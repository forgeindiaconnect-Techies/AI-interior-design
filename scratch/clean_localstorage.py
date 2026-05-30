import re
import glob
import os

files = [
    r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\frontend\src\pages\VendorDashboard.jsx",
    r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\frontend\src\pages\UserDashboard.jsx",
    r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\frontend\src\pages\AdminDashboard.jsx",
    r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\frontend\src\pages\Marketplace.jsx",
    r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\frontend\src\components\DashboardLayout.jsx",
    r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\frontend\src\components\UserSidebar.jsx"
]

def replace_in_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace localStorage.getItem for mock data with empty array
    # e.g., JSON.parse(localStorage.getItem('mockOrders') || '[]') -> []
    content = re.sub(r"JSON\.parse\(localStorage\.getItem\('mock[^']+'\) \|\| '\[\]'\)", "[]", content)
    content = re.sub(r"localStorage\.getItem\('mock[^']+'\)", "null", content)
    
    # We want to remove localStorage.setItem('mock...', ...) lines
    # It's better to replace them with a console.log or just an empty statement to avoid syntax errors if they are in an expression.
    content = re.sub(r"localStorage\.setItem\('mock[^']+',[^;]+;", "", content)

    # Some setItems span multiple lines. For those, we can just look for them.
    # A simple regex to remove localStorage.setItem('mock...', <anything>);
    content = re.sub(r"localStorage\.setItem\('mock[^']+',[\s\S]*?\);", "", content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
for f in files:
    replace_in_file(f)

print("Replacement complete.")
