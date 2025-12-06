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

// Variable global para sumar todos los valores máximos (parte 2)
let totalJolts2 = 0;

// Procesar cada banco de baterías (hasta 12 dígitos)
for (let bank of input2) {
    const digits = bank.split('').map(Number);
    const targetLength = 12; // Número de dígitos que queremos formar

    let result = '';
    let currentIndex = 0; // Índice desde donde buscar

    // Construir el número dígito por dígito
    for (let position = 0; position < targetLength; position++) {
        // Cuántos dígitos más necesitamos después de este
        const digitsNeeded = targetLength - position - 1;

        // Buscar el dígito más alto que tenga suficientes dígitos a su derecha
        let bestDigit = -1;
        let bestIndex = -1;

        for (let i = currentIndex; i < digits.length; i++) {
            // Verificar si desde este índice hay suficientes dígitos disponibles
            const availableAfter = digits.length - i - 1;

            if (availableAfter >= digitsNeeded) {
                if (digits[i] > bestDigit) {
                    bestDigit = digits[i];
                    bestIndex = i;
                }
            }
        }

        // Si encontramos un dígito válido, lo agregamos
        if (bestDigit !== -1) {
            result += bestDigit;
            currentIndex = bestIndex + 1; // Siguiente búsqueda empieza después de este
        } else {
            // No hay suficientes dígitos, terminamos
            break;
        }
    }

    totalJolts2 += parseInt(result);
}

console.log(`Total de jolts (Parte 2): ${totalJolts2}`);
