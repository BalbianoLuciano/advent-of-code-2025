const fs = require('fs');

// Leer el archivo de input
const input = fs.readFileSync('day1_input.txt', 'utf8').trim().split('\n');

// Posici�n inicial del dial
let position = 50;

// Contador de veces que llegamos a 0
let count = 0;

// Procesar cada instrucci�n
for (let instruction of input) {
    const direction = instruction[0]; // 'L' o 'R'
    const steps = parseInt(instruction.slice(1)); // El n�mero despu�s de L/R

    const oldPosition = position;

    if (direction === 'L') {
        // Girar a la izquierda (restar)
        position = ((position - steps) % 100 + 100) % 100;

        // Contar en cuántos clicks el dial apunta a 0
        // Desde oldPosition, apuntamos a 0 en los clicks: oldPosition, oldPosition+100, oldPosition+200, ...
        if (oldPosition > 0 && steps >= oldPosition) {
            // Primer click en 0: oldPosition
            // Siguientes: cada 100 clicks más
            count += 1 + Math.floor((steps - oldPosition) / 100);
        } else if (oldPosition === 0 && steps >= 100) {
            // Si empezamos en 0, solo contamos cuando volvemos: clicks 100, 200, 300, ...
            count += Math.floor(steps / 100);
        }
    } else if (direction === 'R') {
        // Girar a la derecha (sumar)
        position = (position + steps) % 100;

        // Contar en cuántos clicks el dial apunta a 0
        // Desde oldPosition, apuntamos a 0 en los clicks: (100-oldPosition), (100-oldPosition)+100, ...
        const firstZero = 100 - oldPosition; // Clicks hasta llegar a 0
        if (steps >= firstZero) {
            count += 1 + Math.floor((steps - firstZero) / 100);
        }
    }
}

console.log(`La contrase�a es: ${count}`);
