export function getLineIndentation(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
}

export function formatErrorMessage(message: string): string {
    return message
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function generateSuggestionMessage(error: string, suggestion: string): string {
    return `Error: ${error}\nSuggestion: ${suggestion}`;
}
