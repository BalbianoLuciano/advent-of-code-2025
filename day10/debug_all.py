import re
import numpy as np
from scipy.optimize import milp, LinearConstraint, Bounds

def parse_machine(line):
    """Parse a machine line into components"""
    buttons_match = re.findall(r'\([\d,]+\)', line)
    counters_match = re.search(r'\{([\d,]+)\}', line)

    buttons = []
    for btn in buttons_match:
        indices = [int(x) for x in btn.strip('()').split(',')]
        buttons.append(indices)

    counters = [int(x) for x in counters_match.group(1).split(',')]

    return {
        'num_lights': len(counters),
        'buttons': buttons,
        'counters': counters
    }

def solve_part2_ilp(machine):
    """Solve part 2 using Integer Linear Programming"""
    num_lights = machine['num_lights']
    counters = machine['counters']
    buttons = machine['buttons']
    num_buttons = len(buttons)

    # Create coefficient matrix
    A = np.zeros((num_lights, num_buttons), dtype=float)
    for j, button in enumerate(buttons):
        for light_idx in button:
            A[light_idx][j] = 1

    # Minimize: sum of all button presses
    c = np.ones(num_buttons)

    # Subject to: A * x = counters
    A_eq = A
    b_eq = np.array(counters, dtype=float)

    # Bounds: x_i >= 0
    bounds = Bounds(lb=np.zeros(num_buttons), ub=np.full(num_buttons, np.inf))

    # Constraints
    constraints = LinearConstraint(A_eq, b_eq, b_eq)

    # Integer constraints
    integrality = np.ones(num_buttons)

    # Solve
    result = milp(c=c, constraints=constraints, bounds=bounds, integrality=integrality)

    if result.success:
        return int(round(result.fun)), True
    else:
        return 0, False

with open('input.txt', 'r') as f:
    lines = f.read().strip().split('\n')

print(f'Total de líneas: {len(lines)}')

results = []
failed = []
total = 0

for i, line in enumerate(lines):
    machine = parse_machine(line)
    max_counter = max(machine['counters'])
    sum_counters = sum(machine['counters'])

    presses, success = solve_part2_ilp(machine)

    if not success:
        failed.append(i + 1)
        print(f'✗ Línea {i + 1} FALLÓ')

    results.append({
        'line': i + 1,
        'presses': presses,
        'max_counter': max_counter,
        'sum_counters': sum_counters,
        'success': success
    })

    total += presses

print(f'\nTotal Part 2: {total}')
print(f'Máquinas falladas: {len(failed)}')

if failed:
    print(f'Líneas que fallaron: {failed}')

# Mostrar algunas estadísticas
print('\n=== Primeras 10 máquinas ===')
for r in results[:10]:
    print(f"Línea {r['line']}: presses={r['presses']}, max={r['max_counter']}, sum={r['sum_counters']}, diff={r['presses'] - r['max_counter']}")

print('\n=== Últimas 10 máquinas ===')
for r in results[-10:]:
    print(f"Línea {r['line']}: presses={r['presses']}, max={r['max_counter']}, sum={r['sum_counters']}, diff={r['presses'] - r['max_counter']}")

# Buscar casos donde presses == 0
zeros = [r for r in results if r['presses'] == 0]
if zeros:
    print(f'\n⚠️ Encontradas {len(zeros)} máquinas con 0 presiones:')
    for r in zeros:
        print(f"  Línea {r['line']}: max={r['max_counter']}, sum={r['sum_counters']}")
