import * as vscode from 'vscode';
import { ObjectsTreeProvider } from '../views/tree/objectsTreeProvider';
import { registerRefreshCommand } from './refresh';
import { registerOpenSettingsCommand } from './openSettings';
import { registerSwitchSpaceCommand } from './switchSpace';
import { registerOpenMarkdownCommand } from './openMarkdown';

export function registerCommands(
  context: vscode.ExtensionContext,
  objectsTreeProvider: ObjectsTreeProvider,
) {
  registerRefreshCommand(context, objectsTreeProvider);
  registerOpenSettingsCommand(context);
  registerSwitchSpaceCommand(context);
  registerOpenMarkdownCommand(context);
}
