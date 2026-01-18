import * as vscode from 'vscode';
import { ObjectsTreeProvider } from '../views/tree/objectsTreeProvider';
import { TrashTreeProvider } from '../views/tree/trashTreeProvider';

export function registerRefreshCommand(
  context: vscode.ExtensionContext,
  objectsTreeProvider: ObjectsTreeProvider,
  trashTreeProvider?: TrashTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.refresh', () => {
      objectsTreeProvider.refresh();
      if (trashTreeProvider) {
        trashTreeProvider.refresh();
      }
    }),
  );
}
