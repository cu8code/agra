import React, { createContext, useContext, useState, FC } from 'react';
import { SuperContextType, RawItem } from '../types';

const SuperContext = createContext<SuperContextType | undefined>(undefined);

export const AppProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rawItem, setRawItem] = useState<RawItem[]>([]);
    const [search, setSearch] = useState<string>('');
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const resetState = () => {
        setRawItem([]);
        setSearch('');
        setSelectedIndex(0);
    };

    return (
        <SuperContext.Provider value={{ rawItem, setRawItem, search, setSearch, selectedIndex, setSelectedIndex, resetState }}>
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
