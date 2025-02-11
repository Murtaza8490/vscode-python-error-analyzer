import * as vscode from 'vscode';
import { spawnSync } from 'child_process';

export class PythonParser {
    public static parseCode(code: string): any {
        try {
            // Use Python's ast module to parse the code
            const result = spawnSync('python', ['-c', `
import ast
import sys
try:
    ast.parse(sys.argv[1])
    print('{"success": true}')
except SyntaxError as e:
    print('{"success": false, "error": "' + str(e) + '"}')
            `, code]);

            return JSON.parse(result.stdout.toString());
        } catch (error) {
            console.error('Error parsing Python code:', error);
            return { success: false, error: 'Failed to parse code' };
        }
    }
}
