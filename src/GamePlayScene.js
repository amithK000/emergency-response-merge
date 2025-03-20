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
        
        // Add XP display if not already added
        if (!this.xpText) {
            this.xpText = this.add.text(200, 20, `XP: ${GameState.xp} / 100 (Level ${GameState.level})`, {
                fontSize: '18px',
                fill: '#fff'
            });
        } else {
            this.xpText.setText(`XP: ${GameState.xp} / 100 (Level ${GameState.level})`);
        }
    }
    
    showRewardAnimation(x, y, amount) {
        // Create floating text animation for reward
        const rewardText = this.add.text(x, y, `+${amount}`, {
            fontSize: '24px',
            fill: '#FFFF00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(100)
        .setAlpha(1)
        .setScale(0.5)
        .setData('created', Date.now())
        .setData('duration', 1500);
        
        // Animate the reward text floating up and fading out
        this.tweens.add({
            targets: rewardText,
            y: y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 1500,
            ease: 'Power2'
        });
        
        return rewardText;
    }
    
    showMessage(text, color = '#FFFFFF') {
        // Create a message at the bottom of the screen
        const message = this.add.text(400, 550, text, {
            fontSize: '20px',
            fill: color,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(100)
        .setAlpha(1)
        .setData('created', Date.now())
        .setData('duration', 2000);
        
        // Animate the message fading out
        this.tweens.add({
            targets: message,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
        });
        
        return message;
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
        
        // Update vehicle cooldown if active
        if (this.vehicle && this.vehicle.cooldown > 0) {
            this.vehicle.cooldown -= 1/60; // Decrease by approximately 1 second (assuming 60 FPS)
            if (this.vehicle.cooldown < 0) this.vehicle.cooldown = 0;
        }
        
        // Remove any expired reward animations
        this.children.list.forEach(child => {
            if (child.getData('created') && child.getData('duration')) {
                const elapsed = Date.now() - child.getData('created');
                if (elapsed > child.getData('duration')) {
                    child.destroy();
                }
            }
        });
    }
    
    handleEmergencyClick(emergency) {
        // Check if vehicle is available
        if (this.vehicle && this.vehicle.cooldown === 0) {
            console.log('Vehicle dispatched to emergency');
            
            // Create dispatch animation
            const sprite = this.emergencySprites[emergency.id];
            if (sprite) {
                // Create a vehicle sprite that moves from bottom to emergency
                const vehicleSprite = this.add.rectangle(400, 500, 30, 20, this.vehicle.type === 'firetruck' ? 0xFF0000 : 0xFFFFFF);
                
                // Animate vehicle moving to emergency
                this.tweens.add({
                    targets: vehicleSprite,
                    x: sprite.x,
                    y: sprite.y,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        // Remove vehicle sprite
                        vehicleSprite.destroy();
                        
                        // Resolve the emergency
                        const reward = this.emergencyManager.resolveEmergency(emergency.id, this.vehicle);
                        
                        // Add coins to game state
                        if (reward > 0) {
                            GameState.addCoins(reward);
                            GameState.addXP(10);
                            
                            // Show reward animation
                            this.showRewardAnimation(sprite.x, sprite.y, reward);
                            
                            // Show success message
                            this.showMessage('Emergency resolved!', '#00FF00');
                        } else {
                            // Show failure message if no reward
                            this.showMessage('Emergency expired!', '#FF0000');
                        }
                    }
                });
                
                // Set vehicle cooldown
                this.vehicle.cooldown = 30; // 30 seconds cooldown
            }
        } else {
            console.log('No vehicle available or vehicle on cooldown');
            this.showMessage('Vehicle on cooldown!', '#FF9900');
        }
    }
}