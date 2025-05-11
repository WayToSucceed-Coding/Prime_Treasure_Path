class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
        this.minDisplayTime = 2500; // Minimum 2.5 seconds display time
        this.startTime = 0;
    }

    preload() {
        // Setup loading bar visuals
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

        // Progress bar container
        const barWidth = width * 0.6;

        // Actual progress bar
        this.progressBar = this.add.rectangle(
            width / 2 - barWidth / 2,
            height / 2,
            5, // Start with small width
            30,
            0xFA8072
        ).setOrigin(0, 0.5);


        // Percentage text
        this.percentText = this.add.text(
            width / 2,
            height / 2,
            '0%',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#FFFFFF'
            }
        ).setOrigin(0.5);

        // Loading text with animation
        this.loadingText = this.add.text(
            width / 2,
            height / 2 - 50,
            'LOADING GAME....',
            {
                fontFamily: 'Georgia, serif',
                fontSize: '32px',
                color: '#FFFFFF'
            }
        ).setOrigin(0.5);

        // "Let's Go!" text (initially hidden)
        this.readyText = this.add.text(
            width / 2,
            height / 2 - 50,
            'LET\'S GO!',
            {
                fontFamily: 'Georgia, serif',
                fontSize: '42px',
                color: '#ffffff',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000',
                    blur: 3,
                    stroke: true
                }
            }
        ).setOrigin(0.5).setAlpha(0);

        // Animate loading text
        this.tweens.add({
            targets: this.loadingText,
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Load assets
        this.loadAssets();

        // Track loading progress
        this.load.on('progress', (value) => {
            // Update percentage text
            this.percentText.setText(`${Math.floor(value * 100)}%`);

            // Animate progress bar smoothly
            this.tweens.add({
                targets: this.progressBar,
                width: barWidth * value,
                duration: 300,
                ease: 'Sine.Out'
            });
        });

        this.load.on('complete', () => {
            // Ensure minimum display time
            const elapsed = this.time.now - this.startTime;
            const remaining = Math.max(0, this.minDisplayTime - elapsed);

            this.time.delayedCall(remaining, () => {
                // Final animation before starting game
                this.percentText.setText('100%');
                this.progressBar.width = barWidth;

                this.tweens.add({
                    targets: [this.loadingText, this.messageText],
                    alpha: 0,
                    duration: 500
                });

                this.tweens.add({
                    targets: [this.progressBar, this.percentText],
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.readyText,
                            alpha: 1,
                            scale: { from: 1.3, to: 1 },
                            duration: 500,
                            ease: 'Back.out',
                            onComplete: () => {
                                this.scene.start('GameScene');

                            }
                        })

                    }
                });
            });
        });
    }

    create() {
        this.startTime = this.time.now;
    }

    loadAssets() {
        // Load all game assets
        this.load.image('waterTexture', 'assets/texture5.png');
        this.load.image('tile', 'assets/stone2.png');
        this.load.image('explorer', 'assets/player.png');
        this.load.image('treasure', 'assets/gem.png');
        this.load.image('particle', 'assets/gem.png');
        this.load.audio('collect', 'assets/pop.mp3');
        this.load.audio('error', 'assets/error.mp3');
        this.load.audio('win', 'assets/win.mp3');
    }
}//Defines a new scene/screen in Phaser
class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        // Preload assets for start screen
        this.load.image('startBg', 'assets/texture5.png');
        this.load.image('startExplorer', 'assets/player.png');
        this.load.image('startTreasure', 'assets/gem.png');
        this.load.image('startTile', 'assets/stone2.png');
    }

    create() {
        // Create background with same water texture as game
        this.bg = this.add.image(400, 350, 'startBg')

        // Adds text to the screen
        const title = this.add.text(400, 150, 'PRIME TREASURE PATH', {
            fontFamily: 'Georgia, serif',
            fontSize: '48px',
            color: '#FFFFFF',
            strokeThickness: 2,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 3,
                stroke: true
            }
        }).setOrigin(0.5);//Sets origin to the center of the text box
        //setOrigin(x,y) defines the anchor point of an object

        // Subtitle
        const subtitle = this.add.text(400, 210, 'Follow the Path of Primes', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#FFF',

        }).setOrigin(0.5);

        // Game explanation
        const explanation = this.add.text(400, 300,
            `Reach the treasure by following a path where each step is a prime number.\n` +
            `Use arrow keys to move.\n Make sure to avoid non-prime numbers!\n`,
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#EEE',
                align: 'center',
                lineSpacing: 10
            }).setOrigin(0.5);


        // Play button 
        const playButton = this.add.rectangle(400, 400, 200, 60, 0xFA8072)
            .setInteractive()//Starts listening for mouse/touch events
            .setStrokeStyle(4, 0xFFFFFF);

        //setInteractive() can be called on a game object(like sprite,image,text,or shape)

        const playText = this.add.text(400, 400, 'PLAY', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // Button hover effects
        playButton.on('pointerover', () => {
            playButton.setFillStyle(0xFF7F50);
            playText.setScale(1.05);
        });

        playButton.on('pointerout', () => {
            playButton.setFillStyle(0xFA8072);
            playText.setScale(1);
        });

        // Load game on click
        playButton.on('pointerdown', () => {
            this.scene.start('LoadingScene');  // New version
        });

        // Add explorer character
        this.explorer = this.add.image(200, 400, 'startExplorer')
            .setScale(1)
            .setFlipX(true);//Flips the image horizontally

        // Add treasure
        this.treasure = this.add.image(600, 400, 'startTreasure')
            .setScale(1.5);

        // Animate elements
        this.tweens.add({
            targets: this.explorer,//The object to be animated
            y: 380, //It will move the y position of the object to 380
            duration: 2000, //The duration of the movement in milliseconds
            yoyo: true, //Make it behave like a yo-yo by going back to its original position
            repeat: -1, //To repeat the animation indefinitely
            ease: 'Sine.inOut' //Makes the motion smooth and natural
        });

        this.tweens.add({
            targets: this.treasure,
            angle: 360, //Rotate the treasure 360 degrees
            duration: 10000,
            repeat: -1
        });

        // Pulsing title effect
        this.tweens.add({
            targets: title,
            scale: 1.05, //Scale the title to 105% of its original size
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }

}

// Main game scene
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.score = 0;
        this.highScore = 0;
    }

    preload() {
        // Load assets with enhanced visuals
        this.load.image('waterTexture', 'assets/texture5.png');
        this.load.image('tile', 'assets/stone2.png');
        this.load.image('explorer', 'assets/player.png');
        this.load.image('treasure', 'assets/gem.png');
        this.load.image('particle', 'assets/gem.png');
        this.load.audio('collect', 'assets/pop.mp3');
        this.load.audio('error', 'assets/error.mp3');
        this.load.audio('win', 'assets/win.mp3');

    }

    create() {
        // Game state
        this.selectedPath = [];
        this.usedNumbers = new Set();
        this.gridSize = 8;
        this.tileSize = 80;
        this.isMoving = false;
        this.scoredTiles = new Set();

        this.setupTouchControls()



        // Update touch visual feedback
        this.input.on('pointermove', (pointer) => {
            if (!this.touchActive) return;

            const dx = pointer.x - this.touchStartX;
            const dy = pointer.y - this.touchStartY;
            const distance = Math.sqrt(dx * dx + dy * dy);



        });


        // Calculate center offset for the grid
        const gridWidth = this.gridSize * this.tileSize;
        const gridHeight = this.gridSize * this.tileSize;
        this.gridOffsetX = (this.sys.game.config.width - gridWidth) / 2;
        this.gridOffsetY = (this.sys.game.config.height - gridHeight) / 2 + 20; // +50 to account for UI

        // Retrieve high score from local storage if available
        const savedHighScore = localStorage.getItem('primePathHighScore');
        if (savedHighScore) {
            this.highScore = parseInt(savedHighScore);
        }

        // Reset score for new game
        this.score = 0;

        // Generate grid with unique numbers
        this.grid = this.generateUniqueNumberGrid();

        // Create graphics for trail effects
        this.trailGraphics = this.add.graphics();
        this.pathGraphics = this.add.graphics();

        // Create particle emitter for trail
        this.particles = this.add.particles('particle');

        this.trailEmitter = this.particles.createEmitter({
            speed: 0,
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            frequency: -1, // Manual emission
            tint: 0x88ff88
        });

        // Create and store grid tiles
        this.tiles = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                const tileX = this.gridOffsetX + x * this.tileSize + this.tileSize / 2;
                const tileY = this.gridOffsetY + y * this.tileSize + this.tileSize / 2;

                // Create container for tile and effects
                const tileContainer = this.add.container(tileX, tileY);


                // Add glow effect (hidden by default)
                const glow = this.add.graphics();
                glow.fillStyle(0xffff44, 0.3);
                glow.fillCircle(0, 0, this.tileSize / 2 + 4);
                glow.alpha = 0;
                tileContainer.add(glow);

                // Add main tile
                const tile = this.add.image(0, 0, 'tile')
                    .setDisplaySize(this.tileSize - 4, this.tileSize - 4)
                    .setInteractive()


                tileContainer.add(tile);

                // Add number text
                const text = this.add.text(
                    0, 0,
                    this.grid[y][x].value.toString(),
                    {
                        font: 'bold 20px Arial',
                        fill: '#FFFFFF',
                        align: 'center'
                    }
                ).setOrigin(0.5);
                tileContainer.add(text);

                // Store references
                this.tiles[y][x] = {
                    container: tileContainer,
                    tile: tile,
                    text: text,
                    glow: glow,
                    x: x,
                    y: y
                };

            }
        }


        this.tiles.forEach(row => {
            row.forEach(tile => {
                // Store original position
                tile.originalY = tile.container.y;
                // Wobble properties (slow speed, small height)
                tile.wobble = {
                    speed: 0.5 + Math.random() * 0.5,  // Very slow
                    offset: Math.random() * 100,       // Random start point
                    height: 0.6 + Math.random() * 0.8  // Small movement
                };
            });
        });

        // Arrow key movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // Track movement cooldown to prevent spamming
        this.moveCooldown = false;

        // Create player with trailing particles
        this.player = this.add.sprite(
            this.tileSize / 2 + this.gridOffsetX,
            this.tileSize / 2 + this.gridOffsetY,
            'explorer'
        ).setDisplaySize(80, 80);

        // Player particle trail
        this.playerEmitter = this.particles.createEmitter({
            follow: this.player,
            speed: { min: 10, max: 30 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 800,
            blendMode: 'ADD',
            frequency: 40,
            tint: [0xffff00, 0x88ff88, 0x44aaff]
        });

        // Add treasure
        this.treasure = this.add.image(
            (this.gridSize - 1) * this.tileSize + this.tileSize / 2 + this.gridOffsetX,
            (this.gridSize - 1) * this.tileSize + this.tileSize / 2 + this.gridOffsetY,
            'treasure'
        ).setDisplaySize(50, 50);

        // Add glow effect to treasure
        this.treasureGlow = this.add.graphics();
        this.treasureGlow.fillStyle(0xffff44, 0.3);
        this.treasureGlow.fillCircle(
            (this.gridSize - 1) * this.tileSize + this.tileSize / 2 + this.gridOffsetX,
            (this.gridSize - 1) * this.tileSize + this.tileSize / 2 + this.gridOffsetY,
            this.tileSize / 2
        );

        // Pulsing effect for treasure
        this.tweens.add({
            targets: this.treasureGlow,
            alpha: 0.1,
            duration: 1200,
            yoyo: true,
            repeat: -1
        });

        // Rotate treasure
        this.tweens.add({
            targets: this.treasure,
            angle: 360,
            duration: 6000,
            repeat: -1
        });

        this.designSystem = {

            typography: {
                display: "'Playfair Display', serif", // Elegant serif
                heading: "'Cormorant Garamond', serif", // Refined serif
                body: "'Lora', serif", // Readable serif
                ui: "'Montserrat', sans-serif" // Clean sans for UI
            }
        };

        // Score text with letter-spacing
        this.scoreText = this.add.text(20, 15, `SCORE : ${this.score}`, {
            fontFamily: this.designSystem.typography.ui,
            fontSize: '25px',
            color: '#FFFFFF',
            fontStyle: 'bold',
            letterSpacing: 3,

        });

        // High score
        this.highScoreText = this.add.text(500, 15, `HIGH SCORE : ${this.highScore}`, {
            fontFamily: this.designSystem.typography.ui,
            fontSize: '25px',
            color: '#FFFFFF',
            letterSpacing: 2,
            fontStyle: 'bold'

        });


        this.water = this.add.tileSprite(
            0, 0,                // Position
            800, 600,            // Game size (will tile automatically)
            'waterTexture'       // Your texture
        )
            .setOrigin(0)
            .setDepth(-1);




    }
    setupTouchControls() {
        // Variables to track touch input
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.touchActive = false;

        // Create a full-screen touch area
        this.touchArea = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0
        ).setInteractive();

        // Make sure the touch area is on top
        this.touchArea.setDepth(1000);

        // Touch event listeners
        this.touchArea.on('pointerdown', (pointer) => {
            this.touchStartX = pointer.x;
            this.touchStartY = pointer.y;
            this.touchActive = true;

            // Show touch start position (for debugging)
            console.log('Touch started at:', pointer.x, pointer.y);
        });

        this.touchArea.on('pointerup', (pointer) => {
            if (!this.touchActive) return;
            this.touchEndX = pointer.x;
            this.touchEndY = pointer.y;
            console.log('Touch ended at:', pointer.x, pointer.y);
            this.handleSwipe();
            this.touchActive = false;
        });

        // Handle case where touch leaves the game area
        this.input.on('pointerup', () => {
            if (this.touchActive) {
                console.log('Touch cancelled');
                this.touchActive = false;
            }
        });
    }

    handleSwipe() {
        if (this.isMoving || this.moveCooldown) {
            console.log('Movement blocked - isMoving:', this.isMoving, 'moveCooldown:', this.moveCooldown);
            return;
        }

        const dx = this.touchEndX - this.touchStartX;
        const dy = this.touchEndY - this.touchStartY;

        console.log('Swipe detected - dx:', dx, 'dy:', dy);

        // Only register swipes that move a significant distance
        const minSwipeDistance = 30;
        if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
            console.log('Swipe too short');
            return;
        }

        const lastPos = this.selectedPath.length > 0 ?
            this.selectedPath[this.selectedPath.length - 1] :
            { x: 0, y: 0 };

        let targetX = lastPos.x;
        let targetY = lastPos.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 0 && lastPos.x < this.gridSize - 1) {
                targetX++;
                console.log('Swiped right');
            } else if (dx < 0 && lastPos.x > 0) {
                targetX--;
                console.log('Swiped left');
            }
        } else {
            // Vertical swipe
            if (dy > 0 && lastPos.y < this.gridSize - 1) {
                targetY++;
                console.log('Swiped down');
            } else if (dy < 0 && lastPos.y > 0) {
                targetY--;
                console.log('Swiped up');
            }
        }

        // If position changed, handle movement
        if (targetX !== lastPos.x || targetY !== lastPos.y) {
            console.log('Moving to:', targetX, targetY);
            this.moveCooldown = true;
            this.handleTileClick(targetX, targetY);

            // Add slight delay before next move
            this.time.delayedCall(200, () => {
                this.moveCooldown = false;
            });
        } else {
            console.log('No movement - same position or at edge');
        }
    }
    update(time) {
        if (this.isMoving || this.moveCooldown) return;
        const lastPos = this.selectedPath.length > 0 ?
            this.selectedPath[this.selectedPath.length - 1] :
            { x: 0, y: 0 };

        let targetX = lastPos.x;
        let targetY = lastPos.y;

        // Keep existing keyboard controls
        if (this.cursors.left.isDown && lastPos.x > 0) {
            targetX--;
        }
        else if (this.cursors.right.isDown && lastPos.x < this.gridSize - 1) {
            targetX++;
        }
        else if (this.cursors.up.isDown && lastPos.y > 0) {
            targetY--;
        }
        else if (this.cursors.down.isDown && lastPos.y < this.gridSize - 1) {
            targetY++;
        }

        // If position changed, handle movement
        if (targetX !== lastPos.x || targetY !== lastPos.y) {
            this.moveCooldown = true;
            this.handleTileClick(targetX, targetY);

            // Add slight delay before next move
            this.time.delayedCall(200, () => {
                this.moveCooldown = false;
            });

        }
        // Gentle wobble animation
        this.tiles.forEach(row => {
            row.forEach(tile => {
                tile.container.y = tile.originalY +
                    Math.sin((time + tile.wobble.offset) * 0.002 * tile.wobble.speed) * tile.wobble.height;
            });
        });
    }


    generateUniqueNumberGrid() {
        const grid = [];
        this.usedNumbers.clear();

        // Generate primes (2-100) and non-primes
        const primes = [];
        const nonPrimes = [];

        for (let i = 2; i <= 100; i++) {
            if (this.isPrime(i)) primes.push(i);
            else nonPrimes.push(i);
        }

        // Shuffle arrays
        Phaser.Utils.Array.Shuffle(primes);
        Phaser.Utils.Array.Shuffle(nonPrimes);

        // Create guaranteed path first
        let x = 0, y = 0;
        const path = [];

        while (x < this.gridSize - 1 || y < this.gridSize - 1) {
            path.push({ x, y });

            // Randomly move right or down
            const canMoveRight = x < this.gridSize - 1;
            const canMoveDown = y < this.gridSize - 1;

            if (canMoveRight && (!canMoveDown || Math.random() > 0.5)) {
                x++;
            } else {
                y++;
            }
        }
        path.push({ x, y }); // Add end point

        // Initialize empty grid
        for (let y = 0; y < this.gridSize; y++) {
            grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                grid[y][x] = { value: 0, isPrime: false };
            }
        }

        // Assign primes to path
        path.forEach((pos, index) => {
            grid[pos.y][pos.x] = {
                value: primes.pop(),
                isPrime: true
            };
            this.usedNumbers.add(grid[pos.y][pos.x].value);
        });

        // Fill remaining tiles
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (grid[y][x].value === 0) {
                    // 40% chance to be prime
                    if (Math.random() < 0.4 && primes.length > 0) {
                        grid[y][x] = {
                            value: primes.pop(),
                            isPrime: true
                        };
                    } else {
                        grid[y][x] = {
                            value: nonPrimes.pop(),
                            isPrime: false
                        };
                    }
                    this.usedNumbers.add(grid[y][x].value);
                }
            }
        }

        return grid;
    }

    handleTileClick(x, y) {
        const tile = this.grid[y][x];

        // Create a unique key for the tile position
        const tileKey = `${x},${y}`;

        if (tile.isPrime) {
            this.selectedPath.push({ x, y });
            this.drawTrail();
            this.movePlayerTo(x, y);

            // Highlight the selected tile
            this.highlightTile(x, y, true);


            // Only add points if this tile hasn't been scored before
            if (!this.scoredTiles.has(tileKey)) {
                const primeValue = tile.value;

                // const pointsEarned = this.calculatePoints(primeValue);
                const pointsEarned = tile.value
                this.score += pointsEarned;

                this.sound.play('collect', { volume: 0.8 });

                // Show points earned popup
                this.showPointsEarned(x, y, pointsEarned);

                // Mark this tile as scored
                this.scoredTiles.add(tileKey);
            }

            // Update score display
            this.updateScoreDisplay();

            // Check win condition
            if (x === this.gridSize - 1 && y === this.gridSize - 1) {
                // Add completion bonus
                const completionBonus = 500;
                this.score += completionBonus;

                // Check if this is a new high score
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    localStorage.setItem('primePathHighScore', this.highScore);
                    this.updateScoreDisplay();
                }

                this.time.delayedCall(500, () => {
                    this.celebrateWin();
                    this.time.delayedCall(1500, () => {
                        this.scene.start('WinScene', {
                            score: this.score,
                            highScore: this.highScore,
                            isNewHighScore: this.score === this.highScore
                        });
                    });
                });
            }
        } else {
            // Show error and reset
            this.showError(x, y, tile.value);
            this.sound.play('error', { volume: 0.8 });
            this.resetPlayer();
        }
    }
    movePlayerTo(x, y) {
        this.isMoving = true;

        const lastPos = this.selectedPath.length > 1 ?
            this.selectedPath[this.selectedPath.length - 2] :
            { x: 0, y: 0 };

        const startX = lastPos.x * this.tileSize + this.tileSize / 2 + this.gridOffsetX;
        const startY = lastPos.y * this.tileSize + this.tileSize / 2 + this.gridOffsetY;
        const endX = x * this.tileSize + this.tileSize / 2 + this.gridOffsetX;
        const endY = y * this.tileSize + this.tileSize / 2 + this.gridOffsetY;

        // Jump height (adjust as needed)
        const jumpHeight = 20;

        // Create jump animation timeline
        const timeline = this.tweens.createTimeline();

        // 1. Jump up
        timeline.add({
            targets: this.player,
            y: endY - jumpHeight,
            duration: 150,
            ease: 'Sine.easeOut'
        });

        // 2. Land down with tile vibration
        timeline.add({
            targets: this.player,
            y: endY,
            duration: 100,
            ease: 'Bounce.easeOut',
            onStart: () => {
                // Vibrate the landed tile
                this.vibrateTile(x, y);
            },
            onComplete: () => {
                this.isMoving = false;
            }
        });

        // Horizontal movement happens during the entire jump
        this.tweens.add({
            targets: this.player,
            x: endX,
            duration: 250, // Total jump duration
            ease: 'Linear'
        });

        timeline.play();
    }

    vibrateTile(x, y) {
        const tileContainer = this.tiles[y][x].container;

        // Store original position if not already stored
        if (!tileContainer.originalY) {
            tileContainer.originalY = tileContainer.y;
        }

        // Gentle dip and bounce effect
        this.tweens.add({
            targets: tileContainer,
            y: tileContainer.originalY + 3, // Slight downward dip
            duration: 80,
            yoyo: true, // Makes it bounce back
            ease: 'Quad.easeOut',
            onComplete: () => {
                // Ensure it returns exactly to original position
                tileContainer.y = tileContainer.originalY;
            }
        });

        // Optional: Very subtle horizontal movement (comment out if too much)
        this.tweens.add({
            targets: tileContainer,
            x: tileContainer.x + Phaser.Math.Between(-1, 1), // Tiny horizontal variation
            duration: 100,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    drawTrail() {
        this.trailGraphics.clear();

        if (this.selectedPath.length <= 1) return;

        // Create gradient trail
        const colors = [
            0xff88ff,   // Light pink
            0xff00ff,   // Magenta
            0xaa00ff,   // Purple
            0x8800ff    // Deep purple
        ];

        for (let i = 1; i < this.selectedPath.length; i++) {
            const prev = this.selectedPath[i - 1];
            const curr = this.selectedPath[i];

            const prevX = prev.x * this.tileSize + this.tileSize / 2 + this.gridOffsetX;
            const prevY = prev.y * this.tileSize + this.tileSize / 2 + this.gridOffsetY;
            const currX = curr.x * this.tileSize + this.tileSize / 2 + this.gridOffsetX;
            const currY = curr.y * this.tileSize + this.tileSize / 2 + this.gridOffsetY;

            // Calculate gradient color based on path position
            const pathProgress = (i - 1) / (this.selectedPath.length - 1);
            const colorIndex = Math.min(Math.floor(pathProgress * colors.length), colors.length - 1);
            const color = colors[colorIndex];

            // Draw line with glow effect
            this.trailGraphics.lineStyle(6, color, 0.3);
            this.trailGraphics.strokeLineShape(new Phaser.Geom.Line(prevX, prevY, currX, currY));
            this.trailGraphics.setDepth(-1); // Ensure it's behind the player
            // Draw inner line (brighter)
            this.trailGraphics.lineStyle(2, 0xffffff, 0.3);
            this.trailGraphics.strokeLineShape(new Phaser.Geom.Line(prevX, prevY, currX, currY));
            this.trailGraphics.setDepth(-1)
        }
    }

    highlightTile(x, y, isPrime) {
        const tileDef = this.tiles[y][x];

        // Reset all previous highlighting except for path
        this.tiles.forEach(row => {
            row.forEach(t => {
                if (!this.isInPath(t.x, t.y)) {
                    t.glow.alpha = 0;
                    t.tile.setTint(0xffffff);
                }
            });
        });

        // Highlight the current tile
        if (isPrime) {
            // Show glow effect
            tileDef.glow.clear();
            tileDef.glow.fillStyle(0xfff9e6, 0.4);
            tileDef.glow.fillCircle(0, 0, this.tileSize / 2 + 4);
            tileDef.glow.alpha = 1;

            // Tint the tile
            tileDef.tile.setTint(0xccffcc);

            // Create a small flash effect
            this.tweens.add({
                targets: tileDef.glow,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 0
            });

            // Emit particles at tile
            this.time.addEvent({
                delay: 10,
                repeat: 10,
                callback: () => {
                    this.trailEmitter.setPosition(
                        x * this.tileSize + this.tileSize / 2 + this.gridOffsetX,
                        y * this.tileSize + this.tileSize / 2 + this.gridOffsetY
                    );
                    this.trailEmitter.emitParticle(3);
                }
            });
        }
    }

    isInPath(x, y) {
        return this.selectedPath.some(pos => pos.x === x && pos.y === y);
    }

    showError(x, y, num) {
        let explanation = `${num} is not prime. `;

        if (num === 1) {
            explanation += "1 is not a prime number.";
        } else {
            for (let i = 2; i <= Math.sqrt(num); i++) {
                if (num % i === 0) {
                    explanation += `Divisible by ${i}.`;
                    break;
                }
            }
        }

        const errorText = this.add.text(
            x * this.tileSize + this.tileSize / 2 + this.gridOffsetX,
            y * this.tileSize - 20 + this.gridOffsetY,
            explanation,
            {
                font: '14px Arial',
                fill: '#ff0000',
                backgroundColor: '#fff0f0',
                align: 'center',
                padding: { x: 10, y: 10 },

            }
        ).setOrigin(0.5);

        // Flash the incorrect tile with red color
        const tileDef = this.tiles[y][x];

        // Red glow effect
        tileDef.glow.clear();
        tileDef.glow.fillStyle(0xff4444, 0.6);
        tileDef.glow.fillCircle(0, 0, this.tileSize / 2 + 4);
        tileDef.glow.alpha = 1;

        // Tint the tile red
        tileDef.tile.setTint(0xff8888);

        // Create shake effect
        this.tweens.add({
            targets: tileDef.container,
            x: tileDef.container.x + 3,
            duration: 1000,
            yoyo: true,
            repeat: 5
        });

        // Create red particles
        const errorEmitter = this.particles.createEmitter({
            x: x * this.tileSize + this.tileSize / 2 + this.gridOffsetX,
            y: y * this.tileSize + this.tileSize / 2 + this.gridOffsetY,
            speed: { min: 50, max: 100 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 800,
            blendMode: 'ADD',
            tint: 0xff0000,
            quantity: 20
        });

        // Cleanup
        this.time.delayedCall(1000, () => {
            errorText.destroy();
            errorEmitter.stop();
            tileDef.glow.alpha = 0;
            tileDef.tile.clearTint();
        });
    }

    resetPlayer() {
        this.isMoving = true;
        this.scoredTiles.clear();

        // Create tween to return to start
        this.tweens.add({
            targets: this.player,
            x: this.tileSize / 2 + this.gridOffsetX,
            y: this.tileSize / 2 + this.gridOffsetY,
            duration: 300,
            ease: 'Bounce.out',
            onComplete: () => {
                this.isMoving = false;
                // Reset ALL tile visuals including glow
                this.tiles.forEach(row => {
                    row.forEach(tileDef => {
                        tileDef.glow.alpha = 0;  // Clear glow
                        tileDef.tile.clearTint(); // Clear tint
                        tileDef.container.y = tileDef.originalY; // Reset position if needed
                    });
                });
            }
        });

        // Reset tile visuals
        this.tiles.forEach(row => {
            row.forEach(tileDef => {
                tileDef.glow.alpha = 0;
                tileDef.tile.clearTint();
            });
        });

        // Fade out trail
        this.tweens.add({
            targets: this.trailGraphics,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.trailGraphics.clear();
                this.trailGraphics.alpha = 1;
            }
        });

        // Reset path and score
        this.selectedPath = [];
        this.score = 0;
        this.updateScoreDisplay();
    }

    celebrateWin() {

        this.sound.play('win', { volume: 0.8 });
        // Create explosion of particles at treasure
        const winEmitter = this.particles.createEmitter({
            x: (this.gridSize - 1) * this.tileSize + this.tileSize / 2 + this.gridOffsetX,
            y: (this.gridSize - 1) * this.tileSize + this.tileSize / 2 + this.gridOffsetY,
            speed: { min: 50, max: 200 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 1500,
            blendMode: 'ADD',
            tint: [0xffff00, 0x88ff88, 0xff88ff, 0x88ffff],
            quantity: 50
        });

        // Make treasure pulse
        this.tweens.add({
            targets: this.treasure,
            scale: 1.5,
            duration: 300,
            yoyo: true,
            repeat: 3
        });

        // Enhanced glow effect on treasure
        this.treasureGlow.clear();
        this.treasureGlow.fillStyle(0xffff44, 0.8);
        this.treasureGlow.fillCircle(
            (this.gridSize - 1) * this.tileSize + this.tileSize / 2 + this.gridOffsetX,
            (this.gridSize - 1) * this.tileSize + this.tileSize / 2 + this.gridOffsetY,
            this.tileSize
        );

        // Fade out treasure glow
        this.tweens.add({
            targets: this.treasureGlow,
            alpha: 0,
            duration: 1500
        });

        // Stop emitter after celebration
        this.time.delayedCall(1500, () => {
            winEmitter.stop();
        });
    }

    updateScoreDisplay() {
        this.scoreText.setText(`SCORE :  ${this.score}`);
        this.highScoreText.setText(`HIGH SCORE : ${this.highScore}`);

        // Animate score text
        this.tweens.add({
            targets: this.scoreText,
            scale: 1.2,
            duration: 100,
            yoyo: true
        });
    }

    // calculatePoints(primeValue) {
    //     // Base points for finding any prime
    //     let points = 10;

    //     // Bonus points based on prime value
    //     points += Math.floor(primeValue / 3);

    //     // Bonus for larger primes
    //     if (primeValue > 50) points += 15;
    //     if (primeValue > 70) points += 20;
    //     if (primeValue > 90) points += 25;

    //     // Combo bonus for consecutive primes
    //     points += Math.min(this.selectedPath.length * 2, 50);

    //     return points;
    // }

    showPointsEarned(x, y, points) {
        // Create floating points text
        const pointsText = this.add.text(
            x * this.tileSize + this.tileSize / 2,
            y * this.tileSize + this.tileSize / 2 - 10,
            `+${points}`,
            {
                font: 'bold 24px Arial',
                fill: '#ffffff',
                stroke: '#333333',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        // Animate points text floating up and fading
        this.tweens.add({
            targets: pointsText,
            y: pointsText.y - 40,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                pointsText.destroy();
            }
        });

        // Create sparkle particles for points
        const pointsEmitter = this.particles.createEmitter({
            x: x * this.tileSize + this.tileSize / 2 + this.gridOffsetX,
            y: y * this.tileSize + this.tileSize / 2 + this.gridOffsetY,
            speed: { min: 30, max: 70 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 800,
            blendMode: 'ADD',
            tint: 0xffff00,
            quantity: Math.min(points / 5, 10)
        });

        // Stop emitter after animation
        this.time.delayedCall(500, () => {
            pointsEmitter.stop();
        });
    }

    isPrime(num) {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++)
            if (num % i === 0) return false;
        return num > 1;
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super('WinScene');
    }

    init(data) {
        this.score = data.score || 0;
        this.highScore = data.highScore || 0;
        this.isNewHighScore = data.isNewHighScore || false;
    }

    preload() {
        this.load.image('particle', 'assets/gem.png');
        this.load.image('medal', 'assets/gem.png');
        this.load.image('winBg', 'assets/texture5.png');
    }

    create() {
        // Create background with same water texture
        this.bg = this.add.tileSprite(0, 0, 800, 700, 'winBg')
            .setOrigin(0)
            .setAlpha(0.7);

        // Create parchment-style background
        const parchment = this.add.graphics()
            .fillStyle(0xFFF8DC, 0.1)
            .fillRoundedRect(100, 80, 600, 500, 20)
            // .setStrokeStyle(4, 0x8B4513)
            .strokeRoundedRect(100, 80, 600, 500, 20);

        // Title with adventure-style font
        const winTitle = this.add.text(400, 150, 'TREASURE ACQUIRED!', {
            fontFamily: 'Georgia, serif',
            fontSize: '42px',
            color: '#FFFFFF',
            strokeThickness: 2,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 3,
                stroke: true
            }
        }).setOrigin(0.5);

        // Score display on parchment
        const scoreTitle = this.add.text(350, 290, `Your Score : `, {
            fontFamily: 'Georgia, serif',
            fontSize: '40px',
            color: '#FFFFFF',
            strokeThickness: 1,
        }).setOrigin(0.5);

        // Create the animated score text
        this.scoreText = this.add.text(500, 290, '0', {
            fontFamily: 'Georgia, serif',
            fontSize: '40px',
            color: '#FFFFFF',
        }).setOrigin(0.5);

        // Animate score counting up
        let displayScore = 0;
        const scoreCountInterval = setInterval(() => {
            displayScore = Math.min(displayScore + Math.ceil(this.score / 20), this.score);
            this.scoreText.setText(`${displayScore}`);

            if (displayScore >= this.score) {
                clearInterval(scoreCountInterval);
                this.createCelebration(this.scoreText.x, this.scoreText.y);
            }
        }, 30);

        // High score display
        const highScoreText = this.add.text(400, 340, `Highest Score : ${this.highScore}`, {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#FFFFFF',
            strokeThickness: 1

        }).setOrigin(0.5);

        // New high score crown
        if (this.isNewHighScore) {
            const crown = this.add.image(520, 350, 'medal')
                .setScale(0.5)
                .setTint(0xFFD700);

            this.add.text(400, 390, 'NEW RECORD!', {
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                color: '#FF0000',
                fontStyle: 'bold',

            }).setOrigin(0.5);

            this.tweens.add({
                targets: crown,
                scale: 0.6,
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        }

        // Play again button with treasure chest style
        const playAgainButton = this.add.rectangle(400, 460, 200, 60, 0xFA8072)
            .setInteractive()
            .setStrokeStyle(4, 0xFFFFFF);

        const playAgainText = this.add.text(400, 460, 'PLAY AGAIN', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#FFFFFF',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Button hover effects
        playAgainButton.on('pointerover', () => {
            playAgainButton.setFillStyle(0xFF7F50, 1)
            
            playAgainText.setScale(1.05);
        });

        playAgainButton.on('pointerout', () => {
            playAgainButton.setFillStyle(0xFA8072, 1)
           
            playAgainText.setScale(1);
        });

        playAgainButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Add explorer and treasure graphics
        const explorer = this.add.image(200, 450, 'explorer')
            .setScale(0.8)
            .setFlipX(true);

        const treasure = this.add.image(600, 450, 'treasure')
            .setScale(1.2);

        // Animate elements
        this.tweens.add({
            targets: explorer,
            x: 220,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });

        this.tweens.add({
            targets: treasure,
            angle: 360,
            duration: 10000,
            repeat: -1
        });
    }

    createCelebration(x, y) {
        // Create particle emitter for celebration
        const particles = this.add.particles('particle');

        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 1000,
            blendMode: 'ADD',
            tint: [0xFFD700, 0xFFA500, 0xFFFFFF],
        });

        // Stop emitter 
        this.time.delayedCall(500, () => {
            emitter.stop();
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    backgroundColor: '#1a1a2e',
    scene: [StartScene, LoadingScene, GameScene, WinScene],
    parent: 'game-container',
    input: {
        activePointers: 3,
        touch: {
            capture: true
        }
    },
    dom: {
        createContainer: true
    }
};

const game = new Phaser.Game(config);