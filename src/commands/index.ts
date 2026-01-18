import * as vscode from 'vscode';
import { ObjectsTreeProvider } from '../views/tree/objectsTreeProvider';
import { TrashTreeProvider } from '../views/tree/trashTreeProvider';
import { PinnedTreeProvider } from '../views/tree/pinnedTreeProvider';
import { registerRefreshCommand } from './refresh';
import { registerOpenSettingsCommand } from './openSettings';
import { registerSwitchSpaceCommand } from './switchSpace';
import { registerOpenMarkdownCommand } from './openMarkdown';
import { registerSyncOnSaveCommand } from './syncOnSave';
import { registerEditorDecorator } from './decorateEditor';
import { registerCreateObjectCommand } from './createObject';
import { registerDeleteObjectCommand } from './deleteObject';
import { registerArchiveObjectCommand } from './archiveObject';

export function registerCommands(
  context: vscode.ExtensionContext,
  objectsTreeProvider: ObjectsTreeProvider,
  trashTreeProvider?: TrashTreeProvider,
  pinnedTreeProvider?: PinnedTreeProvider,
) {
  registerRefreshCommand(context, objectsTreeProvider, trashTreeProvider, pinnedTreeProvider);
  registerOpenSettingsCommand(context);
  registerSwitchSpaceCommand(context, objectsTreeProvider, trashTreeProvider, pinnedTreeProvider);
  registerOpenMarkdownCommand(context);
  registerSyncOnSaveCommand(context);
  registerEditorDecorator(context);
  registerCreateObjectCommand(context, objectsTreeProvider);
  registerDeleteObjectCommand(context, objectsTreeProvider);
  registerArchiveObjectCommand(context, objectsTreeProvider);
}
