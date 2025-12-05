'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, ChevronUp, X, Filter, DollarSign, 
  Star, Package, Tag
} from 'lucide-react';
import { PRICE_RANGES, RATING_OPTIONS } from '@/lib/constants';

interface AdvancedFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  categories: string[];
}

export default function AdvancedFilters({ filters, onFilterChange, categories }: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['price', 'category']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({ search: '', sort_by: 'created_at', sort_order: 'desc' });
  };

  const activeFiltersCount = Object.keys(filters).filter(
    k => k !== 'sort_by' && k !== 'sort_order' && filters[k]
  ).length;

  const priceRanges = PRICE_RANGES;
  const ratingOptions = RATING_OPTIONS;

  const stockOptions = [
    { label: 'In Stock', value: 'in_stock' },
    { label: 'Low Stock (< 5)', value: 'low_stock' },
    { label: 'Out of Stock', value: 'out_of_stock' },
  ];

  const discountOptions = [
    { label: 'On Sale', value: 'any' },
    { label: '10% Off or More', value: 10 },
    { label: '25% Off or More', value: 25 },
    { label: '50% Off or More', value: 50 },
  ];

  const FilterSection = ({ 
    title, 
    icon: Icon, 
    section 
  }: { 
    title: string; 
    icon: any; 
    section: string;
  }) => {
    const isExpanded = expandedSections.has(section);
    
    return (
      <div className="border-b last:border-b-0">
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-900">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {isExpanded && (
          <div className="px-4 pb-4">
            {section === 'price' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Min Price</Label>
                    <Input
                      type="number"
                      placeholder="$0"
                      value={filters.min_price || ''}
                      onChange={(e) => updateFilter('min_price', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Max Price</Label>
                    <Input
                      type="number"
                      placeholder="Any"
                      value={filters.max_price || ''}
                      onChange={(e) => updateFilter('max_price', e.target.value)}
                      className="h-8"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <Button
                      key={range.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateFilter('min_price', range.min);
                        updateFilter('max_price', range.max);
                      }}
                      className="text-xs h-7"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {section === 'category' && (
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === cat}
                      onChange={() => updateFilter('category', cat)}
                      className="text-indigo-600"
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
                {filters.category && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter('category')}
                    className="w-full text-xs"
                  >
                    Clear Category
                  </Button>
                )}
              </div>
            )}

            {section === 'rating' && (
              <div className="space-y-2">
                {ratingOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.min_rating == option.value}
                      onChange={() => updateFilter('min_rating', option.value)}
                      className="text-indigo-600"
                    />
                    <div className="flex items-center">
                      <span className="text-sm mr-1">{option.label}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </label>
                ))}
                {filters.min_rating && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter('min_rating')}
                    className="w-full text-xs"
                  >
                    Clear Rating
                  </Button>
                )}
              </div>
            )}

            {section === 'stock' && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.in_stock_only || false}
                    onChange={(e) => updateFilter('in_stock_only', e.target.checked)}
                    className="text-indigo-600"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
              </div>
            )}

            {section === 'discount' && (
              <div className="space-y-2">
                {discountOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="discount"
                      checked={filters.discount_min == option.value}
                      onChange={() => updateFilter('discount_min', option.value)}
                      className="text-indigo-600"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
                {filters.discount_min && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter('discount_min')}
                    className="w-full text-xs"
                  >
                    Clear Discount
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="sticky top-4 border-gray-200">
      <CardHeader className="bg-gray-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="default">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-7"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <FilterSection title="Price Range" icon={DollarSign} section="price" />
        <FilterSection title="Category" icon={Package} section="category" />
        <FilterSection title="Customer Rating" icon={Star} section="rating" />
        <FilterSection title="Availability" icon={Package} section="stock" />
        <FilterSection title="Discounts & Deals" icon={Tag} section="discount" />
      </CardContent>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs font-medium text-gray-700 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.min_price && (
              <Badge variant="outline" className="text-xs">
                Min: ${filters.min_price}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => clearFilter('min_price')}
                />
              </Badge>
            )}
            {filters.max_price && (
              <Badge variant="outline" className="text-xs">
                Max: ${filters.max_price}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => clearFilter('max_price')}
                />
              </Badge>
            )}
            {filters.category && (
              <Badge variant="outline" className="text-xs">
                {filters.category}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => clearFilter('category')}
                />
              </Badge>
            )}
            {filters.min_rating && (
              <Badge variant="outline" className="text-xs">
                {filters.min_rating}★+
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => clearFilter('min_rating')}
                />
              </Badge>
            )}
            {filters.in_stock_only && (
              <Badge variant="outline" className="text-xs">
                In Stock
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => clearFilter('in_stock_only')}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
