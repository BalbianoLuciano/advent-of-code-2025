const fs = require('fs');

// Parse input
const input = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

// Parse shapes
const shapes = [];
let i = 0;
while (i < input.length && input[i].includes(':') && !input[i].includes('x')) {
    const shapeLines = [];
    i++; // skip index line
    while (i < input.length && input[i].length === 3 && !input[i].includes(':')) {
        shapeLines.push(input[i]);
        i++;
    }
    if (shapeLines.length > 0) {
        shapes.push(shapeLines);
    }
    i++; // skip empty line
}

// Parse regions
const regions = [];
for (let j = i - 1; j < input.length; j++) {
    if (input[j].includes('x')) {
        const [dims, ...counts] = input[j].split(/[:\s]+/);
        const [w, h] = dims.split('x').map(Number);
        regions.push({
            width: w,
            height: h,
            counts: counts.map(Number)
        });
    }
}

console.log('Shapes:', shapes.length);
console.log('Regions:', regions.length);

// Convert shape to coordinates of # positions
function shapeToCoords(shape) {
    const coords = [];
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] === '#') {
                coords.push([x, y]);
            }
        }
    }
    return coords;
}

// Rotate coordinates 90 degrees clockwise
function rotate90(coords) {
    return coords.map(([x, y]) => [y, -x]);
}

// Flip coordinates horizontally
function flipH(coords) {
    return coords.map(([x, y]) => [-x, y]);
}

// Normalize coordinates to start from (0, 0)
function normalize(coords) {
    if (coords.length === 0) return coords;
    const minX = Math.min(...coords.map(c => c[0]));
    const minY = Math.min(...coords.map(c => c[1]));
    return coords.map(([x, y]) => [x - minX, y - minY]);
}

// Generate all unique transformations of a shape
function getTransformations(shape) {
    const coords = shapeToCoords(shape);
    const transformations = new Set();

    let current = coords;
    for (let rot = 0; rot < 4; rot++) {
        // Normal
        transformations.add(JSON.stringify(normalize(current).sort()));
        // Flipped
        transformations.add(JSON.stringify(normalize(flipH(current)).sort()));
        current = rotate90(current);
    }

    return Array.from(transformations).map(s => JSON.parse(s));
}

// Precompute all transformations for all shapes
const allTransformations = shapes.map(shape => getTransformations(shape));

console.log('Transformations per shape:', allTransformations.map(t => t.length));

// Check if we can place a shape at (x, y) on the grid
function canPlace(grid, coords, x, y) {
    for (const [dx, dy] of coords) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || ny >= grid.length || nx >= grid[0].length) {
            return false;
        }
        if (grid[ny][nx]) {
            return false;
        }
    }
    return true;
}

// Place a shape on the grid
function place(grid, coords, x, y, id) {
    for (const [dx, dy] of coords) {
        grid[y + dy][x + dx] = id;
    }
}

// Remove a shape from the grid
function remove(grid, coords, x, y) {
    for (const [dx, dy] of coords) {
        grid[y + dy][x + dx] = 0;
    }
}

// Solve using backtracking
function solve(grid, presents) {
    // Find first empty cell
    let emptyX = -1, emptyY = -1;
    for (let y = 0; y < grid.length && emptyY === -1; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === 0) {
                emptyX = x;
                emptyY = y;
                break;
            }
        }
    }

    // If no empty cell, check if all presents are placed
    if (emptyY === -1) {
        return presents.every(count => count === 0);
    }

    // Try placing each type of present
    for (let shapeIdx = 0; shapeIdx < presents.length; shapeIdx++) {
        if (presents[shapeIdx] === 0) continue;

        const shapeId = shapeIdx + 1;
        const transformations = allTransformations[shapeIdx];

        // Try each transformation
        for (const coords of transformations) {
            // Try to place this transformation so it covers the empty cell
            // For each coordinate in the shape, try making it align with the empty cell
            for (const [dx, dy] of coords) {
                const startX = emptyX - dx;
                const startY = emptyY - dy;

                if (canPlace(grid, coords, startX, startY)) {
                    place(grid, coords, startX, startY, shapeId);
                    presents[shapeIdx]--;

                    if (solve(grid, presents)) {
                        return true;
                    }

                    presents[shapeIdx]++;
                    remove(grid, coords, startX, startY);
                }
            }
        }
    }

    return false;
}

// Check if a region can fit all presents
function checkRegion(region) {
    const grid = Array(region.height).fill(null).map(() => Array(region.width).fill(0));
    const presents = [...region.counts];
    return solve(grid, presents);
}

// Solve part 1
let validRegions = 0;
for (let i = 0; i < regions.length; i++) {
    console.log(`Checking region ${i + 1}/${regions.length}...`);
    if (checkRegion(regions[i])) {
        validRegions++;
    }
}

console.log('Part 1:', validRegions);
