const canvas = document.querySelector('canvas')
        const ctx = canvas.getContext('2d')

        const upBtn = document.querySelector('#up')
        const downBtn = document.querySelector('#down')
        const leftBtn = document.querySelector('#left')
        const rightBtn = document.querySelector('#right')

        const scoreCon = document.querySelectorAll('.score')
        const gameOverCon = document.querySelector('.game-over')

        canvas.height = "400"
        canvas.width = "360"

        const intervalTime = 200
        const px = 20
        let isGameOver = false
        let firstTime = true

        const snake = {
            height: 20,
            width: 20,
            color: '#5ba505',
            snakeBlockColor: '#8AC926',
            x: -20,
            y: 20,
            speed: 20,
            direction: 'right',
            length: 1,
            snakeBlocks: []
        }

        const food = {
            height: 20,
            width: 20,
            color: 'red',
            x: 200,
            y: 200
        }

        const draw = ()=> {
            ctx.fillStyle = snake.color
            ctx.fillRect(snake.x, snake.y, snake.height, snake.width)
            ctx.strokeStyle = "darkgreen"
            ctx.lineWidth = 2
            ctx.strokeRect(snake.x, snake.y, snake.height, snake.width)
            ctx.fillStyle = snake.snakeBlockColor

            snake.snakeBlocks.forEach((s)=> {
                ctx.fillRect(s.x, s.y, snake.height, snake.width)
                ctx.strokeRect(s.x, s.y, snake.height, snake.width)
            })

            ctx.fillStyle = food.color
            ctx.fillRect(food.x, food.y, food.height, food.width)
        }

        const moveSnake = ()=> {
            let s = snake.speed
            let d = snake.direction

            if (d == 'up') {
                snake.y -= s
            } else if (d == 'down') {
                snake.y += s
            } else if (d == 'left') {
                snake.x -= s
            } else if (d == 'right') {
                snake.x += s
            }
            console.log('snake')
        }

        const moveSnakeBlocks = ()=> {
            console.log('snake block')
            for (let i = snake.snakeBlocks.length-1; i >= 0; i--) {
                if (i != 0) {
                    snake.snakeBlocks[i].x = snake.snakeBlocks[i-1].x
                    snake.snakeBlocks[i].y = snake.snakeBlocks[i-1].y
                } else {
                    snake.snakeBlocks[i].x = snake.x
                    snake.snakeBlocks[i].y = snake.y
                }
            }
        }

        const changeDirection = (d)=> {
            if (snake.direction != 'down' && d == 'up') {
                snake.direction = 'up'
            } else if (snake.direction != 'up' && d == 'down') {
                snake.direction = 'down'
            } else if (snake.direction != 'right' && d == 'left') {
                snake.direction = 'left'
            } else if (snake.direction != 'left' && d == 'right') {
                snake.direction = 'right'
            }
        }

        // Collision with food
        const collisionWithFood = ()=> {
            if (snake.x < food.x + food.width &&
                snake.x + snake.width > food.x &&
                snake.y < food.y + food.height &&
                snake.y + snake.height > food.y) {
                snake.length++
                generateFood()
                generateSnakeBlocks()
                scoreCon.forEach((s)=> {
                    s.textContent = snake.length;
                })
            }
        }

        const collisionWithWall = ()=> {
            if (snake.x < 0 ||
                snake.x + snake.width > canvas.width ||
                snake.y < 0 ||
                snake.y + snake.height > canvas.height) {
                gameOver('collisionWithWall')
            }
        }

        // Collision with blocks
        const collisionWithBlocks = ()=> {
            snake.snakeBlocks.forEach((s)=> {
                if (snake.x == s.x && snake.y == s.y) {
                    gameOver('collisionWithBlocks')
                }
            })
        }

        // Game over
        const gameOver = (err)=> {
            isGameOver = true
            console.log('game over',
                err)
            gameOverCon.style.display = 'grid'
        }

        // Generate food randomly
        const generateFood = ()=> {
            food.x = Math.floor(Math.random() * canvas.width / px) * px
            food.y = Math.floor(Math.random() * canvas.height / px) * px
        }

        // Generate blocks when collision with food detected
        const generateSnakeBlocks = ()=> {
            let x
            let y
            if (snake.snakeBlocks.length > 0) {
                x = snake.snakeBlocks[snake.snakeBlocks.length-1].x
                y = snake.snakeBlocks[snake.snakeBlocks.length-1].y
            } else {
                x = snake.x
                y = snake.y
            }

            let w = snake.width
            let d = snake.direction

            if (d == 'up') {
                y = y + w
            } else if (d == 'down') {
                y = y - w
            } else if (d == 'left') {
                x = x + w
            } else if (d == 'right') {
                x = x - w
            }

            snake.snakeBlocks.push({
                x: x,
                y: y
            })
        }

        const start = ()=> {
            for (let i = 0; i < 3; i++) {
                snake.length++
                generateSnakeBlocks()
            }
        }
        start()
        draw()

        setInterval(()=> {
            if (!isGameOver) {
                ctx.clearRect(0, 0, 400, 400)

                moveSnake()

                setTimeout(()=> {
                    moveSnakeBlocks()
                }, intervalTime)

                collisionWithFood()
                collisionWithWall()
                collisionWithBlocks()
            }
            draw()
        }, intervalTime)

        // Controls
        upBtn.addEventListener('click', ()=> {
            changeDirection('up')})
        downBtn.addEventListener('click', ()=> {
            changeDirection('down')})
        leftBtn.addEventListener('click', ()=> {
            changeDirection('left')})
        rightBtn.addEventListener('click', ()=> {
            changeDirection('right')})
    
