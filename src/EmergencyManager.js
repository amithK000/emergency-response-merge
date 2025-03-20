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
            
            // Return reward if resolved before time runs out
            if (emergency.timeLeft > 0) {
                return 50; // Award 50 coins
            }
        }
        
        return 0; // No reward if emergency not found or expired
    }
}