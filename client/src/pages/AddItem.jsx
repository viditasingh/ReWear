import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { useCreateItemMutation } from '../store/api/itemsApi';
import { useImageUpload } from '../hooks/useImageUpload';
import { itemValidator } from '../utils/validators';
import { CATEGORIES, SIZES, CONDITIONS } from '../utils/constants';
import { showToast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import FileUpload from '../components/ui/FileUpload';

const AddItem = () => {
  const navigate = useNavigate();
  const [createItem, { isLoading }] = useCreateItemMutation();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { uploadFiles, uploadedImages, isLoading: uploadLoading } = useImageUpload({
    onSuccess: (images) => {
      setValue('images', images);
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemValidator),
    defaultValues: {
      availableForSwap: true,
      images: [],
    }
  });

  const watchCategory = watch('category');
  
  const onSubmit = async (data) => {
    try {
      const itemData = {
        ...data,
        tags,
        images: uploadedImages,
      };
      
      const result = await createItem(itemData).unwrap();
      showToast.success('Item listed successfully!');
      navigate(`/item/${result.id}`);
    } catch (error) {
      showToast.error(error.message || 'Failed to create item');
    }
  };

  const handleImageUpload = (files) => {
    uploadFiles(files);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const getSizesForCategory = (category) => {
    switch (category) {
      case 'shoes':
        return SIZES.shoes;
      case 'accessories':
        return SIZES.accessories;
      default:
        return SIZES.clothing;
    }
  };

  const calculatePointsValue = (condition, category) => {
    const basePoints = {
      'tops': 30,
      'bottoms': 35,
      'dresses': 50,
      'outerwear': 60,
      'shoes': 40,
      'accessories': 25,
      'activewear': 35,
      'formal': 70,
    };

    const conditionMultiplier = CONDITIONS.find(c => c.id === condition)?.value || 50;
    const base = basePoints[category] || 30;
    
    return Math.round((base * conditionMultiplier) / 100);
  };

  // Auto-calculate points when condition or category changes
  React.useEffect(() => {
    const category = watch('category');
    const condition = watch('condition');
    
    if (category && condition) {
      const points = calculatePointsValue(condition, category);
      setValue('pointsValue', points);
    }
  }, [watch('category'), watch('condition'), setValue]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Item</h1>
          <p className="text-gray-600">
            Share your pre-loved items with the ReWear community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Images */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
            <p className="text-gray-600 mb-4">
              Add up to 5 photos to showcase your item. The first photo will be the main image.
            </p>
            
            <FileUpload
              onFileSelect={handleImageUpload}
              accept="image/*"
              multiple
              maxSize={5 * 1024 * 1024} // 5MB
            />
            
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {errors.images && (
              <p className="text-red-500 text-sm mt-2">{errors.images.message}</p>
            )}
          </Card>

          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Vintage Denim Jacket"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  {...register('brand')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Levi's"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <select
                  {...register('size')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select size</option>
                  {getSizesForCategory(watchCategory).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                {errors.size && (
                  <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  {...register('condition')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select condition</option>
                  {CONDITIONS.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.name}
                    </option>
                  ))}
                </select>
                {errors.condition && (
                  <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  {...register('color')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Navy Blue"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe your item in detail. Include any flaws, measurements, or special features..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </Card>

          {/* Tags */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
            <p className="text-gray-600 mb-4">
              Add tags to help people find your item (e.g., vintage, minimalist, boho)
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </Card>

          {/* Swap Settings */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Swap Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points Value
                </label>
                <input
                  {...register('pointsValue', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Auto-calculated based on condition and category"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Points are automatically calculated based on your item's condition and category
                </p>
              </div>

              <div className="flex items-center">
                <input
                  {...register('availableForSwap')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Available for item swaps (not just points)
                </label>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || uploadLoading}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Publishing...' : 'Publish Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;