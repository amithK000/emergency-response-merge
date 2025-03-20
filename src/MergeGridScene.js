class MergeGridScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MergeGrid' });
    }

    create() {
        // Draw a 5x5 grid of 50x50 rectangles starting at (200, 350) with 10px spacing
        const gridSize = 5;
        const cellSize = 50;
        const spacing = 10;
        
        // Create graphics object for drawing
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1); // White lines, 2px thick
        
        // Draw the grid
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const x = 200 + col * (cellSize + spacing);
                const y = 350 + row * (cellSize + spacing);
                
                // Draw rectangle (outline only)
                graphics.strokeRect(x, y, cellSize, cellSize);
            }
        }
    }
}