import * as vscode from 'vscode';
import { ObjectsTreeProvider } from '../views/tree/objectsTreeProvider';
import { getApiClient, ConfigManager, SpaceManager } from '../services';
import { I18n } from '../utils';
import { isInvalidSpaceError } from '../utils/errorHandler';

export function registerCreateObjectCommand(
  context: vscode.ExtensionContext,
  objectsTreeProvider: ObjectsTreeProvider,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.createObject', async () => {
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

      // 获取所有类型
      const client = getApiClient();
      const spaceId = SpaceManager.getCurrentSpaceId();

      try {
        const typesResponse = await client.types.list(spaceId);
        const types = typesResponse.data;

        if (types.length === 0) {
          vscode.window.showInformationMessage(
            I18n.t('extension.command.createObject.noTypes'),
          );
          return;
        }

        // 显示类型选择器
        const typeItems = types.map((type) => ({
          label: type.name,
          description: type.key, // Use type.key instead of type.id
        }));

        const selectedType = await vscode.window.showQuickPick(typeItems, {
          placeHolder: I18n.t('extension.command.createObject.selectType'),
        });

        if (!selectedType) {
          return;
        }

        // 获取对象名称
        const objectName = await vscode.window.showInputBox({
          placeHolder: I18n.t('extension.command.createObject.enterName'),
          prompt: I18n.t('extension.command.createObject.enterNamePrompt'),
          validateInput: (value) => {
            if (!value || value.trim().length === 0) {
              return I18n.t('extension.command.createObject.nameRequired');
            }
            return null;
          },
        });

        if (!objectName) {
          return;
        }

        // 创建对象
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: I18n.t('extension.command.createObject.creating'),
            cancellable: false,
          },
          async () => {
            try {
              // 调用 API 创建对象
              const createResponse = await client.objects.create(spaceId, {
                type_key: selectedType.description, // Use type_key instead of type
                name: objectName.trim(),
              });

              if (createResponse.object) {
                vscode.window.showInformationMessage(
                  I18n.t('extension.command.createObject.success'),
                );

                // 刷新树视图
                objectsTreeProvider.refresh();
              }
            } catch (error) {
              // 检查是否是空间无效错误
              if (isInvalidSpaceError(error)) {
                // 触发空间重新选择
                vscode.commands.executeCommand('anytype.switchSpace');
              } else {
                throw error; // 重新抛出其他错误
              }
            }
          },
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          I18n.t('extension.command.createObject.error') + ': ' + error,
        );
      }
    }),
  );
}
