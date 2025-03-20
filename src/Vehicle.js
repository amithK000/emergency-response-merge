class Vehicle {
    constructor(type) {
        this.type = type; // 'firetruck' or 'ambulance'
        this.tools = [];
        this.energy = 100;
        this.cooldown = 0;
    }

    addTool(tool) {
        this.tools.push(tool);
    }
}