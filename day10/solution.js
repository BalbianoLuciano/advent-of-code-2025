const fs = require('fs');

// Read input
const input = fs.readFileSync('input.txt', 'utf8').trim();

// Parse input
const lines = input.split('\n');

// Parse a machine line
function parseMachine(line) {
    // Extract parts using regex
    const lightsMatch = line.match(/\[([.#]+)\]/);
    const buttonsMatch = line.match(/\([\d,]+\)/g);
    const countersMatch = line.match(/\{([\d,]+)\}/);

    const lights = lightsMatch[1];
    const numLights = lights.length;

    // Target state: # = 1, . = 0
    const target = lights.split('').map(c => c === '#' ? 1 : 0);

    // Parse buttons
    const buttons = buttonsMatch.map(b => {
        const indices = b.slice(1, -1).split(',').map(Number);
        return indices;
    });

    // Parse counters (for part 2)
    const counters = countersMatch ? countersMatch[1].split(',').map(Number) : [];

    return { numLights, target, buttons, counters };
}

// Find minimum button presses using brute force with bit manipulation
function findMinimumPresses(machine) {
    const { numLights, target, buttons } = machine;
    const numButtons = buttons.length;

    // Try all possible combinations of buttons (2^numButtons combinations)
    let minPresses = Infinity;

    for (let mask = 0; mask < (1 << numButtons); mask++) {
        // Calculate resulting state for this combination
        const state = new Array(numLights).fill(0);

        let pressCount = 0;
        for (let i = 0; i < numButtons; i++) {
            if (mask & (1 << i)) {
                // Button i is pressed
                pressCount++;
                for (const lightIdx of buttons[i]) {
                    state[lightIdx] ^= 1; // Toggle light
                }
            }
        }

        // Check if this matches target
        let matches = true;
        for (let i = 0; i < numLights; i++) {
            if (state[i] !== target[i]) {
                matches = false;
                break;
            }
        }

        if (matches) {
            minPresses = Math.min(minPresses, pressCount);
        }
    }

    return minPresses === Infinity ? 0 : minPresses;
}

// Part 1
function part1() {
    let totalPresses = 0;

    for (const line of lines) {
        const machine = parseMachine(line);
        const minPresses = findMinimumPresses(machine);
        totalPresses += minPresses;
    }

    return totalPresses;
}

// Solve counter problem using Gaussian elimination + optimization
function solveCounters(machine) {
    const { numLights, buttons, counters } = machine;
    const numButtons = buttons.length;

    // Build coefficient matrix A where A[i][j] = 1 if button j affects light i
    const A = Array(numLights).fill(0).map(() => Array(numButtons).fill(0));
    for (let j = 0; j < numButtons; j++) {
        for (const lightIdx of buttons[j]) {
            A[lightIdx][j] = 1;
        }
    }

    // Gaussian elimination to find pivot columns and reduced form
    const matrix = A.map((row, i) => [...row, counters[i]]);
    const n = numLights;
    const m = numButtons;

    let pivot = 0;
    const pivotCols = [];
    const freeVars = [];

    // Forward elimination
    for (let col = 0; col < m && pivot < n; col++) {
        // Find pivot
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

        // Eliminate
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

    // Mark remaining variables as free
    for (let col = 0; col < m; col++) {
        if (!pivotCols.includes(col)) {
            freeVars.push(col);
        }
    }

    // Check for inconsistency
    for (let row = pivot; row < n; row++) {
        if (Math.abs(matrix[row][m]) > 0.001) {
            return Infinity;
        }
    }

    // If no free variables, solve directly
    if (freeVars.length === 0) {
        const solution = Array(numButtons).fill(0);

        for (let i = 0; i < pivotCols.length; i++) {
            const col = pivotCols[i];
            const row = i;
            const val = matrix[row][numButtons] / matrix[row][col];

            if (val < -0.001 || Math.abs(val - Math.round(val)) > 0.001) {
                return Infinity;
            }
            solution[col] = Math.round(val);
        }

        // Verify
        const result = Array(numLights).fill(0);
        for (let j = 0; j < numButtons; j++) {
            for (const lightIdx of buttons[j]) {
                result[lightIdx] += solution[j];
            }
        }

        for (let i = 0; i < numLights; i++) {
            if (Math.abs(result[i] - counters[i]) > 0.001) {
                return Infinity;
            }
        }

        return solution.reduce((a, b) => a + b, 0);
    }

    // Lower bound: we need at least max(counters) total presses
    const lowerBound = Math.max(...counters);

    // Upper bound - be more generous
    const sumCounters = counters.reduce((a, b) => a + b, 0);
    const upperBound = sumCounters * 2; // Much more generous upper bound

    let minTotal = Infinity;

    function tryFreeVars(freeIdx, assignment, currentSum, targetTotal) {
        // Prune if current sum already exceeds target
        if (currentSum > targetTotal) return;
        if (minTotal !== Infinity && currentSum >= minTotal) return;

        if (freeIdx === freeVars.length) {
            // Compute dependent variables
            const solution = Array(numButtons).fill(0);

            // Set free variables
            for (let i = 0; i < freeVars.length; i++) {
                solution[freeVars[i]] = assignment[i];
            }

            // Compute pivot variables via back substitution
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
                    return; // Invalid solution
                }
                solution[col] = Math.round(val);
                pivotSum += solution[col];
            }

            // Early check before verification
            const totalPresses = currentSum + pivotSum;
            if (totalPresses >= minTotal) return;

            // Verify solution
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
                minTotal = Math.min(minTotal, totalPresses);
            }
            return;
        }

        // Try values for current free variable
        const remaining = targetTotal - currentSum;
        for (let val = 0; val <= remaining; val++) {
            assignment[freeIdx] = val;
            tryFreeVars(freeIdx + 1, assignment, currentSum + val, targetTotal);
        }
    }

    // Try increasing target totals starting from lower bound
    for (let target = lowerBound; target <= upperBound; target++) {
        tryFreeVars(0, [], 0, target);
        if (minTotal !== Infinity) break; // Found solution at this level
    }

    return minTotal;
}

// Part 2
function part2() {
    let totalPresses = 0;

    for (const line of lines) {
        const machine = parseMachine(line);
        const minPresses = solveCounters(machine);
        if (minPresses !== Infinity) {
            totalPresses += minPresses;
        }
    }

    return totalPresses;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
