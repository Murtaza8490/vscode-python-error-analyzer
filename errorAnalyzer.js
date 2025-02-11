"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorAnalyzer = void 0;
const child_process_1 = require("child_process");
const path_1 = require("path");
class ErrorAnalyzer {
    analyzeCode(document) {
        const errors = [];
        // Run Python syntax check
        const result = (0, child_process_1.spawnSync)('python3', [
            `${(0, path_1.dirname)(__dirname)}/syntaxAnalyzer/analyzer.py`,
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
            return analysisResult.map((error) => ({
                line: error.line,
                column: error.column,
                message: error.message,
                severity: error.severity,
                type: error.type,
                suggestions: error.suggestions || []
            }));
        }
        catch (error) {
            console.error('Error parsing analyzer output:', error);
            console.error('Raw output:', result.stdout.toString());
            return errors;
        }
    }
    getSuggestions(error) {
        if (error.suggestions && error.suggestions.length > 0) {
            return error.suggestions;
        }
        // Fallback suggestions for different error types
        const suggestionMap = {
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
exports.ErrorAnalyzer = ErrorAnalyzer;
//# sourceMappingURL=errorAnalyzer.js.map