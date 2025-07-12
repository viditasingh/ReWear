import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Modal from './ui/Modal';

const ImageGallery = ({ images, alt, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const imageList = Array.isArray(images) ? images : [images];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const openModal = (index) => {
    setModalIndex(index);
    setIsModalOpen(true);
    setZoom(1);
    setRotation(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoom(1);
    setRotation(0);
  };

  const nextModalImage = () => {
    setModalIndex((prev) => (prev + 1) % imageList.length);
    setZoom(1);
    setRotation(0);
  };

  const prevModalImage = () => {
    setModalIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    setZoom(1);
    setRotation(0);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  if (imageList.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  if (imageList.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={imageList[0]}
          alt={alt}
          className="w-full h-full object-cover rounded-lg cursor-pointer"
          onClick={() => openModal(0)}
        />
        <button
          onClick={() => openModal(0)}
          className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        
        {/* Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          className="max-w-full max-h-full"
        >
          <div className="relative w-full h-screen flex items-center justify-center bg-black">
            <img
              src={imageList[modalIndex]}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease'
              }}
            />
            
            {/* Controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={zoomOut}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={zoomIn}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={rotate}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={closeModal}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          src={imageList[currentIndex]}
          alt={alt}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => openModal(currentIndex)}
        />
        
        {/* Navigation arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        
        {/* Zoom button */}
        <button
          onClick={() => openModal(currentIndex)}
          className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        
        {/* Image counter */}
        {imageList.length > 1 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-sm rounded">
            {currentIndex + 1} / {imageList.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail Strip */}
      {imageList.length > 1 && (
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? 'border-primary-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        className="max-w-full max-h-full"
      >
        <div className="relative w-full h-screen flex items-center justify-center bg-black">
          <img
            src={imageList[modalIndex]}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease'
            }}
          />
          
          {/* Navigation arrows */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={prevModalImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextModalImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          
          {/* Controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={zoomOut}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={zoomIn}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={rotate}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={closeModal}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Image counter */}
          {imageList.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded">
              {modalIndex + 1} / {imageList.length}
            </div>
          )}
          
          {/* Thumbnail strip in modal */}
          {imageList.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2 overflow-x-auto pb-2">
              {imageList.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setModalIndex(index);
                    setZoom(1);
                    setRotation(0);
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === modalIndex
                      ? 'border-primary-500'
                      : 'border-gray-400 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ImageGallery;
