// Advent of Code 2025 - Day 11
const fs = require('fs');

// Parse input file
const input = fs.readFileSync('day11/input.txt', 'utf8').trim();

// Build graph
const graph = {};
const lines = input.split('\n');

for (const line of lines) {
    if (!line.trim()) continue;

    // Parse line: "node: dest1 dest2 dest3"
    const match = line.match(/^(.+?):\s*(.+)$/);
    if (match) {
        const [, source, destinations] = match;
        const node = source.trim();
        const dests = destinations.trim().split(/\s+/);
        graph[node] = dests;
    }
}

console.log('Graph nodes:', Object.keys(graph).length);
console.log('Starting from "you":', graph['you']);

// Count all paths from 'you' to 'out' using DFS
function countPaths(current, visited = new Set()) {
    // Base case: reached 'out'
    if (current === 'out') {
        return 1;
    }

    // Check if this node exists in graph
    if (!graph[current]) {
        return 0;
    }

    // Avoid cycles - if we've visited this node in current path, skip it
    if (visited.has(current)) {
        return 0;
    }

    // Mark current node as visited
    visited.add(current);

    let totalPaths = 0;

    // Explore all destinations from current node
    for (const dest of graph[current]) {
        totalPaths += countPaths(dest, new Set(visited));
    }

    return totalPaths;
}

// Start counting from 'you'
const result = countPaths('you');

console.log('\nTotal paths from "you" to "out":', result);

// ============ PART 2 ============

console.log('\n=== PART 2 ===');
console.log('Starting from "svr":', graph['svr']);

// Count paths from 'svr' to 'out' that visit both 'dac' and 'fft'
// Using memoization with state tracking
const memo = new Map();

function countPathsWithRequired(current, visited = new Set(), visitedDac = false, visitedFft = false) {
    // Track if we've visited dac or fft
    if (current === 'dac') {
        visitedDac = true;
    }
    if (current === 'fft') {
        visitedFft = true;
    }

    // Base case: reached 'out'
    if (current === 'out') {
        // Only count this path if we've visited both dac and fft
        return (visitedDac && visitedFft) ? 1 : 0;
    }

    // Check if this node exists in graph
    if (!graph[current]) {
        return 0;
    }

    // Avoid cycles - if we've visited this node in current path, skip it
    if (visited.has(current)) {
        return 0;
    }

    // Create memoization key
    const visitedArray = Array.from(visited).sort();
    const memoKey = `${current}|${visitedArray.join(',')}|${visitedDac}|${visitedFft}`;

    if (memo.has(memoKey)) {
        return memo.get(memoKey);
    }

    // Mark current node as visited
    const newVisited = new Set(visited);
    newVisited.add(current);

    let totalPaths = 0;

    // Explore all destinations from current node
    for (const dest of graph[current]) {
        totalPaths += countPathsWithRequired(dest, newVisited, visitedDac, visitedFft);
    }

    memo.set(memoKey, totalPaths);
    return totalPaths;
}

// Start counting from 'svr'
console.log('Calculating paths from "svr" to "out" (this may take a moment)...');
const result2 = countPathsWithRequired('svr');

console.log('\nTotal paths from "svr" to "out" that visit both "dac" and "fft":', result2);
