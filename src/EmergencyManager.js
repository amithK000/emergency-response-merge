class EmergencyManager {
    constructor() {
        this.emergencies = [];
    }

    spawnEmergency(type, district, duration) {
        const emergency = {
            id: Date.now(),
            type,
            district,
            duration,
            timeLeft: duration
        };
        
        this.emergencies.push(emergency);
        return emergency;
    }

    update(delta) {
        // Update timeLeft for each emergency (delta is in milliseconds)
        this.emergencies.forEach(emergency => {
            emergency.timeLeft -= delta / 1000; // Convert to seconds
        });

        // Remove expired emergencies
        this.emergencies = this.emergencies.filter(emergency => emergency.timeLeft > 0);
    }

    resolveEmergency(id, vehicle) {
        const emergencyIndex = this.emergencies.findIndex(emergency => emergency.id === id);
        
        if (emergencyIndex !== -1) {
            const emergency = this.emergencies[emergencyIndex];
            
            // Remove the emergency from the array
            this.emergencies.splice(emergencyIndex, 1);
            
            // Calculate reward based on time left and emergency type
            if (emergency.timeLeft > 0) {
                // Base reward is 50 coins
                let reward = 50;
                
                // Bonus reward for quick response (more than 50% time left)
                if (emergency.timeLeft > emergency.duration / 2) {
                    reward += 25; // Additional 25 coins for quick response
                }
                
                // Different rewards based on emergency type
                if (emergency.type === 'fire') {
                    // Fires are more dangerous, higher reward
                    reward += 10;
                } else if (emergency.type === 'medical') {
                    // Medical emergencies are critical
                    reward += 15;
                }
                
                console.log(`Emergency resolved! Earned ${reward} coins`);
                return reward;
            } else {
                console.log('Emergency expired before resolution');
            }
        } else {
            console.log('Emergency not found');
        }
        
        return 0; // No reward if emergency not found or expired
    }
}