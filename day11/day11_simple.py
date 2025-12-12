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

def count_paths_simple(graph, start, end, required_nodes, max_depth=100):
    """
    Simple BFS by levels WITHOUT processed set.
    State: (node, visited_req)
    dp[node][visited_req] = count of paths
    """
    required_set = frozenset(required_nodes)

    # dp[node][visited_req] = count
    current_level = defaultdict(lambda: defaultdict(int))

    # Initial state
    initial_req = frozenset([start]) if start in required_set else frozenset()
    current_level[start][initial_req] = 1

    for depth in range(max_depth):
        if not current_level:
            print(f"No more paths to explore at depth {depth}")
            break

        next_level = defaultdict(lambda: defaultdict(int))

        total_states = sum(len(req_dict) for req_dict in current_level.values())
        total_paths = sum(
            count
            for req_dict in current_level.values()
            for count in req_dict.values()
        )

        print(f"Depth {depth}: {total_states} states, {total_paths:,} paths")

        for node, req_dict in current_level.items():
            for visited_req, count in req_dict.items():
                # If at end, keep accumulating
                if node == end:
                    next_level[node][visited_req] += count
                    continue

                # Expand to neighbors
                if node not in graph:
                    continue

                for neighbor in graph[node]:
                    # Update required nodes
                    new_visited_req = visited_req
                    if neighbor in required_set:
                        new_visited_req = visited_req | {neighbor}

                    next_level[neighbor][new_visited_req] += count

        current_level = next_level

        # Check progress at end
        if end in current_level:
            total_at_end = sum(current_level[end].values())
            valid_at_end = sum(
                count for req, count in current_level[end].items()
                if req == required_set
            )
            print(f"  -> At 'end': {total_at_end:,} total paths, {valid_at_end:,} valid")

    # Count valid paths at end
    total_valid = 0
    if end in current_level:
        for visited_req, count in current_level[end].items():
            if visited_req == required_set:
                total_valid += count

    return total_valid

def main():
    import os
    if os.path.exists('input.txt'):
        input_file = 'input.txt'
    else:
        input_file = 'day11/input.txt'

    graph = parse_input(input_file)

    print(f"Graph has {len(graph)} nodes\n")
    print("="*60)

    required_nodes = {'dac', 'fft'}

    # Start with reasonable depth
    max_depth = 100

    print(f"\n### Simple BFS with max_depth={max_depth} (NO cycle detection) ###\n")
    result = count_paths_simple(graph, 'svr', 'out', required_nodes, max_depth)

    print(f"\n{'='*60}")
    print(f"RESULT: {result:,}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
