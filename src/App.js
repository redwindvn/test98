import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import coin98Logo from './coin98.png';

function App() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const birdImageRef = useRef(null);
  
  const bird = useRef({
    y: 300,
    velocity: 0,
    width: 40,  // adjusted size for the logo
    height: 40
  });
  
  const pipe = useRef({
    x: 400,
    gap: 200,
    height: Math.random() * 300 + 100
  });

  const gameState = useRef({
    pipeSpeed: 1.5, // Slower initial speed
    baseSpeed: 1.5, // Keep track of base speed
    speedMultiplier: 1, // Will increase with score
  });

  useEffect(() => {
    // Load bird image
    const birdImage = new Image();
    birdImage.src = coin98Logo;
    birdImage.onload = () => {
      birdImageRef.current = birdImage;
    };
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const gravity = 0.5;
    const jump = -8;

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update bird
      bird.current.velocity += gravity;
      bird.current.y += bird.current.velocity;
      
      // Update pipe with dynamic speed
      pipe.current.x -= gameState.current.pipeSpeed;
      if (pipe.current.x < -50) {
        pipe.current.x = 400;
        pipe.current.height = Math.random() * 300 + 100;
        setScore(s => {
          const newScore = s + 1;
          // Increase speed every 5 points, up to 2x the original speed
          gameState.current.speedMultiplier = Math.min(2, 1 + (newScore / 20));
          gameState.current.pipeSpeed = gameState.current.baseSpeed * gameState.current.speedMultiplier;
          return newScore;
        });
      }
      
      // Draw bird (using image instead of rectangle)
      if (birdImageRef.current) {
        ctx.drawImage(
          birdImageRef.current,
          50,
          bird.current.y,
          bird.current.width,
          bird.current.height
        );
      }
      
      // Draw pipes
      ctx.fillStyle = 'green';
      ctx.fillRect(pipe.current.x, 0, 50, pipe.current.height);
      ctx.fillRect(
        pipe.current.x,
        pipe.current.height + pipe.current.gap,
        50,
        canvas.height - (pipe.current.height + pipe.current.gap)
      );
      
      // Collision detection
      if (
        bird.current.y < 0 ||
        bird.current.y > canvas.height - bird.current.height ||
        (pipe.current.x < 80 &&
          pipe.current.x > 0 &&
          (bird.current.y < pipe.current.height ||
            bird.current.y > pipe.current.height + pipe.current.gap - bird.current.height))
      ) {
        setGameOver(true);
        return;
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const handleClick = () => {
      if (gameOver) {
        setGameOver(false);
        bird.current.y = 300;
        bird.current.velocity = 0;
        pipe.current.x = 400;
        setScore(0);
        // Reset speed on game over
        gameState.current.speedMultiplier = 1;
        gameState.current.pipeSpeed = gameState.current.baseSpeed;
      } else {
        bird.current.velocity = jump;
      }
    };

    canvas.addEventListener('click', handleClick);
    if (!gameOver) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }

    return () => {
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver]);

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        style={{ border: '1px solid black' }}
      />
      <div className="score">Score: {score}</div>
      {gameOver && <div className="game-over">Game Over! Click to restart</div>}
    </div>
  );
}

export default App; 