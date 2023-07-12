document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const nameInput = document.getElementById("name-input");
  const startButton = document.getElementById("start-button");
  const scoreDisplay = document.getElementById("score-display");
  const gridSize = 20;
  const boardSize = 400;
  const snake = [{ x: 0, y: 0 }];
  let food = { x: 0, y: 0 };
  let dx = 0;
  let dy = 0;
  let score = 0;

  function createFood() {
    food = {
      x: Math.floor(Math.random() * gridSize) * gridSize,
      y: Math.floor(Math.random() * gridSize) * gridSize,
    };
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === food.x && snake[i].y === food.y) {
        createFood();
        break;
      }
    }
  }

  function draw() {
    board.innerHTML = "";
    snake.forEach(segment => {
      const snakeElement = document.createElement("div");
      snakeElement.style.left = segment.x + "px";
      snakeElement.style.top = segment.y + "px";
      snakeElement.classList.add("snake");
      board.appendChild(snakeElement);
    });

    const foodElement = document.createElement("div");
    foodElement.style.left = food.x + "px";
    foodElement.style.top = food.y + "px";
    foodElement.classList.add("food");
    board.appendChild(foodElement);
  }

  function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      createFood();
    } else {
      snake.pop();
    }
  }

  function changeDirection(event) {
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingLeft = dx === -gridSize;
    const goingRight = dx === gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
      dx = -gridSize;
      dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
      dx = 0;
      dy = -gridSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
      dx = gridSize;
      dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
      dx = 0;
      dy = gridSize;
    }
  }

  function checkGameOver() {
    const head = snake[0];
    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x >= boardSize;
    const hitTopWall = head.y < 0;
    const hitBottomWall = head.y >= boardSize;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
      return true;
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }

    return false;
  }

  function gameLoop() {
    if (checkGameOver()) {
      alert("Game Over! Your score is: " + score);
      resetGame();
      return;
    }

    moveSnake();
    draw();
    setTimeout(gameLoop, 100);
  }

  function startGame() {
    const name = nameInput.value;
    if (name === "") {
      alert("Please enter a name for the snake!");
      return;
    }

    startButton.disabled = true;
    nameInput.disabled = true;
    nameInput.style.backgroundColor = "#ddd";
    createFood();
    draw();
    gameLoop();
  }

  function resetGame() {
    startButton.disabled = false;
    nameInput.disabled = false;
    nameInput.style.backgroundColor = "";
    snake.length = 1;
    snake[0] = { x: 0, y: 0 };
    dx = 0;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = "";
  }

  startButton.addEventListener("click", startGame);
  document.addEventListener("keydown", changeDirection);
});
