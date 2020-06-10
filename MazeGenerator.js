class MazeGenerator
{
    static empty(columns, rows, space, animate) 
    {
        return new Maze(Array(columns).fill().map(
            () => Array(rows).fill().map(
                () => ({
                    wall: false,
                    color: undefined
                })
            )
        ), columns, rows, space)
    }
    static random(columns, rows, space, animate) 
    {
        return new Maze(Array(columns).fill().map(
            () => Array(rows).fill().map(
                () => ({
                    wall: random() < 0.3,
                    color: undefined
                })
            )
        ), columns, rows, space)
    }
    static async recursiveBacktracker(columns, rows, space, animate) 
    {
        let maze = new Maze(Array(columns).fill().map(
            (_, x) => Array(rows).fill().map(
                (_, y) => ({
                    wall: x % 2 == 1 || y % 2 == 1,
                    color: undefined
                })
            )
        ), columns, rows, space)

        if (animate != 0) {
            maze.draw()
            await sleep(animate)
        }

        let visited = Array(floor((columns + 1) / 2)).fill().map(
            () => Array(floor((rows + 1) / 2)).fill(false)
        )

        async function visit(position) {
            visited[floor(position.x / 2)][floor(position.y / 2)] = true

            let neighbors = maze.neighbors(position, 2)

            while (neighbors.length > 0) {
                let index = floor(random(neighbors.length))
                let neighbor = neighbors[index]

                if (random() < 0.05 || !visited[floor(neighbor.x / 2)][floor(neighbor.y / 2)]) {
                    let wall = new Position(floor((position.x + neighbor.x) / 2), floor((position.y + neighbor.y) / 2))

                    maze.grid[wall.x][wall.y].wall = false

                    if (animate != 0) {
                        maze.drawSpot(wall)
                        await sleep(animate)
                    }

                    if (!visited[floor(neighbor.x / 2)][floor(neighbor.y / 2)]) {
                        await visit(neighbor)
                    }
                }

                neighbors.splice(index, 1)
            }
        }

        await visit(new Position(0, 0))

        return maze
    }
}