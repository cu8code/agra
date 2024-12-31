import React from 'react';
import { Command } from 'lucide-react';

const Footer: React.FC = () => (
    <div className="flex justify-between items-center px-5 py-3 text-sm text-gray-400 border-t border-gray-700">
        <div className="flex items-center space-x-2">
            <Command size={16} />
            <span>App Launcher</span>
        </div>
        <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
                <span>↑↓</span>
                <span>to Navigate</span>
            </div>
            <div className="flex items-center space-x-2">
                <span>Enter</span>
                <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">↵</span>
                <span>to Launch</span>
            </div>
        </div>
    </div>
);

export default Footer;
