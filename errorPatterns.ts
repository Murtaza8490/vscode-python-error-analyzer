export interface ErrorPattern {
    line: number;
    column: number;
    message: string;
    severity: string;
    type?: string;
    suggestions?: string[];
}

export const commonErrorPatterns: { [key: string]: RegExp } = {
    undefinedVariable: /NameError: name '(\w+)' is not defined/,
    syntaxError: /SyntaxError: (.*)/,
    indentationError: /IndentationError: (.*)/,
    importError: /ImportError: (.*)/,
    typeError: /TypeError: (.*)/
};
