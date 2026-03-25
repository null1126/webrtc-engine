import { StateEnum } from '../constants/enums';

/**
 * 定义每个事件类型对应的参数
 */
export interface PlayerEvents {
  /**
   * 流事件
   */
  track: { stream: MediaStream; event: RTCTrackEvent };
  /**
   * 状态事件
   */
  state: StateEnum;
  /**
   * 错误事件
   */
  error: string;
  /**
   * ice 候选事件
   */
  icecandidate: RTCIceCandidate;
  /**
   * ice 连接状态事件
   */
  iceconnectionstate: RTCIceConnectionState;
  /**
   * ice 采集状态事件
   */
  icegatheringstate: RTCIceGatheringState;
}

// 事件类型联合
export type EventType = keyof PlayerEvents;

// 监听器类型
export type EventListener<T extends EventType> = (data: PlayerEvents[T]) => void;

/**
 * 事件发射器
 */
export class EventEmitter {
  private events: Map<EventType, EventListener<EventType>[]> = new Map();

  /**
   * 监听事件
   * @param event 事件类型
   * @param listener 事件监听器
   */
  on<T extends EventType>(event: T, listener: EventListener<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener as EventListener<EventType>);
  }

  /**
   * 发射事件
   * @param event 事件类型
   * @param data 事件数据
   */
  emit<T extends EventType>(event: T, data: PlayerEvents[T]) {
    this.events.get(event)?.forEach((listener) => listener(data));
  }

  /**
   * 移除事件监听器
   * @param event 事件类型
   * @param listener 事件监听器
   */
  off<T extends EventType>(event: T, listener: EventListener<T>) {
    this.events.get(event)!.filter((l) => l !== listener);
  }

  /**
   * 监听一次事件
   * @param event 事件类型
   * @param listener 事件监听器
   */
  once<T extends EventType>(event: T, listener: EventListener<T>) {
    const wrappedListener = (data: PlayerEvents[T]) => {
      listener(data);
      this.off(event, wrappedListener as EventListener<T>);
    };
    this.on(event, wrappedListener);
  }

  /**
   * 检查事件是否存在
   * @param event 事件类型
   * @returns 是否存在
   */
  has(event: EventType) {
    return this.events.has(event) && (this.events.get(event)?.length ?? 0) > 0;
  }

  /**
   * 获取事件监听器
   * @param event 事件类型
   * @returns 事件监听器
   */
  get(event: EventType) {
    return this.events.get(event) || [];
  }
}
