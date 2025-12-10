const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trim();

// Part 1
function part1() {
    // Parse points (y, x)
    const points = input.split('\n')
        .filter(line => line.trim())
        .map(line => {
            const [y, x] = line.split(',').map(Number);
            return { y, x };
        });

    let maxArea = 0;

    // Try every pair of points
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const p1 = points[i];
            const p2 = points[j];

            // Find the bounding rectangle formed by these two points
            const minY = Math.min(p1.y, p2.y);
            const maxY = Math.max(p1.y, p2.y);
            const minX = Math.min(p1.x, p2.x);
            const maxX = Math.max(p1.x, p2.x);

            // Calculate area: count all points in the rectangle (inclusive)
            const width = maxX - minX + 1;
            const height = maxY - minY + 1;
            const area = width * height;

            maxArea = Math.max(maxArea, area);
        }
    }

    return maxArea;
}

// Part 2
function part2() {
    // Parse points (y, x)
    const points = input.split('\n')
        .filter(line => line.trim())
        .map(line => {
            const [y, x] = line.split(',').map(Number);
            return { y, x };
        });

    console.log(`Total red points: ${points.length}`);

    // Step 1: Build the polygon boundary (green tiles)
    const greenTiles = new Set();
    const redSet = new Set(points.map(p => `${p.y},${p.x}`));

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        if (p1.y === p2.y) {
            const minX = Math.min(p1.x, p2.x);
            const maxX = Math.max(p1.x, p2.x);
            for (let x = minX; x <= maxX; x++) {
                greenTiles.add(`${p1.y},${x}`);
            }
        } else if (p1.x === p2.x) {
            const minY = Math.min(p1.y, p2.y);
            const maxY = Math.max(p1.y, p2.y);
            for (let y = minY; y <= maxY; y++) {
                greenTiles.add(`${y},${p1.x}`);
            }
        }
    }

    console.log(`Green boundary tiles: ${greenTiles.size}`);

    // Step 2: Create list of all possible rectangles with their areas
    const rectangles = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const p1 = points[i];
            const p2 = points[j];

            const minY = Math.min(p1.y, p2.y);
            const maxY = Math.max(p1.y, p2.y);
            const minX = Math.min(p1.x, p2.x);
            const maxX = Math.max(p1.x, p2.x);

            const area = (maxY - minY + 1) * (maxX - minX + 1);
            rectangles.push({ i, j, minY, maxY, minX, maxX, area });
        }
    }

    // Step 3: Sort by area descending
    rectangles.sort((a, b) => b.area - a.area);
    console.log(`Total possible rectangles: ${rectangles.length}`);
    console.log(`Largest potential area: ${rectangles[0].area}`);

    // Step 4: Check rectangles from largest to smallest
    const insideCache = new Map();

    function isInsidePolygon(y, x) {
        const key = `${y},${x}`;
        if (insideCache.has(key)) {
            return insideCache.get(key);
        }

        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const yi = points[i].y, xi = points[i].x;
            const yj = points[j].y, xj = points[j].x;

            if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
                inside = !inside;
            }
        }

        insideCache.set(key, inside);
        return inside;
    }

    function isValidTile(y, x) {
        const key = `${y},${x}`;
        return redSet.has(key) || greenTiles.has(key) || isInsidePolygon(y, x);
    }

    for (let idx = 0; idx < rectangles.length; idx++) {
        const rect = rectangles[idx];
        const { minY, maxY, minX, maxX, area, i, j } = rect;

        // Check only the perimeter
        let valid = true;

        // Check top and bottom edges
        for (let x = minX; x <= maxX && valid; x++) {
            if (!isValidTile(minY, x) || !isValidTile(maxY, x)) {
                valid = false;
            }
        }

        // Check left and right edges
        if (valid) {
            for (let y = minY + 1; y < maxY && valid; y++) {
                if (!isValidTile(y, minX) || !isValidTile(y, maxX)) {
                    valid = false;
                }
            }
        }

        if (valid) {
            console.log(`Found valid rectangle: ${area} between points ${i} and ${j}`);
            return area;
        }

        if ((idx + 1) % 10000 === 0) {
            console.log(`Checked ${idx + 1}/${rectangles.length} rectangles...`);
        }
    }

    return 0;
}

console.log('Part 1:', part1());
console.log('Part 2:', part2());
