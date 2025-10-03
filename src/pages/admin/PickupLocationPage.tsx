import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import GoogleMapComponent from '../../components/common/GoogleMap';

interface PickupLocationSettings {
  latitude: number;
  longitude: number;
  address: string;
}

const PickupLocationPage: React.FC = () => {
  const [settings, setSettings] = useState<PickupLocationSettings>({
    latitude: 30.0444,  // Default to Cairo coordinates
    longitude: 31.2357,
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'pickup');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings(docSnap.data() as PickupLocationSettings);
      }
    } catch (error) {
      console.error('Error fetching pickup location settings:', error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحميل إعدادات موقع الاستلام' });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setSettings(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await setDoc(doc(db, 'settings', 'pickup'), settings);
      setMessage({ type: 'success', text: 'تم حفظ موقع الاستلام بنجاح' });
    } catch (error) {
      console.error('Error saving pickup location settings:', error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ موقع الاستلام' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-light"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="section-title mb-8 dark:text-gray-100">إعدادات موقع الاستلام</h1>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.type === 'success' ? 'bg-success/10 text-success dark:bg-success-dark/20 dark:text-success-light' : 'bg-error/10 text-error dark:bg-error-dark/20 dark:text-error-light'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6 dark:bg-gray-800 dark:shadow-gray-700">
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  عنوان موقع الاستلام
                </label>
                <input
                  type="text"
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                  placeholder="العنوان التفصيلي لموقع الاستلام"
                  required
                />
              </div>

              <div className="h-[400px] rounded-lg overflow-hidden">
                <GoogleMapComponent
                  latitude={settings.latitude}
                  longitude={settings.longitude}
                  onLocationSelect={handleLocationChange}
                  isSelectable={true}
                  zoom={15}
                />
              </div>

              <div className="flex gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    خط العرض
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    value={settings.latitude}
                    onChange={(e) => setSettings(prev => ({ ...prev, latitude: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                    step="any"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    خط الطول
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    value={settings.longitude}
                    onChange={(e) => setSettings(prev => ({ ...prev, longitude: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                    step="any"
                    required
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                يمكنك تحديد الموقع عن طريق النقر على الخريطة أو إدخال خطوط الطول والعرض يدوياً
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors dark:bg-primary-dark dark:hover:bg-primary"
            disabled={saving}
          >
            <Save className="h-5 w-5" />
            {saving ? 'جاري الحفظ...' : 'حفظ موقع الاستلام'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PickupLocationPage;