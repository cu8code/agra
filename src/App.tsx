import React, { useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import { AppProvider } from './SuperContext';
import { ShortcutsProvider, useShortcuts } from './KeyboardShortcutsContext';
import { invoke } from '@tauri-apps/api/core';
import Page from './Page';

const App: React.FC = () => {
	const { registerShortcut, unregisterShortcut } = useShortcuts();

	useEffect(() => {
		// Registering the Escape key shortcut
		const hideWindowShortcut = {
			key: 'Escape',
			action: () => {
				invoke('hide_window')
			},
		};

		registerShortcut(hideWindowShortcut);

		// Cleanup function to unregister the shortcut on component unmount
		return () => {
			unregisterShortcut('Escape');
		};
	}, [registerShortcut, unregisterShortcut]);

	return (
		<div className="flex flex-col h-screen w-full bg-gray-800 border border-gray-700">
			<main className="flex flex-col flex-1 min-h-0">
				<SearchBar />
				<div className="w-full h-[1px] bg-gray-700" />
				<Page />
			</main>
			<Footer />
		</div>
	);
};

const WrapSuperContext = () => {
	return (
		<AppProvider>
			<ShortcutsProvider>
				<App />
			</ShortcutsProvider>
		</AppProvider>
	);
};

export default WrapSuperContext;
