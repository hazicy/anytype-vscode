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

/**
 * 空间对象数据结构
 */
export interface SpaceObject {
  id: string;
  name: string;
  markdown?: string;
  type?: string;  // 对象类型: page, task, collection, bookmark, image
  layout?: string; // 对象布局
}

/**
 * API 响应数据结构
 */
export interface ApiResponse<T> {
  data: T;
}

/**
 * 对象列表响应
 */
export interface ObjectsListResponse {
  data: SpaceObject[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * 对象详情响应
 */
export interface ObjectDetailResponse {
  object: SpaceObject;
}
