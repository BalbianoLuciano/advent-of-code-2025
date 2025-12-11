import re
import numpy as np
from scipy.optimize import milp, LinearConstraint, Bounds

line = '[.#..##.##.] (0,1,4) (0,2,3,8) (1,2,3) (0,1,2,3,5,6,7,9) (0,2,4,6,7) (0,1,2,3,4,6,7,8) (0,1,2,3,5,6,8) (1,2,3,4,5,6,7,9) (1,2,3,4,6,7,8) (1,4,5,7,8) (0,1,2,6,7,8) (1,4,7,8,9) {252,263,267,247,238,27,254,255,252,16}'

def parse_machine(line):
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

machine = parse_machine(line)

print('Análisis de la máquina línea 37:')
print(f'Número de luces: {machine["num_lights"]}')
print(f'Número de botones: {len(machine["buttons"])}')
print(f'Contadores objetivo: {machine["counters"]}')
print(f'Suma de contadores: {sum(machine["counters"])}')
print(f'Máximo contador: {max(machine["counters"])}')
print(f'\nMínimo teórico de pulsaciones: {max(machine["counters"])} (porque necesitamos alcanzar ese valor)')

# Mostrar qué botones afectan cada luz
print('\nBotones por luz:')
for i in range(machine["num_lights"]):
    affecting = [j for j, btn in enumerate(machine["buttons"]) if i in btn]
    print(f'  Luz {i} (objetivo {machine["counters"][i]}): afectada por {len(affecting)} botones: {affecting}')

# Resolver con scipy
num_lights = machine['num_lights']
counters = machine['counters']
buttons = machine['buttons']
num_buttons = len(buttons)

# Create coefficient matrix
A = np.zeros((num_lights, num_buttons), dtype=float)
for j, button in enumerate(buttons):
    for light_idx in button:
        A[light_idx][j] = 1

print('\nMatriz de coeficientes A (luces x botones):')
print(A.astype(int))

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

print('\nResolviendo con scipy.optimize.milp...')
result = milp(c=c, constraints=constraints, bounds=bounds, integrality=integrality)

if result.success:
    print(f'\n✓ Solución encontrada!')
    print(f'Vector solución (pulsaciones por botón):')
    for i, presses in enumerate(result.x):
        if presses > 0:
            print(f'  Botón {i} {buttons[i]}: {int(presses)} veces')

    print(f'\nTotal de pulsaciones: {int(round(result.fun))}')

    # Verificar la solución
    result_counters = np.dot(A, result.x)
    print(f'\nVerificación:')
    print(f'Contadores objetivo:   {counters}')
    print(f'Contadores resultantes: {result_counters.astype(int).tolist()}')
    print(f'Match: {np.allclose(result_counters, counters)}')
else:
    print(f'\n✗ Falló: {result.message}')
