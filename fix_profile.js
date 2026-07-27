const fs = require('fs');

const path = 'frontend/src/components/jobs/ProfileModal.jsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = {
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
};

for (const [k, v] of Object.entries(replacements)) {
    content = content.split(k).join(v);
}

// Revert specific things
content = content.split('text-txtMain bg-emerald-600').join('text-white bg-emerald-600');
content = content.split('text-txtMain font-bold rounded-xl').join('text-white font-bold rounded-xl');
content = content.split('text-accent/20 border border-accent/30').join('bg-accent/20 border border-accent/30');

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced classes successfully.');
