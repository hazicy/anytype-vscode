import * as vscode from 'vscode';
import { Space } from '../../types';
import { getApiClient } from '../api';
import { I18n } from '../../utils';
import { SpacePicker } from './spacePicker';

/**
 * Space Manager
 * Manages space selection and switching
 */
export class SpaceManager {
  private static currentSpace: Space | null = null;
  private static spaces: Space[] = [];
  private static statusBarItem: vscode.StatusBarItem;

  /**
   * Initialize space manager
   */
  static initialize(context: vscode.ExtensionContext): void {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100,
    );
    this.statusBarItem.command = 'anytype.switchSpace';
    this.statusBarItem.show();
    context.subscriptions.push(this.statusBarItem);

    // Restore last selected space from global state
    const savedSpaceId = context.globalState.get<string>('currentSpaceId');
    if (savedSpaceId) {
      this.currentSpace = {
        id: savedSpaceId,
        name: I18n.t('extension.command.loading'),
      };
      this.updateStatusBar();
    }
  }

  /**
   * Fetch all available spaces
   */
  static async fetchSpaces(): Promise<Space[]> {
    try {
      const client = getApiClient();
      const response = await client.spaces.list();
      this.spaces = response.data || [];
      return this.spaces;
    } catch (error) {
      vscode.window.showErrorMessage(
        I18n.t('extension.command.failedToFetchSpaces', String(error))
      );
      return [];
    }
  }

  /**
   * Get current space
   */
  static getCurrentSpace(): Space | null {
    return this.currentSpace;
  }

  /**
   * Get current space ID
   */
  static getCurrentSpaceId(): string {
    return this.currentSpace?.id || '';
  }

  /**
   * Check if a space is selected
   */
  static hasSpace(): boolean {
    return this.currentSpace !== null;
  }

  /**
   * Set current space
   */
  static async setCurrentSpace(
    space: Space,
    context: vscode.ExtensionContext
  ): Promise<void> {
    this.currentSpace = space;

    // Save to global state
    await context.globalState.update('currentSpaceId', space.id);

    // Update status bar
    this.updateStatusBar();

    // Notify tree views to refresh
    vscode.commands.executeCommand('anytype.refresh');
  }

  /**
   * Show space picker
   */
  static async showSpacePicker(context: vscode.ExtensionContext): Promise<void> {
    const spaces = await this.fetchSpaces();
    const selected = await SpacePicker.show(spaces, this.currentSpace?.id || null);

    if (selected) {
      await this.setCurrentSpace(selected, context);
      vscode.window.showInformationMessage(
        I18n.t('extension.command.switchedToSpace', selected.name)
      );
    }
  }

  /**
   * Update status bar display
   */
  private static updateStatusBar(): void {
    if (this.currentSpace) {
      this.statusBarItem.text = `$(database) ${this.currentSpace.name}`;
      this.statusBarItem.tooltip = `${I18n.t('extension.command.currentSpace')}: ${this.currentSpace.name}`;
    } else {
      this.statusBarItem.text = `$(database) ${I18n.t('extension.command.noSpaceSelected')}`;
      this.statusBarItem.tooltip = I18n.t('extension.command.clickToSelectSpace');
    }
  }
}
