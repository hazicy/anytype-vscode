import * as vscode from 'vscode';
import { SpaceManager } from '../services';

export function registerSwitchSpaceCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.switchSpace', async () => {
      await SpaceManager.showSpacePicker(context);
    }),
  );
}
