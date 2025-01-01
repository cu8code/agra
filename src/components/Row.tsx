import React, { useEffect } from 'react';
import { AppDetails } from '../types';
import { useAppContext } from '../SuperContext';
import { cn } from '../utils'; // Adjust the import path accordingly

type RowProps = {
  index: number;
  app: AppDetails;
  handleSelect: (app: AppDetails) => Promise<void>;
  className?: string; // Optional additional class names
};

const Row: React.FC<RowProps> = ({ index, app, handleSelect, className }) => {
  const { selectedIndex } = useAppContext();

  useEffect(() => {
    console.log(`Row rendered: index=${index}, selectedIndex=${selectedIndex}, isSelected=${selectedIndex === index}`);
  }, [index, selectedIndex]);

  const isSelected = index === selectedIndex;

  const handleRowSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelect(app);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200",
        isSelected ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-400',
        className
      )}
      onClick={handleRowSelect}
      tabIndex={0} // Make it focusable
    >
      <div>
        <strong>{app.name}</strong>
        <div className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>{app.description}</div>
      </div>
    </div>
  );
};

export default Row;

