import React, { useState } from 'react';
import { useAppContext } from '../SuperContext';

const SearchBar: React.FC = () => {
    const { search, setSearch, page, setPage } = useAppContext();
    const [backspaceCount, setBackspaceCount] = useState(0); // Track backspace presses

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.trimEnd(); // Automatically remove trailing spaces
        setSearch(newValue);

        // Reset backspace count when user types
        if (backspaceCount > 0) {
            setBackspaceCount(0);
        }

        // Check if input is for changing pages
        if (['settings', 'emojis'].includes(newValue) && newValue !== page) {
            setPage(newValue as any);
            setSearch(''); // Clear input after page change
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (search === '') {
                setBackspaceCount((prev) => prev + 1);
                if (backspaceCount === 1) {
                    setPage('app'); // Set page to 'app' after two backspaces
                    setBackspaceCount(0); // Reset count after action
                }
            }
        } else {
            setBackspaceCount(0); // Reset count for non-backspace keys
        }
    };

    const handleBackButtonClick = () => {
        setPage('app'); // Set page back to 'app'
    };

    return (
        <div className="flex items-center w-full px-5 py-3">
            {page !== 'app' && (
                <button
                    onClick={handleBackButtonClick}
                    className="mr-4 text-white bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded focus:outline-none transition duration-200 ease-in-out"
                >
                    Back
                </button>
            )}
            <div className="flex-1">
                <input
                    className="w-full text-xl text-white bg-transparent placeholder-gray-400 px-4 py-2 rounded focus:outline-none focus:ring-0"
                    id="search-input"
                    value={search}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search applications or type 'settings' or 'emojis'..."
                    autoFocus
                />
            </div>
        </div>
    );
};

export default SearchBar;
