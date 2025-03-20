class SaveManager {
    static saveGame(data) {
        try {
            // Convert data object to JSON string
            const jsonData = JSON.stringify(data);
            
            // Save to localStorage
            localStorage.setItem('emergencyResponseMerge', jsonData);
            
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    }

    static loadGame() {
        try {
            // Get data from localStorage
            const jsonData = localStorage.getItem('emergencyResponseMerge');
            
            // If no data exists, return empty object
            if (!jsonData) {
                console.log('No saved game found, starting new game');
                return {};
            }
            
            // Parse JSON string to object
            const data = JSON.parse(jsonData);
            
            console.log('Game loaded successfully');
            return data;
        } catch (error) {
            console.error('Error loading game:', error);
            return {};
        }
    }
}