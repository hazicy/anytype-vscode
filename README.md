# Anytype VSCode Extension

A VSCode extension for managing Anytype notes and objects directly from your editor.

## Features

- 📁 **Browse Objects** - View your Anytype objects in a dedicated sidebar
- 🔄 **Space Management** - Easy switching between spaces with status bar indicator
- 📝 **Open as Markdown** - Open any object as a markdown file in the editor
- 🔄 **Auto-refresh** - Refresh your object list with a single click
- ⚡ **Caching** - Built-in caching for improved performance
- ⚙️ **Configurable** - Fully configurable API settings
- 🛡️ **Secure** - No hardcoded credentials, all tokens stored in VSCode settings

## Installation

1. Clone this repository

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Compile the extension:

   ```bash
   pnpm run compile
   ```

4. Launch the extension in development mode:

   ```bash
   pnpm run watch
   ```

## Configuration

Before using the extension, you need to configure your API settings:

1. Open VSCode Settings (Ctrl+, or Cmd+,)
2. Search for "Anytype"
3. Configure the following settings:

### Required Settings

- **`anytype.api.token`** - Your Anytype API token (Bearer token)

### Optional Settings

- **`anytype.api.baseUrl`** - The base URL of the Anytype API (default: `http://127.0.0.1:31009`)
- **`anytype.cache.enabled`** - Enable caching of API responses (default: `true`)
- **`anytype.cache.ttl`** - Cache time-to-live in milliseconds (default: `300000` = 5 minutes)

## Usage

### Selecting a Space

When you first activate the extension, you'll be prompted to select a space. The current space is displayed in the status bar at the bottom of VSCode. Click on it or use the command palette (Ctrl+Shift+P or Cmd+Shift+P) and search for "Anytype: Switch Space" to change spaces.

### Browsing Objects

1. Open the Anytype sidebar by clicking on the Anytype icon in the activity bar
2. Navigate through the "Objects" and "Pinned" views
3. Click on any object to open it as a markdown file

### Opening Objects as Markdown

When you click on an object:

- The object is saved as a markdown file in the extension's global storage directory
- The file opens automatically in the editor
- Any changes you make are saved locally

### Refreshing the View

Click the refresh button in the sidebar header or use the command palette (Ctrl+Shift+P or Cmd+Shift+P) and search for "Anytype: Refresh".

## Commands

- **`anytype.switchSpace`** - Switch between spaces
- **`anytype.refresh`** - Refresh the object tree
- **`anytype.openSettings`** - Open Anytype settings
- **`anytype.openMarkdown`** - Open an object as markdown

## Development

### Project Structure

```text
.
├── src/
│   ├── extension.ts              # Main extension entry point
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── lib/
│   │   ├── config.ts             # Configuration management
│   │   ├── spaceManager.ts       # Space selection and management
│   │   └── request.ts            # HTTP client setup
│   └── providers/
│       └── objectsTreeProvider.ts # Tree data provider
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
├── webpack.config.js             # Webpack build configuration
└── eslint.config.mjs             # ESLint configuration
```

### Building

```bash
# Compile in development mode
pnpm run compile

# Build for production
pnpm run package

# Watch for changes during development
pnpm run watch
```

### Testing

```bash
# Run linting
pnpm run lint

# Run tests
pnpm run test
```

## Security

This extension does not store any credentials in the code. All API tokens are securely stored in VSCode's configuration settings and are never exposed to third parties.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See [LICENSE](LICENSE) file for details.

## Changelog

### 0.0.1

- Initial release
- Basic object browsing
- Markdown file generation
- Configurable API settings
- Caching support
- Error handling and user feedback
