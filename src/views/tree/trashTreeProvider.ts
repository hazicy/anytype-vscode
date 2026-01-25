import * as vscode from 'vscode';
import { getApiClient, ConfigManager, SpaceManager } from '../../services';
import { I18n } from '../../utils';
import { isInvalidSpaceError } from '../../utils/errorHandler';

/**
 * 树节点结构
 */
export type TreeItem = {
  id: string;
  label: string;
  collapsibleState: vscode.TreeItemCollapsibleState;
  children?: TreeItem[];
  markdown?: string;
} & vscode.TreeItem;

/**
 * 缓存项结构
 */
interface CacheItem {
  data: TreeItem[];
  timestamp: number;
}

export class TrashTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private cache: Map<string, CacheItem> = new Map();

  /**
   * 刷新树视图
   */
  refresh(): void {
    this.cache.clear();
    this._onDidChangeTreeData.fire();
  }

  /**
   * 获取树项元素
   */
  getTreeItem(element: TreeItem): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      element.label,
      element.collapsibleState,
    );

    treeItem.id = element.id;

    // 已归档对象节点
    treeItem.iconPath = new vscode.ThemeIcon('file');
    treeItem.contextValue = 'blinkoArchivedObject';
    // 绑定点击命令
    treeItem.command = {
      command: 'anytype.openMarkdown',
      title: I18n.t('extension.anytype.openMarkdown'),
      arguments: [element],
    };

    return treeItem;
  }

  /**
   * 获取子节点
   */
  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!element) {
      return this.getTrashItems();
    }

    return Promise.resolve(element.children || []);
  }

  /**
   * 获取回收站中的已归档对象
   */
  private async getTrashItems(): Promise<TreeItem[]> {
    // 验证配置
    const validation = ConfigManager.validateConfig();
    if (!validation.valid) {
      vscode.window.showWarningMessage(validation.error!);
      return [];
    }

    // 验证空间
    if (!SpaceManager.hasSpace()) {
      vscode.window
        .showWarningMessage(
          I18n.t('extension.command.pleaseSelectSpace'),
          I18n.t('extension.command.selectSpace'),
        )
        .then((selection) => {
          if (selection === I18n.t('extension.command.selectSpace')) {
            vscode.commands.executeCommand('anytype.switchSpace');
          }
        });
      return [];
    }

    const spaceId = SpaceManager.getCurrentSpaceId();
    const cacheConfig = ConfigManager.getCacheConfig();

    // 为回收站使用固定的缓存键
    const cacheKey = `${spaceId}-trash`;

    // 检查缓存
    if (cacheConfig.enabled) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheConfig.ttl) {
        return cached.data;
      }
    }

    try {
      const client = getApiClient();

      const response = await client.objects.list(spaceId, {
        limit: 100,
      });

      const data = response.data;

      const items: TreeItem[] = data
        .filter((obj) => obj.archived)
        .map((obj) => {
          return {
            id: obj.id,
            label: obj.name || obj.id,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
          };
        });

      // 更新缓存
      if (cacheConfig.enabled) {
        this.cache.set(cacheKey, {
          data: items,
          timestamp: Date.now(),
        });
      }

      return items;
    } catch (error) {
      // 检查是否是空间无效错误
      if (isInvalidSpaceError(error)) {
        // 触发空间重新选择
        vscode.commands.executeCommand('anytype.switchSpace');
      } else {
        // 其他错误也显示警告
        vscode.window.showWarningMessage(
          I18n.t('extension.error.fetchingDetails', String(error)),
        );
      }
      return [];
    }
  }
}
