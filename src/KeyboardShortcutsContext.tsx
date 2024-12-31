import React, { createContext, useContext, useEffect } from 'react';

interface Shortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
}

interface ShortcutsContextType {
    registerShortcut: (shortcut: Shortcut) => void;
}

const ShortcutsContext = createContext<ShortcutsContextType | undefined>(undefined);

export const ShortcutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const shortcuts: Shortcut[] = [];

    const registerShortcut = (shortcut: Shortcut) => {
        shortcuts.push(shortcut);
    };

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
        <ShortcutsContext.Provider value={{ registerShortcut }}>
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
