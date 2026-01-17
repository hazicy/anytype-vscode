import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * File metadata
 */
export interface FileMetadata {
  path: string;
  size: number;
  created: number;
  modified: number;
}

/**
 * Storage Manager
 * Manages file storage and caching
 */
export class StorageManager {
  private static cacheDir: string;

  /**
   * Initialize storage manager
   */
  static initialize(context: vscode.ExtensionContext): void {
    this.cacheDir = path.join(context.globalStorageUri.fsPath, 'markdown-cache');
    this.ensureCacheDir();
  }

  /**
   * Get cache directory path
   */
  static getCacheDir(): string {
    return this.cacheDir;
  }

  /**
   * Ensure cache directory exists
   */
  private static ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Sanitize filename to be safe for filesystem
   */
  static sanitizeFilename(name: string): string {
    return name.replace(/[\\/:*?"<>|]/g, '_');
  }

  /**
   * Write file to cache
   */
  static writeFile(filename: string, content: string): string {
    this.ensureCacheDir();

    const safeName = this.sanitizeFilename(filename);
    const filePath = path.join(this.cacheDir, `${safeName}.md`);

    fs.writeFileSync(filePath, content, 'utf8');

    return filePath;
  }

  /**
   * Read file from cache
   */
  static readFile(filename: string): string | null {
    const safeName = this.sanitizeFilename(filename);
    const filePath = path.join(this.cacheDir, `${safeName}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    return fs.readFileSync(filePath, 'utf8');
  }

  /**
   * Check if file exists in cache
   */
  static fileExists(filename: string): boolean {
    const safeName = this.sanitizeFilename(filename);
    const filePath = path.join(this.cacheDir, `${safeName}.md`);
    return fs.existsSync(filePath);
  }

  /**
   * Get file metadata
   */
  static getFileMetadata(filename: string): FileMetadata | null {
    const safeName = this.sanitizeFilename(filename);
    const filePath = path.join(this.cacheDir, `${safeName}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const stats = fs.statSync(filePath);

    return {
      path: filePath,
      size: stats.size,
      created: stats.birthtimeMs,
      modified: stats.mtimeMs,
    };
  }

  /**
   * Delete file from cache
   */
  static deleteFile(filename: string): boolean {
    const safeName = this.sanitizeFilename(filename);
    const filePath = path.join(this.cacheDir, `${safeName}.md`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }

    return false;
  }

  /**
   * Clear all cache
   */
  static clearCache(): void {
    if (!fs.existsSync(this.cacheDir)) {
      return;
    }

    const files = fs.readdirSync(this.cacheDir);
    files.forEach((file) => {
      const filePath = path.join(this.cacheDir, file);
      fs.unlinkSync(filePath);
    });
  }

  /**
   * Get cache size in bytes
   */
  static getCacheSize(): number {
    if (!fs.existsSync(this.cacheDir)) {
      return 0;
    }

    let totalSize = 0;
    const files = fs.readdirSync(this.cacheDir);

    files.forEach((file) => {
      const filePath = path.join(this.cacheDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    });

    return totalSize;
  }
}
