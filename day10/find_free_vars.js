// Find machines with free variables
const fs = require('fs');

function parseMachine(line) {
    const lightsMatch = line.match(/\[([.#]+)\]/);
    const buttonsMatch = line.match(/\([\d,]+\)/g);
    const countersMatch = line.match(/\{([\d,]+)\}/);

    const lights = lightsMatch[1];
    const numLights = lights.length;

    const buttons = buttonsMatch.map(b => {
        const indices = b.slice(1, -1).split(',').map(Number);
        return indices;
    });

    const counters = countersMatch[1].split(',').map(Number);

    return { numLights, buttons, counters, line };
}

function analyzeSystem(machine) {
    const { numLights, buttons } = machine;
    const numButtons = buttons.length;

    // Build matrix
    const A = Array(numLights).fill(0).map(() => Array(numButtons).fill(0));
    for (let j = 0; j < numButtons; j++) {
        for (const lightIdx of buttons[j]) {
            A[lightIdx][j] = 1;
        }
    }

    // Count rank (pivot columns)
    const matrix = A.map(row => [...row]);
    let pivot = 0;
    const pivotCols = [];

    for (let col = 0; col < numButtons && pivot < numLights; col++) {
        let maxRow = pivot;
        for (let row = pivot + 1; row < numLights; row++) {
            if (Math.abs(matrix[row][col]) > Math.abs(matrix[maxRow][col])) {
                maxRow = row;
            }
        }

        if (matrix[maxRow][col] === 0) continue;

        [matrix[pivot], matrix[maxRow]] = [matrix[maxRow], matrix[pivot]];
        pivotCols.push(col);

        for (let row = pivot + 1; row < numLights; row++) {
            if (matrix[row][col] !== 0) {
                const factor = matrix[row][col] / matrix[pivot][col];
                for (let c = col; c < numButtons; c++) {
                    matrix[row][c] -= factor * matrix[pivot][c];
                }
            }
        }
        pivot++;
    }

    const rank = pivotCols.length;
    const numFreeVars = numButtons - rank;

    return { rank, numFreeVars, numButtons, numLights };
}

const input = fs.readFileSync('input.txt', 'utf8').trim();
const lines = input.split('\n');

console.log('Looking for machines with free variables...\n');

for (let i = 0; i < Math.min(20, lines.length); i++) {
    const machine = parseMachine(lines[i]);
    const analysis = analyzeSystem(machine);

    if (analysis.numFreeVars > 0) {
        console.log(`Line ${i + 1}:`);
        console.log(lines[i]);
        console.log(`  Lights: ${analysis.numLights}, Buttons: ${analysis.numButtons}`);
        console.log(`  Rank: ${analysis.rank}, Free vars: ${analysis.numFreeVars}`);
        console.log(`  Counters: [${machine.counters.join(', ')}]`);
        console.log(`  Max counter: ${Math.max(...machine.counters)}`);
        console.log('');

        if (analysis.numFreeVars <= 2) {
            console.log('  ^^^ Good candidate for manual testing');
            break;
        }
    }
}
