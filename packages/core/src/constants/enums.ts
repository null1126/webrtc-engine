/**
 * 状态枚举
 */
export enum StateEnum {
  /**
   * 连接中
   */
  CONNECTING = 'connecting',
  /**
   * 连接成功
   */
  CONNECTED = 'connected',
  /**
   * 断开连接
   */
  DISCONNECTED = 'disconnected',
  /**
   * 连接失败
   */
  FAILED = 'failed',
  /**
   * 连接关闭
   */
  CLOSED = 'closed',
  /**
   * 切换中
   */
  SWITCHING = 'switching',
  /**
   * 切换成功
   */
  SWITCHED = 'switched',
  /**
   * 销毁
   */
  DESTROYED = 'destroyed',
}
