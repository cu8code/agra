import React, { useEffect, useState } from 'react';
import { useAppContext } from '../SuperContext';
import { invoke } from '@tauri-apps/api/core';
import { Emoji } from '../types';
import { useShortcuts } from '../KeyboardShortcutsContext'; // Adjust the path as necessary
import EmojiCard from './EmojiCard'; // Adjust the path as necessary

const Emojis: React.FC = () => {
	const { search } = useAppContext();
	const { registerShortcut, unregisterShortcut } = useShortcuts();
	const [rawItem, setRawItem] = useState<Emoji[]>([]);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	useEffect(() => {
		const query = async () => {
			try {
				let result_emojis = (await invoke('query_emojis', { query: search }) as Emoji[]);
				console.log({ result_emojis });
				setRawItem(result_emojis);
				setSelectedIndex(null); // Reset selection when search changes
			} catch (error) {
				console.error('Error querying emojis:', error);
			}
		};

		query();
	}, [search]); // Add search as a dependency to re-query on change

	useEffect(() => {
		const upShortcut = {
			key: 'ArrowUp',
			action: () => {
				setSelectedIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
			},
		};

		const downShortcut = {
			key: 'ArrowDown',
			action: () => {
				setSelectedIndex(prev => (prev !== null && prev < rawItem.length - 1 ? prev + 1 : prev));
			},
		};

		const leftShortcut = {
			key: 'ArrowLeft',
			action: () => {
				setSelectedIndex(prev => (prev !== null && prev % 4 !== 0 ? prev - 1 : prev)); // Move left
			},
		};

		const rightShortcut = {
			key: 'ArrowRight',
			action: () => {
				setSelectedIndex(prev => (prev !== null && prev < rawItem.length - 1 ? prev + 1 : prev)); // Move right
			},
		};

		const enterShortcut = {
			key: 'Enter',
			action: () => {
				if (selectedIndex !== null) {
					handleEmojiClick(selectedIndex);
				}
			},
		};

		registerShortcut(upShortcut);
		registerShortcut(downShortcut);
		registerShortcut(leftShortcut);
		registerShortcut(rightShortcut);
		registerShortcut(enterShortcut);

		return () => {
			unregisterShortcut(upShortcut.key);
			unregisterShortcut(downShortcut.key);
			unregisterShortcut(leftShortcut.key);
			unregisterShortcut(rightShortcut.key);
			unregisterShortcut(enterShortcut.key);
		};
	}, [registerShortcut, unregisterShortcut, rawItem.length, selectedIndex]);

	const handleEmojiClick = async (index: number) => {
		const emoji = rawItem[index];
		try {
			await navigator.clipboard.writeText(emoji.glyph); // Copy emoji to clipboard
			console.log(`Copied to clipboard: ${emoji.glyph}`);
			invoke('hide_window')
		} catch (error) {
			console.error('Failed to copy emoji:', error);
		}
	};

	return (
		<div className="grid grid-cols-4 grid-row-2 gap-4 w-full">
			{rawItem.map((emoji, index) => (
				<EmojiCard
					key={index}
					emoji={emoji}
					isSelected={selectedIndex === index}
					onClick={() => handleEmojiClick(index)}
				/>
			))}
		</div>
	);
};

export default Emojis;
