import * as vscode from 'vscode';
import { ObjectsTreeProvider } from '../views/tree/objectsTreeProvider';
import { TrashTreeProvider } from '../views/tree/trashTreeProvider';
import { PinnedTreeProvider } from '../views/tree/pinnedTreeProvider';

export function registerRefreshCommand(
  context: vscode.ExtensionContext,
  objectsTreeProvider: ObjectsTreeProvider,
  trashTreeProvider?: TrashTreeProvider,
  pinnedTreeProvider?: PinnedTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.refresh', () => {
      objectsTreeProvider.refresh();
      if (trashTreeProvider) {
        trashTreeProvider.refresh();
      }
      if (pinnedTreeProvider) {
        pinnedTreeProvider.refresh();
      }
    }),
  );
}
