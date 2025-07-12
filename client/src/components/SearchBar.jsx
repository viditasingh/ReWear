import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search items...", 
  className = '',
  showSuggestions = true,
  showFilters = false,
  initialValue = '',
  autoFocus = false
}) => {
  const [query, setQuery] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const mockSuggestions = [
    'Vintage denim jacket',
    'Summer dress',
    'Nike sneakers',
    'Leather handbag',
    'Wool sweater',
    'Black jeans',
    'Casual shirt',
    'Designer shoes'
  ];

  const mockTrending = [
    'Vintage jackets',
    'Summer dresses',
    'Sneakers',
    'Handbags',
    'Jeans'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    
    // Set trending searches
    setTrendingSearches(mockTrending);
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 0 && showSuggestions) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filtered = mockSuggestions.filter(item =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setLoading(false);
      }, 200);
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  const performSearch = (searchQuery) => {
    // Save to recent searches
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(item => item !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    
    // Close dropdown
    setShowDropdown(false);
    
    // Perform search
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/items?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeRecentSearch = (searchToRemove) => {
    const updated = recentSearches.filter(item => item !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        
        {showFilters && (
          <button
            type="button"
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <Filter className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {showDropdown && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          )}
          
          {!loading && (
            <>
              {/* Current query suggestion */}
              {query && (
                <div className="p-2 border-b border-gray-100">
                  <button
                    onClick={() => performSearch(query)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                  >
                    <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-900 truncate">
                      Search for "<span className="font-medium">{query}</span>"
                    </span>
                  </button>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <div className="text-xs text-gray-500 px-2 py-1 mb-1">Suggestions</div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                    >
                      <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Recent searches */}
              {recentSearches.length > 0 && !query && (
                <div className="p-2 border-b border-gray-100">
                  <div className="flex items-center justify-between px-2 py-1 mb-1">
                    <span className="text-xs text-gray-500">Recent searches</span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center group">
                      <button
                        onClick={() => handleSuggestionClick(search)}
                        className="flex-1 text-left p-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                      >
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 truncate">{search}</span>
                      </button>
                      <button
                        onClick={() => removeRecentSearch(search)}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full transition-opacity"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Trending searches */}
              {trendingSearches.length > 0 && !query && (
                <div className="p-2">
                  <div className="text-xs text-gray-500 px-2 py-1 mb-1">Trending</div>
                  {trendingSearches.map((trending, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(trending)}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                    >
                      <TrendingUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 truncate">{trending}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {!loading && query && suggestions.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No suggestions found
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
