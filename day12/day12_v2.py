# Parse input
with open('input.txt', 'r') as f:
    lines = [line.rstrip('\n') for line in f]

# Parse shapes
shapes = []
i = 0
while i < len(lines) and ':' in lines[i] and 'x' not in lines[i]:
    i += 1
    shape_lines = []
    while i < len(lines) and len(lines[i]) == 3 and ':' not in lines[i]:
        shape_lines.append(lines[i])
        i += 1
    if shape_lines:
        shapes.append(shape_lines)
    i += 1

# Parse regions
regions = []
for j in range(i - 1, len(lines)):
    if 'x' in lines[j]:
        parts = lines[j].replace(':', ' ').split()
        dims = parts[0].split('x')
        w, h = int(dims[0]), int(dims[1])
        counts = [int(x) for x in parts[1:]]
        regions.append((w, h, counts))

print(f'Shapes: {len(shapes)}')
print(f'Regions: {len(regions)}')

# Convert shape to coordinates
def shape_to_coords(shape):
    coords = []
    for y, row in enumerate(shape):
        for x, ch in enumerate(row):
            if ch == '#':
                coords.append((x, y))
    return coords

# Rotate, flip, normalize
def rotate90(coords):
    return [(y, -x) for x, y in coords]

def flip_h(coords):
    return [(-x, y) for x, y in coords]

def normalize(coords):
    if not coords:
        return coords
    min_x = min(c[0] for c in coords)
    min_y = min(c[1] for c in coords)
    return tuple(sorted((x - min_x, y - min_y) for x, y in coords))

def get_transformations(shape):
    coords = shape_to_coords(shape)
    transformations = set()
    current = coords
    for _ in range(4):
        transformations.add(normalize(current))
        transformations.add(normalize(flip_h(current)))
        current = rotate90(current)
    return [list(t) for t in transformations]

# Precompute
all_transformations = [get_transformations(shape) for shape in shapes]
shape_sizes = [len(shape_to_coords(shape)) for shape in shapes]

print(f'Shape sizes: {shape_sizes}')

# Backtracking optimizado
def solve_backtrack(grid, presents, depth=0):
    # Límite de profundidad para evitar loops infinitos
    if depth > 1000:
        return False

    # Encontrar primera celda vacía
    empty_x, empty_y = -1, -1
    for y in range(len(grid)):
        for x in range(len(grid[0])):
            if grid[y][x] == 0:
                empty_x, empty_y = x, y
                break
        if empty_y != -1:
            break

    # Si no hay celdas vacías, verificar si usamos todos los regalos
    if empty_y == -1:
        return all(c == 0 for c in presents)

    # Intentar cada tipo de regalo
    for shape_idx in range(len(presents)):
        if presents[shape_idx] == 0:
            continue

        transformations = all_transformations[shape_idx]

        # Intentar cada transformación
        for coords in transformations:
            # Intentar colocar de forma que cubra la celda vacía
            for dx, dy in coords:
                start_x = empty_x - dx
                start_y = empty_y - dy

                # Verificar si cabe
                can_place = True
                h, w = len(grid), len(grid[0])
                for cx, cy in coords:
                    nx, ny = start_x + cx, start_y + cy
                    if nx < 0 or ny < 0 or ny >= h or nx >= w or grid[ny][nx] != 0:
                        can_place = False
                        break

                if can_place:
                    # Colocar
                    for cx, cy in coords:
                        grid[start_y + cy][start_x + cx] = shape_idx + 1

                    presents[shape_idx] -= 1

                    if solve_backtrack(grid, presents, depth + 1):
                        return True

                    # Deshacer
                    presents[shape_idx] += 1
                    for cx, cy in coords:
                        grid[start_y + cy][start_x + cx] = 0

    return False

def check_region(region):
    w, h, counts = region

    # Verificación rápida
    total_needed = sum(shape_sizes[i] * counts[i] for i in range(len(counts)))
    if total_needed != w * h:
        return False

    grid = [[0] * w for _ in range(h)]
    presents = counts.copy()

    return solve_backtrack(grid, presents)

# Probar
valid = 0
for i, region in enumerate(regions[:10]):  # Solo las primeras 10 para probar
    print(f'Region {i+1}...', end=' ')
    if check_region(region):
        valid += 1
        print('YES')
    else:
        print('NO')

print(f'\nValid in first 10: {valid}')
