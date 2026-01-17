import * as vscode from 'vscode';
import { ObjectsTreeProvider, TreeItem } from '../views/tree/objectsTreeProvider';
import { getApiClient, ConfigManager, SpaceManager } from '../services';
import { I18n } from '../utils';

export function registerArchiveObjectCommand(
  context: vscode.ExtensionContext,
  objectsTreeProvider: ObjectsTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'anytype.archiveObject',
      async (treeItem: TreeItem) => {
        // 验证配置
        const validation = ConfigManager.validateConfig();
        if (!validation.valid) {
          vscode.window.showWarningMessage(validation.error!);
          return;
        }

        // 验证空间
        if (!SpaceManager.hasSpace()) {
          vscode.window
            .showWarningMessage(
              I18n.t('extension.command.pleaseSelectSpace'),
              I18n.t('extension.command.selectSpace'),
            )
            .then((selection) => {
              if (selection === I18n.t('extension.command.selectSpace')) {
                vscode.commands.executeCommand('anytype.switchSpace');
              }
            });
          return;
        }

        if (!treeItem || !treeItem.id) {
          vscode.window.showWarningMessage(
            I18n.t('extension.command.archiveObject.noSelection'),
          );
          return;
        }

        try {
          const client = getApiClient();
          const spaceId = SpaceManager.getCurrentSpaceId();

          await vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: I18n.t('extension.command.archiveObject.archiving'),
              cancellable: false,
            },
            async () => {
              // Note: Since the SDK doesn't have a direct archive method,
              // we would need to update the object's archived property.
              // However, based on the available UpdateObjectRequest,
              // there's no 'archived' field that can be updated directly.
              // This is a limitation of the current API.
              //
              // For now, we'll show a message indicating this feature is not yet available.
              // If the API adds archive support in the future, it can be implemented here.

              vscode.window.showInformationMessage(
                I18n.t(
                  'extension.command.archiveObject.notSupported',
                  treeItem.label,
                ),
              );
            },
          );
        } catch (error) {
          vscode.window.showErrorMessage(
            I18n.t('extension.command.archiveObject.error') + ': ' + error,
          );
        }
      },
    ),
  );
}
