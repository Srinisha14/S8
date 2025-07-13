// ✅ components/SearchInput.js

import React, { useState, useEffect } from 'react';

const SearchInput = ({ onSearch, initialQuery }) => {
  const [localQuery, setLocalQuery] = useState(initialQuery || '');

  useEffect(() => {
    setLocalQuery(initialQuery || '');
  }, [initialQuery]);

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        className="search-input"
        value={localQuery}
        onChange={handleChange}
        placeholder="Search courses..."
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
