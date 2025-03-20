class GamePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GamePlay' });
    }

    create() {
        // Set background color to sky blue
        this.cameras.main.setBackgroundColor('#87CEEB');

        // Create a city map background (placeholder rectangle)
        const graphics = this.add.graphics();
        graphics.fillStyle(0x555555, 0.8); // Dark gray with some transparency
        graphics.fillRect(100, 50, 600, 300);
        graphics.lineStyle(2, 0xFFFFFF, 1); // White border
        graphics.strokeRect(100, 50, 600, 300);
        
        // Add a title for the map
        this.add.text(400, 30, 'City Map', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        // Initialize emergency manager
        this.emergencyManager = new EmergencyManager();
        
        // Spawn a test emergency
        const emergency = this.emergencyManager.spawnEmergency('fire', 'Harborview', 60);
        
        // Create a visual representation of the emergency
        this.emergencySprites = {};
        this.createEmergencySprite(emergency);
        
        // Create a test vehicle
        this.vehicle = new Vehicle('firetruck');
        this.vehicle.addTool('Basic Hose');
        console.log('Vehicle tools:', this.vehicle.tools);
        
        // Display game state information
        this.coinsText = this.add.text(50, 20, `Coins: ${GameState.coins}`, {
            fontSize: '18px',
            fill: '#fff'
        });
        
        // Launch the MergeGrid scene as a parallel scene
        this.scene.launch('MergeGrid');
    }
    
    update(time, delta) {
        // Update emergency manager
        this.emergencyManager.update(delta);
        
        // Update emergency visuals
        this.updateEmergencyVisuals();
        
        // Update coins display
        this.coinsText.setText(`Coins: ${GameState.coins}`);
        
        // Log emergencies for testing
        console.log('Emergencies:', this.emergencyManager.emergencies);
    }
    
    createEmergencySprite(emergency) {
        // Define positions for different districts
        const districtPositions = {
            'Harborview': { x: 200, y: 100 }
        };
        
        const pos = districtPositions[emergency.district] || { x: 400, y: 200 };
        
        // Create a circle for the emergency
        let color;
        if (emergency.type === 'fire') {
            color = 0xFF0000; // Red for fire
        } else if (emergency.type === 'medical') {
            color = 0xFFFFFF; // White for medical
        } else {
            color = 0xFFFF00; // Yellow for other
        }
        
        // Create a sprite for the emergency
        const graphics = this.add.graphics();
        graphics.fillStyle(color, 1);
        graphics.fillCircle(0, 0, 15);
        graphics.generateTexture(`emergency_${emergency.type}`, 30, 30);
        graphics.clear();
        
        const sprite = this.add.sprite(pos.x, pos.y, `emergency_${emergency.type}`);
        
        // Add pulsing animation
        this.tweens.add({
            targets: sprite,
            scale: { from: 0.8, to: 1.2 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Make it interactive
        sprite.setInteractive();
        sprite.on('pointerdown', () => this.handleEmergencyClick(emergency));
        
        // Store the sprite reference
        this.emergencySprites[emergency.id] = sprite;
        
        return sprite;
    }
    
    updateEmergencyVisuals() {
        // Remove sprites for resolved emergencies
        for (const id in this.emergencySprites) {
            const found = this.emergencyManager.emergencies.find(e => e.id.toString() === id.toString());
            if (!found) {
                this.emergencySprites[id].destroy();
                delete this.emergencySprites[id];
            }
        }
        
        // Add sprites for new emergencies
        this.emergencyManager.emergencies.forEach(emergency => {
            if (!this.emergencySprites[emergency.id]) {
                this.createEmergencySprite(emergency);
            }
        });
    }
    
    handleEmergencyClick(emergency) {
        // Check if vehicle is available
        if (this.vehicle && this.vehicle.cooldown === 0) {
            console.log('Vehicle dispatched to emergency');
            
            // Resolve the emergency
            const reward = this.emergencyManager.resolveEmergency(emergency.id, this.vehicle);
            
            // Add coins to game state
            if (reward > 0) {
                GameState.addCoins(reward);
                GameState.addXP(10);
                
                // Show reward animation
                const sprite = this.emergencySprites[emergency.id];
                if (sprite) {
                    this.add.text(sprite.x, sprite.y, `+${reward}`, {
                        fontSize: '24px',
                        fill: '#FFFF00'
                    }).setOrigin(0.5).setDepth(100)
                    .setAlpha(1)
                    .setScale(0.5)
                    .setData('created', Date.now())
                    .setData('duration', 1500);
                }
            }
            
            // Set vehicle cooldown
            this.vehicle.cooldown = 30; // 30 seconds cooldown
        } else {
            console.log('No vehicle available or vehicle on cooldown');
        }
    }
}