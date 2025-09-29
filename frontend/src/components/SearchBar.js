import React, { useState, useEffect } from 'react';
import { useOrganizationsStore } from '../stores/organizationsStore';

const SearchBar = () => {
  const [localQuery, setLocalQuery] = useState('');
  const { 
    searchQuery, 
    searchOrganizations, 
    clearSearch, 
    loading 
  } = useOrganizationsStore();

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localQuery !== searchQuery) {
        if (localQuery.trim()) {
          searchOrganizations(localQuery);
        } else {
          clearSearch();
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, searchQuery, searchOrganizations, clearSearch]);

  const handleClear = () => {
    setLocalQuery('');
    clearSearch();
  };

  return (
    <div className="search-container">
      <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search organizations by name..."
          className="search-input"
          disabled={loading}
        />
        
        {localQuery && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: '18px',
              padding: '0',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>
      
      {searchQuery && (
        <div style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.875rem', 
          color: '#6b7280' 
        }}>
          Searching for: "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;