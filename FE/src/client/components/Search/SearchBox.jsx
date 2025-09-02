import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchService } from '../../services/searchService';
import './SearchBox.css';

// Utility function to remove Vietnamese accents
const removeAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

const SearchBox = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        fetchSuggestions(searchTerm.trim());
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (keyword) => {
    try {
      setLoading(true);
      const response = await SearchService.getSearchSuggestions(keyword);
      
      if (response?.products) {
        // Filter and highlight matching products
        const filteredSuggestions = response.products.filter(product => {
          const productTitle = product.title.toLowerCase();
          const searchLower = keyword.toLowerCase();
          const productTitleNoAccent = removeAccents(productTitle);
          const searchNoAccent = removeAccents(searchLower);
          
          return productTitle.includes(searchLower) || 
                 productTitleNoAccent.includes(searchNoAccent);
        });

        setSuggestions(filteredSuggestions);
        setShowSuggestions(filteredSuggestions.length > 0);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/products/detail/${product.slug}`);
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const searchLower = searchTerm.toLowerCase();
    const searchNoAccent = removeAccents(searchLower);
    const textLower = text.toLowerCase();
    const textNoAccent = removeAccents(textLower);
    
    // Find match position (with or without accents)
    let matchIndex = textLower.indexOf(searchLower);
    if (matchIndex === -1) {
      matchIndex = textNoAccent.indexOf(searchNoAccent);
    }
    
    if (matchIndex === -1) return text;
    
    const matchLength = searchTerm.length;
    const beforeMatch = text.substring(0, matchIndex);
    const match = text.substring(matchIndex, matchIndex + matchLength);
    const afterMatch = text.substring(matchIndex + matchLength);
    
    return (
      <>
        {beforeMatch}
        <strong className="highlight">{match}</strong>
        {afterMatch}
      </>
    );
  };

  return (
    <div className={`search-box ${className}`} ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        <button 
          className="search-btn"
          onClick={handleSearch}
          disabled={!searchTerm.trim()}
        >
          {loading ? '⏳' : '🔍'}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions" ref={suggestionsRef}>
          {suggestions.map((product, index) => (
            <div
              key={product._id}
              className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(product)}
            >
              <div className="suggestion-image">
                <img src={product.thumbnail} alt={product.title} />
              </div>
              <div className="suggestion-content">
                <div className="suggestion-title">
                  {highlightMatch(product.title, searchTerm)}
                </div>
                <div className="suggestion-price">
                  ₫{product.price?.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          
          <div className="suggestion-footer">
            <button 
              className="view-all-btn"
              onClick={handleSearch}
            >
              Xem tất cả kết quả cho "{searchTerm}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
