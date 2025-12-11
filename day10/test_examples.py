import re
import numpy as np
from scipy.optimize import milp, LinearConstraint, Bounds

def parse_machine(line):
    """Parse a machine line into components"""
    lights_match = re.search(r'\[([.#]+)\]', line)
    buttons_match = re.findall(r'\([\d,]+\)', line)
    counters_match = re.search(r'\{([\d,]+)\}', line)

    lights = lights_match.group(1)
    num_lights = len(lights)

    # Parse buttons
    buttons = []
    for btn in buttons_match:
        indices = [int(x) for x in btn.strip('()').split(',')]
        buttons.append(indices)

    # Parse counters for part 2
    counters = [int(x) for x in counters_match.group(1).split(',')]

    return {
        'num_lights': num_lights,
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
        print(f"Solution: {result.x}")
        print(f"Total presses: {result.fun}")
        return int(round(result.fun))
    else:
        print(f"Failed: {result.message}")
        return 0

# Test examples
examples = [
    ('[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}', 10),
    ('[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}', 12),
    ('[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}', 11)
]

for i, (line, expected) in enumerate(examples, 1):
    print(f'\n=== Example {i} ===')
    print(f'Expected: {expected}')
    machine = parse_machine(line)
    result = solve_part2_ilp(machine)
    print(f'Result: {result}')
    print(f'{"PASS" if result == expected else "FAIL"}')
