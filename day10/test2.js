// Test solveCounters function

// Parse machine
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

// Solve counter problem - find minimum button presses
function solveCounters(machine) {
    const { numLights, buttons, counters } = machine;
    const numButtons = buttons.length;

    // For small cases, use brute force with bounds
    const maxCounter = Math.max(...counters);
    const upperBound = maxCounter + 1;

    let minPresses = Infinity;

    function dfs(buttonIdx, currentCounters, totalPresses) {
        if (totalPresses >= minPresses) return;

        if (buttonIdx === numButtons) {
            let match = true;
            for (let i = 0; i < numLights; i++) {
                if (currentCounters[i] !== counters[i]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                minPresses = Math.min(minPresses, totalPresses);
            }
            return;
        }

        for (let presses = 0; presses <= upperBound; presses++) {
            const newCounters = [...currentCounters];
            for (const lightIdx of buttons[buttonIdx]) {
                newCounters[lightIdx] += presses;
            }

            let exceeded = false;
            for (let i = 0; i < numLights; i++) {
                if (newCounters[i] > counters[i]) {
                    exceeded = true;
                    break;
                }
            }

            if (!exceeded) {
                dfs(buttonIdx + 1, newCounters, totalPresses + presses);
            }
        }
    }

    const initialCounters = Array(numLights).fill(0);
    dfs(0, initialCounters, 0);

    return minPresses;
}

// Test examples
const examples = [
    { line: '[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}', expected: 10 },
    { line: '[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}', expected: 12 },
    { line: '[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}', expected: 11 }
];

for (let i = 0; i < examples.length; i++) {
    const { line, expected } = examples[i];
    const machine = parseMachine(line);
    const result = solveCounters(machine);
    console.log(`Example ${i + 1}: Expected ${expected}, Got ${result} - ${result === expected ? 'PASS' : 'FAIL'}`);
}

console.log(`\nTotal expected: 33, Got: ${examples.map(e => {
    const machine = parseMachine(e.line);
    return solveCounters(machine);
}).reduce((a, b) => a + b, 0)}`);
