import * as vscode from 'vscode';
import { ErrorAnalyzer } from './errorAnalyzer';
import { ErrorPattern } from './errorPatterns';

export class DiagnosticProvider {
    private errorAnalyzer: ErrorAnalyzer;

    constructor() {
        this.errorAnalyzer = new ErrorAnalyzer();
    }

    public analyzePythonCode(
        document: vscode.TextDocument,
        collection: vscode.DiagnosticCollection
    ): void {
        const errors = this.errorAnalyzer.analyzeCode(document);
        const diagnostics: vscode.Diagnostic[] = [];

        errors.forEach(error => {
            const range = new vscode.Range(
                error.line - 1,
                error.column,
                error.line - 1,
                error.column + 1
            );

            const diagnostic = new vscode.Diagnostic(
                range,
                error.message,
                this.getSeverity(error.severity)
            );

            diagnostic.source = 'Python Error Analyzer';
            diagnostics.push(diagnostic);
        });

        collection.set(document.uri, diagnostics);
    }

    private getSeverity(severity: string): vscode.DiagnosticSeverity {
        switch (severity) {
            case 'error':
                return vscode.DiagnosticSeverity.Error;
            case 'warning':
                return vscode.DiagnosticSeverity.Warning;
            default:
                return vscode.DiagnosticSeverity.Information;
        }
    }
}
