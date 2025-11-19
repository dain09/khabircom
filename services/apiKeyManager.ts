
const KEYS_STORAGE_KEY = 'gemini-api-keys';
const CURRENT_KEY_INDEX_KEY = 'gemini-current-api-key-index';

// Function to load keys from environment variable and store them if they don't exist
export const initializeApiKeys = () => {
    try {
        let keys: string[] = [];

        // 1. Try loading from localStorage
        try {
            const stored = localStorage.getItem(KEYS_STORAGE_KEY);
            if (stored) keys = JSON.parse(stored);
        } catch (e) {
            console.error("Error reading from localStorage", e);
        }

        // 2. Check Environment Variables (Vite & Standard)
        let envKeysString = '';
        
        // Check Vite env
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEYS) {
            envKeysString = import.meta.env.VITE_API_KEYS;
        } 
        // Check Standard Node env (fallback)
        // @ts-ignore
        else if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
             // @ts-ignore
            envKeysString = process.env.API_KEY;
        }

        if (envKeysString) {
            const newKeys = envKeysString.split(',').map(k => k.trim()).filter(k => k.length > 0);
            newKeys.forEach(key => {
                if (!keys.includes(key)) {
                    keys.push(key);
                }
            });
        }

        // 3. Save back to localStorage if we found keys
        if (keys.length > 0) {
            localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
            // Ensure index is set
            if (localStorage.getItem(CURRENT_KEY_INDEX_KEY) === null) {
                localStorage.setItem(CURRENT_KEY_INDEX_KEY, '0');
            }
            console.log(`Initialized with ${keys.length} API keys.`);
        }
    } catch (e) {
        console.error("Could not initialize API keys.", e);
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
    // Ensure index is valid
    if (index >= keys.length) {
        localStorage.setItem(CURRENT_KEY_INDEX_KEY, '0');
        return keys[0];
    }
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

export const addApiKey = (key: string): boolean => {
    try {
        const keys = getApiKeys();
        if (keys.includes(key)) {
            return false; // Key already exists
        }
        const newKeys = [...keys, key];
        localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(newKeys));
        // If it's the first key being added, set it as the current one.
        if (newKeys.length === 1) {
            localStorage.setItem(CURRENT_KEY_INDEX_KEY, '0');
        }
        return true;
    } catch (e) {
        console.error("Failed to add API key:", e);
        return false;
    }
};

export const deleteApiKey = (keyToDelete: string): void => {
    try {
        const keys = getApiKeys();
        const keyIndexToDelete = keys.indexOf(keyToDelete);
        if (keyIndexToDelete === -1) return;

        const currentIndex = getCurrentKeyIndex();
        const newKeys = keys.filter((_, index) => index !== keyIndexToDelete);

        localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(newKeys));

        if (newKeys.length === 0) {
            localStorage.setItem(CURRENT_KEY_INDEX_KEY, '0');
            return;
        }

        let newIndex = currentIndex;
        if (keyIndexToDelete < currentIndex) {
            newIndex = currentIndex - 1;
        } else if (keyIndexToDelete === currentIndex) {
            // The key at currentIndex was deleted. The "next" item is now at the same index.
            // If we deleted the last item, the index needs to be capped at the new last index.
            newIndex = Math.min(currentIndex, newKeys.length - 1);
        }
        // If keyIndexToDelete > currentIndex, index remains the same.

        localStorage.setItem(CURRENT_KEY_INDEX_KEY, newIndex.toString());

    } catch (e) {
        console.error("Failed to delete API key:", e);
    }
};
