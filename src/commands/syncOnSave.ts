import * as vscode from 'vscode';
import { ObjectSyncManager, SpaceManager, getApiClient } from '../services';
import { I18n } from '../utils';

/**
 * 注册文档保存时同步的命令
 */
export function registerSyncOnSaveCommand(context: vscode.ExtensionContext) {
  // 监听文档保存事件
  const saveDisposable = vscode.workspace.onDidSaveTextDocument(
    async (document) => {
      // 检查是否在我们管理的缓存目录中
      const filePath = document.uri.fsPath;

      const mapping = ObjectSyncManager.getMapping(filePath);
      if (!mapping) {
        return;
      }

      try {
        // 获取文档内容
        const content = document.getText();

        // 调用 API 更新对象
        const client = getApiClient();
        await client.objects.update(mapping.spaceId, mapping.objectId, {
          markdown: content,
        });
      } catch (error) {
        // 显示错误提示
        vscode.window.showErrorMessage(
          I18n.t('extension.error.syncFailed', String(error)),
        );
      }
    },
  );

  context.subscriptions.push(saveDisposable);
}
