import * as vscode from 'vscode';
import { StorageManager } from '../services';
import { I18n } from '../utils';
import { TreeItem } from '../views/tree/objectsTreeProvider';

export function registerOpenMarkdownCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'anytype.openMarkdown',
      async (item: TreeItem) => {
        try {
          const filePath = StorageManager.writeFile(item.label, item.markdown ?? '');

          // Open file
          const uri = vscode.Uri.file(filePath);
          const document = await vscode.workspace.openTextDocument(uri);

          await vscode.window.showTextDocument(document, {
            preview: false,
          });
        } catch (error) {
          vscode.window.showErrorMessage(
            I18n.t('extension.error.failedToOpenMarkdown', String(error)),
          );
        }
      },
    ),
  );
}
