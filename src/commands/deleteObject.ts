import * as vscode from 'vscode';
import { ObjectsTreeProvider, TreeItem } from '../views/tree/objectsTreeProvider';
import { getApiClient, ConfigManager, SpaceManager } from '../services';
import { I18n } from '../utils';

export function registerDeleteObjectCommand(
  context: vscode.ExtensionContext,
  objectsTreeProvider: ObjectsTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'anytype.deleteObject',
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
            I18n.t('extension.command.deleteObject.noSelection'),
          );
          return;
        }

        // 确认删除
        const confirm = await vscode.window.showWarningMessage(
          I18n.t('extension.command.deleteObject.confirm', treeItem.label),
          {
            modal: true,
          },
          I18n.t('extension.command.deleteObject.confirmButton'),
          I18n.t('extension.command.deleteObject.cancelButton'),
        );

        if (confirm !== I18n.t('extension.command.deleteObject.confirmButton')) {
          return;
        }

        try {
          const client = getApiClient();
          const spaceId = SpaceManager.getCurrentSpaceId();

          await vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: I18n.t('extension.command.deleteObject.deleting'),
              cancellable: false,
            },
            async () => {
              await client.objects.delete(spaceId, treeItem.id);

              vscode.window.showInformationMessage(
                I18n.t('extension.command.deleteObject.success', treeItem.label),
              );

              // 刷新树视图
              objectsTreeProvider.refresh();
            },
          );
        } catch (error) {
          vscode.window.showErrorMessage(
            I18n.t('extension.command.deleteObject.error') + ': ' + error,
          );
        }
      },
    ),
  );
}
