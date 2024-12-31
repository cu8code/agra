import React from 'react';
import SearchBar from './components/SearchBar';
import AppList from './components/AppList';
import Footer from './components/Footer';
import { AppProvider } from './components/SuperContext';
import { ShortcutsProvider } from './KeyboardShortcutsContext';

const App: React.FC = () => {
    return (
        <div className="flex flex-col h-screen w-full bg-gray-800 border border-gray-700">
            <main className="flex flex-col flex-1 min-h-0">
                <SearchBar />
                <div className="w-full h-[1px] bg-gray-700" />
                <AppList />
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
