// Advent of Code 2025 - Day 8
const fs = require('fs');

// Leer el input
const input = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');

// Parsear los puntos (x, y, z)
const puntos = input.map(line => {
    const match = line.match(/(\d+),(\d+),(\d+)/);
    if (match) {
        return {
            x: parseInt(match[1]),
            y: parseInt(match[2]),
            z: parseInt(match[3])
        };
    }
}).filter(p => p !== undefined);

console.log(`Total de puntos: ${puntos.length}`);

// Función para calcular distancia euclidiana
function distancia(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

// Union-Find (Disjoint Set Union)
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.size = Array(n).fill(1);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) return false; // Ya están conectados

        // Union by size
        if (this.size[rootX] < this.size[rootY]) {
            this.parent[rootX] = rootY;
            this.size[rootY] += this.size[rootX];
        } else {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
        }
        return true;
    }

    getCircuitSizes() {
        const sizes = new Map();
        for (let i = 0; i < this.parent.length; i++) {
            const root = this.find(i);
            sizes.set(root, this.size[root]);
        }
        return Array.from(sizes.values()).sort((a, b) => b - a);
    }
}

// Calcular todas las distancias entre pares de puntos
console.log('Calculando todas las distancias...');
const distancias = [];
for (let i = 0; i < puntos.length; i++) {
    for (let j = i + 1; j < puntos.length; j++) {
        const dist = distancia(puntos[i], puntos[j]);
        distancias.push({ i, j, dist });
    }
}

console.log(`Total de pares: ${distancias.length}`);

// Ordenar por distancia
console.log('Ordenando distancias...');
distancias.sort((a, b) => a.dist - b.dist);

// Hacer las primeras 1000 conexiones (o número de pares a conectar según el problema)
const numConexiones = Math.min(1000, distancias.length);
const uf = new UnionFind(puntos.length);

console.log(`Haciendo las primeras ${numConexiones} conexiones...`);
let conexionesRealizadas = 0;

for (let k = 0; k < numConexiones; k++) {
    const { i, j } = distancias[k];
    if (uf.union(i, j)) {
        conexionesRealizadas++;
    }
}

console.log(`Conexiones realizadas (excluyendo duplicadas): ${conexionesRealizadas}`);

// Obtener los tamaños de los circuitos
const circuitSizes = uf.getCircuitSizes();

console.log(`\nTotal de circuitos: ${circuitSizes.length}`);
console.log(`Tamaños de los 10 circuitos más grandes: ${circuitSizes.slice(0, 10)}`);

// Obtener los 3 circuitos más grandes
const top3 = circuitSizes.slice(0, 3);
const respuesta = top3[0] * top3[1] * top3[2];

console.log(`\nLos 3 circuitos más grandes tienen:`);
console.log(`  Circuito 1: ${top3[0]} cajas`);
console.log(`  Circuito 2: ${top3[1]} cajas`);
console.log(`  Circuito 3: ${top3[2]} cajas`);
console.log(`\nRespuesta: ${respuesta}`);
