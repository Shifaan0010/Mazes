class Position
{
    constructor(x, y)
    {
        this.x = x
        this.y = y
    }
    equals(other) {
        return this.x == other.x && this.y == other.y
    }
    add(other) {
        this.x += other.x
        this.y += other.y
    }
    copy() {
        return new Position(this.x, this.y)
    }
    static manhattenDistance(position, other) {
        return abs(position.x - other.x) + abs(position.y - other.y)
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}