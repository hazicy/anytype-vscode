import * as vscode from 'vscode';
import { getApiClient, ConfigManager, SpaceManager } from '../../services';
import { I18n } from '../../utils';
import { AnytypeClient, type Object } from '../../lib/sdk';

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

export class ObjectsTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private cache: Map<string, CacheItem> = new Map();
  private typeIds: Set<string> = new Set();

  /**
   * 刷新树视图
   */
  refresh(): void {
    this.cache.clear();
    this.typeIds.clear();
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
    treeItem.iconPath = vscode.ThemeIcon.File;
    treeItem.contextValue = 'blinkoObject';

    // 绑定点击命令 - 所有的叶子节点都可以点击打开
    if (element.collapsibleState === vscode.TreeItemCollapsibleState.None) {
      treeItem.command = {
        command: 'anytype.openMarkdown',
        title: I18n.t('extension.anytype.openMarkdown'),
        arguments: [element],
      };
    }

    return treeItem;
  }

  /**
   * 获取子节点
   */
  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!element) {
      return this.getRootItems();
    }

    // 如果是分类节点（来自 types API 的 ID），获取该分类下的对象
    if (this.typeIds.has(element.id)) {
      return this.getCategoryItems(element.id);
    }

    return Promise.resolve(element.children || []);
  }

  /**
   * 获取根节点
   */
  private async getRootItems(): Promise<TreeItem[]> {
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

    const client = getApiClient();
    const spaceId = SpaceManager.getCurrentSpaceId();

    const res = await client.types.list(spaceId);

    // 清空并重新填充类型 ID 集合
    this.typeIds.clear();
    res.data.forEach((data) => {
      this.typeIds.add(data.id);
    });

    const items: TreeItem[] = res.data.map((data) => {
      return {
        id: data.id,
        label: data.name,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      };
    });

    return items;
  }

  /**
   * 获取分类下的对象
   */
  private async getCategoryItems(category: string): Promise<TreeItem[]> {
    const spaceId = SpaceManager.getCurrentSpaceId();
    const cacheConfig = ConfigManager.getCacheConfig();

    // 为每个分类使用不同的缓存键
    const cacheKey = `${spaceId}-${category}`;

    // 检查缓存
    if (cacheConfig.enabled) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheConfig.ttl) {
        return cached.data;
      }
    }

    try {
      const client = getApiClient();

      const detailResponse = await client.search.inSpace(spaceId, {
        types: [`${category}`],
        query: '',
      });

      const data = detailResponse.data;

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
      return [];
    }
  }
}
