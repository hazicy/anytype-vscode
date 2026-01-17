import * as vscode from 'vscode';
import * as path from 'path';

/**
 * 文件到对象的映射信息
 */
interface FileObjectMapping {
  objectId: string;
  objectName: string;
  filePath: string;
  spaceId: string;
}

/**
 * 对象同步管理器
 * 负责管理本地文件与远程对象的映射关系
 */
export class ObjectSyncManager {
  private static mappings: Map<string, FileObjectMapping> = new Map();

  /**
   * 注册文件到对象的映射
   */
  static registerMapping(mapping: FileObjectMapping): void {
    this.mappings.set(mapping.filePath, mapping);
  }

  /**
   * 获取文件对应的对象信息
   */
  static getMapping(filePath: string): FileObjectMapping | undefined {
    return this.mappings.get(filePath);
  }

  /**
   * 移除文件映射
   */
  static removeMapping(filePath: string): void {
    this.mappings.delete(filePath);
  }

  /**
   * 清空所有映射
   */
  static clearMappings(): void {
    this.mappings.clear();
  }

  /**
   * 从文件路径提取对象 ID
   * @deprecated 使用 getMapping 代替
   */
  static extractObjectIdFromPath(filePath: string): string | null {
    const mapping = this.mappings.get(filePath);
    return mapping?.objectId ?? null;
  }
}
