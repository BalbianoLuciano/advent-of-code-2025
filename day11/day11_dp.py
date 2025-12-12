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

def count_paths_dp(graph, start, end, required_nodes):
    """
    Count paths from start to end that visit all required nodes.
    Uses DP with state = (current_node, frozenset_of_visited_required_nodes)

    dp[node][visited_required] = number of ways to reach 'node' having visited
                                  exactly the required nodes in 'visited_required'
    """
    required_set = set(required_nodes)

    # State: (node, visited_required_nodes_as_frozenset) -> count
    dp = defaultdict(lambda: defaultdict(int))

    # Base case: we start at 'start' with no required nodes visited yet
    # (unless start itself is a required node)
    initial_visited = frozenset([start]) if start in required_set else frozenset()
    dp[start][initial_visited] = 1

    # We need to process nodes in topological order for a DAG
    # But if there are cycles, we need an iterative approach
    # Since the problem likely has cycles, we'll use BFS with states

    from collections import deque

    # Queue: (node, visited_required_frozenset)
    queue = deque([(start, initial_visited)])
    visited_states = {(start, initial_visited)}

    # Process in BFS order
    while queue:
        current, curr_visited_req = queue.popleft()

        if current not in graph:
            continue

        current_count = dp[current][curr_visited_req]

        for neighbor in graph[current]:
            # Update visited required nodes if neighbor is required
            new_visited_req = curr_visited_req
            if neighbor in required_set:
                new_visited_req = curr_visited_req | {neighbor}

            # Update DP table
            dp[neighbor][new_visited_req] += current_count

            # Add to queue if not visited with this state
            state = (neighbor, new_visited_req)
            if state not in visited_states:
                visited_states.add(state)
                queue.append(state)

    # Sum all paths that reach 'end' with all required nodes visited
    total = 0
    for visited_req, count in dp[end].items():
        if required_set.issubset(visited_req):
            total += count

    return total

def count_paths_dp_with_cycle_detection(graph, start, end, required_nodes):
    """
    Count paths with cycle detection using memoization.
    State: (current_node, visited_nodes_in_path, visited_required_nodes)
    """
    required_set = frozenset(required_nodes)
    memo = {}

    def dfs(node, visited_path, visited_required):
        # Base case: reached end
        if node == end:
            # Check if all required nodes were visited
            return 1 if visited_required == required_set else 0

        # Cycle detection
        if node in visited_path:
            return 0

        # Memoization key - can't use visited_path as it changes
        # Use (node, visited_required) as key
        memo_key = (node, visited_required)
        if memo_key in memo:
            return memo[memo_key]

        # Node doesn't exist
        if node not in graph:
            return 0

        # Add to path
        new_visited_path = visited_path | {node}

        # Update required nodes
        new_visited_required = visited_required
        if node in required_set:
            new_visited_required = visited_required | {node}

        total = 0
        for neighbor in graph[node]:
            total += dfs(neighbor, new_visited_path, new_visited_required)

        memo[memo_key] = total
        return total

    initial_visited_req = frozenset([start]) if start in required_set else frozenset()
    return dfs(start, frozenset(), initial_visited_req)

def count_paths_segment_multiply(graph, start, end, required_nodes):
    """
    Alternative approach: If required nodes must be visited in a specific order,
    we can multiply the number of paths between segments.

    For example: paths(svr -> dac) * paths(dac -> fft) * paths(fft -> out)

    But this only works if there's a forced ordering (no cycles back).
    """
    if len(required_nodes) != 2:
        raise ValueError("This approach only works for exactly 2 required nodes")

    node1, node2 = list(required_nodes)

    # Try both orderings: start -> node1 -> node2 -> end
    #                and: start -> node2 -> node1 -> end

    def count_simple_paths(start, end, avoid=None):
        """Count paths from start to end avoiding certain nodes"""
        if avoid is None:
            avoid = set()

        def dfs(curr, visited):
            if curr == end:
                return 1
            if curr in visited:
                return 0
            if curr not in graph:
                return 0

            visited_new = visited | {curr}
            total = 0
            for neighbor in graph[curr]:
                if neighbor not in avoid or neighbor == end:
                    total += dfs(neighbor, visited_new)
            return total

        return dfs(start, frozenset())

    # Ordering 1: start -> node1 -> node2 -> end
    p1_1 = count_simple_paths(start, node1, avoid={node2})
    p1_2 = count_simple_paths(node1, node2, avoid={start})
    p1_3 = count_simple_paths(node2, end, avoid={start, node1})
    total1 = p1_1 * p1_2 * p1_3

    # Ordering 2: start -> node2 -> node1 -> end
    p2_1 = count_simple_paths(start, node2, avoid={node1})
    p2_2 = count_simple_paths(node2, node1, avoid={start})
    p2_3 = count_simple_paths(node1, end, avoid={start, node2})
    total2 = p2_1 * p2_2 * p2_3

    print(f"\nSegment analysis:")
    print(f"Order {start} -> {node1} -> {node2} -> {end}:")
    print(f"  {start} -> {node1}: {p1_1}")
    print(f"  {node1} -> {node2}: {p1_2}")
    print(f"  {node2} -> {end}: {p1_3}")
    print(f"  Total: {total1}")

    print(f"\nOrder {start} -> {node2} -> {node1} -> {end}:")
    print(f"  {start} -> {node2}: {p2_1}")
    print(f"  {node2} -> {node1}: {p2_2}")
    print(f"  {node1} -> {end}: {p2_3}")
    print(f"  Total: {total2}")

    return total1 + total2

def main():
    graph = parse_input('day11/input.txt')

    print(f"Graph nodes: {len(graph)}")

    # Part 2: Count paths from 'svr' to 'out' that visit both 'dac' and 'fft'
    print("\n=== PART 2 ===")
    print("Calculating paths from 'svr' to 'out' that visit both 'dac' and 'fft'...\n")

    required_nodes = {'dac', 'fft'}

    # Method 1: Segment multiplication (fast but may not handle all cases)
    print("Method 1: Segment multiplication")
    try:
        result_segment = count_paths_segment_multiply(graph, 'svr', 'out', required_nodes)
        print(f"\nResult (segment multiplication): {result_segment}")
    except Exception as e:
        print(f"Error: {e}")

    # Method 2: DP with cycle detection (more accurate but potentially slower)
    print("\n" + "="*50)
    print("Method 2: DP with cycle detection and memoization")
    try:
        result_dp = count_paths_dp_with_cycle_detection(graph, 'svr', 'out', required_nodes)
        print(f"Result (DP with memoization): {result_dp}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
