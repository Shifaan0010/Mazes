function selector(options, selected) {
    let s = createSelect()
    options.forEach(
        (option) => s.option(option)
    )
    s.selected(options[selected])
    return s
}

async function setup()
{
    let canvas = createCanvas(100, 100)
    canvas.id('canvas')

    let sizeP = createP('Size ').parent('text-container')
    let size = createSlider(10, 50, 20)
    size.parent(sizeP)

    let running = false

    let rows, columns
    async function resize() {
        if (running) {
            return
        }

        let animateValue = animate.checked()
        animate.checked(false)

        if (windowHeight < windowWidth) {
            rows = floor(windowHeight / size.value())
            columns = floor((windowWidth * 0.7) / size.value())
            select('#text-container').size(windowWidth - columns * size.value())
            canvas.elt.float = 'right'
        } else {
            rows = floor((windowHeight * 0.7) / size.value())
            columns = floor(windowWidth / size.value())
            select('#text-container').size(windowWidth)
            canvas.elt.float = 'none'
        }
        if (rows % 2 == 0) {
            rows -= 1
        }
        if (columns % 2 == 0) {
            columns -= 1
        }
        resizeCanvas(columns * size.value(), rows * size.value())
        await generate()

        animate.checked(animateValue)
    }

    windowResized = resize
    size.changed(resize)

    // let row = createP(`Rows: ${startRows}`)
    // row.parent('text-container')
    // let rowSlider = createSlider(3, 121, startRows, 2)
    // rowSlider.input(() => row.html(`Rows: ${rowSlider.value()}`))
    // rowSlider.parent('text-container')

    // let column = createP(`Columns: ${startColumns}`)
    // column.parent('text-container')
    // let columnSlider = createSlider(3, 121, startColumns, 2)
    // columnSlider.input(() => column.html(`Columns: ${columnSlider.value()}`))
    // columnSlider.parent('text-container')

    let seed = createInput('')
    seed.elt.placeholder = 'Seed'
    seed.parent('text-container')

    let animate = createCheckbox('Animate', false)
    animate.parent('text-container')

    let animateSlider = createSlider(1, 50, 10)
    animateSlider.parent(animate)

    function animateSpeed() {
        if (animate.checked()) {
            return animateSlider.value()
        } else {
            return 0
        }
    }

    let mazeGeneratorP = createP('Maze Generator ')
    mazeGeneratorP.parent('text-container')
    let mazeGenerator = selector(['Empty', 'Random', 'Recursive Backtracker'], 2)
    mazeGenerator.parent(mazeGeneratorP)

    let pathfinderP = createP('Pathfinding Algorithm ')
    pathfinderP.parent('text-container')
    let pathfinder = selector(['Breadth First', 'Dijkstra', 'A Star', 'A Star (Weighted)', 'Wall Follower', 'Greedy'], 2)
    pathfinder.parent(pathfinderP)

    let maze

    async function generate() {
        if (running) {
            return
        }
        running = true

        if (!isNaN(parseInt(seed.value()))) {
            randomSeed(+seed)
        }

        let algorithm
        if (mazeGenerator.value() == 'Empty') {
            algorithm = MazeGenerator.empty
        } else if (mazeGenerator.value() == 'Random') {
            algorithm = MazeGenerator.random
        } else if (mazeGenerator.value() == 'Recursive Backtracker') {
            algorithm = MazeGenerator.recursiveBacktracker
        } else {return}

        maze = await algorithm(columns, rows, size.value(), animateSpeed())
        running = false
        maze.draw()
    }

    async function solve() {
        if (running) {
            return
        }
        running = true

        maze.clear()

        let algorithm
        if (pathfinder.value() == 'Breadth First') {
            algorithm = Pathfinder.breadthFirst
        } else if (pathfinder.value() == 'Dijkstra') {
            algorithm = Pathfinder.dijkstra
        } else if (pathfinder.value() == 'A Star (Weighted)') {
            algorithm = Pathfinder.aStarWeighted
        } else if (pathfinder.value() == 'A Star') {
            algorithm = Pathfinder.aStar
        } else if (pathfinder.value() == 'Wall Follower') {
            algorithm = Pathfinder.wallFollower
        } else if (pathfinder.value() == 'Greedy') {
            algorithm = Pathfinder.greedy
        } else {return}

        let endNode = await algorithm(maze, animateSpeed())
        await Pathfinder.trace(maze, endNode, animateSpeed())

        running = false
        maze.draw()
    }

    let generateButton = createButton('Generate Maze')
    generateButton.mousePressed(generate)
    generateButton.touchStarted(generate)
    generateButton.parent('text-container')

    let solveButton = createButton('Solve')
    solveButton.mousePressed(solve)
    solveButton.touchStarted(solve)
    solveButton.parent('text-container')

    await resize() // resizes and generates maze

    noLoop()
}