import * as vscode from 'vscode';
import { ObjectSyncManager } from '../services';

/**
 * 注册编辑器装饰提供者
 * 为已同步的文件添加特殊标记
 */
export function registerEditorDecorator(context: vscode.ExtensionContext) {
  const fileDecorationProvider = vscode.window.registerFileDecorationProvider({
    provideFileDecoration(uri: vscode.Uri) {
      const mapping = ObjectSyncManager.getMapping(uri.fsPath);

      if (mapping) {
        // 返回装饰对象,显示一个同步图标或徽章
        return {
          badge: 'sync',
          tooltip: 'Changes will be synced to Anytype',
          color: new vscode.ThemeColor('terminal.ansiGreen'),
        };
      }

      return undefined;
    },
  });

  context.subscriptions.push(fileDecorationProvider);
}
