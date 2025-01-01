import React, { useEffect, useRef } from 'react';
import { Emoji } from '../types';

interface EmojiCardProps {
    emoji: Emoji;
    isSelected: boolean;
    onClick: () => void;
}

const EmojiCard: React.FC<EmojiCardProps> = ({ emoji, isSelected, onClick }) => {
    const cardRef = useRef<HTMLButtonElement | null>(null);

    // Auto focus the card if it is selected
    useEffect(() => {
        if (isSelected && cardRef.current) {
            cardRef.current.focus();
        }
    }, [isSelected]);

    return (
        <button
            ref={cardRef}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            className={`p-6 rounded-lg shadow-lg transition-transform duration-200 cursor-pointer flex flex-col items-center w-32 ${
                isSelected ? 'bg-gray-200' : 'bg-gray-700'
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            tabIndex={0} // Make button focusable
        >
            <div className="text-4xl text-white">{emoji.glyph /* icon */}</div>
            <div className="text-lg mt-2 text-center truncate text-white" style={{ maxWidth: '80%' }}>
                {emoji.name.slice(0, 10)}
            </div>
        </button>
    );
};

export default EmojiCard;
