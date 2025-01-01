import React, { createContext, useContext, useState, FC } from 'react';
import { SuperContextType } from './types';

const SuperContext = createContext<SuperContextType | undefined>(undefined);

export const AppProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [search, setSearch] = useState<string>('');
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [page, setPage] = useState<'app' | 'settings' | 'emojis'>('app'); // New page state

    const resetState = () => {
        setSearch('');
        setSelectedIndex(0);
        setPage('app'); // Reset page to default
    };

    return (
        <SuperContext.Provider value={{ 
            search, 
            setSearch, 
            selectedIndex, 
            setSelectedIndex,
            page, // Provide the page state
            setPage, // Provide the method to update the page
            resetState 
        }}>
            {children}
        </SuperContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(SuperContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
