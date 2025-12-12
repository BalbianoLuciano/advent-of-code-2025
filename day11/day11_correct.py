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

def count_paths_dfs_memoized(graph, start, end, required_nodes):
    """
    Count all simple paths (without cycles) from start to end that visit all required nodes.
    Uses memoization with state = (current_node, visited_path, visited_required)
    """
    required_set = frozenset(required_nodes)
    memo = {}

    def dfs(node, visited_path, visited_required):
        # Base case: reached end
        if node == end:
            # Check if all required nodes were visited
            if visited_required == required_set:
                return 1
            else:
                return 0

        # Cycle detection - can't revisit nodes in the same path
        if node in visited_path:
            return 0

        # Node doesn't exist in graph
        if node not in graph:
            return 0

        # Memoization key - CAN'T use full visited_path because it's too specific
        # Instead, we need a different approach

        # Mark current node as visited
        new_visited_path = visited_path | {node}

        # Update required nodes if current node is required
        new_visited_required = visited_required
        if node in required_set:
            new_visited_required = visited_required | {node}

        # Count paths through all neighbors
        total = 0
        for neighbor in graph[node]:
            total += dfs(neighbor, new_visited_path, new_visited_required)

        return total

    # Start DFS
    initial_visited_req = frozenset([start]) if start in required_set else frozenset()
    return dfs(start, frozenset(), initial_visited_req)

def count_paths_dp_correct(graph, start, end, required_nodes):
    """
    Correct DP approach: state includes visited nodes to prevent cycles.
    dp[(node, visited_nodes_frozenset, visited_required_frozenset)] = count
    """
    required_set = frozenset(required_nodes)
    memo = {}

    def count_from(node, visited, visited_req):
        # Base case
        if node == end:
            return 1 if visited_req == required_set else 0

        # Cycle detection
        if node in visited:
            return 0

        # Check memo
        state = (node, visited, visited_req)
        if state in memo:
            return memo[state]

        # Node doesn't exist
        if node not in graph:
            return 0

        # Add to visited
        new_visited = visited | {node}

        # Update required
        new_visited_req = visited_req
        if node in required_set:
            new_visited_req = visited_req | {node}

        # Count paths
        total = 0
        for neighbor in graph[node]:
            total += count_from(neighbor, new_visited, new_visited_req)

        memo[state] = total
        return total

    initial_req = frozenset([start]) if start in required_set else frozenset()
    result = count_from(start, frozenset(), initial_req)

    print(f"Memoization table size: {len(memo)}")
    return result

import sys
sys.setrecursionlimit(100000)

def main():
    import os
    if os.path.exists('input.txt'):
        input_file = 'input.txt'
    else:
        input_file = 'day11/input.txt'

    graph = parse_input(input_file)

    print(f"Graph has {len(graph)} nodes\n")
    print("="*60)
    print("\n### Correct DP with full path tracking ###\n")

    # Part 2
    required_nodes = {'dac', 'fft'}

    print(f"Counting paths from 'svr' to 'out' that visit {required_nodes}")
    print("This may take a while as we're counting all simple paths...\n")

    result = count_paths_dp_correct(graph, 'svr', 'out', required_nodes)

    print(f"\n{'='*60}")
    print(f"RESULT: {result}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
