import networkx as nx

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

def count_paths_with_cutoff(G, start, end, required_nodes, cutoff=30):
    """
    Count paths from start to end that pass through ALL required nodes.
    Uses cutoff to limit maximum path length.
    """
    try:
        # Use cutoff to limit path enumeration
        all_paths = nx.all_simple_paths(G, start, end, cutoff=cutoff)

        valid_count = 0
        total_count = 0

        for path in all_paths:
            total_count += 1

            # Check if path contains all required nodes
            path_set = set(path)
            if required_nodes.issubset(path_set):
                valid_count += 1

            # Progress indicator
            if total_count % 10000 == 0:
                print(f"  Processed {total_count} paths, found {valid_count} valid paths so far...")

        print(f"Total paths examined: {total_count}")
        return valid_count

    except nx.NodeNotFound as e:
        print(f"Node not found: {e}")
        return 0

def main():
    G = parse_input('input.txt')

    print(f"Graph nodes: {G.number_of_nodes()}")
    print(f"Graph edges: {G.number_of_edges()}")

    # Check if required nodes exist
    print(f"\n'svr' in graph: {'svr' in G}")
    print(f"'dac' in graph: {'dac' in G}")
    print(f"'fft' in graph: {'fft' in G}")
    print(f"'out' in graph: {'out' in G}")

    if 'svr' in G:
        print(f"svr neighbors: {list(G.neighbors('svr'))}")
    if 'dac' in G:
        print(f"dac neighbors: {list(G.neighbors('dac'))}")
    if 'fft' in G:
        print(f"fft neighbors: {list(G.neighbors('fft'))}")

    # Part 1
    print("\n=== PART 1 ===")
    print("Counting paths from 'you' to 'out' with cutoff=30...")
    try:
        paths_p1 = list(nx.all_simple_paths(G, 'you', 'out', cutoff=30))
        result1 = len(paths_p1)
        print(f"Total paths from 'you' to 'out' (cutoff=30): {result1}")
    except Exception as e:
        print(f"Error in part 1: {e}")

    # Part 2
    print("\n=== PART 2 ===")
    print("Finding paths from 'svr' to 'out' that visit both 'dac' and 'fft'...")
    print("Using cutoff=30 to limit path length...")

    required_nodes = {'dac', 'fft'}
    result2 = count_paths_with_cutoff(G, 'svr', 'out', required_nodes, cutoff=30)
    print(f"\nTotal paths that visit both 'dac' and 'fft' (cutoff=30): {result2}")

if __name__ == '__main__':
    main()
