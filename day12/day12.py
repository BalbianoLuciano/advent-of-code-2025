# Day 12 - Garden Groups Gift Wrapping

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

# Count # in each shape
shape_sizes = [sum(row.count('#') for row in shape) for shape in shapes]

# Check if region can fit all presents
def check_region(region):
    w, h, counts = region
    total_cells_needed = sum(shape_sizes[i] * counts[i] for i in range(len(counts)))
    total_area = w * h
    # Shapes can overlap in their '.' parts, so we just need total # <= area
    return total_cells_needed <= total_area

# Part 1: Count valid regions
valid_regions = sum(1 for region in regions if check_region(region))

print(f'Part 1: {valid_regions}')
