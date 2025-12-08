// Advent of Code 2025 - Day 8 - Part 2
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
        this.numCircuitos = n; // Inicialmente cada punto es su propio circuito
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
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

        this.numCircuitos--; // Reducimos el número de circuitos
        return true;
    }

    getNumCircuitos() {
        return this.numCircuitos;
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

// Conectar pares hasta que todo forme un solo circuito
const uf = new UnionFind(puntos.length);
let ultimaConexion = null;

console.log('Conectando pares hasta formar un solo circuito...');

for (let k = 0; k < distancias.length; k++) {
    const { i, j, dist } = distancias[k];

    if (uf.union(i, j)) {
        ultimaConexion = { i, j, dist };

        // Mostrar progreso cada 100 conexiones
        if (uf.getNumCircuitos() % 100 === 0) {
            console.log(`  Circuitos restantes: ${uf.getNumCircuitos()}`);
        }

        // Si ya solo queda 1 circuito, terminamos
        if (uf.getNumCircuitos() === 1) {
            console.log(`\n¡Todos conectados en un solo circuito!`);
            console.log(`Total de conexiones realizadas: ${k + 1}`);
            break;
        }
    }
}

if (ultimaConexion) {
    const punto1 = puntos[ultimaConexion.i];
    const punto2 = puntos[ultimaConexion.j];

    console.log(`\nÚltima conexión necesaria:`);
    console.log(`  Punto 1: [${ultimaConexion.i}] ${punto1.x},${punto1.y},${punto1.z}`);
    console.log(`  Punto 2: [${ultimaConexion.j}] ${punto2.x},${punto2.y},${punto2.z}`);
    console.log(`  Distancia: ${ultimaConexion.dist.toFixed(2)}`);

    const respuesta = punto1.x * punto2.x;
    console.log(`\nMultiplicación de coordenadas X: ${punto1.x} × ${punto2.x} = ${respuesta}`);
    console.log(`\nRespuesta: ${respuesta}`);
} else {
    console.log('No se encontró la última conexión');
}
