const fs = require('fs');

// Leer el archivo de input
const input = fs.readFileSync('input.txt', 'utf8').trim();

// Función para verificar si un número es inválido
function isInvalid(num) {
    const str = num.toString();
    const len = str.length;

    // Verificar si el número es una repetición de un patrón 2, 3, 4, 5, 6 o 7 veces
    for (let repetitions = 2; repetitions <= 7; repetitions++) {
        // La longitud del patrón debe dividir exactamente la longitud total
        if (len % repetitions !== 0) continue;

        const patternLen = len / repetitions;
        const pattern = str.substring(0, patternLen);

        // Si el patrón comienza con 0, no es inválido
        if (pattern.startsWith('0')) continue;

        // Verificar si el patrón se repite exactamente 'repetitions' veces
        let isRepeated = true;
        for (let i = 1; i < repetitions; i++) {
            const segment = str.substring(i * patternLen, (i + 1) * patternLen);
            if (segment !== pattern) {
                isRepeated = false;
                break;
            }
        }

        if (isRepeated) {
            return true;
        }
    }

    return false;
}

// Parsear los rangos
const ranges = input.split(',').map(range => {
    const [start, end] = range.split('-').map(Number);
    return { start, end };
});

let sumInvalid = 0;

// Procesar cada rango
for (const { start, end } of ranges) {
    for (let num = start; num <= end; num++) {
        if (isInvalid(num)) {
            sumInvalid += num;
        }
    }
}

console.log(`Suma de IDs inválidos: ${sumInvalid}`);
