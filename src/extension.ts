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

  // 显示欢迎信息并提示选择空间
  if (!SpaceManager.hasSpace()) {
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

export function deactivate() {
  // 清理资源
}
