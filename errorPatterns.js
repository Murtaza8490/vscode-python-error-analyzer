"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonErrorPatterns = void 0;
exports.commonErrorPatterns = {
    undefinedVariable: /NameError: name '(\w+)' is not defined/,
    syntaxError: /SyntaxError: (.*)/,
    indentationError: /IndentationError: (.*)/,
    importError: /ImportError: (.*)/,
    typeError: /TypeError: (.*)/
};
//# sourceMappingURL=errorPatterns.js.map