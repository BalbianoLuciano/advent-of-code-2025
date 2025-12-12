import networkx as nx
from itertools import product

def parse_input(filename):
    """Parse the input file and build a directed graph"""
    G = nx.DiGraph()

    with open(filename, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            if ':' in line:
                parts = line.split(':')
                source = parts[0].strip()
                destinations = parts[1].strip().split()

                for dest in destinations:
                    G.add_edge(source, dest)

    return G

def count_simple_paths(G, start, end):
    """Count all simple paths (no cycles) from start to end"""
    try:
        # all_simple_paths returns a generator of paths
        paths = list(nx.all_simple_paths(G, start, end))
        return len(paths)
    except nx.NodeNotFound:
        return 0

def count_paths_with_required(G, start, end, required_nodes):
    """
    Count paths from start to end that pass through ALL required nodes.
    Since we need to visit both 'dac' and 'fft', and:
    - 'dac' only appears in edges from 'ccc'
    - 'fft' only appears in edges from 'pnw', 'fhz', 'jzs'

    A path visits 'dac' if it goes through an edge that contains 'dac'
    A path visits 'fft' if it goes through an edge that contains 'fft'
    """

    # Find all simple paths from start to end
    try:
        all_paths = list(nx.all_simple_paths(G, start, end))
    except nx.NodeNotFound:
        return 0

    print(f"Total paths from {start} to {end}: {len(all_paths)}")

    # Check which paths contain all required nodes
    valid_paths = 0

    for path in all_paths:
        # Check if this path visits all required nodes
        # A node is "visited" if it appears in the path OR in the edges

        visited_nodes = set()

        # Check all edges in the path
        for i in range(len(path) - 1):
            src = path[i]
            dst = path[i + 1]

            # Check if any of the required nodes appear in the edge
            # In this problem, we need to check if going from src leads to a node that IS the required node
            if dst in required_nodes:
                visited_nodes.add(dst)

        # Check if all required nodes were visited
        if visited_nodes == required_nodes:
            valid_paths += 1

    return valid_paths

def main():
    G = parse_input('input.txt')

    print(f"Graph nodes: {G.number_of_nodes()}")
    print(f"Graph edges: {G.number_of_edges()}")

    # Part 1
    print("\n=== PART 1 ===")
    result1 = count_simple_paths(G, 'you', 'out')
    print(f"Total paths from 'you' to 'out': {result1}")

    # Part 2
    print("\n=== PART 2 ===")
    print("Finding paths from 'svr' to 'out' that visit both 'dac' and 'fft'...")

    # Note: 'dac' and 'fft' are nodes in the graph, not just edge labels
    required_nodes = {'dac', 'fft'}
    result2 = count_paths_with_required(G, 'svr', 'out', required_nodes)
    print(f"Total paths that visit both 'dac' and 'fft': {result2}")

if __name__ == '__main__':
    main()
