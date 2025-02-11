"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickFixProvider = void 0;
const vscode = require("vscode");
const errorAnalyzer_1 = require("./errorAnalyzer");
class QuickFixProvider {
    constructor() {
        this.errorAnalyzer = new errorAnalyzer_1.ErrorAnalyzer();
    }
    provideCodeActions(document, range, context, token) {
        if (token.isCancellationRequested) {
            return [];
        }
        const diagnostics = context.diagnostics;
        const codeActions = [];
        diagnostics.forEach(diagnostic => {
            if (token.isCancellationRequested) {
                return;
            }
            const suggestions = this.errorAnalyzer.getSuggestions({
                line: range.start.line + 1,
                column: range.start.character,
                message: diagnostic.message,
                severity: 'error',
                type: this.getErrorType(diagnostic.message)
            });
            suggestions.forEach(suggestion => {
                const action = new vscode.CodeAction(suggestion, vscode.CodeActionKind.QuickFix);
                // Create a workspace edit
                const fix = new vscode.WorkspaceEdit();
                const fixText = suggestion.includes('Import')
                    ? `import ${suggestion.split(' ')[1]}`
                    : this.getFixText(suggestion, document.getText(range));
                fix.replace(document.uri, range, fixText);
                action.edit = fix;
                // Set diagnostics this fix addresses
                action.diagnostics = [diagnostic];
                action.isPreferred = true;
                codeActions.push(action);
            });
        });
        return codeActions;
    }
    getErrorType(message) {
        if (message.includes('NameError'))
            return 'NameError';
        if (message.includes('SyntaxError'))
            return 'SyntaxError';
        if (message.includes('IndentationError'))
            return 'IndentationError';
        return 'Unknown';
    }
    getFixText(suggestion, originalText) {
        // Add more sophisticated fix text generation based on error type
        switch (suggestion) {
            case 'Check indentation':
                return originalText.replace(/^\s*/, '    ');
            case 'Define the variable before using it':
                const varName = originalText.trim();
                return `${varName} = None  # TODO: Initialize this variable`;
            default:
                return originalText;
        }
    }
}
exports.QuickFixProvider = QuickFixProvider;
//# sourceMappingURL=quickFixProvider.js.map