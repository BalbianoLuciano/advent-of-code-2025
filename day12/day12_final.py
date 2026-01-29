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

# Count # in each shape
shape_sizes = []
for shape in shapes:
    count = sum(row.count('#') for row in shape)
    shape_sizes.append(count)

print(f'Shape sizes: {shape_sizes}')

# Check region: just verify if total cells match area
def check_region(region):
    w, h, counts = region

    # Count total # needed
    total_cells = sum(shape_sizes[i] * counts[i] for i in range(len(counts)))
    total_area = w * h

    # Must match exactly
    return total_cells == total_area

# Analyze all regions
exact_matches = 0
less_than = 0
greater_than = 0

for region in regions:
    w, h, counts = region
    total = sum(shape_sizes[i] * counts[i] for i in range(len(counts)))
    area = w * h

    if total == area:
        exact_matches += 1
    elif total < area:
        less_than += 1
    else:
        greater_than += 1

print(f'\nRegion analysis:')
print(f'  Exact match (cells == area): {exact_matches}')
print(f'  Less than (cells < area): {less_than}')
print(f'  Greater than (cells > area): {greater_than}')

# Solve part 1 - try exact match
valid_regions = sum(1 for region in regions if check_region(region))
print(f'\nPart 1 (exact match): {valid_regions}')

# Try <= instead
def check_region_lte(region):
    w, h, counts = region
    total_cells = sum(shape_sizes[i] * counts[i] for i in range(len(counts)))
    return total_cells <= w * h

valid_lte = sum(1 for region in regions if check_region_lte(region))
print(f'Part 1 (<=): {valid_lte}')
