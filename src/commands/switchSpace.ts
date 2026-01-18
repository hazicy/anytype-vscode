import * as vscode from 'vscode';
import { SpaceManager } from '../services';
import { ObjectsTreeProvider } from '../views/tree/objectsTreeProvider';
import { TrashTreeProvider } from '../views/tree/trashTreeProvider';

export function registerSwitchSpaceCommand(
  context: vscode.ExtensionContext,
  objectsTreeProvider?: ObjectsTreeProvider,
  trashTreeProvider?: TrashTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.switchSpace', async () => {
      await SpaceManager.showSpacePicker(context);
      // 刷新两个树视图
      if (objectsTreeProvider) {
        objectsTreeProvider.refresh();
      }
      if (trashTreeProvider) {
        trashTreeProvider.refresh();
      }
    }),
  );
}
