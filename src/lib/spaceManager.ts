import * as vscode from 'vscode';
import { instance } from './request';
import { Space } from '../types';

/**
 * 空间管理器
 * 负责管理空间选择和切换
 */
export class SpaceManager {
  private static currentSpace: Space | null = null;
  private static spaces: Space[] = [];
  private static statusBarItem: vscode.StatusBarItem;

  /**
   * 初始化空间管理器
   */
  static initialize(context: vscode.ExtensionContext) {
    // 创建状态栏项
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100,
    );
    this.statusBarItem.command = 'anytype.switchSpace';
    this.statusBarItem.show();
    context.subscriptions.push(this.statusBarItem);

    // 从全局状态恢复上次选择的空间
    const savedSpaceId = context.globalState.get<string>('currentSpaceId');
    if (savedSpaceId) {
      this.currentSpace = { id: savedSpaceId, name: 'Loading...' };
      this.updateStatusBar();
    }
  }

  /**
   * 获取所有空间
   */
  static async fetchSpaces(): Promise<Space[]> {
    try {
      const response = await instance.get('/v1/spaces');
      this.spaces = response.data.data || [];
      return this.spaces;
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to fetch spaces: ${error}`);
      return [];
    }
  }

  /**
   * 获取当前空间
   */
  static getCurrentSpace(): Space | null {
    return this.currentSpace;
  }

  /**
   * 设置当前空间
   */
  static async setCurrentSpace(
    space: Space,
    context: vscode.ExtensionContext,
  ): Promise<void> {
    this.currentSpace = space;

    // 保存到全局状态
    await context.globalState.update('currentSpaceId', space.id);

    // 更新状态栏
    this.updateStatusBar();

    // 通知树视图刷新
    vscode.commands.executeCommand('anytype.refresh');
  }

  /**
   * 显示空间选择快速选择菜单
   */
  static async showSpacePicker(
    context: vscode.ExtensionContext,
  ): Promise<void> {
    // 获取空间列表
    const spaces = await this.fetchSpaces();

    if (spaces.length === 0) {
      vscode.window.showWarningMessage('No spaces found');
      return;
    }

    // 创建快速选择项
    const items = spaces.map(
      (space) =>
        new SpaceItem(space, space.id === this.currentSpace?.id),
    );

    // 显示快速选择
    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a space',
    });

    if (selected) {
      await this.setCurrentSpace(selected.space, context);
      vscode.window.showInformationMessage(
        `Switched to space: ${selected.space.name}`,
      );
    }
  }

  /**
   * 更新状态栏显示
   */
  private static updateStatusBar(): void {
    if (this.currentSpace) {
      this.statusBarItem.text = `$(database) ${this.currentSpace.name}`;
      this.statusBarItem.tooltip = `Current space: ${this.currentSpace.name}`;
    } else {
      this.statusBarItem.text = '$(database) No space selected';
      this.statusBarItem.tooltip = 'Click to select a space';
    }
  }

  /**
   * 获取空间ID (用于 API 调用)
   */
  static getCurrentSpaceId(): string {
    return this.currentSpace?.id || '';
  }

  /**
   * 检查是否已选择空间
   */
  static hasSpace(): boolean {
    return this.currentSpace !== null;
  }
}

/**
 * 空间快速选择项
 */
class SpaceItem implements vscode.QuickPickItem {
  constructor(
    public space: Space,
    private isCurrent: boolean,
  ) {}

  get label(): string {
    return this.isCurrent ? `${this.space.name} ✓` : this.space.name;
  }

  get description(): string {
    return this.isCurrent ? 'Current space' : '';
  }

  get alwaysShow(): boolean {
    return this.isCurrent;
  }
}
