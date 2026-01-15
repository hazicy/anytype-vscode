import * as vscode from 'vscode';
import { ApiConfig } from '../types';

/**
 * 配置管理器
 * 负责从 VSCode 配置中读取和管理扩展配置
 */
export class ConfigManager {
  private static readonly CONFIG_SECTION = 'anytype';

  /**
   * 获取完整的 API 配置
   */
  static getApiConfig(): ApiConfig {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);

    const baseUrl = config.get<string>('api.baseUrl', 'http://127.0.0.1:31009');
    const apiToken = config.get<string>('api.token', '');

    return {
      baseUrl,
      apiToken,
    };
  }

  /**
   * 验证配置是否完整
   */
  static validateConfig(): { valid: boolean; message?: string } {
    const config = this.getApiConfig();

    if (!config.apiToken) {
      return {
        valid: false,
        message: 'API token is missing. Please configure it in settings.',
      };
    }

    return { valid: true };
  }

  /**
   * 获取缓存配置
   */
  static getCacheConfig(): { enabled: boolean; ttl: number } {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);

    const enabled = config.get<boolean>('cache.enabled', true);
    const ttl = config.get<number>('cache.ttl', 300000);

    return { enabled, ttl };
  }

  /**
   * 打开设置页面
   */
  static async openSettings(): Promise<void> {
    await vscode.commands.executeCommand(
      'workbench.action.openSettings',
      `${this.CONFIG_SECTION}.api`,
    );
  }
}
