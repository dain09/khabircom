
const KEYS_STORAGE_KEY = 'gemini-api-keys';
const CURRENT_KEY_INDEX_KEY = 'gemini-current-api-key-index';

// Function to load keys from environment variable and store them if they don't exist
export const initializeApiKeys = () => {
    try {
        const storedKeys = localStorage.getItem(KEYS_STORAGE_KEY);
        // Only initialize from env var if localStorage is empty
        if (storedKeys === null || JSON.parse(storedKeys).length === 0) {
            // In Vite, environment variables are accessed via import.meta.env
            const envKeys = import.meta.env.VITE_API_KEYS;
            if (envKeys) {
                const keysArray = envKeys.split(',').map(k => k.trim()).filter(Boolean);
                if (keysArray.length > 0) {
                    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keysArray));
                    localStorage.setItem(CURRENT_KEY_INDEX_KEY, '0');
                    console.log(`Initialized with ${keysArray.length} API keys from environment variable.`);
                }
            }
        }
    } catch (e) {
        console.error("Could not initialize API keys from environment variables.", e);
    }
};

export const getApiKeys = (): string[] => {
    try {
        const keysJson = localStorage.getItem(KEYS_STORAGE_KEY);
        return keysJson ? JSON.parse(keysJson) : [];
    } catch (e) {
        return [];
    }
};

const getCurrentKeyIndex = (): number => {
    return parseInt(localStorage.getItem(CURRENT_KEY_INDEX_KEY) || '0', 10);
};

export const getCurrentApiKey = (): string | undefined => {
    const keys = getApiKeys();
    if (keys.length === 0) return undefined;
    const index = getCurrentKeyIndex();
    return keys[index];
};

export const rotateToNextKey = (): string | undefined => {
    const keys = getApiKeys();
    if (keys.length <= 1) return keys[0]; // No rotation if 0 or 1 key

    const currentIndex = getCurrentKeyIndex();
    const nextIndex = (currentIndex + 1) % keys.length; // Loop back to the start
    localStorage.setItem(CURRENT_KEY_INDEX_KEY, nextIndex.toString());
    
    return keys[nextIndex];
};