class GameState {
    static coins = 0;
    static gems = 0;
    static energy = 100;
    static level = 1;
    static xp = 0;
    static districts = ['Harborview'];

    static addCoins(amount) {
        this.coins += amount;
        console.log(`Added ${amount} coins. Total: ${this.coins}`);
        return this.coins;
    }

    static spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            console.log(`Spent ${amount} coins. Remaining: ${this.coins}`);
            return true;
        } else {
            console.log(`Not enough coins. Have: ${this.coins}, Need: ${amount}`);
            return false;
        }
    }

    static addXP(amount) {
        this.xp += amount;
        console.log(`Added ${amount} XP. Total: ${this.xp}`);
        
        // Level up if XP reaches 100
        if (this.xp >= 100) {
            this.level += 1;
            this.xp -= 100;
            console.log(`Leveled up to ${this.level}!`);
        }
        
        return this.xp;
    }

    static unlockDistrict(name, cost, requiredTool) {
        // Check if district is already unlocked
        if (this.districts.includes(name)) {
            console.log(`${name} is already unlocked.`);
            return false;
        }
        
        // Check if player has enough coins
        if (this.coins < cost) {
            console.log(`Not enough coins to unlock ${name}. Need ${cost}, have ${this.coins}.`);
            return false;
        }
        
        // In a real implementation, we would check if the player has the required tool
        // For now, we'll just log it
        console.log(`Checking for required tool: ${requiredTool}`);
        
        // Deduct cost and unlock district
        this.coins -= cost;
        this.districts.push(name);
        console.log(`Unlocked ${name}! Remaining coins: ${this.coins}`);
        return true;
    }

    static getGameData() {
        return {
            coins: this.coins,
            gems: this.gems,
            energy: this.energy,
            level: this.level,
            xp: this.xp,
            districts: [...this.districts]
        };
    }

    static loadGameData(data) {
        if (!data) return false;
        
        this.coins = data.coins || 0;
        this.gems = data.gems || 0;
        this.energy = data.energy || 100;
        this.level = data.level || 1;
        this.xp = data.xp || 0;
        this.districts = data.districts || ['Harborview'];
        
        console.log('Game data loaded successfully');
        return true;
    }
}