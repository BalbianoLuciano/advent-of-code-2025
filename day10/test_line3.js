// Test line 3 manually
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

const machine = parseMachine(line);
console.log('Machine:', machine);
console.log('\nCounters:', machine.counters);
console.log('Sum of counters:', machine.counters.reduce((a,b) => a+b, 0));
console.log('Max counter:', Math.max(...machine.counters));

// Let's check what each button affects
console.log('\nButton effects:');
machine.buttons.forEach((btn, i) => {
    console.log(`Button ${i}: affects lights [${btn.join(', ')}]`);
});

// Count how many buttons affect each light
console.log('\nLights coverage:');
for (let i = 0; i < machine.numLights; i++) {
    const affecting = machine.buttons.filter(btn => btn.includes(i));
    console.log(`Light ${i} (needs ${machine.counters[i]}): affected by ${affecting.length} buttons`);
}
