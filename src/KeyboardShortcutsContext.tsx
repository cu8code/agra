import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface Shortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
}

interface ShortcutsContextType {
    registerShortcut: (shortcut: Shortcut) => void;
    unregisterShortcut: (key: string) => void; // Add unregister function
}

const ShortcutsContext = createContext<ShortcutsContextType | undefined>(undefined);

export const ShortcutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([]); // Use state for shortcuts

    const registerShortcut = useCallback((shortcut: Shortcut) => {
        setShortcuts(prev => [...prev, shortcut]);
    }, []);

    const unregisterShortcut = useCallback((key: string) => {
        setShortcuts(prev => prev.filter(shortcut => shortcut.key !== key));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                if (
                    event.key === shortcut.key &&
                    (!shortcut.ctrl || event.ctrlKey) &&
                    (!shortcut.shift || event.shiftKey) &&
                    (!shortcut.alt || event.altKey)
                ) {
                    event.preventDefault();
                    shortcut.action();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [shortcuts]);

    return (
        <ShortcutsContext.Provider value={{ registerShortcut, unregisterShortcut }}>
            {children}
        </ShortcutsContext.Provider>
    );
};

export const useShortcuts = () => {
    const context = useContext(ShortcutsContext);
    if (!context) {
        throw new Error('useShortcuts must be used within a ShortcutsProvider');
    }
    return context;
};
