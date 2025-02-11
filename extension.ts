import * as vscode from 'vscode';
import { DiagnosticProvider } from './diagnosticProvider';
import { QuickFixProvider } from './quickFixProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Python Error Analyzer is now active');

    const diagnosticProvider = new DiagnosticProvider();
    const quickFixProvider = new QuickFixProvider();

    // Register the diagnostic collection
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('python-error-analyzer');
    context.subscriptions.push(diagnosticCollection);

    // Register event handlers
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.languageId === 'python') {
                diagnosticProvider.analyzePythonCode(event.document, diagnosticCollection);
            }
        })
    );

    // Register code action provider
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('python', quickFixProvider, {
            providedCodeActionKinds: [
                vscode.CodeActionKind.QuickFix
            ]
        })
    );

    // Initial analysis of open documents
    if (vscode.window.activeTextEditor) {
        diagnosticProvider.analyzePythonCode(
            vscode.window.activeTextEditor.document,
            diagnosticCollection
        );
    }
}

export function deactivate() {
    console.log('Python Error Analyzer is now deactivated');
}