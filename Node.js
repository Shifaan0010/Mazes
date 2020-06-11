class Node extends Position
{
    constructor(x, y, neighbors)
    {
        super(x, y)
        this.neighbors = neighbors
        this.path = null
    }
}

class AStarNode extends Node
{
    constructor(x, y, neighbors, heuristic)
    {
        super(x, y, neighbors)
        this.cost = Infinity
        this.heuristic = heuristic
    }
    priority()
    {
        return this.cost + this.heuristic
    }
    static async unweightedMaze(maze, heuristic, animate)
    {
        let mazeNodes = maze.grid.map(
            (column, x) => column.map(
                (spot, y) => {
                    if (spot.wall) {
                        return null
                    }
                    let position = new Position(x, y)
                    return new AStarNode(x, y, maze.neighbors(position, 1), heuristic(position, maze.end))
                }
            )
        )

        mazeNodes.forEach(
            (column) => column.forEach(
                (spot) => {
                    if (spot != null) {
                        spot.neighbors = spot.neighbors.map((neighbor) => mazeNodes[neighbor.x][neighbor.y])
                    }
                }
            )
        )

        return mazeNodes
    }

    static async weightedMaze(maze, heuristic, animate) 
    {
        maze.clear()
        let mazeNodes = maze.grid.map(
            (column, x) => column.map(
                (spot, y) => {
                    let position = new Position(x, y)
                    let neighbors = maze.neighbors(position, 1)

                    if ((spot.wall || neighbors.length == 2 && (abs(neighbors[0].x - neighbors[1].x) == 2 || abs(neighbors[0].y - neighbors[1].y) == 2))
                        && !(position.equals(maze.start) || position.equals(maze.end))) {
                        return null
                    } else {
                        return new AStarNode(x, y, [], heuristic(position, maze.end))
                    }
                }
            )
        )

        function connectNodes(node1, node2) 
        {
            node1.neighbors.push(node2)
            node2.neighbors.push(node1)
            stroke(0)
            line((node1.x + 0.5) * maze.space, (node1.y + 0.5) * maze.space, (node2.x + 0.5) * maze.space, (node2.y + 0.5) * maze.space)
        }

        for (let x = 0; x < mazeNodes.length; x += 1)
        {
            let previousSpot = null
            for (let y = 0; y < mazeNodes[x].length; y += 1)
            {
                let spot = mazeNodes[x][y]
                if (spot != null) {
                    if (previousSpot != null) {
                        connectNodes(spot, previousSpot)
                    }

                    if (animate != 0) {
                        noStroke()
                        fill(150, 150, 150)
                        circle((spot.x + 0.5) * maze.space, (spot.y + 0.5) * maze.space, maze.space * 0.8)
                        await sleep(animate / 10)
                    }

                    previousSpot = spot
                } else if (maze.grid[x][y].wall) {
                    previousSpot = null
                }
            }
        }

        for (let y = 0; y < mazeNodes[0].length; y += 1)
        {
            let previousSpot = null
            for (let x = 0; x < mazeNodes.length; x += 1)
            {
                let spot = mazeNodes[x][y]
                if (spot != null) {
                    if (previousSpot != null) {
                        connectNodes(spot, previousSpot)
                    }

                    if (animate != 0) {
                        await sleep(animate / 10)
                    }

                    previousSpot = spot
                } else if (maze.grid[x][y].wall) {
                    previousSpot = null
                }
            }
        }

        return mazeNodes
    }
}