// Advent of Code 2025 - Day 7
const fs = require('fs');

function solveTachyonBeams(inputFile) {
    const lines = fs.readFileSync(inputFile, 'utf-8').trim().split('\n');

    // Encontrar la posición inicial 'S'
    let startCol = -1;
    for (let i = 0; i < lines[0].length; i++) {
        if (lines[0][i] === 'S') {
            startCol = i;
            break;
        }
    }

    console.log(`Posición inicial S en columna: ${startCol}`);

    // Conjunto de posiciones activas de hazes (columnas)
    let activeBeams = new Set([startCol]);
    let totalSplits = 0;

    // Procesar cada fila siguiente
    for (let row = 1; row < lines.length; row++) {
        const currentLine = lines[row];
        const newBeams = new Set();

        // Para cada haz activo
        for (let col of activeBeams) {
            const char = currentLine[col];

            if (char === '^') {
                // El haz se divide en dos
                totalSplits++;
                // Agregar los dos nuevos hazes (izquierda y derecha del divisor)
                if (col - 1 >= 0) newBeams.add(col - 1);
                if (col + 1 < currentLine.length) newBeams.add(col + 1);
            } else if (char === '.') {
                // El haz continúa sin problemas
                newBeams.add(col);
            }
        }

        activeBeams = newBeams;

        if (row % 20 === 0) {
            console.log(`Fila ${row}: ${activeBeams.size} hazes activos, ${totalSplits} divisiones totales`);
        }
    }

    console.log(`\nTotal de divisiones: ${totalSplits}`);
    console.log(`Hazes activos al final: ${activeBeams.size}`);

    return totalSplits;
}

// Ejecutar
const result = solveTachyonBeams('./day7_input.txt');
console.log(`\nRespuesta final: ${result}`);
