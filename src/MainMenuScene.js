class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Add title text
        this.add.text(400, 200, 'Emergency Response Merge', {
            fontSize: '32px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add start game text
        this.add.text(400, 300, 'Click to Start', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Add input event to transition to GamePlay scene
        this.input.on('pointerdown', () => {
            this.scene.start('GamePlay');
        });
    }
}