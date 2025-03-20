class MergeGridScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MergeGrid' });
        this.tools = [];
        this.gridSize = 5;
        this.cellSize = 50;
        this.spacing = 10;
        this.gridCells = [];
    }

    create() {
        // Draw a 5x5 grid of 50x50 rectangles starting at (200, 350) with 10px spacing
        const gridSize = this.gridSize;
        const cellSize = this.cellSize;
        const spacing = this.spacing;
        
        // Create graphics object for drawing
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1); // White lines, 2px thick
        
        // Draw the grid and initialize grid cells array
        for (let row = 0; row < gridSize; row++) {
            this.gridCells[row] = [];
            for (let col = 0; col < gridSize; col++) {
                const x = 200 + col * (cellSize + spacing);
                const y = 350 + row * (cellSize + spacing);
                
                // Draw rectangle (outline only)
                graphics.strokeRect(x, y, cellSize, cellSize);
                
                // Store grid cell data
                this.gridCells[row][col] = {
                    x: x,
                    y: y,
                    occupied: false,
                    tool: null
                };
            }
        }
        
        // Spawn a Basic Hose at grid[0][0]
        this.spawnTool('Basic Hose', 0, 0);
        
        // Set up input handlers for drag and drop
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        this.input.on('dragend', (pointer, gameObject) => {
            // Find the nearest grid cell
            const cellPos = this.findNearestCell(gameObject.x, gameObject.y);
            
            if (cellPos) {
                const { row, col } = cellPos;
                const cell = this.gridCells[row][col];
                
                // If cell is empty, snap to it
                if (!cell.occupied) {
                    // Update the old cell to be unoccupied
                    if (gameObject.gridRow !== undefined && gameObject.gridCol !== undefined) {
                        this.gridCells[gameObject.gridRow][gameObject.gridCol].occupied = false;
                        this.gridCells[gameObject.gridRow][gameObject.gridCol].tool = null;
                    }
                    
                    // Move to new cell
                    gameObject.x = cell.x + this.cellSize / 2;
                    gameObject.y = cell.y + this.cellSize / 2;
                    cell.occupied = true;
                    cell.tool = gameObject;
                    gameObject.gridRow = row;
                    gameObject.gridCol = col;
                } else if (cell.tool && cell.tool !== gameObject && cell.tool.toolType === gameObject.toolType) {
                    // If cell has same type of tool, merge them
                    if (gameObject.toolType === 'Basic Hose') {
                        // Remove both tools
                        if (gameObject.gridRow !== undefined && gameObject.gridCol !== undefined) {
                            this.gridCells[gameObject.gridRow][gameObject.gridCol].occupied = false;
                            this.gridCells[gameObject.gridRow][gameObject.gridCol].tool = null;
                        }
                        
                        cell.occupied = false;
                        cell.tool = null;
                        
                        // Destroy both sprites
                        gameObject.destroy();
                        cell.tool.destroy();
                        
                        // Spawn a Reinforced Hose
                        this.spawnTool('Reinforced Hose', row, col);
                    }
                } else {
                    // Return to original position if cell is occupied by different tool
                    if (gameObject.gridRow !== undefined && gameObject.gridCol !== undefined) {
                        const originalCell = this.gridCells[gameObject.gridRow][gameObject.gridCol];
                        gameObject.x = originalCell.x + this.cellSize / 2;
                        gameObject.y = originalCell.y + this.cellSize / 2;
                    }
                }
            } else {
                // Return to original position if not over grid
                if (gameObject.gridRow !== undefined && gameObject.gridCol !== undefined) {
                    const originalCell = this.gridCells[gameObject.gridRow][gameObject.gridCol];
                    gameObject.x = originalCell.x + this.cellSize / 2;
                    gameObject.y = originalCell.y + this.cellSize / 2;
                }
            }
        });
    }
    
    spawnTool(toolType, row, col) {
        const cell = this.gridCells[row][col];
        
        // Create a colored rectangle as a placeholder for the tool sprite
        let color;
        if (toolType === 'Basic Hose') {
            color = 0x0000FF; // Blue for water tools
        } else if (toolType === 'Reinforced Hose') {
            color = 0x00AAFF; // Light blue for upgraded water tools
        } else {
            color = 0xFFFF00; // Yellow default
        }
        
        // Create a sprite (using a colored rectangle for now)
        const graphics = this.add.graphics();
        graphics.fillStyle(color, 1);
        graphics.fillRect(0, 0, this.cellSize - 10, this.cellSize - 10);
        graphics.generateTexture(toolType, this.cellSize - 10, this.cellSize - 10);
        graphics.clear();
        
        const tool = this.add.sprite(cell.x + this.cellSize / 2, cell.y + this.cellSize / 2, toolType);
        tool.toolType = toolType;
        tool.gridRow = row;
        tool.gridCol = col;
        
        // Make the tool draggable
        this.input.setDraggable(tool);
        
        // Update grid cell data
        cell.occupied = true;
        cell.tool = tool;
        
        // Add to tools array
        this.tools.push(tool);
        
        return tool;
    }
    
    findNearestCell(x, y) {
        // Find the grid cell closest to the given coordinates
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.gridCells[row][col];
                if (x >= cell.x && x < cell.x + this.cellSize &&
                    y >= cell.y && y < cell.y + this.cellSize) {
                    return { row, col };
                }
            }
        }
        return null;
    }
}