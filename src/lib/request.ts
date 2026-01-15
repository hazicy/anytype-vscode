import axios, { AxiosError } from 'axios';
import * as vscode from 'vscode';
import { ConfigManager } from './config';

/**
 * 创建并配置 axios 实例
 */
export function createApiClient() {
  const config = ConfigManager.getApiConfig();

  const instance = axios.create({
    baseURL: config.baseUrl,
    timeout: 30000, // 30 秒超时
  });

  // 请求拦截器 - 添加认证头
  instance.interceptors.request.use(
    (requestConfig) => {
      if (config.apiToken) {
        requestConfig.headers.Authorization = `Bearer ${config.apiToken}`;
      }
      return requestConfig;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // 响应拦截器 - 统一错误处理
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      let message = 'Request failed';

      if (error.response) {
        // 服务器响应了错误状态码
        const status = error.response.status;
        switch (status) {
          case 401:
            message = 'Authentication failed. Please check your API token.';
            break;
          case 403:
            message = 'Access forbidden. Please check your permissions.';
            break;
          case 404:
            message = 'Resource not found. Please check your space ID.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = `Request failed with status ${status}`;
        }
      } else if (error.request) {
        // 请求发送了但没有收到响应
        message = 'No response from server. Please check your connection.';
      } else {
        // 请求设置出错
        message = error.message;
      }

      vscode.window.showErrorMessage(message);
      return Promise.reject(error);
    },
  );

  return instance;
}

// 导出默认实例
export const instance = createApiClient();

/**
 * 重新创建 API 客户端实例
 * 在配置更改后调用
 */
export function recreateApiClient(): void {
  (instance as any) = createApiClient();
}
