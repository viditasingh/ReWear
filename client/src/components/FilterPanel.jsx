import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Button from './Button';
import Input from './Input';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  categories = [],
  brands = [],
  sizes = [],
  isOpen = false,
  onToggle,
  showSearch = true
}) => {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    category: '',
    brand: '',
    size: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'newest',
    ...filters
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: false,
    size: false,
    condition: true,
    price: false,
    location: false
  });

  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'eco_points', label: 'Eco Points' }
  ];

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      brand: '',
      size: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      sortBy: 'newest'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.entries(localFilters).filter(([key, value]) => {
      if (key === 'sortBy' || key === 'search') return false;
      return value && value !== '';
    }).length;
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  if (!isOpen) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={onToggle}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>
        
        {/* Sort dropdown */}
        <select
          value={localFilters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFiltersCount() > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
          )}
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search items..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      )}

      {/* Category */}
      <FilterSection title="Category" section="category">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={localFilters.category === ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">All Categories</span>
          </label>
          {categories.map(category => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={localFilters.category === category.id}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {category.name} ({category.count || 0})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" section="brand">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="brand"
              value=""
              checked={localFilters.brand === ''}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">All Brands</span>
          </label>
          {brands.map(brand => (
            <label key={brand} className="flex items-center">
              <input
                type="radio"
                name="brand"
                value={brand}
                checked={localFilters.brand === brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size" section="size">
        <div className="grid grid-cols-3 gap-2">
          {sizes.map(size => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                value={size}
                checked={localFilters.size.includes(size)}
                onChange={(e) => {
                  const currentSizes = localFilters.size.split(',').filter(s => s);
                  if (e.target.checked) {
                    handleFilterChange('size', [...currentSizes, size].join(','));
                  } else {
                    handleFilterChange('size', currentSizes.filter(s => s !== size).join(','));
                  }
                }}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{size}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Condition */}
      <FilterSection title="Condition" section="condition">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="condition"
              value=""
              checked={localFilters.condition === ''}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Any Condition</span>
          </label>
          {conditions.map(condition => (
            <label key={condition} className="flex items-center">
              <input
                type="radio"
                name="condition"
                value={condition}
                checked={localFilters.condition === condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{condition}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Eco Points Range" section="price">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Points</label>
              <Input
                type="number"
                placeholder="0"
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Points</label>
              <Input
                type="number"
                placeholder="100"
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location" section="location">
        <Input
          type="text"
          placeholder="Enter city or area..."
          value={localFilters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        />
      </FilterSection>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={localFilters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
