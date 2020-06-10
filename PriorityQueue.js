class PriorityQueue
{
    constructor() {
        this.items = []
    }
    empty() {
        return this.items.length == 0
    }
    push(item) {
        this.items.push(item)
    }
    pop() {
        if (this.empty()) {
            return undefined
        }
        let least = 0
        for (let i = 1; i < this.items.length; i += 1) {
            if (this.items[i].priority() < this.items[least].priority()) {
                least = i
            }
        }
        let item = this.items[least]
        this.items.splice(least, 1)
        return item
    }
}