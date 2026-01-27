import * as vscode from 'vscode';
import { SpaceManager } from '../services';
import { ObjectsTreeProvider } from '../views/tree/objectsTreeProvider';

export function registerSwitchSpaceCommand(
  context: vscode.ExtensionContext,
  objectsTreeProvider?: ObjectsTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.switchSpace', async () => {
      await SpaceManager.showSpacePicker(context);
      // 刷新所有树视图
      if (objectsTreeProvider) {
        objectsTreeProvider.refresh();
      }
    }),
  );
}
