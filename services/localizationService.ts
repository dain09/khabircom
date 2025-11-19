
// A simple i18n service
// In a larger app, you might use a library like i18next

let translations: any = {};

export type TFunction = (key: string, options?: { [key: string]: any }) => any;

/**
 * Fetches and loads the translations from the JSON file.
 */
export async function initializeLocalization() {
    try {
        const response = await fetch('/locales/ar.json');
        if (!response.ok) {
            throw new Error(`Failed to load translations: ${response.statusText}`);
        }
        translations = await response.json();
    } catch (error) {
        console.error("Could not initialize localization:", error);
        // Fallback to an empty object to prevent crashes
        translations = {};
    }
}

/**
 * A simple translation function.
 * It supports nested keys like 'parent.child.key' and replacements.
 * @param key The key for the translation string.
 * @param options An object for replacements, e.g., { name: 'John' } for "Hello, {{name}}".
 *                Also supports `returnObjects: true` to return a whole object/array from JSON.
 */
export const t: TFunction = (key, options) => {
    let string = key.split('.').reduce((obj, k) => obj && obj[k], translations);

    if (string === undefined) {
        console.warn(`Translation key not found: "${key}"`);
        return key; // Return the key itself as a fallback
    }

    if (options?.returnObjects && (typeof string === 'object' || Array.isArray(string))) {
        return string;
    }

    if (typeof string !== 'string') {
        console.warn(`Translation for key "${key}" is not a string. Did you mean to use 'returnObjects: true'?`);
        return key;
    }

    if (options) {
        Object.keys(options).forEach(placeholder => {
            if (placeholder !== 'returnObjects') {
                const regex = new RegExp(`{{${placeholder}}}`, 'g');
                string = string.replace(regex, options[placeholder]);
            }
        });
    }

    return string;
};
