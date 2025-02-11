import ast
import sys
import json
import tokenize
from io import StringIO
from typing import List, Dict, Set

def check_syntax(code: str) -> List[Dict]:
    """First phase: Check for syntax errors"""
    try:
        ast.parse(code)
        return []
    except SyntaxError as e:
        # Check if the error message indicates an indentation issue
        error_msg = str(e)
        is_indentation_error = any(msg in error_msg.lower() for msg in [
            'indentation',
            'indent',
            'expected an indented block',
            'unexpected indent'
        ])

        return [{
            'line': e.lineno or 1,
            'column': e.offset or 0,
            'message': str(e),
            'severity': 'error',
            'type': 'IndentationError' if is_indentation_error else 'SyntaxError',
            'suggestions': [
                'Check indentation level',
                'Use consistent indentation (spaces)',
                'Ensure proper block indentation'
            ] if is_indentation_error else [
                'Check syntax at the indicated position',
                'Verify matching parentheses and brackets',
                'Ensure proper indentation'
            ]
        }]

def get_defined_names(code: str) -> Set[str]:
    """Extract defined names from the code"""
    defined = {'print', 'def', 'class', 'import', 'from', 'return', 'if', 
              'else', 'elif', 'while', 'for', 'in', 'True', 'False', 'None'}
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
                defined.add(node.id)
            elif isinstance(node, ast.FunctionDef):
                defined.add(node.name)
                defined.update(arg.arg for arg in node.args.args)
            elif isinstance(node, ast.ClassDef):
                defined.add(node.name)
            elif isinstance(node, ast.Import):
                defined.update(name.name for name in node.names)
            elif isinstance(node, ast.ImportFrom):
                defined.update(name.name for name in node.names)
    except:
        pass  # If parsing fails, return what we have so far
    return defined

def analyze_static(code: str) -> List[Dict]:
    """Second phase: Static analysis for other issues"""
    errors = []
    try:
        # Use tokenize for better token parsing
        tokens = list(tokenize.generate_tokens(StringIO(code).readline))
        defined_vars = get_defined_names(code)
        current_indent = 0
        expected_indent = 0

        for i, token in enumerate(tokens):
            # Skip if we're in a string or comment
            if token.type in (tokenize.STRING, tokenize.COMMENT):
                continue

            # Handle indentation
            if token.type == tokenize.INDENT:
                current_indent = len(token.string)
                expected_indent += 4
                if current_indent != expected_indent:
                    errors.append({
                        'line': token.start[0],
                        'column': token.start[1],
                        'message': f'IndentationError: unexpected indent (expected {expected_indent} spaces)',
                        'severity': 'error',
                        'type': 'IndentationError',
                        'suggestions': [
                            'Use 4 spaces for indentation',
                            'Convert tabs to spaces',
                            'Fix indentation level'
                        ]
                    })
            elif token.type == tokenize.DEDENT:
                expected_indent -= 4
                current_indent = 0

            # Check for undefined variables
            if token.type == tokenize.NAME and token.string not in defined_vars:
                # Skip if token is being defined
                prev_token = tokens[i - 1] if i > 0 else None
                next_token = tokens[i + 1] if i < len(tokens) - 1 else None

                if (prev_token and prev_token.string in ('def', 'class', 'import', 'from', 'as')) or \
                   (next_token and next_token.string in ('=', '(', 'import', 'from')):
                    defined_vars.add(token.string)
                    continue

                errors.append({
                    'line': token.start[0],
                    'column': token.start[1],
                    'message': f"NameError: name '{token.string}' is not defined",
                    'severity': 'error',
                    'type': 'NameError',
                    'suggestions': [
                        f"Define variable '{token.string}' before using it",
                        f"Check if '{token.string}' is misspelled",
                        f"Import module if '{token.string}' is from a module"
                    ]
                })

    except tokenize.TokenError as e:
        line, msg = e.args
        errors.append({
            'line': line,
            'column': 0,
            'message': f'TokenError: {msg}',
            'severity': 'error',
            'type': 'TokenError',
            'suggestions': ['Check the syntax of your code']
        })

    return errors

def analyze_code(code: str) -> List[Dict]:
    """Main analysis function combining both phases"""
    code = code.replace('\\n', '\n')
    all_errors = []

    # Phase 1: Syntax checking
    syntax_errors = check_syntax(code)

    # If we have syntax errors, only return those (highest priority)
    if syntax_errors:
        return syntax_errors

    # Phase 2: Static analysis (only run if no syntax errors)
    static_errors = analyze_static(code)
    all_errors.extend(static_errors)

    # Sort errors by line number and column
    all_errors.sort(key=lambda x: (x['line'], x['column']))

    # Remove duplicate errors (same type on same line)
    seen_lines = set()
    unique_errors = []
    for error in all_errors:
        line = error['line']
        if line not in seen_lines:
            seen_lines.add(line)
            unique_errors.append(error)

    return unique_errors

if __name__ == '__main__':
    if len(sys.argv) > 1:
        code = sys.argv[1]
        result = analyze_code(code)
        print(json.dumps(result))
    else:
        print(json.dumps([{
            'line': 1,
            'column': 0,
            'message': 'No code provided for analysis',
            'severity': 'error',
            'type': 'InputError',
            'suggestions': ['Provide Python code for analysis']
        }]))