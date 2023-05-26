document.addEventListener("DOMContentLoaded", () => {
    // Paddle and ball objects
    const leftPaddle = document.getElementById("leftPaddle");
    const rightPaddle = document.getElementById("rightPaddle");
    const ball = document.getElementById("ball");
    const newGameButton = document.getElementById("newGameButton");
    const gameOverPanel = document.getElementById("gameOverPanel");

    // Initial paddle positions
    let leftPaddleY = 160;
    let rightPaddleY = 160;

    // Initial ball position and speed
    let ballX = 295;
    let ballY = 195;
    let ballSpeedX = 0;
    let ballSpeedY = 0;

    // Scores
    let playerScore = 0;
    let computerScore = 0;

    // Function to update the game state
    function update() {
        // Move the paddles
        leftPaddle.style.top = leftPaddleY + "px";
        rightPaddle.style.top = rightPaddleY + "px";

        // Apply acceleration and update velocity
        playerVelocity += playerAcceleration;
        
        // Apply friction to gradually slow down the paddle
        playerVelocity *= paddleFriction;
        
        // Limit the maximum speed of the paddle
        if (playerVelocity > 20) {
            playerVelocity = 20;
        } else if (playerVelocity < -20) {
            playerVelocity = -20;
        }
        
        // Move the paddle based on the velocity
        leftPaddleY += playerVelocity;
        
        // Reset the player's acceleration
        playerAcceleration = 0;

        // Move the ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        // Check collision with paddles
        if (
            (ballX <= 20 && ballX >= 10 && ballY + 10 >= leftPaddleY && ballY <= leftPaddleY + 60) ||
            (ballX >= 570 && ballX <= 580 && ballY + 10 >= rightPaddleY && ballY <= rightPaddleY + 60)
        ) {
            ballSpeedX *= -1;
        }

        // Check collision with walls
        if (ballY <= 0 || ballY >= 390) {
            ballSpeedY *= -1;
        }

        // Update the game state every frame
        requestAnimationFrame(update);
    }

    // Function to handle user input
    const paddleAcceleration = 10;  // The acceleration rate
    const paddleFriction = 0.50;     // The friction to gradually slow down the paddle
    
    // Variables for player paddle movement
    let playerVelocity = 0;           // The current velocity of the player's paddle
    let playerAcceleration = 0;       // The current acceleration of the player's paddle
    
    // Function to handle user input
    function handleInput(e) {
        if (e.keyCode === 38) {
            // Up arrow key
            playerAcceleration = -paddleAcceleration;
        } else if (e.keyCode === 40) {
            // Down arrow key
            playerAcceleration = paddleAcceleration;
        }
    }

    // Function for the computer opponent
    function computerAI() {
        // Calculate the center of the paddle
        const paddleCenter = rightPaddleY + 30;

        // Move the paddle towards the ball's vertical position
        if (paddleCenter < ballY) {
            rightPaddleY += 4;
        } else if (paddleCenter > ballY) {
            rightPaddleY -= 4;
        }
    }

    // Function to update the score panel
    function updateScorePanel() {
        const scorePanel = document.getElementById("scorePanel");
        scorePanel.textContent = `Player: ${playerScore} - Computer: ${computerScore}`;
    }

    // Function to reset the game state
    function resetGame() {
        // Reset paddle positions
        leftPaddleY = 160;
        rightPaddleY = 160;

        // Reset ball position and speed
        ballX = 295;
        ballY = 195;
        ballSpeedX = 3;
        ballSpeedY = 3;
    }

    let gameStarted = false; // Flag variable to track game start
    let gameEnded = false; // Flag variable to track game state

    // Function to show game over message
    function showGameOverMessage(winner) {
        const gameOverPanel = document.getElementById("gameOverPanel");
        gameOverPanel.textContent = `${winner} wins the game!`;
        gameOverPanel.style.display = "block";
        gameEnded = true; // Set gameEnded to true to prevent further gameplay
    }

    // Function to handle game over
    function gameOver() {
        if (playerScore === 5 || computerScore === 5) {
            // Display the winner
            const winner = playerScore === 5 ? "Player" : "Computer";
            showGameOverMessage(winner);
        }
    }

    // Function to start a new game
    function startNewGame() {
        gameStarted = true; // Set gameStarted to true
        gameEnded = false; // Reset the gameEnded flag
        gameOverPanel.style.display = "none";
        playerScore = 0;
        computerScore = 0;
        resetGame();
    }

    // Event listener for the new game button
    newGameButton.addEventListener("click", startNewGame);

    // Event listener for user input
    document.addEventListener("keydown", handleInput);

    // Start the game
    update();

    // Game loop
    setInterval(() => {
        if (gameStarted && !gameEnded) { // Only update the game if it hasn't ended
            computerAI();

            // Check if the ball goes out of bounds
            if (ballX <= 0) {
                computerScore++;
                resetGame();
                gameOver();
            } else if (ballX >= 600) {
                playerScore++;
                resetGame();
                gameOver();
            }

            // Update the score panel
            updateScorePanel();

            // Update the ball's position if the game is still ongoing
            if (gameEnded) {
                ballSpeedX = 0;
                ballSpeedY = 0;
            }
        }
    }, 1000 / 60);
});
