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

def count_all_paths(graph, start, end, visited=None):
    """Count all paths from start to end using DFS"""
    if visited is None:
        visited = set()

    if start == end:
        return 1

    if start not in graph:
        return 0

    if start in visited:
        return 0

    visited.add(start)
    total_paths = 0

    for neighbor in graph[start]:
        total_paths += count_all_paths(graph, neighbor, end, visited.copy())

    return total_paths

def count_paths_through_nodes(graph, start, end, must_visit_all):
    """
    Count paths from start to end that pass through ALL nodes in must_visit_all.
    Strategy: enumerate different orderings of visiting required nodes.
    """
    must_visit_list = list(must_visit_all)

    # If we need to visit dac and fft:
    # - dac is only in 'ccc'
    # - fft is in 'pnw', 'fhz', 'jzs'

    # We need to count paths that visit ccc AND at least one of {pnw, fhz, jzs}

    # Strategy: For each of the 3 nodes with fft, count paths like:
    # svr -> ... -> fft_node -> ... -> ccc -> ... -> out
    # svr -> ... -> ccc -> ... -> fft_node -> ... -> out

    fft_nodes = ['pnw', 'fhz', 'jzs']
    dac_node = 'ccc'

    total = 0

    for fft_node in fft_nodes:
        # Case 1: svr -> fft_node -> ccc -> out
        # Count: svr to fft_node, then fft_node to ccc (avoiding svr), then ccc to out (avoiding svr and fft_node)
        paths_svr_to_fft = count_paths_avoiding(graph, start, fft_node, set())

        if paths_svr_to_fft > 0:
            paths_fft_to_ccc = count_paths_avoiding(graph, fft_node, dac_node, {start})

            if paths_fft_to_ccc > 0:
                paths_ccc_to_out = count_paths_avoiding(graph, dac_node, end, {start, fft_node})
                total += paths_svr_to_fft * paths_fft_to_ccc * paths_ccc_to_out
                print(f"  {start} -> {fft_node} -> {dac_node} -> {end}: {paths_svr_to_fft} * {paths_fft_to_ccc} * {paths_ccc_to_out} = {paths_svr_to_fft * paths_fft_to_ccc * paths_ccc_to_out}")

        # Case 2: svr -> ccc -> fft_node -> out
        paths_svr_to_ccc = count_paths_avoiding(graph, start, dac_node, set())

        if paths_svr_to_ccc > 0:
            paths_ccc_to_fft = count_paths_avoiding(graph, dac_node, fft_node, {start})

            if paths_ccc_to_fft > 0:
                paths_fft_to_out = count_paths_avoiding(graph, fft_node, end, {start, dac_node})
                total += paths_svr_to_ccc * paths_ccc_to_fft * paths_fft_to_out
                print(f"  {start} -> {dac_node} -> {fft_node} -> {end}: {paths_svr_to_ccc} * {paths_ccc_to_fft} * {paths_fft_to_out} = {paths_svr_to_ccc * paths_ccc_to_fft * paths_fft_to_out}")

    return total

def count_paths_avoiding(graph, start, end, avoid_nodes, visited=None):
    """Count paths from start to end, avoiding certain nodes (except start and end)"""
    if visited is None:
        visited = set()

    if start == end:
        return 1

    if start not in graph:
        return 0

    if start in visited:
        return 0

    visited.add(start)
    total_paths = 0

    for neighbor in graph[start]:
        # Skip if neighbor is in avoid list (unless it's the destination)
        if neighbor in avoid_nodes and neighbor != end:
            continue

        total_paths += count_paths_avoiding(graph, neighbor, end, avoid_nodes, visited.copy())

    return total_paths

def main():
    graph = parse_input('day11/input.txt')

    print(f"Graph nodes: {len(graph)}")

    # Part 1
    print("\n=== PART 1 ===")
    result1 = count_all_paths(graph, 'you', 'out')
    print(f"Total paths from 'you' to 'out': {result1}")

    # Part 2
    print("\n=== PART 2 ===")
    print("Calculating paths from 'svr' to 'out' that visit both 'dac' and 'fft'...")
    print("Note: 'dac' appears in: ccc")
    print("Note: 'fft' appears in: pnw, fhz, jzs")
    print()

    required_nodes = {'dac', 'fft'}
    result2 = count_paths_through_nodes(graph, 'svr', 'out', required_nodes)
    print(f"\nTotal paths from 'svr' to 'out' that visit both 'dac' and 'fft': {result2}")

if __name__ == '__main__':
    main()
