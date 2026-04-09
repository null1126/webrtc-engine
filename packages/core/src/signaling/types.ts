/**
 * 拉流信令提供者接口
 * 用户可自定义实现，支持 HTTP / WebSocket / GRPC 等任何信令协议
 */
export interface PlayerSignalingProvider {
  /**
   * 拉流信令交换
   * @param sdp 本地 SDP offer
   * @param url 拉流地址
   * @returns 远端 SDP answer
   */
  play(sdp: string, url: string): Promise<string>;
}

/**
 * 推流信令提供者接口
 * 用户可自定义实现，支持 HTTP / WebSocket / GRPC 等任何信令协议
 */
export interface PublisherSignalingProvider {
  /**
   * 推流信令交换
   * @param sdp 本地 SDP offer
   * @param url 推流地址
   * @returns 远端 SDP answer
   */
  publish(sdp: string, url: string): Promise<string>;
}

/**
 * 同时支持推流和拉流的通用信令提供者
 */
export type SignalingProvider = PlayerSignalingProvider & PublisherSignalingProvider;
