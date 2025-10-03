import React from 'react';
import { MapPin } from 'lucide-react';
import GoogleMapComponent from '../common/GoogleMap';
import { PickupLocation } from '../../types';

interface PickupLocationModalProps {
  location: PickupLocation;
  onClose: () => void;
}

const PickupLocationModal: React.FC<PickupLocationModalProps> = ({ location, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full dark:bg-gray-800">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            موقع الاستلام
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {location.address}
          </p>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${location.latitude},${location.longitude}`);
              }}
              className="text-primary hover:text-primary-dark flex items-center gap-2"
            >
              <MapPin size={16} />
              نسخ الإحداثيات
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark flex items-center gap-2"
            >
              <MapPin size={16} />
              فتح في خرائط جوجل
            </a>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden">
          <GoogleMapComponent
            latitude={location.latitude}
            longitude={location.longitude}
            height="300px"
          />
        </div>
      </div>
    </div>
  );
};

export default PickupLocationModal;