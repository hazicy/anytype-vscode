import * as vscode from 'vscode';
import { ObjectsTreeProvider } from '../views/tree/objectsTreeProvider';
import { registerRefreshCommand } from './refresh';
import { registerOpenSettingsCommand } from './openSettings';
import { registerSwitchSpaceCommand } from './switchSpace';
import { registerOpenMarkdownCommand } from './openMarkdown';
import { registerSyncOnSaveCommand } from './syncOnSave';
import { registerEditorDecorator } from './decorateEditor';
import { registerCreateObjectCommand } from './createObject';

export function registerCommands(
  context: vscode.ExtensionContext,
  objectsTreeProvider: ObjectsTreeProvider,
) {
  registerRefreshCommand(context, objectsTreeProvider);
  registerOpenSettingsCommand(context);
  registerSwitchSpaceCommand(context);
  registerOpenMarkdownCommand(context);
  registerSyncOnSaveCommand(context);
  registerEditorDecorator(context);
  registerCreateObjectCommand(context, objectsTreeProvider);
}
