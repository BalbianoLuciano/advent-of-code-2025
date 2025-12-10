// Debug specific line from input
const fs = require('fs');

// Parse machine
function parseMachine(line) {
    const lightsMatch = line.match(/\[([.#]+)\]/);
    const buttonsMatch = line.match(/\([\d,]+\)/g);
    const countersMatch = line.match(/\{([\d,]+)\}/);

    const lights = lightsMatch[1];
    const numLights = lights.length;

    const target = lights.split('').map(c => c === '#' ? 1 : 0);

    const buttons = buttonsMatch.map(b => {
        const indices = b.slice(1, -1).split(',').map(Number);
        return indices;
    });

    const counters = countersMatch ? countersMatch[1].split(',').map(Number) : [];

    return { numLights, target, buttons, counters };
}

// Read a few lines from actual input
const input = fs.readFileSync('input.txt', 'utf8').trim();
const lines = input.split('\n');

console.log('Total lines:', lines.length);
console.log('\nFirst line:');
console.log(lines[0]);

const machine = parseMachine(lines[0]);
console.log('\nParsed:');
console.log('Lights:', machine.numLights);
console.log('Buttons:', machine.buttons.length);
console.log('Counters:', machine.counters);
console.log('Max counter:', Math.max(...machine.counters));

// Check if there are machines with very high counter values
let maxCounterOverall = 0;
let maxButtonsCount = 0;
for (const line of lines) {
    const m = parseMachine(line);
    const mc = Math.max(...m.counters);
    if (mc > maxCounterOverall) {
        maxCounterOverall = mc;
    }
    if (m.buttons.length > maxButtonsCount) {
        maxButtonsCount = m.buttons.length;
    }
}

console.log('\nOverall stats:');
console.log('Max counter value across all machines:', maxCounterOverall);
console.log('Max number of buttons:', maxButtonsCount);
