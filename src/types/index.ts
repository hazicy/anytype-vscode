/**
 * API 配置接口
 */
export interface ApiConfig {
  /** API 基础 URL */
  baseUrl: string;
  /** Bearer Token 用于身份验证 */
  apiToken: string;
}

/**
 * 空间信息
 */
export interface Space {
  id: string;
  name: string;
  createdTs?: number;
  updatedTs?: number;
}
