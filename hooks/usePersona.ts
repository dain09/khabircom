
import { useContext } from 'react';
import { PersonaContext } from '../contexts/PersonaContext';

export const usePersona = () => {
    const context = useContext(PersonaContext);
    if (context === undefined) {
        throw new Error('usePersona must be used within a PersonaProvider');
    }
    return context;
};
