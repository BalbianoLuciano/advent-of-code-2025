from collections import defaultdict, deque

def parse_input(filename):
    """Parse the input file and build a directed graph"""
    graph = defaultdict(list)

    with open(filename, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            if ':' in line:
                parts = line.split(':')
                source = parts[0].strip()
                destinations = parts[1].strip().split()
                graph[source] = destinations

    return graph

def count_paths_by_levels(graph, start, end, required_nodes):
    """
    Count paths from start to end that visit all required nodes.
    Uses BFS by levels with DP.

    State: (node, frozenset_of_required_nodes_visited)
    dp[state] = number of paths to reach this state
    """
    required_set = frozenset(required_nodes)

    # DP: state -> count
    # state = (node, visited_required_nodes as frozenset)
    current_level = {}

    # Initial state: at start node
    initial_required = frozenset([start]) if start in required_set else frozenset()
    current_level[(start, initial_required)] = 1

    # Track which (node, required_set) combinations we've seen to avoid infinite loops
    all_seen_states = {(start, initial_required)}

    max_steps = 100  # Safety limit
    step = 0

    print(f"Starting BFS from '{start}' to '{end}'")
    print(f"Required nodes to visit: {required_nodes}")
    print()

    while current_level and step < max_steps:
        next_level = defaultdict(int)

        print(f"Step {step}: {len(current_level)} states to process")

        for (node, visited_req), count in current_level.items():
            # If we reached the end, don't expand further from here
            if node == end:
                # Keep this state for the final count
                next_level[(node, visited_req)] += count
                continue

            # Expand to neighbors
            if node in graph:
                for neighbor in graph[node]:
                    # Update required nodes if neighbor is required
                    new_visited_req = visited_req
                    if neighbor in required_set:
                        new_visited_req = visited_req | {neighbor}

                    new_state = (neighbor, new_visited_req)

                    # Add paths to this state
                    next_level[new_state] += count
                    all_seen_states.add(new_state)

        current_level = next_level
        step += 1

        # Show progress for end node
        end_states = [(s, c) for s, c in current_level.items() if s[0] == end]
        if end_states:
            total_at_end = sum(c for _, c in end_states)
            print(f"  Paths reaching 'out': {total_at_end} (across {len(end_states)} states)")

    print(f"\nFinished after {step} steps")

    # Count paths that reached 'end' with all required nodes visited
    total = 0
    for (node, visited_req), count in current_level.items():
        if node == end and required_set.issubset(visited_req):
            total += count
            print(f"  Valid state: visited={visited_req}, paths={count}")

    return total

def count_paths_optimized(graph, start, end, required_nodes):
    """
    Optimized version: stop expanding once we reach 'end' with all required nodes.
    Track states more carefully to avoid exponential blowup.
    """
    required_set = frozenset(required_nodes)

    # dp[node][visited_required] = count of paths
    dp = defaultdict(lambda: defaultdict(int))

    # Initial state
    initial_required = frozenset([start]) if start in required_set else frozenset()
    dp[start][initial_required] = 1

    # BFS queue: (node, visited_required)
    queue = deque([(start, initial_required)])

    # Track processed states to avoid reprocessing
    processed = set()

    max_iterations = 1000000
    iterations = 0

    print(f"Starting optimized BFS from '{start}' to '{end}'")
    print(f"Required nodes: {required_nodes}\n")

    while queue and iterations < max_iterations:
        iterations += 1

        state = queue.popleft()
        node, visited_req = state

        # Skip if already processed
        if state in processed:
            continue
        processed.add(state)

        # Progress
        if iterations % 10000 == 0:
            print(f"Iteration {iterations}: queue size = {len(queue)}, processed = {len(processed)}")

        # Don't expand from 'end' node
        if node == end:
            continue

        # Don't expand if node doesn't exist
        if node not in graph:
            continue

        current_count = dp[node][visited_req]

        # Expand to neighbors
        for neighbor in graph[node]:
            # Update visited required nodes
            new_visited_req = visited_req
            if neighbor in required_set:
                new_visited_req = visited_req | {neighbor}

            # Update DP
            dp[neighbor][new_visited_req] += current_count

            # Add to queue if not processed
            new_state = (neighbor, new_visited_req)
            if new_state not in processed:
                queue.append(new_state)

    print(f"\nFinished after {iterations} iterations")
    print(f"Processed {len(processed)} unique states\n")

    # Sum all paths to 'end' with all required nodes
    total = 0
    for visited_req, count in dp[end].items():
        if required_set.issubset(visited_req):
            print(f"Valid path set: visited={visited_req}, count={count}")
            total += count

    return total

def main():
    import os
    # Determine correct path based on current working directory
    if os.path.exists('input.txt'):
        input_file = 'input.txt'
    else:
        input_file = 'day11/input.txt'

    graph = parse_input(input_file)

    print(f"Graph has {len(graph)} nodes\n")
    print("="*60)

    # Part 2
    required_nodes = {'dac', 'fft'}

    print("\n### Method: Optimized BFS with DP ###\n")
    result = count_paths_optimized(graph, 'svr', 'out', required_nodes)
    print(f"\n{'='*60}")
    print(f"RESULT: Paths from 'svr' to 'out' visiting both 'dac' and 'fft': {result}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
