import { EventEmitter } from '../utils/emitter';
import { exchangeSDP } from '../signaling/http';
import type { PlayerOptions } from './types';
import { StateEnum } from '../constants/enums';

export class WebRTCPlayer {
  private pc: RTCPeerConnection | null = null;
  private readonly video?: HTMLVideoElement;
  private readonly options: PlayerOptions;
  private emitter = new EventEmitter();
  private emit = this.emitter.emit.bind(this.emitter);

  on = this.emitter.on.bind(this.emitter);
  off = this.emitter.off.bind(this.emitter);

  constructor(options: PlayerOptions) {
    this.options = options;
    this.video = options.video;
  }

  /**
   * 创建 PeerConnection
   */
  private createPeerConnection() {
    this.pc = new RTCPeerConnection();

    // 监听流
    this.pc.ontrack = (event) => {
      const stream = event.streams[0];

      // 输出给外部
      this.emit('track', { stream, event });

      // 自动绑定 video 元素
      if (this.video) {
        this.video.srcObject = stream;
        this.video.muted = true;

        // 监听视频加载完成
        this.video.onloadedmetadata = () => {
          this.video?.play();
        };
      }
    };

    // 监听连接状态
    this.pc.onconnectionstatechange = () => {
      this.emit('state', this.pc!.connectionState as StateEnum);
    };

    // 监听 ICE 候选
    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.emit('icecandidate', event.candidate);
      }
    };

    // 监听 ICE 连接状态
    this.pc.oniceconnectionstatechange = () => {
      this.emit('iceconnectionstate', this.pc!.iceConnectionState);
    };

    // 监听 ICE 收集状态
    this.pc.onicegatheringstatechange = () => {
      this.emit('icegatheringstate', this.pc!.iceGatheringState);
    };
  }

  /**
   * 播放
   * @returns {Promise<boolean>}
   */
  async play() {
    try {
      this.createPeerConnection();
      if (!this.pc) {
        return Promise.reject(new Error('Peer connection not initialized'));
      }

      // 收流准备
      this.pc.addTransceiver('video', { direction: 'sendrecv' });
      this.pc.addTransceiver('audio', { direction: 'sendrecv' });

      // 创建 offer
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // SDP 交换
      const answerSDP = await exchangeSDP(this.options.api, {
        api: this.options.api,
        streamurl: this.options.url,
        sdp: offer.sdp!,
      });

      // 设置 answer
      await this.pc.setRemoteDescription({
        type: 'answer',
        sdp: answerSDP,
      });

      return Promise.resolve(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.emit('error', err.message);
      } else {
        this.emit('error', String(err));
      }
      return Promise.reject(err);
    }
  }

  /**
   * 切换流
   * @param url 播放地址
   * @returns {Promise<void>}
   */
  async switchStream(url: string) {
    this.emit('state', StateEnum.SWITCHING);
    this.options.url = url;
    await this.play();
    this.emit('state', StateEnum.SWITCHED);
  }

  /**
   * 销毁
   * @returns {void}
   */
  destroy() {
    this.pc?.close();
    this.pc = null;
    this.emit('state', StateEnum.DESTROYED);
    if (this.video) {
      this.video.srcObject = null;
    }
  }
}
