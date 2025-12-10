// Test first machine from real input manually
const line = '[####] (2,3) (0,3) (1,3) (0,1,3) {34,24,10,51}';

// Manual analysis:
// counters: [34, 24, 10, 51]
// buttons: (2,3) (0,3) (1,3) (0,1,3)
//
// Let's call button presses: a, b, c, d
// counter[0] = b + d = 34
// counter[1] = c + d = 24
// counter[2] = a = 10
// counter[3] = a + b + c + d = 51
//
// From counter[2]: a = 10
// From counter[3]: 10 + b + c + d = 51  =>  b + c + d = 41
// From counter[0]: b + d = 34
// From counter[1]: c + d = 24
//
// b + d = 34
// c + d = 24
// b + c + d = 41
//
// From first two: b + d + c + d = 34 + 24 = 58
// => b + c + 2d = 58
// But b + c + d = 41
// => d = 58 - 41 = 17
//
// b + 17 = 34  =>  b = 17
// c + 17 = 24  =>  c = 7
//
// Solution: a=10, b=17, c=7, d=17
// Total: 10 + 17 + 7 + 17 = 51

console.log('Manual solution for first machine:');
console.log('a=10, b=17, c=7, d=17');
console.log('Total:', 10 + 17 + 7 + 17);

// Verify:
console.log('\nVerification:');
console.log('counter[0] = b + d =', 17 + 17);
console.log('counter[1] = c + d =', 7 + 17);
console.log('counter[2] = a =', 10);
console.log('counter[3] = a + b + c + d =', 10 + 17 + 7 + 17);
