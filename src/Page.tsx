import React from 'react';
import AppList from './components/AppList'; // Import your existing AppList component
import Settings from './components/Settings'; // Placeholder for Settings component
import Emojis from './components/Emojis'; // Placeholder for Emojis component
import { useAppContext } from './SuperContext';

const Page: React.FC = () => {
	const { page } = useAppContext(); // Get the current page from context

	const renderContent = () => {
		switch (page) {
			case 'app':
				return <AppList />;
			case 'settings':
				return <Settings />; // Replace with your actual settings component
			case 'emojis':
				return <Emojis />; // Replace with your actual emojis component
			default:
				return <>You are in a forbiden page and something went wrong; lets the devs know how; see the logs</>; // Fallback to AppList if page is unknown
		}
	};

	return (
		<div className="flex-1 overflow-y-auto w-full">
			{renderContent()}
		</div>
	);
};

export default Page;
