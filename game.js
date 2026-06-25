class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 40;
        this.color = '#FF6B6B';
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - 10, this.y - 5, 6, 6);
        ctx.fillRect(this.x + 4, this.y - 5, 6, 6);
    }

    moveUp() {
        this.y -= this.speed;
    }

    moveDown() {
        this.y += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    getBounds() {
        return {
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            top: this.y - this.height / 2,
            bottom: this.y + this.height / 2
        };
    }
}

class Obstacle {
    constructor(x, y, width, height, speed, color = '#333') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }

    update() {
        this.x += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw wheels for cars
        if (this.width > 50) {
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + this.height, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + this.width - 10, this.y + this.height, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    isOffScreen(canvasWidth) {
        return this.x > canvasWidth || this.x + this.width < 0;
    }
}

class Road {
    constructor(y, obstacleSpeed, obstacleColor = '#333') {
        this.y = y;
        this.obstacleSpeed = obstacleSpeed;
        this.obstacleColor = obstacleColor;
        this.obstacles = [];
        this.spawnRate = 0;
    }

    update() {
        this.spawnRate++;
        
        // Spawn obstacles
        if (this.spawnRate > 60) {
            const width = 60 + Math.random() * 40;
            const x = Math.random() > 0.5 ? -width : 800;
            const speed = this.obstacleSpeed * (Math.random() > 0.5 ? 1 : -1);
            this.obstacles.push(new Obstacle(x, this.y, width, 30, speed, this.obstacleColor));
            this.spawnRate = 0;
        }

        // Update and remove off-screen obstacles
        this.obstacles = this.obstacles.filter(obs => {
            obs.update();
            return !obs.isOffScreen(800);
        });
    }

    draw(ctx) {
        // Draw road
        ctx.fillStyle = '#444';
        ctx.fillRect(0, this.y - 40, 800, 80);
        
        // Draw road markings
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 20]);
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        ctx.lineTo(800, this.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw obstacles
        this.obstacles.forEach(obs => obs.draw(ctx));
    }

    checkCollision(player) {
        const pBounds = player.getBounds();
        for (let obs of this.obstacles) {
            const oBounds = obs.getBounds();
            if (!(pBounds.right < oBounds.left || 
                  pBounds.left > oBounds.right || 
                  pBounds.bottom < oBounds.top || 
                  pBounds.top > oBounds.bottom)) {
                return true;
            }
        }
        return false;
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(400, 550);
        this.roads = [];
        this.score = 0;
        this.highScore = localStorage.getItem('crossyRoadHighScore') || 0;
        this.isRunning = true;
        this.isPaused = false;
        this.lastPlayerY = this.player.y;
        
        this.initRoads();
        this.setupControls();
        this.setupButtons();
        this.gameLoop();
    }

    initRoads() {
        const colors = ['#333', '#444', '#333', '#444'];
        const speeds = [2, 3, 2.5, 3.5];
        
        for (let i = 0; i < 15; i++) {
            const y = 550 - i * 80;
            const road = new Road(y, speeds[i % 4], colors[i % 4]);
            this.roads.push(road);
        }
    }

    setupControls() {
        const keys = {};
        
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            
            if (!this.isPaused && this.isRunning) {
                if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                    this.player.moveUp();
                    this.lastPlayerY = this.player.y;
                }
                if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                    this.player.moveDown();
                }
                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    this.player.moveLeft();
                }
                if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                    this.player.moveRight();
                }
            }
        });
    }

    setupButtons() {
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('restartBtn').addEventListener('click', () => location.reload());
    }

    pause() {
        this.isPaused = true;
        document.getElementById('pauseMenu').classList.remove('hidden');
    }

    resume() {
        this.isPaused = false;
        document.getElementById('pauseMenu').classList.add('hidden');
    }

    checkGameOver() {
        // Check boundaries
        if (this.player.x < 0 || this.player.x > 800 || this.player.y < 0 || this.player.y > 600) {
            return true;
        }

        // Check collisions
        for (let road of this.roads) {
            if (this.player.y >= road.y - 40 && this.player.y <= road.y + 40) {
                if (road.checkCollision(this.player)) {
                    return true;
                }
            }
        }

        return false;
    }

    gameOver() {
        this.isRunning = false;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('crossyRoadHighScore', this.highScore);
        }

        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalHighScore').textContent = this.highScore;
        document.getElementById('gameOver').classList.remove('hidden');
    }

    update() {
        if (!this.isRunning || this.isPaused) return;

        // Update roads
        this.roads.forEach(road => road.update());

        // Update score based on how far up the player has gone
        const newScore = Math.max(0, Math.floor((550 - this.player.y) / 10));
        this.score = Math.max(this.score, newScore);

        // Check game over
        if (this.checkGameOver()) {
            this.gameOver();
        }

        // Remove roads that are too far above and add new ones
        if (this.roads[this.roads.length - 1].y > -100) {
            const lastRoad = this.roads[this.roads.length - 1];
            const colors = ['#333', '#444', '#333', '#444'];
            const speeds = [2, 3, 2.5, 3.5];
            const index = this.roads.length;
            const road = new Road(lastRoad.y - 80, speeds[index % 4], colors[index % 4]);
            this.roads.push(road);
        }

        this.roads = this.roads.filter(road => road.y > -100);
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(135, 206, 235, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grass patches (safe zones)
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, 0, 800, 50);
        this.ctx.fillRect(0, 550, 800, 50);

        // Draw roads
        this.roads.forEach(road => road.draw(this.ctx));

        // Draw player
        this.player.draw(this.ctx);

        // Draw score
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText(`Distance: ${this.score}`, 10, 25);
    }

    gameLoop() {
        this.update();
        this.draw();
        
        // Update UI
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game('gameCanvas');
});
