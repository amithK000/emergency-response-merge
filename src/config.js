// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MainMenuScene, GamePlayScene, MergeGridScene]
};

// Initialize the game
const game = new Phaser.Game(config);