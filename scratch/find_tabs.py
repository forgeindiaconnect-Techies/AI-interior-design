import re

def search_in_file(filepath, keywords):
    print(f"\n--- Searching in {filepath} ---")
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading with utf-8: {e}")
        try:
            with open(filepath, 'r', encoding='utf-16', errors='ignore') as f:
                content = f.read()
        except Exception as e2:
            print(f"Error reading with utf-16: {e2}")
            return
            
    lines = content.splitlines()
    for i, line in enumerate(lines):
        for kw in keywords:
            if kw.lower() in line.lower():
                print(f"Line {i+1}: {line.strip()[:120]}")
                break

search_in_file(r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\frontend\src\pages\AdminDashboard.jsx", ["designerRequest", "manualDesign", "customDesign", "activeTab === '", "activeTab == '"])
search_in_file(r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\frontend\src\pages\VendorDashboard.jsx", ["designerRequest", "manualDesign", "customDesign", "activeTab === '", "activeTab == '"])
