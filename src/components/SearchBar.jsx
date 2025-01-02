import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, onClear, showClear }) => {
  const [inputValue, setInputValue] = useState('');

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  return (
    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          placeholder="Search herbs..."
          onChange={(e) => {
            setInputValue(e.target.value);
            onSearch(e.target.value);
          }}
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        {showClear && (
          <X
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            size={20}
            onClick={handleClear}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;