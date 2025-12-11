import re

def parse_machine(line):
    """Parse a machine line into components"""
    counters_match = re.search(r'\{([\d,]+)\}', line)
    counters = [int(x) for x in counters_match.group(1).split(',')]
    return counters, sum(counters)

with open('input.txt', 'r') as f:
    lines = f.read().strip().split('\n')

max_sum = 0
max_line_idx = 0
max_line = ""
max_counters = []

for i, line in enumerate(lines):
    counters, total = parse_machine(line)
    if total > max_sum:
        max_sum = total
        max_line_idx = i
        max_line = line
        max_counters = counters

print(f'Máquina con suma más alta:')
print(f'Línea {max_line_idx + 1}:')
print(max_line)
print(f'\nContadores: {max_counters}')
print(f'Suma total: {max_sum}')
print(f'Máximo individual: {max(max_counters)}')
print(f'Cantidad de luces: {len(max_counters)}')

# También mostrar top 5
print('\n\nTop 5 máquinas con mayor suma:')
sums_with_idx = []
for i, line in enumerate(lines):
    counters, total = parse_machine(line)
    sums_with_idx.append((total, i, max(counters), line))

sums_with_idx.sort(reverse=True)
for rank, (total, idx, max_val, line) in enumerate(sums_with_idx[:5], 1):
    print(f'\n{rank}. Línea {idx + 1}: Suma={total}, Max={max_val}')
    print(f'   {line[:80]}...' if len(line) > 80 else f'   {line}')
