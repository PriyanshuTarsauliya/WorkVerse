import sys

path = 'frontend/src/components/jobs/ProfileModal.jsx'
with open(path, 'r') as f:
    content = f.read()

replacements = {
    'bg-base-950': 'bg-main',
    'bg-base-900': 'bg-surface',
    'bg-base-800': 'bg-nested',
    'bg-base-750': 'bg-nested',
    'border-base-800': 'border-borderSubtle',
    'border-base-750': 'border-borderStrong',
    'border-base-700': 'border-borderStrong',
    'border-base-600': 'border-borderStrong',
    'text-base-50': 'text-txtMain',
    'text-base-200': 'text-txtMain',
    'text-base-300': 'text-txtMain',
    'text-base-400': 'text-txtMuted',
    'text-base-500': 'text-txtMuted opacity-80',
    'bg-indigo-light': 'bg-accent',
    'text-indigo-light': 'text-accent',
    'border-indigo-light': 'border-accent',
    'bg-indigo': 'bg-accent',
    'text-indigo': 'text-accent',
    'border-indigo': 'border-accent',
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Revert specific things
content = content.replace('text-txtMain bg-emerald-600', 'text-white bg-emerald-600')
content = content.replace('text-txtMain font-bold rounded-xl', 'text-white font-bold rounded-xl')

with open(path, 'w') as f:
    f.write(content)
print('Replaced classes successfully.')
