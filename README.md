# 🚗 Crossy Road - Web Game

A fun and addictive web-based replica of the classic Crossy Road game! No downloads needed - play directly in your browser.

## 🎮 How to Play

1. **Open the Game**: Open `index.html` in your web browser
2. **Controls**:
   - **Arrow Keys** or **WASD** to move your character
   - **Up/W**: Move forward
   - **Down/S**: Move backward
   - **Left/A**: Move left
   - **Right/D**: Move right
3. **Objective**: Navigate your character across roads filled with moving obstacles (cars, trucks)
4. **Score**: Earn points by advancing forward - the further you go, the higher your score
5. **Game Over**: Collide with an obstacle or go off-screen to end the game
6. **High Score**: Your best score is automatically saved

## 🌟 Features

- ✅ **Web-Based**: No installation required - runs in any modern browser
- ✅ **Smooth Controls**: Responsive arrow key or WASD controls
- ✅ **Dynamic Obstacles**: Cars and trucks move at different speeds
- ✅ **Progressive Difficulty**: Obstacles increase in speed as you progress
- ✅ **Score Tracking**: Real-time score display and high score persistence
- ✅ **Pause/Resume**: Take a break anytime with the pause button
- ✅ **Responsive Design**: Works on desktop browsers
- ✅ **Game Over Screen**: Shows your final score and high score

## 📁 File Structure

```
├── index.html    # Main HTML file with canvas and UI
├── game.js       # Core game logic (Player, Obstacles, Roads, Game)
├── style.css     # Styling and layout
└── README.md     # This file
```

## 🚀 Quick Start

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Click "Play" and start moving!

## 🎯 Game Classes

### Player
- Handles player character movement and collision detection
- Starting position: center bottom of screen
- Can move in 4 directions (up, down, left, right)

### Obstacle
- Represents moving vehicles (cars, trucks)
- Moves horizontally across the screen
- Spawns randomly on roads

### Road
- Contains multiple obstacles
- Generates obstacles at regular intervals
- Different speeds for varied difficulty

### Game
- Main game controller
- Manages player, roads, score, and collision detection
- Handles pause/resume functionality
- Stores high score in browser localStorage

## 🎨 Customization

You can easily customize the game by modifying values in `game.js`:

- **Player Speed**: Change `this.speed = 40;` in Player class
- **Obstacle Speeds**: Modify the `speeds` array in `initRoads()`
- **Colors**: Update color values (e.g., `'#FF6B6B'` for player)
- **Canvas Size**: Modify width/height in `index.html` canvas element
- **Road Layout**: Adjust number of roads in `initRoads()` loop

## 💾 High Score

Your high score is automatically saved in the browser's local storage. Clear your browser data to reset it.

## 🐛 Troubleshooting

- **Game not loading?** Make sure all three files (index.html, game.js, style.css) are in the same folder
- **Controls not working?** Click on the game canvas first to ensure it has focus
- **Game too fast?** Adjust obstacle speeds in the game.js file

## 📝 License

This project is open source and available for educational and personal use.

## 🎉 Enjoy!

Have fun playing Crossy Road! Beat your high score and share your achievements!
