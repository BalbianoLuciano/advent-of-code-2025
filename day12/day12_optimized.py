# Parse input
with open('input.txt', 'r') as f:
    lines = [line.rstrip('\n') for line in f]

# Parse shapes
shapes = []
i = 0
while i < len(lines) and ':' in lines[i] and 'x' not in lines[i]:
    i += 1  # skip index line
    shape_lines = []
    while i < len(lines) and len(lines[i]) == 3 and ':' not in lines[i]:
        shape_lines.append(lines[i])
        i += 1
    if shape_lines:
        shapes.append(shape_lines)
    i += 1  # skip empty line

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

# Print shapes
print('\nShapes:')
for idx, shape in enumerate(shapes):
    print(f'{idx}:')
    for row in shape:
        print(f'  {row}')

# Count # in each shape
shape_sizes = []
for shape in shapes:
    count = sum(row.count('#') for row in shape)
    shape_sizes.append(count)

print(f'\nShape sizes (# count): {shape_sizes}')

# Check which pairs of shapes can form rectangles
print('\nAnalyzing shape combinations:')

# For each pair, try to see if they complement each other
def get_full_grid(shape):
    """Get a 3x3 grid with # and . for a shape"""
    grid = []
    for row in shape:
        grid.append(list(row))
    return grid

def shapes_form_rectangle(shape1, shape2):
    """Check if two shapes can combine to form a 3x3 filled rectangle"""
    grid1 = get_full_grid(shape1)
    grid2 = get_full_grid(shape2)

    # Check if combined they fill all 9 cells
    combined = [[False]*3 for _ in range(3)]
    for y in range(3):
        for x in range(3):
            if grid1[y][x] == '#' or grid2[y][x] == '#':
                combined[y][x] = True

    # Check if all cells are filled
    all_filled = all(combined[y][x] for y in range(3) for x in range(3))

    # Check if they don't overlap
    no_overlap = True
    for y in range(3):
        for x in range(3):
            if grid1[y][x] == '#' and grid2[y][x] == '#':
                no_overlap = False
                break

    return all_filled and no_overlap

# Find pairs
pairs = []
for i in range(len(shapes)):
    for j in range(i, len(shapes)):
        if shapes_form_rectangle(shapes[i], shapes[j]):
            pairs.append((i, j))
            print(f'  Shapes {i} and {j} form a 3x3 rectangle')

# Simple approach: just check if total cells match exactly
def check_region_simple(region):
    w, h, counts = region

    # Count total # needed
    total_cells_needed = sum(shape_sizes[i] * counts[i] for i in range(len(counts)))
    total_area = w * h

    # Must match exactly (since . doesn't block)
    return total_cells_needed == total_area

# Solve part 1
valid_regions = 0
for i, region in enumerate(regions):
    if check_region_simple(region):
        valid_regions += 1
        print(f'Region {i + 1}: YES (total valid: {valid_regions})')

print(f'\nPart 1: {valid_regions}')
