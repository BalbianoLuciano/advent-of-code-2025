const fs = require('fs');

// Leer el archivo de input
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n');

// Variable global para sumar todos los valores m�ximos
let totalJolts = 0;

// Procesar cada banco de bater�as
for (let bank of input) {
    const digits = bank.split('').map(Number);

    // Encontrar el dígito más alto y su posición
    let maxDigit = digits[0];
    let maxIndex = 0;

    for (let i = 1; i < digits.length; i++) {
        if (digits[i] > maxDigit) {
            maxDigit = digits[i];
            maxIndex = i;
        }
    }

    // Si el dígito más alto es el último, no tiene nada a la derecha
    if (maxIndex === digits.length - 1) {
        // Buscar el segundo más alto de todo el banco
        let secondMax = -1;
        let secondMaxIndex = 0;

        for (let i = 0; i < digits.length - 1; i++) {
            if (digits[i] > secondMax) {
                secondMax = digits[i];
                secondMaxIndex = i;
            }
        }

        // Ahora buscar el más alto a la derecha del segundo más alto
        let rightMax = -1;
        for (let i = secondMaxIndex + 1; i < digits.length; i++) {
            if (digits[i] > rightMax) {
                rightMax = digits[i];
            }
        }

        const maxValue = parseInt(secondMax.toString() + rightMax.toString());
        totalJolts += maxValue;
    } else {
        // Buscar el dígito más alto a la derecha del primero
        let secondDigit = -1;

        for (let i = maxIndex + 1; i < digits.length; i++) {
            if (digits[i] > secondDigit) {
                secondDigit = digits[i];
            }
        }

        const maxValue = parseInt(maxDigit.toString() + secondDigit.toString());
        totalJolts += maxValue;
    }
}

console.log(`Total de jolts (Parte 1): ${totalJolts}`);

// ==================== PARTE 2 ====================

// Leer el archivo de input nuevamente
const input2 = fs.readFileSync('input.txt', 'utf8').trim().split('\n');

// Función para encontrar las posiciones de las columnas usando los operadores
function findColumnPositions(lines) {
    const operatorLine = lines[lines.length - 1]; // Última línea con operadores
    const positions = [];

    for (let i = 0; i < operatorLine.length; i++) {
        if (operatorLine[i] === '*' || operatorLine[i] === '+') {
            positions.push(i);
        }
    }

    return positions;
}

// Función para leer una columna de arriba hacia abajo
function readColumn(lines, colIndex) {
    let number = '';

    // Leer las primeras 3 filas (excluyendo la última que tiene el operador)
    for (let row = 0; row < lines.length - 1; row++) {
        const char = lines[row][colIndex];
        if (char && char.trim() !== '') {
            number += char;
        }
    }

    return number === '' ? null : parseInt(number);
}

// Función para resolver un problema
function solveProblem(lines, colPositions) {
    const problems = [];

    // Para cada posición de operador
    for (let i = 0; i < colPositions.length; i++) {
        const colIndex = colPositions[i];
        const operator = lines[lines.length - 1][colIndex];
        const numbers = [];

        // Buscar todas las columnas que pertenecen a este problema
        // Las columnas van desde la posición del operador anterior + 1 hasta esta posición
        const startCol = i === 0 ? 0 : colPositions[i - 1] + 1;
        const endCol = colIndex;

        // Leer cada columna del problema
        for (let col = startCol; col <= endCol; col++) {
            const num = readColumn(lines, col);
            if (num !== null) {
                numbers.push(num);
            }
        }

        // Invertir para leer de derecha a izquierda
        numbers.reverse();

        // Calcular el resultado
        let result = numbers[0];
        for (let j = 1; j < numbers.length; j++) {
            if (operator === '*') {
                result *= numbers[j];
            } else {
                result += numbers[j];
            }
        }

        problems.push(result);
    }

    return problems;
}

// Dividir el input en grupos de 4 líneas (3 de números + 1 de operadores)
let totalPart2 = 0;
for (let i = 0; i < input2.length; i += 4) {
    const problemLines = input2.slice(i, i + 4);

    if (problemLines.length === 4) {
        const colPositions = findColumnPositions(problemLines);
        const results = solveProblem(problemLines, colPositions);

        // Sumar todos los resultados de este grupo
        for (let result of results) {
            totalPart2 += result;
        }
    }
}

console.log(`Total de jolts (Parte 2): ${totalPart2}`);
