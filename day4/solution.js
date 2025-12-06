// Advent of Code 2025 - Day 4
const fs = require('fs');

// Leer el input
const input = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');

// Crear la cuadrícula
const grid = input.map(line => line.split(''));
const rows = grid.length;
const cols = grid[0].length;

console.log(`Cuadrícula: ${rows} filas x ${cols} columnas`);

// Variable para contar las posiciones válidas
let validPoints = 0;

// Recorrer cada posición de la cuadrícula
for (let fila = 0; fila < rows; fila++) {
    for (let col = 0; col < cols; col++) {
        // Solo nos interesan las arrobas (@)
        if (grid[fila][col] !== '@') {
            continue;
        }

        // Contar arrobas en las 8 posiciones adyacentes
        let arrobas = 0;

        // Definir las 8 direcciones (arriba-izq, arriba, arriba-der, izq, der, abajo-izq, abajo, abajo-der)
        const direcciones = [
            [-1, -1], [-1, 0], [-1, 1],  // fila arriba
            [0, -1],           [0, 1],    // misma fila (izq y der)
            [1, -1],  [1, 0],  [1, 1]     // fila abajo
        ];

        // Revisar cada dirección
        for (let [dFila, dCol] of direcciones) {
            const nuevaFila = fila + dFila;
            const nuevaCol = col + dCol;

            // Verificar que la posición esté dentro de los límites
            if (nuevaFila >= 0 && nuevaFila < rows && nuevaCol >= 0 && nuevaCol < cols) {
                if (grid[nuevaFila][nuevaCol] === '@') {
                    arrobas++;
                }
            }
        }

        // Si tiene MENOS de 4 arrobas adyacentes (0, 1, 2 o 3), es una posición válida
        // (sin importar si es un punto o una arroba)
        if (arrobas < 4) {
            validPoints++;
        }
    }
}

console.log(`\nParte 1 - Rollos de papel accesibles (arrobas con menos de 4 arrobas adyacentes): ${validPoints}`);

// ============================================
// PARTE 2: Simular remoción iterativa
// ============================================

// Función para contar arrobas vecinas
function contarArrobasVecinas(grid, fila, col) {
    const direcciones = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    let arrobas = 0;
    for (let [dFila, dCol] of direcciones) {
        const nuevaFila = fila + dFila;
        const nuevaCol = col + dCol;

        if (nuevaFila >= 0 && nuevaFila < rows && nuevaCol >= 0 && nuevaCol < cols) {
            if (grid[nuevaFila][nuevaCol] === '@') {
                arrobas++;
            }
        }
    }
    return arrobas;
}

// Crear una copia de la cuadrícula para la parte 2
const grid2 = input.map(line => line.split(''));
let totalRemovidos = 0;
let ronda = 0;

console.log('\nParte 2 - Simulando remoción iterativa:');

while (true) {
    ronda++;

    // Encontrar todos los rollos que se pueden remover en esta ronda
    let aRemover = [];

    for (let fila = 0; fila < rows; fila++) {
        for (let col = 0; col < cols; col++) {
            if (grid2[fila][col] === '@' && contarArrobasVecinas(grid2, fila, col) < 4) {
                aRemover.push([fila, col]);
            }
        }
    }

    // Si no hay más rollos para remover, terminar
    if (aRemover.length === 0) {
        break;
    }

    // Remover todos los rollos encontrados
    for (let [fila, col] of aRemover) {
        grid2[fila][col] = '.';
        totalRemovidos++;
    }

    console.log(`  Ronda ${ronda}: Removidos ${aRemover.length} rollos (Total acumulado: ${totalRemovidos})`);
}

console.log(`\nParte 2 - Total de rollos removidos: ${totalRemovidos}`);
