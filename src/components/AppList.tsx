import React, { useEffect, useRef, useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useAppContext } from '../SuperContext';
import { useShortcuts } from '../KeyboardShortcutsContext';
import { AppDetails } from '../types';
import Row from './Row';

const AppList: React.FC = () => {
    const { selectedIndex, setSelectedIndex, search } = useAppContext();
    const { registerShortcut, unregisterShortcut } = useShortcuts();
    const shortcutsRegistered = useRef(false);
    const [rawItem, setRawItem] = useState<AppDetails[]>([]);

    // Function to handle launching the application
    const handleSelect = useCallback(async (app: AppDetails) => {
        try {
            console.log('Launching application:', app.app_id);
            await invoke('launch_application', { desktopEntryId: app.app_id });
            await invoke('hide_window');
        } catch (error) {
            console.error('Error launching app:', error);
        }
    }, []);

    const clampIndex = (index: number) => Math.max(0, Math.min(index, rawItem.length - 1));

    // Register and unregister shortcuts
    useEffect(() => {
        if (!shortcutsRegistered.current) {
            registerShortcut({ key: 'ArrowDown', action: () => setSelectedIndex(prev => clampIndex(prev + 1)) });
            registerShortcut({ key: 'ArrowUp', action: () => setSelectedIndex(prev => clampIndex(prev - 1)) });
            registerShortcut({ key: 'Enter', action: async () => {
                const validIndex = clampIndex(selectedIndex);
                if (rawItem[validIndex]) await handleSelect(rawItem[validIndex]);
            }});
            shortcutsRegistered.current = true;
        }

        return () => {
            unregisterShortcut('ArrowDown');
            unregisterShortcut('ArrowUp');
            unregisterShortcut('Enter');
            shortcutsRegistered.current = false;
        };
    }, [rawItem, selectedIndex, handleSelect, registerShortcut, unregisterShortcut]);

    // Fetch applications based on search
    useEffect(() => {
        const fetchApps = async () => {
            if (!search.trim()) {
                setRawItem([]); // Clear list if no search
                return;
            }
            try {
                console.log('Fetching applications for search:', search);
                const apps = await invoke<AppDetails[]>('query_app', { query: search });
                setRawItem(apps);
            } catch (error) {
                console.error('Error fetching applications:', error);
                setRawItem([]);
            }
        };

        fetchApps();
    }, [search]);

    return (
        <div
            className="flex-1 overflow-y-auto"
            role="listbox"
            tabIndex={0}
        >
            {rawItem.map((item, index) => (
                <Row
                    key={item.app_id} // Use a stable unique key
                    index={index}
                    app={item}
                    handleSelect={() => handleSelect(rawItem[selectedIndex])}
                />
            ))}
        </div>
    );
};

export default AppList;
