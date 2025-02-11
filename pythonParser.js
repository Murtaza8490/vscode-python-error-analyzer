"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonParser = void 0;
const child_process_1 = require("child_process");
class PythonParser {
    static parseCode(code) {
        try {
            // Use Python's ast module to parse the code
            const result = (0, child_process_1.spawnSync)('python', ['-c', `
import ast
import sys
try:
    ast.parse(sys.argv[1])
    print('{"success": true}')
except SyntaxError as e:
    print('{"success": false, "error": "' + str(e) + '"}')
            `, code]);
            return JSON.parse(result.stdout.toString());
        }
        catch (error) {
            console.error('Error parsing Python code:', error);
            return { success: false, error: 'Failed to parse code' };
        }
    }
}
exports.PythonParser = PythonParser;
//# sourceMappingURL=pythonParser.js.map