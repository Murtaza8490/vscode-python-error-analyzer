import * as vscode from 'vscode';
import { spawnSync } from 'child_process';
import { ErrorPattern } from './errorPatterns';
import { dirname } from 'path';

export class ErrorAnalyzer {
    public analyzeCode(document: vscode.TextDocument): ErrorPattern[] {
        const errors: ErrorPattern[] = [];

        // Run Python syntax check
        const result = spawnSync('python3', [
            `${dirname(__dirname)}/syntaxAnalyzer/analyzer.py`,
            document.getText()
        ]);

        if (result.error) {
            console.error('Error running Python analyzer:', result.error);
            return errors;
        }

        try {
            const output = result.stdout.toString().trim();
            if (!output) {
                return errors;
            }

            const analysisResult = JSON.parse(output);
            return analysisResult.map((error: any) => ({
                line: error.line,
                column: error.column,
                message: error.message,
                severity: error.severity,
                type: error.type,
                suggestions: error.suggestions || []
            }));
        } catch (error) {
            console.error('Error parsing analyzer output:', error);
            console.error('Raw output:', result.stdout.toString());
            return errors;
        }
    }

    public getSuggestions(error: ErrorPattern): string[] {
        if (error.suggestions && error.suggestions.length > 0) {
            return error.suggestions;
        }

        // Fallback suggestions for different error types
        const suggestionMap: { [key: string]: string[] } = {
            'NameError': [
                'Define the variable before using it',
                'Check for typos in variable name',
                'Import required module'
            ],
            'SyntaxError': [
                'Check for missing parentheses',
                'Verify indentation',
                'Check for missing colons'
            ],
            'IndentationError': [
                'Use consistent indentation (spaces or tabs)',
                'Check indentation level'
            ]
        };

        return suggestionMap[error.type || 'Unknown'] || ['No specific suggestions available'];
    }
}