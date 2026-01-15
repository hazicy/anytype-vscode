import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ObjectsTreeProvider, TreeItem } from './views/tree/objectsTreeProvider';
import { recreateApiClient } from './lib/request';
import { SpaceManager } from './lib/spaceManager';

/**
 * 获取扩展的缓存目录
 */
function getCacheDir(context: vscode.ExtensionContext): string {
  const globalStoragePath = context.globalStorageUri.fsPath;
  const cacheDir = path.join(globalStoragePath, 'markdown-cache');

  // 确保缓存目录存在
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  return cacheDir;
}

export function activate(context: vscode.ExtensionContext) {
  // 初始化空间管理器
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
      await vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'anytype.api',
      );
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
          // 使用扩展的全局存储目录
          const cacheDir = getCacheDir(context);

          // 文件名安全处理
          const safeName = item.label.replace(
            /[\\/:*?"<>|]/g,
            '_',
          );

          const filePath = path.join(cacheDir, `${safeName}.md`);

          // 写入 markdown 内容
          fs.writeFileSync(filePath, item.markdown ?? '', 'utf8');

          // 打开文件
          const uri = vscode.Uri.file(filePath);
          const document =
            await vscode.workspace.openTextDocument(uri);

          await vscode.window.showTextDocument(document, {
            preview: false,
          });
        } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to open markdown file: ${error}`,
          );
        }
      },
    ),
  );

  // 监听配置变化
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration('anytype.api.baseUrl') ||
        e.affectsConfiguration('anytype.api.token')
      ) {
        recreateApiClient();
        objectsTreeProvider.refresh();
        vscode.window.showInformationMessage('Anytype configuration updated');
      }
    }),
  );

  // 显示欢迎信息并提示选择空间
  if (!SpaceManager.hasSpace()) {
    vscode.window.showInformationMessage(
      'Anytype extension activated! Please select a space to get started.',
      'Select Space',
      'Open Settings',
    ).then((selection) => {
      if (selection === 'Select Space') {
        vscode.commands.executeCommand('anytype.switchSpace');
      } else if (selection === 'Open Settings') {
        vscode.commands.executeCommand('anytype.openSettings');
      }
    });
  }
}

export function deactivate() {
  // 清理资源
}
