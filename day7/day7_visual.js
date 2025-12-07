// Advent of Code 2025 - Day 7 - Generador Visual
const fs = require('fs');

function generateVisualBeams(inputFile, outputFile) {
    const lines = fs.readFileSync(inputFile, 'utf-8').trim().split('\n');
    const visualOutput = [];

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

    // Agregar primera fila con S
    visualOutput.push(lines[0]);

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

        // Generar línea visual
        let visualLine = '';
        for (let i = 0; i < currentLine.length; i++) {
            if (currentLine[i] === '^') {
                visualLine += '^';
            } else if (newBeams.has(i)) {
                visualLine += '|';
            } else {
                visualLine += '.';
            }
        }
        visualOutput.push(visualLine);

        activeBeams = newBeams;

        if (row % 20 === 0) {
            console.log(`Fila ${row}: ${activeBeams.size} hazes activos, ${totalSplits} divisiones totales`);
        }
    }

    // Guardar archivo visual
    fs.writeFileSync(outputFile, visualOutput.join('\n'));

    console.log(`\nTotal de divisiones: ${totalSplits}`);
    console.log(`Hazes activos al final: ${activeBeams.size}`);
    console.log(`Archivo visual guardado en: ${outputFile}`);

    return totalSplits;
}

// Ejecutar
const result = generateVisualBeams('./day7_input.txt', './day7_visual.txt');
console.log(`\nRespuesta final: ${result}`);
