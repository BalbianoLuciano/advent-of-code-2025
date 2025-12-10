// Test first machine with my algorithm
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

    return { numLights, buttons, counters };
}

// Copy the solveCounters function here
function solveCounters(machine) {
    const { numLights, buttons, counters } = machine;
    const numButtons = buttons.length;

    const A = Array(numLights).fill(0).map(() => Array(numButtons).fill(0));
    for (let j = 0; j < numButtons; j++) {
        for (const lightIdx of buttons[j]) {
            A[lightIdx][j] = 1;
        }
    }

    const matrix = A.map((row, i) => [...row, counters[i]]);
    const n = numLights;
    const m = numButtons;

    let pivot = 0;
    const pivotCols = [];
    const freeVars = [];

    for (let col = 0; col < m && pivot < n; col++) {
        let maxRow = pivot;
        for (let row = pivot + 1; row < n; row++) {
            if (Math.abs(matrix[row][col]) > Math.abs(matrix[maxRow][col])) {
                maxRow = row;
            }
        }

        if (matrix[maxRow][col] === 0) {
            freeVars.push(col);
            continue;
        }

        [matrix[pivot], matrix[maxRow]] = [matrix[maxRow], matrix[pivot]];
        pivotCols.push(col);

        for (let row = 0; row < n; row++) {
            if (row !== pivot && matrix[row][col] !== 0) {
                const factor = matrix[row][col] / matrix[pivot][col];
                for (let c = col; c <= m; c++) {
                    matrix[row][c] -= factor * matrix[pivot][c];
                }
            }
        }
        pivot++;
    }

    for (let col = 0; col < m; col++) {
        if (!pivotCols.includes(col)) {
            freeVars.push(col);
        }
    }

    for (let row = pivot; row < n; row++) {
        if (Math.abs(matrix[row][m]) > 0.001) {
            return Infinity;
        }
    }

    console.log('Pivot cols:', pivotCols);
    console.log('Free vars:', freeVars);

    const lowerBound = Math.max(...counters);
    const maxVal = Math.max(...counters);
    const upperBound = maxVal * 2;

    let minTotal = Infinity;

    function tryFreeVars(freeIdx, assignment, currentSum, targetTotal) {
        if (currentSum > targetTotal) return;
        if (minTotal !== Infinity && currentSum >= minTotal) return;

        if (freeIdx === freeVars.length) {
            const solution = Array(numButtons).fill(0);

            for (let i = 0; i < freeVars.length; i++) {
                solution[freeVars[i]] = assignment[i];
            }

            let pivotSum = 0;
            for (let i = 0; i < pivotCols.length; i++) {
                const col = pivotCols[i];
                const row = i;

                let val = matrix[row][m];
                for (let j = 0; j < numButtons; j++) {
                    if (j !== col) {
                        val -= matrix[row][j] * solution[j];
                    }
                }
                val /= matrix[row][col];

                if (val < -0.001 || Math.abs(val - Math.round(val)) > 0.001) {
                    return;
                }
                solution[col] = Math.round(val);
                pivotSum += solution[col];
            }

            const totalPresses = currentSum + pivotSum;
            if (totalPresses >= minTotal) return;

            const result = Array(numLights).fill(0);
            for (let j = 0; j < numButtons; j++) {
                for (const lightIdx of buttons[j]) {
                    result[lightIdx] += solution[j];
                }
            }

            let valid = true;
            for (let i = 0; i < numLights; i++) {
                if (Math.abs(result[i] - counters[i]) > 0.001) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                console.log('Found solution:', solution, 'Total:', totalPresses);
                minTotal = Math.min(minTotal, totalPresses);
            }
            return;
        }

        const remaining = targetTotal - currentSum;
        for (let val = 0; val <= remaining; val++) {
            assignment[freeIdx] = val;
            tryFreeVars(freeIdx + 1, assignment, currentSum + val, targetTotal);
        }
    }

    console.log('Searching from', lowerBound, 'to', upperBound);
    for (let target = lowerBound; target <= upperBound; target++) {
        tryFreeVars(0, [], 0, target);
        if (minTotal !== Infinity) break;
    }

    return minTotal;
}

// Test first line
const input = fs.readFileSync('input.txt', 'utf8').trim();
const lines = input.split('\n');
const machine = parseMachine(lines[0]);

console.log('Testing first machine:');
console.log('Line:', lines[0]);
console.log('Counters:', machine.counters);
console.log('Buttons:', machine.buttons);

const result = solveCounters(machine);
console.log('\nResult:', result);
console.log('Expected: 51');
