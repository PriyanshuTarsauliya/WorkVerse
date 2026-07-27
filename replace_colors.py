import sys

path = 'frontend/src/components/prep/PrepHubModal.jsx'
with open(path, 'r') as f:
    content = f.read()

replacements = {
    'bg-navy-950': 'bg-main',
    'bg-navy-900': 'bg-surface',
    'bg-navy-800': 'bg-nested',
    'border-navy-750': 'border-borderStrong',
    'border-navy-800': 'border-borderSubtle',
    'border-navy-700': 'border-borderStrong',
    'text-txt-secondary': 'text-txtMuted',
    'text-txt-tertiary': 'text-txtMuted opacity-80',
    'text-white': 'text-txtMain',
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Revert specific things where we DO want white text, e.g. buttons
content = content.replace('text-txtMain bg-emerald-600', 'text-white bg-emerald-600')
content = content.replace('text-txtMain bg-indigo', 'text-white bg-indigo')
content = content.replace('text-txtMain font-bold rounded-xl', 'text-white font-bold rounded-xl')
content = content.replace('text-txtMain mb-2 flex items-center gap-2', 'text-white mb-2 flex items-center gap-2')
content = content.replace('text-txtMain shrink-0', 'text-white shrink-0') # Avatar letters
content = content.replace('text-txtMain font-bold shadow-md', 'text-white font-bold shadow-md')
content = content.replace('fill-white', 'fill-current')
content = content.replace('bg-black/75', 'bg-black/60')
content = content.replace('text-emerald-300', 'text-emerald-400')

with open(path, 'w') as f:
    f.write(content)
print('Replaced classes successfully.')
