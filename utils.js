"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSuggestionMessage = exports.formatErrorMessage = exports.getLineIndentation = void 0;
function getLineIndentation(line) {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
}
exports.getLineIndentation = getLineIndentation;
function formatErrorMessage(message) {
    return message
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
exports.formatErrorMessage = formatErrorMessage;
function generateSuggestionMessage(error, suggestion) {
    return `Error: ${error}\nSuggestion: ${suggestion}`;
}
exports.generateSuggestionMessage = generateSuggestionMessage;
//# sourceMappingURL=utils.js.map