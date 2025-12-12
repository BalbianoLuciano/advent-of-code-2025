from collections import defaultdict

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

def count_paths_by_levels_correct(graph, start, end, required_nodes, max_depth=50):
    """
    Count paths from start to end that visit all required nodes.
    Uses level-by-level BFS with state = (node, visited_path, visited_required)
    Limits depth to prevent infinite loops.
    """
    required_set = frozenset(required_nodes)

    # Current level: list of (node, visited_path, visited_required)
    # We store paths as frozensets to detect cycles
    current_level = []

    # Initial state
    initial_req = frozenset([start]) if start in required_set else frozenset()
    current_level.append((start, frozenset(), initial_req))

    total_valid_paths = 0

    for depth in range(max_depth):
        if not current_level:
            break

        next_level = []
        paths_at_end = 0

        print(f"Depth {depth}: processing {len(current_level)} paths")

        for node, visited_path, visited_req in current_level:
            # If we reached end, check if valid
            if node == end:
                if visited_req == required_set:
                    total_valid_paths += 1
                    paths_at_end += 1
                # Don't expand further from end
                continue

            # Expand to neighbors
            if node not in graph:
                continue

            # Add current node to path
            new_visited_path = visited_path | {node}

            for neighbor in graph[node]:
                # Skip if creates cycle
                if neighbor in new_visited_path:
                    continue

                # Update required nodes
                new_visited_req = visited_req
                if neighbor in required_set:
                    new_visited_req = visited_req | {neighbor}

                next_level.append((neighbor, new_visited_path, new_visited_req))

        if paths_at_end > 0:
            print(f"  -> Found {paths_at_end} valid paths at 'end'")

        current_level = next_level

    print(f"\nTotal valid paths found: {total_valid_paths}")
    return total_valid_paths

def count_paths_dp_by_state(graph, start, end, required_nodes, max_depth=50):
    """
    DP approach: dp[depth][node][visited_path][visited_req] = count
    But visited_path makes this exponential...

    Better approach: dp[depth][node][visited_req] = list of (visited_path, count)
    """
    required_set = frozenset(required_nodes)

    # dp[node][visited_req] = {visited_path: count}
    current_dp = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))

    # Initial state
    initial_req = frozenset([start]) if start in required_set else frozenset()
    current_dp[start][initial_req][frozenset()] = 1

    for depth in range(max_depth):
        if not current_dp:
            break

        next_dp = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))

        # Count states
        total_states = sum(
            len(paths_dict)
            for node_dict in current_dp.values()
            for paths_dict in node_dict.values()
        )

        print(f"Depth {depth}: {total_states} unique path states")

        # Process each state
        for node, req_dict in current_dp.items():
            for visited_req, paths_dict in req_dict.items():
                for visited_path, count in paths_dict.items():
                    # If at end, don't expand
                    if node == end:
                        next_dp[node][visited_req][visited_path] += count
                        continue

                    # Expand to neighbors
                    if node not in graph:
                        continue

                    new_visited_path = visited_path | {node}

                    for neighbor in graph[node]:
                        # Skip cycles
                        if neighbor in new_visited_path:
                            continue

                        # Update required
                        new_visited_req = visited_req
                        if neighbor in required_set:
                            new_visited_req = visited_req | {neighbor}

                        next_dp[neighbor][new_visited_req][new_visited_path] += count

        current_dp = next_dp

    # Sum valid paths at end
    total = 0
    if end in current_dp:
        for visited_req, paths_dict in current_dp[end].items():
            if visited_req == required_set:
                total += sum(paths_dict.values())
                print(f"Valid state: visited_req={visited_req}, paths={sum(paths_dict.values())}")

    return total

def main():
    import os
    if os.path.exists('input.txt'):
        input_file = 'input.txt'
    else:
        input_file = 'day11/input.txt'

    graph = parse_input(input_file)

    print(f"Graph has {len(graph)} nodes\n")
    print("="*60)

    # Part 2
    required_nodes = {'dac', 'fft'}

    # Try with increasing depth limits
    max_depth = 60  # Adjust as needed

    print(f"\n### Counting paths with max depth = {max_depth} ###\n")
    result = count_paths_dp_by_state(graph, 'svr', 'out', required_nodes, max_depth)

    print(f"\n{'='*60}")
    print(f"RESULT: {result}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
