import * as vscode from 'vscode';
import { ObjectsTreeProvider, TreeItem } from './views/tree/objectsTreeProvider';
import { ApiClientManager, SpaceManager, StorageManager, ConfigManager } from './services';
import { I18n } from './utils';

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

  // 刷新命令
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.refresh', () => {
      objectsTreeProvider.refresh();
    }),
  );

  // 打开设置命令
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.openSettings', async () => {
      await ConfigManager.openSettings();
    }),
  );

  // 切换空间命令
  context.subscriptions.push(
    vscode.commands.registerCommand('anytype.switchSpace', async () => {
      await SpaceManager.showSpacePicker(context);
    }),
  );

  // 打开 Markdown 文件命令
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'anytype.openMarkdown',
      async (item: TreeItem) => {
        try {
          const filePath = StorageManager.writeFile(item.label, item.markdown ?? '');

          // 打开文件
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
