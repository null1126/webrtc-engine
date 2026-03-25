/**
 * 播放器选项
 */
export interface PlayerOptions {
  /**
   * 播放地址
   * 支持 webrtc
   */
  url: string;
  /**
   * 信令地址
   * 支持 http/https
   */
  api: string;
  /**
   * 视频元素
   * 如果传了 video 就自动绑定
   */
  video?: HTMLVideoElement;
}
