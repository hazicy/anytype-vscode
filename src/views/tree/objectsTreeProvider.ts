import * as vscode from 'vscode';
import { instance, recreateApiClient } from '../../lib/request';
import { ConfigManager } from '../../lib/config';
import { SpaceManager } from '../../lib/spaceManager';
import { SpaceObject } from '../../types';

/**
 * 树节点结构
 */
export type TreeItem = {
  id: string;
  label: string;
  collapsibleState: vscode.TreeItemCollapsibleState;
  children?: TreeItem[];
  markdown?: string;
};

/**
 * 缓存项结构
 */
interface CacheItem {
  data: TreeItem[];
  timestamp: number;
}

/**
 * Blinko 对象树视图数据提供者
 */
export class ObjectsTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private outputChannel: vscode.OutputChannel;
  private cache: Map<string, CacheItem> = new Map();

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Blinko');
  }

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
    treeItem.iconPath = vscode.ThemeIcon.File;
    treeItem.contextValue = 'blinkoObject';

    // 绑定点击命令
    if (element.markdown) {
      treeItem.command = {
        command: 'anytype.openMarkdown',
        title: 'Open Markdown',
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

    // 如果是分类节点,获取该分类下的对象
    if (
      ['pages', 'tasks', 'collections', 'bookmarks', 'images'].includes(
        element.id,
      )
    ) {
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
      vscode.window.showWarningMessage(validation.message!);
      return [];
    }

    // 验证空间
    if (!SpaceManager.hasSpace()) {
      vscode.window
        .showWarningMessage('Please select a space first', 'Select Space')
        .then((selection) => {
          if (selection === 'Select Space') {
            vscode.commands.executeCommand('anytype.switchSpace');
          }
        });
      return [];
    }

    // 返回5个分类作为根节点
    return [
      {
        id: 'pages',
        label: 'Pages',
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      },
      {
        id: 'tasks',
        label: 'Tasks',
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      },
      {
        id: 'collections',
        label: 'Collections',
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      },
      {
        id: 'bookmarks',
        label: 'Bookmarks',
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      },
      {
        id: 'images',
        label: 'Images',
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      },
    ];
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
        this.log(`Using cached data for ${category}`);
        return cached.data;
      }
    }

    try {
      this.log(`Fetching ${category} for space: ${spaceId}`);

      // 获取对象列表
      const objectsResponse = await instance.get(
        `/v1/spaces/${spaceId}/objects`,
        {
          params: {
            offset: 0,
            limit: 50,
          },
        },
      );

      const objects: SpaceObject[] = objectsResponse.data.data;

      this.log(`Found ${objects.length} objects in ${category}`);

      // 并行获取所有对象的详细信息
      const item = objects.map(async (object) => {
        try {
          const detailResponse = await instance.get(
            `/v1/spaces/${spaceId}/objects/${object.id}`,
            {
              params: { format: 'md' },
            },
          );

          const data = detailResponse.data.object;

          return {
            id: data.id,
            label: data.name || object.id,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            markdown: data.markdown,
          };
        } catch (error) {
          this.log(`Failed to fetch details for object ${object.id}`);
          return null;
        }
      });

      const results = await Promise.all(item);
      const items = results.filter((item) => item !== null) as TreeItem[];

      // 更新缓存
      if (cacheConfig.enabled) {
        this.cache.set(cacheKey, {
          data: items,
          timestamp: Date.now(),
        });
      }

      return items;
    } catch (error) {
      this.log(`Error fetching ${category}: ${error}`);
      return [];
    }
  }

  /**
   * 记录日志到输出频道
   */
  private log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.outputChannel.appendLine(`[${timestamp}] ${message}`);
  }
}
