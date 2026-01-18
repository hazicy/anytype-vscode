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
  objectCount?: number;
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
  private typeCountCache: Map<string, number> = new Map();

  /**
   * 刷新树视图
   */
  refresh(): void {
    this.cache.clear();
    this.typeIds.clear();
    this.typeCountCache.clear();
    this._onDidChangeTreeData.fire();
  }

  /**
   * 获取树项元素
   */
  getTreeItem(element: TreeItem): vscode.TreeItem {
    // 根据是否有数量来决定显示的 label
    let label = element.label;
    if (element.objectCount !== undefined && this.typeIds.has(element.id)) {
      label = `${element.label} (${element.objectCount})`;
    }

    const treeItem = new vscode.TreeItem(
      label,
      element.collapsibleState,
    );

    treeItem.id = element.id;

    // 根据是否为类型节点设置不同的 contextValue 和图标
    if (this.typeIds.has(element.id)) {
      // 类型节点
      treeItem.iconPath = new vscode.ThemeIcon('folder');
      treeItem.contextValue = 'blinkoType';
      // 添加 tooltip 显示详细信息
      if (element.objectCount !== undefined) {
        treeItem.tooltip = `${element.label}: ${element.objectCount} 个对象`;
      }
    } else {
      // 对象节点（叶子节点）
      treeItem.iconPath = vscode.ThemeIcon.File;
      treeItem.contextValue = 'blinkoObject';
      // 绑定点击命令
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

    try {
      const client = getApiClient();
      const spaceId = SpaceManager.getCurrentSpaceId();

      const res = await client.types.list(spaceId);

      // 清空并重新填充类型 ID 集合
      this.typeIds.clear();
      this.typeCountCache.clear();

      const items: TreeItem[] = [];

      // 为每个类型获取对象数量
      for (const type of res.data) {
        this.typeIds.add(type.id);

        try {
          // 获取该类型下的对象数量
          const searchResponse = await client.search.inSpace(spaceId, {
            types: [type.id],
            query: '',
          });

          const count = searchResponse.data.length;
          this.typeCountCache.set(type.id, count);

          items.push({
            id: type.id,
            label: type.name,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            objectCount: count,
          });
        } catch (error) {
          // 如果获取数量失败，仍然显示类型，但不显示数量
          items.push({
            id: type.id,
            label: type.name,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
          });
        }
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
      // 检查是否是空间无效错误
      if (isInvalidSpaceError(error)) {
        // 触发空间重新选择
        vscode.commands.executeCommand('anytype.switchSpace');
      }
      return [];
    }
  }
}
