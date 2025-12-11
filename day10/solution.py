import re
import numpy as np
from scipy.optimize import linprog
from scipy.optimize import milp, LinearConstraint, Bounds

def parse_machine(line):
    """Parse a machine line into components"""
    lights_match = re.search(r'\[([.#]+)\]', line)
    buttons_match = re.findall(r'\([\d,]+\)', line)
    counters_match = re.search(r'\{([\d,]+)\}', line)

    lights = lights_match.group(1)
    num_lights = len(lights)

    # Target state for part 1: # = 1, . = 0
    target = [1 if c == '#' else 0 for c in lights]

    # Parse buttons
    buttons = []
    for btn in buttons_match:
        indices = [int(x) for x in btn.strip('()').split(',')]
        buttons.append(indices)

    # Parse counters for part 2
    counters = [int(x) for x in counters_match.group(1).split(',')]

    return {
        'num_lights': num_lights,
        'target': target,
        'buttons': buttons,
        'counters': counters
    }

def solve_part1_gf2(machine):
    """Solve part 1 using GF(2) - toggle logic"""
    num_lights = machine['num_lights']
    target = machine['target']
    buttons = machine['buttons']
    num_buttons = len(buttons)

    # Create coefficient matrix over GF(2)
    # A[i][j] = 1 if button j toggles light i
    A = np.zeros((num_lights, num_buttons), dtype=int)
    for j, button in enumerate(buttons):
        for light_idx in button:
            A[light_idx][j] = 1

    # Try all 2^num_buttons combinations (brute force for GF(2))
    min_presses = float('inf')

    for mask in range(1 << num_buttons):
        # Calculate resulting state
        state = np.zeros(num_lights, dtype=int)
        press_count = 0

        for i in range(num_buttons):
            if mask & (1 << i):
                press_count += 1
                for light_idx in buttons[i]:
                    state[light_idx] ^= 1  # XOR (toggle)

        # Check if matches target
        if np.array_equal(state, target):
            min_presses = min(min_presses, press_count)

    return min_presses if min_presses != float('inf') else 0

def solve_part2_ilp(machine):
    """Solve part 2 using Integer Linear Programming"""
    num_lights = machine['num_lights']
    counters = machine['counters']
    buttons = machine['buttons']
    num_buttons = len(buttons)

    # Create coefficient matrix
    # A[i][j] = 1 if button j affects counter i
    A = np.zeros((num_lights, num_buttons), dtype=float)
    for j, button in enumerate(buttons):
        for light_idx in button:
            A[light_idx][j] = 1

    # We want to minimize: sum of all button presses (x_0 + x_1 + ... + x_n)
    c = np.ones(num_buttons)

    # Subject to: A * x = counters (each counter must equal its target)
    # For MILP, we need A_eq * x = b_eq
    A_eq = A
    b_eq = np.array(counters, dtype=float)

    # Bounds: x_i >= 0 (can't press negative times)
    bounds = Bounds(lb=np.zeros(num_buttons), ub=np.full(num_buttons, np.inf))

    # Constraints: A_eq * x = b_eq
    constraints = LinearConstraint(A_eq, b_eq, b_eq)

    # Integer constraints (all variables must be integers)
    integrality = np.ones(num_buttons)

    # Solve
    result = milp(c=c, constraints=constraints, bounds=bounds, integrality=integrality)

    if result.success:
        return int(round(result.fun))
    else:
        print(f"Failed to solve: {result.message}")
        return 0

def main():
    with open('input.txt', 'r') as f:
        lines = f.read().strip().split('\n')

    # Part 1
    total_part1 = 0
    for line in lines:
        machine = parse_machine(line)
        presses = solve_part1_gf2(machine)
        total_part1 += presses

    print(f'Part 1: {total_part1}')

    # Part 2
    total_part2 = 0
    for i, line in enumerate(lines):
        machine = parse_machine(line)
        presses = solve_part2_ilp(machine)
        total_part2 += presses
        if (i + 1) % 10 == 0:
            print(f'Progress: {i + 1}/{len(lines)} machines processed')

    print(f'Part 2: {total_part2}')

if __name__ == '__main__':
    main()
