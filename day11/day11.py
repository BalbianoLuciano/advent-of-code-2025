from collections import defaultdict

def parse_input(filename):
    """Parse the input file and build a directed graph"""
    graph = defaultdict(list)

    with open(filename, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            # Parse: "node: dest1 dest2 dest3"
            if ':' in line:
                parts = line.split(':')
                source = parts[0].strip()
                destinations = parts[1].strip().split()
                graph[source] = destinations

    return graph

def count_paths_dfs(graph, start, end, visited=None):
    """Count all paths from start to end using DFS"""
    if visited is None:
        visited = set()

    # Base case: reached destination
    if start == end:
        return 1

    # Node doesn't exist in graph
    if start not in graph:
        return 0

    # Cycle detection
    if start in visited:
        return 0

    # Mark as visited
    visited.add(start)

    total_paths = 0
    for neighbor in graph[start]:
        total_paths += count_paths_dfs(graph, neighbor, end, visited.copy())

    return total_paths

def count_paths_with_required_nodes(graph, start, end, required_nodes, visited=None, visited_required=None, memo=None):
    """Count paths from start to end that visit all required nodes with memoization"""
    if visited is None:
        visited = frozenset()
    if visited_required is None:
        visited_required = frozenset()
    if memo is None:
        memo = {}

    # Track required nodes
    if start in required_nodes:
        visited_required = visited_required | {start}

    # Base case: reached destination
    if start == end:
        # Check if all required nodes were visited
        return 1 if visited_required == required_nodes else 0

    # Node doesn't exist in graph
    if start not in graph:
        return 0

    # Cycle detection
    if start in visited:
        return 0

    # Memoization key
    memo_key = (start, visited, visited_required)
    if memo_key in memo:
        return memo[memo_key]

    # Mark as visited
    new_visited = visited | {start}

    total_paths = 0
    for neighbor in graph[start]:
        total_paths += count_paths_with_required_nodes(
            graph, neighbor, end, required_nodes, new_visited, visited_required, memo
        )

    memo[memo_key] = total_paths
    return total_paths

def main():
    # Parse input
    graph = parse_input('day11/input.txt')

    print(f"Graph nodes: {len(graph)}")
    print(f"Starting from 'you': {graph.get('you', [])}")

    # Part 1: Count paths from 'you' to 'out'
    print("\n=== PART 1 ===")
    result1 = count_paths_dfs(graph, 'you', 'out')
    print(f"Total paths from 'you' to 'out': {result1}")

    # Part 2: Count paths from 'svr' to 'out' that visit both 'dac' and 'fft'
    print("\n=== PART 2 ===")
    print(f"Starting from 'svr': {graph.get('svr', [])}")
    print("Calculating paths from 'svr' to 'out' that visit both 'dac' and 'fft'...")

    required_nodes = {'dac', 'fft'}
    result2 = count_paths_with_required_nodes(graph, 'svr', 'out', required_nodes)
    print(f"Total paths from 'svr' to 'out' that visit both 'dac' and 'fft': {result2}")

if __name__ == '__main__':
    main()
