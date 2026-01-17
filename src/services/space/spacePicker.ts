import * as vscode from 'vscode';
import { Space } from '../../types';
import { I18n } from '../../utils';

/**
 * Space QuickPick Item
 */
export class SpaceItem implements vscode.QuickPickItem {
  constructor(
    public readonly space: Space,
    private readonly isCurrent: boolean,
  ) {}

  get label(): string {
    return this.isCurrent ? `${this.space.name} ✓` : this.space.name;
  }

  get description(): string {
    return this.isCurrent ? I18n.t('extension.command.currentSpace') : '';
  }

  get alwaysShow(): boolean {
    return this.isCurrent;
  }
}

/**
 * Space Picker UI Component
 */
export class SpacePicker {
  /**
   * Show space selection quick pick
   */
  static async show(spaces: Space[], currentSpaceId: string | null): Promise<Space | null> {
    if (spaces.length === 0) {
      vscode.window.showWarningMessage(
        I18n.t('extension.command.noSpacesFound')
      );
      return null;
    }

    const items = spaces.map(
      (space) => new SpaceItem(space, space.id === currentSpaceId)
    );

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: I18n.t('extension.command.selectSpace.placeholder'),
    });

    return selected?.space || null;
  }
}
