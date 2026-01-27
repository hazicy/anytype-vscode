import * as vscode from 'vscode';
import { ObjectsTreeProvider } from '../views/tree/objectsTreeProvider';

export function registerRefreshCommand(
  context: vscode.ExtensionContext,
  objectsTreeProvider: ObjectsTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.refresh', () => {
      objectsTreeProvider.refresh();
    }),
  );
}
