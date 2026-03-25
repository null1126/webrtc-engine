/**
 * 交换 SDP 请求
 */
export interface PlayRequest {
  /**
   * 接口地址
   */
  api: string;
  /**
   * 播放地址
   */
  streamurl: string;
  /**
   * SDP
   */
  sdp: string;
}

/**
 * 交换 SDP 响应
 */
export interface PlayResponse {
  /**
   * 状态码
   */
  code: number;
  /**
   * SDP
   */
  sdp: string;
}

/**
 * 交换 SDP
 * @param api 接口地址
 * @param data 请求数据
 * @returns SDP
 */
export async function exchangeSDP(api: string, data: PlayRequest): Promise<string> {
  const res = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json: PlayResponse = await res.json();

  if (json.code !== 0) {
    throw new Error('SDP exchange failed');
  }

  return json.sdp;
}
