import React, { useEffect } from 'react';
import { RawItem } from '../types';
import { useAppContext } from './SuperContext';

type RowProps = {
  index: number;
  style: React.CSSProperties;
  app: RawItem;
	handleSelect: (app: RawItem) => Promise<void>;
};

const Row: React.FC<RowProps> = ({ index, style, app,  handleSelect }) => {
	const { selectedIndex } = useAppContext();

  useEffect(() => {
    console.log(`Row rendered: index=${index}, selectedIndex=${selectedIndex}, isSelected=${selectedIndex === index}`);
  }, [index, selectedIndex]);

  const isSelected = index === selectedIndex;
  
  // Highlight only when selected
  const baseClasses =
    'flex items-center justify-between p-3 rounded-lg cursor-pointer group transition-colors duration-150';
  const dynamicClasses = isSelected ? 'bg-gray-700' : ''; // Highlight only when selected

  let content;

  switch (app.t) {
    case 'app_details':
      content = (
        <div
          key={app.icon_path}
          className={`${baseClasses} ${dynamicClasses}`}
          style={style}
          onClick={() => handleSelect(app)}
        >
          <div className="flex items-center space-x-2 text-gray-200 group-hover:text-white transition-colors duration-150">
            <div className="font-bold">{app.name}</div>
            <div className="text-sm font-semibold text-gray-400">{app.description}</div>
          </div>
        </div>
      );
      break;

    case 'icon_details':
      content = (
        <div
          key={app.name}
          className={`${baseClasses} ${dynamicClasses}`}
          style={style}
          onClick={() => handleSelect(app)}
        >
          <div className="flex items-center space-x-2 text-gray-200 group-hover:text-white transition-colors duration-150">
            <svg
              dangerouslySetInnerHTML={{ __html: app.svg }}
              className="w-[100px] h-[100px] overflow-hidden"
            />
            <div className="font-bold">{app.name}</div>
          </div>
        </div>
      );
      break;

    case 'emoji':
      content = (
        <div
          key={app.name}
          className={`${baseClasses} ${dynamicClasses}`}
          style={style}
          onClick={() => handleSelect(app)} // Copy emoji and hide window on click
        >
          <div className="flex items-center space-x-2 text-gray-200 group-hover:text-white transition-colors duration-150">
            <div className="font-bold">{app.name}</div>
            <div className="font-bold">{app.glyph}</div>
          </div>
        </div>
      );
      break;

    default:
      content = (
        <div style={style} className="p-3 text-gray-500">
          Unknown
        </div>
      );
  }

  return content;
};

export default Row;
