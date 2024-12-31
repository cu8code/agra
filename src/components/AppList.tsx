import React, { useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useAppContext } from './SuperContext';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import Row from './Row';
import { useShortcuts } from '../KeyboardShortcutsContext';
import { RawItem } from '../types';

const AppList: React.FC = () => {
    const { rawItem, selectedIndex, setSelectedIndex } = useAppContext();
    const { registerShortcut } = useShortcuts();
    const listRef = useRef<List>(null);

    // Function to handle launching or copying emoji
    const handleSelect = async (app: RawItem) => {
        if (app.t === "app_details") {
            try {
                console.log('Launching application:', app.app_id);
                await invoke('launch_application', { desktopEntryId: app.app_id });
                await invoke('hide_window'); // Call to hide the window after launching
            } catch (error) {
                console.error('Error launching app:', error);
            }
        } else if (app.t === "emoji") {
            try {
                console.log('Copying emoji to clipboard:', app.glyph);
                await navigator.clipboard.writeText(app.glyph);
                console.log('Emoji copied to clipboard:', app.glyph);
                await invoke('hide_window'); // Call to hide the window after copying emoji
            } catch (error) {
                console.error('Failed to copy emoji:', error);
            }
        }
    };

    const clampIndex = (index: number) => {
        return Math.max(0, Math.min(index, Math.max(0, rawItem.length - 1)));
    };

    // Function to focus the selected row
    const focusSelectedRow = () => {
        const element = document.querySelector(`[data-index="${selectedIndex}"]`);
        if (element) {
            console.log('[AppList][Focus] Focusing element at index:', selectedIndex);
            (element as HTMLElement).focus();
            // Scroll the item into view if needed
            listRef.current?.scrollToItem(selectedIndex, 'smart');
        } else {
            console.log('[AppList][Focus] Element not found for index:', selectedIndex);
        }
    };

    useEffect(() => {
        console.log('[AppList] Initializing keyboard shortcuts');
        console.log(`[AppList] Total items available: ${rawItem.length}`);
        console.log(`[AppList] Current selected index: ${clampIndex(selectedIndex)}`);
        
        if (selectedIndex !== clampIndex(selectedIndex)) {
            console.log('[AppList] Initial index out of bounds, adjusting...');
            setSelectedIndex(clampIndex(selectedIndex));
        }

        const downShortcut = {
            key: 'ArrowDown',
            action: () => {
                console.log('[AppList][KeyPress] ↓ Down arrow pressed');
                setSelectedIndex(prev => {
                    const newIndex = clampIndex(prev + 1);
                    console.log(`[AppList][Navigation] Moving down from ${prev} to ${newIndex}`);
                    return newIndex;
                });
            },
        };

        const upShortcut = {
            key: 'ArrowUp',
            action: () => {
                console.log('[AppList][KeyPress] ↑ Up arrow pressed');
                setSelectedIndex(prev => {
                    const newIndex = clampIndex(prev - 1);
                    console.log(`[AppList][Navigation] Moving up from ${prev} to ${newIndex}`);
                    return newIndex;
                });
            },
        };

        const enterShortcut = {
            key: 'Enter',
            action: async () => {
                console.log('[AppList][KeyPress] Enter key pressed');
                const validIndex = clampIndex(selectedIndex);
                if (rawItem[validIndex]) {
                    await handleSelect(rawItem[validIndex]);  // Use handleSelect here
                } else {
                    console.log('[AppList][Launch] No application selected or invalid index:', validIndex);
                }
            },
        };

        registerShortcut(downShortcut);
        registerShortcut(upShortcut);
        registerShortcut(enterShortcut);

        console.log('[AppList] All keyboard shortcuts registered successfully');

        return () => {
            console.log('[AppList] Cleaning up keyboard shortcuts');
        };
    }, [rawItem, selectedIndex, setSelectedIndex, registerShortcut]);

    // Effect to handle focus when selectedIndex changes
    useEffect(() => {
        console.log('[AppList][Focus] Selection changed, updating focus');
        focusSelectedRow();
    }, [selectedIndex]);

    return (
        <div
            className="flex-1 overflow-y-auto"
            role="listbox"
            tabIndex={0}
        >
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        height={height}
                        itemCount={rawItem.length}
                        itemSize={50}
                        width={width}
                    >
                        {({ index, style }) => (
                            <Row
                                key={`row-${index}`}
                                data-index={index}
                                index={index}
                                style={style}
                                app={rawItem[index]}
                                handleSelect={handleSelect}  // Pass handleSelect to Row
                            />
                        )}
                    </List>
                )}
            </AutoSizer>
        </div>
    );
};

export default AppList;
