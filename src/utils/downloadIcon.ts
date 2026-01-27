import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';

export async function downloadIcon(
  url: string,
  context: vscode.ExtensionContext,
) {
  const fileName = path.basename(url);
  const iconDir = context.globalStorageUri.fsPath;

  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }

  const localPath = path.join(iconDir, fileName);

  if (!fs.existsSync(localPath)) {
    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(localPath);
      https
        .get(url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        })
        .on('error', reject);
    });
  }

  return localPath;
}
