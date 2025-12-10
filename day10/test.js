// Test with examples

const examples = [
    {
        line: '[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}',
        expected: 10,
        solution: '(3) once, (1,3) three times, (2,3) three times, (0,2) once, (0,1) twice'
    },
    {
        line: '[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}',
        expected: 12,
        solution: '(0,2,3,4) twice, (2,3) five times, (0,1,2) five times'
    },
    {
        line: '[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}',
        expected: 11,
        solution: '(0,1,2,3,4) five times, (0,1,2,4,5) five times, (1,2) once'
    }
];

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

// Test first example manually
console.log('=== Example 1 ===');
const ex1 = parseMachine(examples[0].line);
console.log('Machine:', ex1);
console.log('Expected counters:', ex1.counters); // [3,5,4,7]

// Verify solution: (3) once, (1,3) three times, (2,3) three times, (0,2) once, (0,1) twice
// Button indices: 0=(3), 1=(1,3), 2=(2), 3=(2,3), 4=(0,2), 5=(0,1)
console.log('Buttons:', ex1.buttons);

// Solution: button 0 x1, button 1 x3, button 3 x3, button 4 x1, button 5 x2
const presses1 = [1, 3, 0, 3, 1, 2];
const counters1 = [0, 0, 0, 0]; // 4 lights

for (let i = 0; i < ex1.buttons.length; i++) {
    const times = presses1[i];
    for (const lightIdx of ex1.buttons[i]) {
        counters1[lightIdx] += times;
    }
}

console.log('Result counters:', counters1);
console.log('Match:', JSON.stringify(counters1) === JSON.stringify(ex1.counters));
console.log('Total presses:', presses1.reduce((a,b) => a+b, 0));

console.log('\n=== Example 2 ===');
const ex2 = parseMachine(examples[1].line);
console.log('Machine:', ex2);
console.log('Expected counters:', ex2.counters); // [7,5,12,7,2]

// Solution: (0,2,3,4) twice, (2,3) five times, (0,1,2) five times
// Button indices: 0=(0,2,3,4), 1=(2,3), 2=(0,4), 3=(0,1,2), 4=(1,2,3,4)
console.log('Buttons:', ex2.buttons);

// Solution: button 0 x2, button 1 x5, button 3 x5
const presses2 = [2, 5, 0, 5, 0];
const counters2 = [0, 0, 0, 0, 0]; // 5 lights

for (let i = 0; i < ex2.buttons.length; i++) {
    const times = presses2[i];
    for (const lightIdx of ex2.buttons[i]) {
        counters2[lightIdx] += times;
    }
}

console.log('Result counters:', counters2);
console.log('Match:', JSON.stringify(counters2) === JSON.stringify(ex2.counters));
console.log('Total presses:', presses2.reduce((a,b) => a+b, 0));

console.log('\n=== Example 3 ===');
const ex3 = parseMachine(examples[2].line);
console.log('Machine:', ex3);
console.log('Expected counters:', ex3.counters); // [10,11,11,5,10,5]

// Solution: (0,1,2,3,4) five times, (0,1,2,4,5) five times, (1,2) once
// Button indices: 0=(0,1,2,3,4), 1=(0,3,4), 2=(0,1,2,4,5), 3=(1,2)
console.log('Buttons:', ex3.buttons);

// Solution: button 0 x5, button 2 x5, button 3 x1
const presses3 = [5, 0, 5, 1];
const counters3 = [0, 0, 0, 0, 0, 0]; // 6 lights

for (let i = 0; i < ex3.buttons.length; i++) {
    const times = presses3[i];
    for (const lightIdx of ex3.buttons[i]) {
        counters3[lightIdx] += times;
    }
}

console.log('Result counters:', counters3);
console.log('Match:', JSON.stringify(counters3) === JSON.stringify(ex3.counters));
console.log('Total presses:', presses3.reduce((a,b) => a+b, 0));
