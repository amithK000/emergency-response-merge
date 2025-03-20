class GamePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GamePlay' });
    }

    create() {
        // Set background color to sky blue
        this.cameras.main.setBackgroundColor('#87CEEB');

        // Launch the MergeGrid scene as a parallel scene
        this.scene.launch('MergeGrid');
    }
}