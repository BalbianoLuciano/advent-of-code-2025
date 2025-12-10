// Test my algorithm on line 3
const line = '[#######...] (2,4,5,6,7) (0,1,2,4,5,8,9) (1,3,4,5,6,7,8,9) (0,1,2,3,4,5,6,9) (1,2,4) (0,3,4,5,6,7,8) (7,8) (1,2,3,4,5) (2,3,8) (2,4,6) (0,2,4,5,8) {56,53,220,189,100,73,48,36,192,21}';

function parseMachine(line) {
    const lightsMatch = line.match(/\[([.#]+)\]/);
    const buttonsMatch = line.match(/\([\d,]+\)/g);
    const countersMatch = line.match(/\{([\d,]+)\}/);

    const buttons = buttonsMatch.map(b => {
        const indices = b.slice(1, -1).split(',').map(Number);
        return indices;
    });

    const counters = countersMatch[1].split(',').map(Number);

    return { numLights: counters.length, buttons, counters };
}

// Simplified version - just find any valid solution
function bruteForce(machine) {
    const { numLights, buttons, counters } = machine;
    const numButtons = buttons.length;

    // Try simple heuristic: solve as linear system
    // This is a system of equations, try to find solution by trying different combinations

    // For simplicity, let's try target = max(counters) first
    const maxCounter = Math.max(...counters);

    console.log('Max counter:', maxCounter);
    console.log('Sum counters:', counters.reduce((a,b) => a+b, 0));

    // The minimum is at least maxCounter because we need to reach that value
    // But it could be more if buttons overlap inefficiently

    return maxCounter; // Lower bound
}

const machine = parseMachine(line);
console.log('Testing line 3');
console.log('Lower bound (max counter):', Math.max(...machine.counters));
console.log('Upper bound (sum counters):', machine.counters.reduce((a,b) => a+b, 0));

// The actual answer must be between these bounds
// Let me think... if we had perfect efficiency, we'd need max(counters) = 220
// But realistically it will be higher due to overlaps
