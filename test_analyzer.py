import unittest
import json
from pathlib import Path
import sys

# Add the project root to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from syntaxAnalyzer.analyzer import analyze_code, check_syntax, analyze_static

class TestPythonAnalyzer(unittest.TestCase):
    def test_syntax_error(self):
        code = """
if True
    print("Missing colon")
"""
        result = analyze_code(code)
        self.assertTrue(any(error['type'] == 'SyntaxError' for error in result))
        self.assertEqual(len(result), 1)  # Should only report the syntax error

    def test_indentation_error(self):
        code = """
def test_function():
print("Wrong indentation")
"""
        result = analyze_code(code)
        self.assertTrue(any(error['type'] == 'IndentationError' for error in result))

    def test_name_error(self):
        code = "print(undefined_variable)"
        result = analyze_code(code)
        self.assertTrue(any(error['type'] == 'NameError' for error in result))
        self.assertTrue(any('undefined_variable' in error['message'] for error in result))

    def test_multiple_errors_same_line(self):
        code = "if x print('Multiple errors')"
        result = analyze_code(code)
        # Should prioritize syntax error over name error
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['type'], 'SyntaxError')

    def test_error_suggestions(self):
        code = "print(my_var)"
        result = analyze_code(code)
        error = result[0]
        self.assertTrue(len(error['suggestions']) > 0)
        self.assertTrue(any('Define variable' in sugg for sugg in error['suggestions']))

    def test_complex_code(self):
        code = """
def calculate_sum(a, b)
    return a + c  # undefined variable and indentation error
"""
        result = analyze_code(code)
        # Should prioritize syntax error (missing colon)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['type'], 'SyntaxError')

if __name__ == '__main__':
    unittest.main()