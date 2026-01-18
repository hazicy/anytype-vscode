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

export class PinnedTreeProvider implements vscode.TreeDataProvider<TreeItem> {
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

    // 置顶对象节点
    treeItem.iconPath = new vscode.ThemeIcon('star-full');
    treeItem.contextValue = 'blinkoPinnedObject';
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
      return this.getPinnedItems();
    }

    return Promise.resolve(element.children || []);
  }

  /**
   * 获取置顶对象
   */
  private async getPinnedItems(): Promise<TreeItem[]> {
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

    // 为置顶使用固定的缓存键
    const cacheKey = `${spaceId}-pinned`;

    // 检查缓存
    if (cacheConfig.enabled) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheConfig.ttl) {
        return cached.data;
      }
    }

    try {
      const client = getApiClient();

      // 使用搜索 API 获取置顶对象
      // 这里假设置顶对象有特定的属性或标记
      const response = await client.search.inSpace(spaceId, {
        query: '',
        // 可以根据实际情况添加筛选条件
        // 例如: filters: { ... }
      });

      // 过滤出置顶的对象
      // 这里需要根据实际的 API 来判断对象是否置顶
      const data = response.data.filter((obj) => {
        // TODO: 实现实际的置顶判断逻辑
        // 可能需要检查对象的某个属性或标记
        // 例如: return obj.isPinned === true;
        return false; // 暂时返回空，等 API 明确后更新
      });

      const items: TreeItem[] = data.map((obj) => {
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
          I18n.t('extension.error.fetchingDetails', String(error))
        );
      }
      return [];
    }
  }
}
