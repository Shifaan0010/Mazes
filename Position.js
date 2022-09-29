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
    static distance(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
    }
    static manhattenDistance(position, other) {
        return abs(position.x - other.x) + abs(position.y - other.y)
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}