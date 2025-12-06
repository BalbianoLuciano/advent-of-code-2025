const fs = require('fs');
const path = require('path');

// Leer el archivo input.txt
const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
const lines = input.trim().split('\n');

// Separar rangos e IDs
let ranges = [];
let ids = [];
let parsingRanges = true;

for (let line of lines) {
    line = line.trim();

    // Si encontramos una línea vacía, cambiamos a parsear IDs
    if (line === '') {
        parsingRanges = false;
        continue;
    }

    if (parsingRanges) {
        // Parsear rangos: "min-max"
        const [min, max] = line.split('-').map(Number);
        ranges.push({ min, max });
    } else {
        // Parsear IDs individuales
        const id = Number(line);
        if (!isNaN(id)) {
            ids.push(id);
        }
    }
}

// Función para verificar si un ID está dentro de algún rango
function isValidIngredient(id, ranges) {
    return ranges.some(range => id >= range.min && id <= range.max);
}

// Contar ingredientes válidos
let validCount = 0;
let invalidCount = 0;

console.log('Verificando ingredientes...\n');

for (let id of ids) {
    const isValid = isValidIngredient(id, ranges);
    if (isValid) {
        validCount++;
    } else {
        invalidCount++;
    }
}

console.log(`Total de rangos: ${ranges.length}`);
console.log(`Total de IDs a verificar: ${ids.length}`);
console.log(`\n=== PARTE 1 ===`);
console.log(`- IDs frescos (válidos): ${validCount}`);
console.log(`- IDs dañados (inválidos): ${invalidCount}`);
console.log(`\nRespuesta Parte 1: ${validCount} IDs de ingredientes son frescos`);

// PARTE 2: Contar todos los números válidos en los rangos
console.log(`\n=== PARTE 2 ===`);

// Calcular el total de números en todos los rangos (sin considerar solapamientos aún)
let totalWithOverlaps = 0;
for (let range of ranges) {
    const count = range.max - range.min + 1;
    totalWithOverlaps += count;
}
console.log(`Total de números (con solapamientos): ${totalWithOverlaps}`);

// Para contar sin solapamientos, necesitamos fusionar rangos que se superponen
// Ordenar rangos por el valor mínimo
ranges.sort((a, b) => a.min - b.min);

// Fusionar rangos solapados
let mergedRanges = [];
let current = ranges[0];

for (let i = 1; i < ranges.length; i++) {
    const next = ranges[i];

    // Si el siguiente rango se solapa o es adyacente al actual
    if (next.min <= current.max + 1) {
        // Fusionar expandiendo el rango actual
        current.max = Math.max(current.max, next.max);
    } else {
        // No hay solapamiento, guardar el rango actual y empezar uno nuevo
        mergedRanges.push(current);
        current = next;
    }
}
// No olvidar agregar el último rango
mergedRanges.push(current);

// Contar números únicos en rangos fusionados
let totalUnique = 0;
for (let range of mergedRanges) {
    totalUnique += range.max - range.min + 1;
}

console.log(`Rangos originales: ${ranges.length}`);
console.log(`Rangos después de fusionar: ${mergedRanges.length}`);
console.log(`\nRespuesta Parte 2: ${totalUnique} números válidos en total`);
