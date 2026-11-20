import fs from 'fs';
import path from 'path';

const catalogPath = path.resolve('src/data/curriculumCatalog.ts');
let text = fs.readFileSync(catalogPath, 'utf-8');

// Strip TypeScript imports and type annotations
text = text.replace(/import\s+.*?from\s+['"].*?['"];/g, '');
text = text.replace(/export\s+const\s+CURRICULUM_CATALOG\s*:\s*SimulationMetadata\[\]\s*=/, 'const CURRICULUM_CATALOG =');

// Wrap in module and extract
const fn = new Function(`${text}; return CURRICULUM_CATALOG;`);
const labs = fn();

const outPath = path.resolve('src/data/labs.json');
fs.writeFileSync(outPath, JSON.stringify(labs, null, 2), 'utf-8');
console.log(`Extracted ${labs.length} labs into ${outPath}`);
