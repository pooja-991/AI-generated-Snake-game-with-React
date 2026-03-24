import React, { useEffect, useRef, useState } from 'react';

const GRID_COUNT = 20;
const CANVAS_SIZE = 600;
const CELL_SIZE = CANVAS_SIZE / GRID_COUNT;
const MOVE_INTERVAL = 80;

type Point = { x: number; y: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameState = useRef({
    snake: [{ x: 10, y: 10 }] as Point[],
    direction: { x: 0, y: -1 } as Point,
    nextDirection: { x: 0, y: -1 } as Point,
    food: { x: 15, y: 5 } as Point,
    lastMove: performance.now(),
    particles: [] as Particle[],
    shake: 0,
    score: 0,
    gameOver: false,
    isPaused: false
  });

  const spawnParticles = (x: number, y: number, count: number, color: string) => {
    for (let i = 0; i < count; i++) {
      gameState.current.particles.push({
        x: x + 0.5,
        y: y + 0.5,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        life: 1.0,
        color: color,
        size: Math.random() * 6 + 2
      });
    }
  };

  const resetGame = () => {
    gameState.current = {
      snake: [{ x: 10, y: 10 }],
      direction: { x: 0, y: -1 },
      nextDirection: { x: 0, y: -1 },
      food: { x: Math.floor(Math.random() * GRID_COUNT), y: Math.floor(Math.random() * GRID_COUNT) },
      lastMove: performance.now(),
      particles: [],
      shake: 10,
      score: 0,
      gameOver: false,
      isPaused: false
    };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameState.current;
      if (state.gameOver) {
        if (e.key === 'Enter') resetGame();
        return;
      }
      if (e.key === ' ') {
        state.isPaused = !state.isPaused;
        setIsPaused(state.isPaused);
        return;
      }

      const { x, y } = state.direction;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          if (y === 0) state.nextDirection = { x: 0, y: -1 }; break;
        case 'ArrowDown': case 's': case 'S':
          if (y === 0) state.nextDirection = { x: 0, y: 1 }; break;
        case 'ArrowLeft': case 'a': case 'A':
          if (x === 0) state.nextDirection = { x: -1, y: 0 }; break;
        case 'ArrowRight': case 'd': case 'D':
          if (x === 0) state.nextDirection = { x: 1, y: 0 }; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const state = gameState.current;

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.save();
      if (state.shake > 0) {
        const dx = (Math.random() - 0.5) * state.shake;
        const dy = (Math.random() - 0.5) * state.shake;
        ctx.translate(dx, dy);
      }

      // Grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for(let i=0; i<=GRID_COUNT; i++) {
        ctx.beginPath(); ctx.moveTo(i*CELL_SIZE, 0); ctx.lineTo(i*CELL_SIZE, CANVAS_SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i*CELL_SIZE); ctx.lineTo(CANVAS_SIZE, i*CELL_SIZE); ctx.stroke();
      }

      // Food
      ctx.fillStyle = '#f0f';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#f0f';
      ctx.fillRect(state.food.x * CELL_SIZE + 4, state.food.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);

      // Snake
      state.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#fff' : '#0ff';
        ctx.shadowBlur = index === 0 ? 15 : 10;
        ctx.shadowColor = '#0ff';
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });

      // Particles
      ctx.shadowBlur = 0;
      state.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x * CELL_SIZE, p.y * CELL_SIZE, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;

      ctx.restore();
    };

    const loop = (time: number) => {
      const state = gameState.current;
      
      if (!state.isPaused && !state.gameOver) {
        const deltaTime = time - state.lastMove;
        if (deltaTime > MOVE_INTERVAL) {
          state.direction = state.nextDirection;
          const head = state.snake[0];
          const newHead = { x: head.x + state.direction.x, y: head.y + state.direction.y };

          // Collision
          if (newHead.x < 0 || newHead.x >= GRID_COUNT || newHead.y < 0 || newHead.y >= GRID_COUNT ||
              state.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
            state.gameOver = true;
            setGameOver(true);
            state.shake = 30;
            spawnParticles(head.x, head.y, 50, '#f0f');
          } else {
            state.snake.unshift(newHead);
            if (newHead.x === state.food.x && newHead.y === state.food.y) {
              state.score += 10;
              setScore(state.score);
              state.shake = 8;
              spawnParticles(state.food.x, state.food.y, 20, '#0ff');
              
              // Generate new food
              let newFood;
              while (true) {
                newFood = { x: Math.floor(Math.random() * GRID_COUNT), y: Math.floor(Math.random() * GRID_COUNT) };
                // eslint-disable-next-line no-loop-func
                if (!state.snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
              }
              state.food = newFood;
            } else {
              state.snake.pop();
            }
          }
          state.lastMove = time;
        }
      }

      // Update particles
      state.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
      });
      state.particles = state.particles.filter(p => p.life > 0);

      // Update shake
      if (state.shake > 0) state.shake *= 0.85;
      if (state.shake < 0.5) state.shake = 0;

      draw();
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[600px] mx-auto">
      <div className="flex justify-between w-full mb-2 text-2xl font-mono">
        <div className="text-cyan">SCORE_VAL: {score.toString().padStart(4, '0')}</div>
        <div className="text-magenta glitch" data-text={gameOver ? "SYS_FAIL" : isPaused ? "HALTED" : "EXEC"}>
          {gameOver ? "SYS_FAIL" : isPaused ? "HALTED" : "EXEC"}
        </div>
      </div>
      
      <div className="relative w-full aspect-square border-glitch bg-black overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_SIZE} 
          height={CANVAS_SIZE} 
          className="w-full h-full object-contain block"
        />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <h2 className="text-5xl text-magenta glitch mb-2" data-text="FATAL_EXCEPTION">FATAL_EXCEPTION</h2>
            <p className="text-cyan text-2xl mb-8">MEM_DUMP: {score} BYTES</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 border-2 border-cyan text-cyan hover:bg-cyan hover:text-black transition-colors uppercase tracking-widest text-xl font-bold"
            >
              [ REBOOT_SEQ ]
            </button>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
            <h2 className="text-4xl text-cyan glitch" data-text="PROCESS_SUSPENDED">PROCESS_SUSPENDED</h2>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-cyan/70 text-sm text-center w-full flex justify-between">
        <span>INPUT: [W][A][S][D] / ARROWS</span>
        <span>INTERRUPT: [SPACE]</span>
      </div>
    </div>
  );
}
