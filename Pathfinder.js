class Pathfinder
{
    static async aStar(maze, animate) {
        return Pathfinder.astar(maze, Position.manhattenDistance, AStarNode.unweightedMaze, animate)
    }
    static async aStarWeighted(maze, animate) {
        return Pathfinder.astar(maze, Position.manhattenDistance, AStarNode.weightedMaze, animate)
    }
    static async breadthFirst(maze, animate) {
        return Pathfinder.astar(maze, (position, end) => 0, AStarNode.unweightedMaze, animate)
    }
    static async dijkstra(maze, animate) {
        return Pathfinder.astar(maze, (position, end) => 0, AStarNode.weightedMaze, animate)
    }
    static async greedy(maze, animate) {
        return Pathfinder.astar(maze, (position, end) => 100 * Position.manhattenDistance(position, end), AStarNode.weightedMaze, animate)
    }
    static async astar(maze, heuristic, graphGenerator, animate)
    {
        let mazeNodes = await graphGenerator(maze, heuristic, animate)

        let start = mazeNodes[maze.start.x][maze.start.y]
        let end = mazeNodes[maze.end.x][maze.end.y]

        // maze.clear()

        let priorityQ = new PriorityQueue()

        start.cost = 0

        priorityQ.push(start)

        while (!priorityQ.empty())
        {
            let node = priorityQ.pop()

            if (node === end) {
                return node
            } else {
                maze.setColor(node, color(255, 150, 150))
                if (animate != 0) {
                    maze.drawSpot(node)
                    await sleep(animate)
                }
            }

            node.neighbors.forEach(
                (neighbor) => {
                    let newCost = node.cost + Position.manhattenDistance(node, neighbor)
                    if (neighbor.cost == Infinity || newCost < neighbor.cost) {
                        if (neighbor.cost == Infinity) {
                            priorityQ.push(neighbor)
                        }
                        neighbor.cost = newCost
                        neighbor.path = node
                    }
                }
            )
        }
        return null
    }
    static async wallFollower(maze, animate) {
        maze.clear()

        let walker = new Walker(maze)

        let path_length = 0

        let visited_start = false

        while (true) {
            if (walker.position.equals(maze.end)) {
                return null
            } else if ((walker.position.equals(maze.start) && walker.direction == 0 && visited_start)) {
                return null
            } else if (!walker.position.equals(maze.start)) {
                maze.setColor(walker.position, color(120, 255, 170))
                if (animate != 0) {
                    maze.drawSpot(walker.position)
                    await sleep(animate)
                }
            }

            visited_start = true;

            if (!walker.blocked(-1)) {
                walker.turn(-1)
            } else if (!walker.blocked(0)) {
                walker.turn(0)
            } else {
                walker.turn(1)
                continue
            }

            walker.moveForward()
            path_length += 1
        }
    }
    static async trace(maze, end, animate)
    {
        let node = end
        while (node != null)
        {
            // maze.setColor(node, color(120, 255, 170))
            // if (animate != 0) {
            //     maze.drawSpot(node)
            //     await sleep(animate)
            // }

            if (node.path != null) {
                let position = node.copy()
                while (!position.equals(node.path)) {
                    if (position.x != node.path.x) {
                        position.x += floor((node.path.x - position.x) / abs(node.path.x - position.x))
                    }
                    if (position.y != node.path.y) {
                        position.y += floor((node.path.y - position.y) / abs(node.path.y - position.y))
                    }

                    maze.setColor(position, color(120, 255, 170))
                    if (animate != 0) {
                        maze.drawSpot(position)
                        await sleep(animate)
                    }
                }
            }

            node = node.path
        }
    }
}

let directions = [
    new Position(0, 1),
    new Position(1, 0),
    new Position(0, -1),
    new Position(-1, 0)
]

class Walker
{
    constructor(maze) {
        this.maze = maze
        this.position = maze.start.copy()
        this.direction = 0
    }
    // 1 -> left, -1 -> right
    ifTurn(direction) {
        return (this.direction + direction + directions.length) % directions.length
    }
    turn(direction) {
        this.direction = this.ifTurn(direction)
    }
    moveForward() {
        this.position.add(directions[this.direction])
    }
    blocked(direction) {
        let newPosition = this.position.copy()
        newPosition.add(directions[this.ifTurn(direction)])
        return !this.maze.inBounds(newPosition) || this.maze.grid[newPosition.x][newPosition.y].wall
    }
}