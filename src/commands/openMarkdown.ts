import * as vscode from 'vscode';
import {
  StorageManager,
  SpaceManager,
  getApiClient,
  ObjectSyncManager,
} from '../services';
import { I18n } from '../utils';
import { TreeItem } from '../views/tree/objectsTreeProvider';
import { isInvalidSpaceError } from '../utils/errorHandler';
// @ts-ignore
import { lint as lintSync } from 'markdownlint/sync';
// @ts-ignore
import { applyFixes } from 'markdownlint';

export function registerOpenMarkdownCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'anytype.openMarkdown',
      async (item: TreeItem) => {
        try {
          let markdown = item.markdown ?? '';

          // 如果 item 没有 markdown,从 API 获取
          if (!markdown) {
            const client = getApiClient();
            const spaceId = SpaceManager.getCurrentSpaceId();

            try {
              const response = await client.objects.get(spaceId, item.id);
              markdown = response.object.markdown ?? '';
            } catch (error) {
              // 检查是否是空间无效错误
              if (isInvalidSpaceError(error)) {
                // 触发空间重新选择
                vscode.commands.executeCommand('anytype.switchSpace');
                return;
              }
              throw error; // 重新抛出其他错误
            }
          }

          const results = lintSync({ strings: { content: markdown } });
          const fixed = applyFixes(markdown, results.content);
          markdown = fixed;
          const filePath = StorageManager.writeFile(item.label, markdown);

          // 注册文件到对象的映射关系
          ObjectSyncManager.registerMapping({
            objectId: item.id,
            objectName: item.label,
            filePath: filePath,
            spaceId: SpaceManager.getCurrentSpaceId(),
          });

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
