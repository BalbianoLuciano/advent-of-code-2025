// Advent of Code 2025 - Day 7 - Part 2: Líneas del Tiempo
const fs = require('fs');

function countTimelines(inputFile) {
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

    // Map: columna -> número de líneas del tiempo que llegan a esa columna
    // Cada haz activo lleva consigo el contador de cuántas líneas del tiempo representa
    let activeBeams = new Map([[startCol, 1n]]); // Usar BigInt para números grandes
    let totalSplits = 0;

    // Procesar cada fila siguiente
    for (let row = 1; row < lines.length; row++) {
        const currentLine = lines[row];
        const newBeams = new Map();

        // Para cada haz activo con su contador de líneas del tiempo
        for (let [col, timelineCount] of activeBeams) {
            const char = currentLine[col];

            if (char === '^') {
                // El haz se divide en dos
                totalSplits++;

                // Cada división duplica el número de líneas del tiempo de este haz
                // porque en cada línea del tiempo tienes que elegir L o R
                const newTimelineCount = timelineCount * 2n;

                // Agregar los dos nuevos hazes (izquierda y derecha del divisor)
                if (col - 1 >= 0) {
                    const left = newBeams.get(col - 1) || 0n;
                    newBeams.set(col - 1, left + timelineCount); // La mitad va a la izquierda
                }
                if (col + 1 < currentLine.length) {
                    const right = newBeams.get(col + 1) || 0n;
                    newBeams.set(col + 1, right + timelineCount); // La mitad va a la derecha
                }
            } else if (char === '.') {
                // El haz continúa sin problemas
                // Las líneas del tiempo se mantienen igual
                const existing = newBeams.get(col) || 0n;
                newBeams.set(col, existing + timelineCount);
            }
        }

        activeBeams = newBeams;

        if (row <= 5 || row % 20 === 0) {
            const totalTimelines = Array.from(activeBeams.values()).reduce((a, b) => a + b, 0n);
            console.log(`Fila ${row}: ${activeBeams.size} hazes activos, ${totalSplits} divisiones, ${totalTimelines} líneas del tiempo`);
        }
    }

    // Sumar todas las líneas del tiempo de todos los hazes finales
    const totalTimelines = Array.from(activeBeams.values()).reduce((a, b) => a + b, 0n);

    console.log(`\nTotal de divisiones: ${totalSplits}`);
    console.log(`Hazes activos al final: ${activeBeams.size}`);
    console.log(`Total de líneas del tiempo: ${totalTimelines}`);

    return totalTimelines;
}

// Ejecutar
const result = countTimelines('./day7_input.txt');
console.log(`\nRespuesta final Parte 2: ${result}`);
