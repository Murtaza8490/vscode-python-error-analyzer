git clone https://github.com/Murtaza8490/vscode-python-error-analyzer.git
   cd vscode-python-error-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Package the extension:
   ```bash
   npm run package
   ```

## Testing Locally

1. Install the packaged extension:
   - Locate the generated `python-error-analyzer-1.0.0.vsix` file in the project directory
   - In VS Code, press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
   - Type "Install from VSIX" and select the command
   - Choose the .vsix file you just created
   - Restart VS Code when prompted

2. Verify the installation:
   - Open a Python file (`.py` extension)
   - The extension should automatically activate
   - Try introducing some common Python errors (undefined variables, syntax errors)
   - Hover over the errors to see diagnostics
   - Look for the lightbulb icon to access quick fixes

### Publishing to GitHub

1. Create a new repository on GitHub (https://github.com/new)
   - Repository name: vscode-python-error-analyzer
   - Add a description
   - Choose public repository
   - Initialize with a README (optional)

2. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial release: Python Error Analyzer VSCode Extension"
   git branch -M main
   git remote add origin https://github.com/Murtaza8490/vscode-python-error-analyzer.git
   git push -u origin main
   ```

### Publishing to VS Code Marketplace

1. Create a publisher account:
   - Go to https://marketplace.visualstudio.com/manage
   - Sign in with your Microsoft account
   - Create a publisher if you don't have one

2. Get a Personal Access Token:
   - Go to https://dev.azure.com
   - Click on your profile > Security
   - Create a new token with "Marketplace (publish)" scope

3. Login to vsce:
   ```bash
   npx vsce login [YOUR-PUBLISHER-NAME]
   ```

4. Publish the extension:
   ```bash
   npm run package
   npx vsce publish