import * as vscode from 'vscode';
import { ObjectsTreeProvider } from './views/tree/objectsTreeProvider';
import { ApiClientManager, SpaceManager, StorageManager, ConfigManager } from './services';
import { I18n } from './utils';
import { registerCommands } from './commands';

export function activate(context: vscode.ExtensionContext) {
  // Initialize services
  I18n.initialize(context);
  StorageManager.initialize(context);
  SpaceManager.initialize(context);

  const objectsTreeProvider = new ObjectsTreeProvider();

  // 注册 Objects TreeView
  vscode.window.registerTreeDataProvider(
    'objectsView',
    objectsTreeProvider,
  );

  // 注册所有命令
  registerCommands(context, objectsTreeProvider);

  // 监听配置变化
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (ConfigManager.affectsApiConfig(e)) {
        ApiClientManager.recreateClient();
        objectsTreeProvider.refresh();
        vscode.window.showInformationMessage(
          I18n.t('extension.command.configuration.updated'),
        );
      }
    }),
  );

  // 验证当前空间是否仍然有效
  if (SpaceManager.hasSpace()) {
    validateAndHandleSpace(context);
  } else {
    // 显示欢迎信息并提示选择空间
    vscode.window
      .showInformationMessage(
        I18n.t('extension.command.activated.title'),
        I18n.t('extension.command.selectSpace'),
        I18n.t('extension.command.openSettings.button'),
      )
      .then((selection) => {
        if (selection === I18n.t('extension.command.selectSpace')) {
          vscode.commands.executeCommand('anytype.switchSpace');
        } else if (selection === I18n.t('extension.command.openSettings.button')) {
          vscode.commands.executeCommand('anytype.openSettings');
        }
      });
  }
}

/**
 * Validate current space and handle invalid space scenario
 */
async function validateAndHandleSpace(context: vscode.ExtensionContext): Promise<void> {
  const isValid = await SpaceManager.validateCurrentSpace();

  if (!isValid) {
    await SpaceManager.handleInvalidSpace(context);
  }
}

export function deactivate() {
  // 清理资源
}
