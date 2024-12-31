import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useAppContext } from './SuperContext';
import { AppDetails, Emoji, HistoryEntry } from '../types';

const SearchBar: React.FC = () => {
	const { search, setSearch, setRawItem } = useAppContext();
	const [searchTimeout, setSearchTimeout] = useState<any | null>(null);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		console.log('Search input changed:', newValue); // Log the new search input
		setSearch(newValue);

		// Clear previous timeout if it exists
		if (searchTimeout) {
			clearTimeout(searchTimeout);
			console.log('Cleared previous search timeout');
		}

		// Set a new timeout
		const timeoutId = setTimeout(async () => {
			console.log('Executing search query for:', newValue); // Log before executing the query
			try {
				let result_app = (await invoke('query_app', { query: newValue }) as AppDetails[]);
				let result_history = (await invoke('query_history', { query: newValue }) as HistoryEntry[]);
				let result_emojis = (await invoke('query_emojis', { query: newValue }) as Emoji[]);

				console.log('Search results:', {
					result_app,
					result_history,
					result_emojis,
				});

				setRawItem([...result_app, ...result_emojis]); // Update raw items with the result
			} catch (error) {
				console.error('Error querying apps:', error);
			}
		}, 300); // Adjust cooldown duration as needed

		setSearchTimeout(timeoutId);
	};

	return (
		<form className="flex w-full p-5" onSubmit={(e) => e.preventDefault()}>
			<input
				className="w-full bg-transparent text-xl text-white placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-transparent"
				id="search-input"
				value={search}
				onChange={handleSearchChange}
				placeholder="Search applications..."
				autoFocus
			/>
		</form>
	);
};

export default SearchBar;
