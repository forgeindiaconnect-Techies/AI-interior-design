import os
import re

controllers_dir = r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\backend\controllers"

# Regex to match the if block:
# if (global.MOCK_DB || ...) { ... }
# Note: Since there can be nested braces, it's better to just do a simple line-based approach or use a recursive descent parser.
# Actually, since the formatting is consistent, we can just look for `if (global.MOCK_DB` and find the matching closing brace.

def remove_mock_db_blocks(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We will search for "if (global.MOCK_DB"
    while True:
        start_idx = content.find("if (global.MOCK_DB")
        if start_idx == -1:
            break
        
        # Find the opening brace of this if block
        brace_start = content.find("{", start_idx)
        if brace_start == -1:
            break
            
        # Find the matching closing brace
        brace_count = 1
        idx = brace_start + 1
        while brace_count > 0 and idx < len(content):
            if content[idx] == '{':
                brace_count += 1
            elif content[idx] == '}':
                brace_count -= 1
            idx += 1
            
        if brace_count == 0:
            # We found the end of the block.
            # Remove from start_idx up to idx
            # Also try to remove leading spaces before 'if'
            line_start = content.rfind('\n', 0, start_idx)
            if line_start != -1:
                content = content[:line_start+1] + content[idx:]
            else:
                content = content[:start_idx] + content[idx:]
        else:
            break

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filename in os.listdir(controllers_dir):
    if filename.endswith(".js"):
        filepath = os.path.join(controllers_dir, filename)
        remove_mock_db_blocks(filepath)
        print(f"Processed {filename}")
