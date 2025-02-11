"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticProvider = void 0;
const vscode = require("vscode");
const errorAnalyzer_1 = require("./errorAnalyzer");
class DiagnosticProvider {
    constructor() {
        this.errorAnalyzer = new errorAnalyzer_1.ErrorAnalyzer();
    }
    analyzePythonCode(document, collection) {
        const errors = this.errorAnalyzer.analyzeCode(document);
        const diagnostics = [];
        errors.forEach(error => {
            const range = new vscode.Range(error.line - 1, error.column, error.line - 1, error.column + 1);
            const diagnostic = new vscode.Diagnostic(range, error.message, this.getSeverity(error.severity));
            diagnostic.source = 'Python Error Analyzer';
            diagnostics.push(diagnostic);
        });
        collection.set(document.uri, diagnostics);
    }
    getSeverity(severity) {
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
exports.DiagnosticProvider = DiagnosticProvider;
//# sourceMappingURL=diagnosticProvider.js.map