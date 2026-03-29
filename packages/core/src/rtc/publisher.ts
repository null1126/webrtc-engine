import { RtcBase } from './base';
import { HttpSignalingProvider } from '../signaling/http';
import type { MediaSource, RtcPublisherEvents, RtcPublisherOptions } from './types';
import { RtcState } from './types';

/**
 * RTC 推流器
 */
export class RtcPublisher extends RtcBase<RtcPublisherEvents> {
  private _source: MediaSource;
  private video?: HTMLVideoElement;
  private localStream: MediaStream | null = null;
  private activeTransceivers: RTCRtpTransceiver[] = [];

  constructor(options: RtcPublisherOptions) {
    const signaling = options.signaling ?? new HttpSignalingProvider(options.api);
    super(options, signaling);
    this._source = options.source;
    this.video = options.video;
  }

  get source(): MediaSource {
    return this._source;
  }

  /**
   * 获取本地 MediaStream
   */
  getStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * 开始推流
   */
  async start(): Promise<boolean> {
    try {
      this.initPeerConnection();
      if (!this.pc) {
        throw new Error('Peer connection not initialized');
      }

      await this.acquireSource();
      await this.attachStream();
      await this.createSession();

      this.emit('streamstart', { stream: this.localStream as MediaStream });
      return true;
    } catch (err) {
      this.emitError(err);
      throw err;
    }
  }

  /**
   * 停止推流
   */
  stop(): void {
    this.resetSession();
    this.releaseSource();
    this.emit('streamstop', undefined);
  }

  /**
   * 切换输入源
   * @param source 新的媒体源
   */
  async switchSource(source: MediaSource): Promise<void> {
    this.emit('state', RtcState.SWITCHING);

    const prevStream = this.localStream;
    const prevSource = this._source;

    try {
      await this.acquireSource();

      if (!this.pc || !this.localStream) {
        throw new Error('Peer connection not ready');
      }

      for (const transceiver of this.activeTransceivers) {
        const track = this.localStream!.getTracks().find(
          (t) => t.kind === transceiver.receiver.track.kind
        );
        if (track) {
          await transceiver.sender.replaceTrack(track);
        }
      }

      this._source = source;
    } catch (err) {
      this._source = prevSource;
      throw err;
    } finally {
      this.releaseSource(prevStream ?? undefined);
    }

    this.emit('state', RtcState.SWITCHED);
    this.emit('sourcechange', source);
  }

  protected async createSession(): Promise<void> {
    if (!this.pc) throw new Error('Peer connection not initialized');

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    const answerSDP = await this.signaling.publish(offer.sdp!, this.url);
    await this.pc.setRemoteDescription({
      type: 'answer',
      sdp: answerSDP,
    });
  }

  protected resetSession(): void {
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    this.activeTransceivers = [];
  }

  protected onTrack(event: RTCTrackEvent): void {
    const stream = event.streams[0];
    this.emit('track', { stream, event });
  }

  /**
   * 获取媒体源
   */
  private async acquireSource(): Promise<MediaStream> {
    const s = this._source;

    if (s.type === 'custom') {
      this.localStream = s.stream;
      return s.stream;
    }

    if (s.type === 'screen') {
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: true,
        audio: s.audio ?? false,
      };
      this.localStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    } else {
      const constraints: MediaStreamConstraints = {
        video: s.type === 'camera' ? { deviceId: s.deviceId } : false,
        audio: { deviceId: s.deviceId },
      };
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    }

    if (this.video) {
      this.video.srcObject = this.localStream;
      this.video.muted = true;
      this.video.onloadedmetadata = () => {
        this.video?.play();
      };
    }

    return this.localStream;
  }

  /**
   * 将媒体流绑定到轨道
   */
  private async attachStream(): Promise<void> {
    if (!this.pc || !this.localStream) return;

    this.activeTransceivers = [];

    const videoTrack = this.localStream.getVideoTracks()[0];
    const audioTrack = this.localStream.getAudioTracks()[0];

    if (videoTrack) {
      const videoTransceiver = this.pc.addTransceiver(videoTrack, {
        direction: 'sendonly',
      });
      this.activeTransceivers.push(videoTransceiver);
    }

    if (audioTrack) {
      const audioTransceiver = this.pc.addTransceiver(audioTrack, {
        direction: 'sendonly',
      });
      this.activeTransceivers.push(audioTransceiver);
    }

    if (!videoTrack && !audioTrack) {
      throw new Error('No media tracks available');
    }
  }

  /**
   * 释放媒体源
   */
  private releaseSource(stream?: MediaStream): void {
    const target = stream ?? this.localStream;
    if (!target) return;

    target.getTracks().forEach((track) => track.stop());

    if (!stream) {
      this.localStream = null;
      if (this.video) {
        this.video.srcObject = null;
      }
    }
  }

  public override destroy(): void {
    this.stop();
    super.destroy();
  }
}
