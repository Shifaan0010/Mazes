class Maze
{
    constructor(grid, columns, rows, space)
    {
        this.columns = columns
        this.rows = rows

        this.start = new Position(0, 0)
        this.end = new Position(columns - 1, rows - 1)

        this.grid = grid

        this.grid[this.start.x][this.start.y].wall = false
        this.grid[this.end.x][this.end.y].wall = false
        this.grid[this.start.x][this.start.y].color = color(150, 200, 255)
        this.grid[this.end.x][this.end.y].color = color(150, 200, 255)

        this.mazeColor = color(255)
        this.wallColor = color(39, 43, 52)

        this.space = space || floor(min(windowWidth / this.columns, windowHeight / this.rows))

        this.draw()
    }
    clear()
    {
        this.grid.forEach(
            (column) => column.forEach(
                (spot) => spot.color = undefined
            )
        )
        this.grid[this.start.x][this.start.y].color = color(150, 200, 255)
        this.grid[this.end.x][this.end.y].color = color(150, 200, 255)
        this.draw()
    }
    setColor(position, color)
    {
        if (!position.equals(this.start) && !position.equals(this.end)) {
            this.grid[position.x][position.y].color = color
        }
    }
    drawSpot(position)
    {
        let spot = this.grid[position.x][position.y]
        noStroke()
        if (spot.wall) {
            fill(this.wallColor)
        } else if (spot.color) {
            fill(spot.color)
        } else {
            fill(this.mazeColor)
        }
        rect(position.x * this.space, position.y * this.space, this.space, this.space)
    }
    draw() 
    {
        background(this.mazeColor)
        this.grid.forEach(
            (column, x) => column.forEach(
                (spot, y) => this.drawSpot(new Position(x, y))
            )
        )
    }
    inBounds(position)
    {
        return position.x >= 0 && position.x < this.columns && position.y >= 0 && position.y < this.rows
    }
    neighbors(position, distance) 
    {
        if (this.grid[position.x][position.y].wall) {
            return []
        } else {
            return [
                new Position(position.x + distance, position.y),
                new Position(position.x - distance, position.y),
                new Position(position.x, position.y + distance),
                new Position(position.x, position.y - distance)
            ].filter(
                (neighbor) => this.inBounds(neighbor) && !this.grid[neighbor.x][neighbor.y].wall
            )
        }
    }
}