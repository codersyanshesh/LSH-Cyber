import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract sections
# Hero: lines 67-162 (approximately)
# We can use regex to extract sections based on their IDs

def extract_section(html, section_id):
    pattern = r'(<section\s+id="' + section_id + r'".*?</section>)'
    match = re.search(pattern, html, re.DOTALL)
    if match:
        return match.group(1)
    return ""

sections = {
    'hero': extract_section(html, 'hero'),
    'about': extract_section(html, 'about'),
    'experience': extract_section(html, 'experience'),
    'tto-simulator': extract_section(html, 'tto-simulator'),
    'projects': extract_section(html, 'projects'),
    'certificates': extract_section(html, 'certificates'),
    'contact': extract_section(html, 'contact')
}

# The modal needs to go with vault.html
modal_pattern = r'(<!-- ─── Certificate Modal ───.*?</div>\n</div>)'
modal_match = re.search(modal_pattern, html, re.DOTALL)
modal_html = modal_match.group(1) if modal_match else ""

# Create base layout
head_nav_pattern = r'(<!DOCTYPE html>.*?</nav>\n)'
head_nav_match = re.search(head_nav_pattern, html, re.DOTALL)
base_top = head_nav_match.group(1)

footer_scripts_pattern = r'(<footer.*?</html>)'
footer_scripts_match = re.search(footer_scripts_pattern, html, re.DOTALL)
base_bottom = '\n<main>\n{content}\n</main>\n\n' + footer_scripts_match.group(1)

# Modify navigation in base_top
base_top = base_top.replace('href="#hero"', 'href="index.html"')
base_top = base_top.replace('href="#about"', 'href="intel.html"')
base_top = base_top.replace('href="#experience"', 'href="field-ops.html"')
base_top = base_top.replace('href="#tto-simulator"', 'href="tto-sim.html"')
base_top = base_top.replace('href="#projects"', 'href="projects.html"')
base_top = base_top.replace('href="#certificates"', 'href="vault.html"')
base_top = base_top.replace('href="#contact"', 'href="connect.html"')

# Also modify CTAs in Hero
sections['hero'] = sections['hero'].replace('href="#tto-simulator"', 'href="tto-sim.html"')
sections['hero'] = sections['hero'].replace('href="#contact"', 'href="connect.html"')

# Also modify footer links
base_bottom = base_bottom.replace('href="#hero"', 'href="index.html"')
base_bottom = base_bottom.replace('href="#experience"', 'href="field-ops.html"')
base_bottom = base_bottom.replace('href="#tto-simulator"', 'href="tto-sim.html"')
base_bottom = base_bottom.replace('href="#contact"', 'href="connect.html"')

pages = {
    'index.html': sections['hero'],
    'intel.html': sections['about'],
    'field-ops.html': sections['experience'],
    'tto-sim.html': sections['tto-simulator'],
    'projects.html': sections['projects'],
    'vault.html': sections['certificates'] + '\n\n' + modal_html,
    'connect.html': sections['contact']
}

for filename, content in pages.items():
    full_html = base_top + base_bottom.format(content=content)
    # Give the body an ID based on filename so JS can know which page it is
    body_id = filename.replace('.html', '')
    full_html = full_html.replace('<body>', f'<body id="page-{body_id}">')
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(full_html)
        
print("HTML split successfully.")
