import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface DeliverySettings {
  baseCost: number;
  freeDeliveryThreshold: number;
}

const DeliverySettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<DeliverySettings>({
    baseCost: 0,
    freeDeliveryThreshold: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'delivery');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings(docSnap.data() as DeliverySettings);
      }
    } catch (error) {
      console.error('Error fetching delivery settings:', error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحميل الإعدادات' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await setDoc(doc(db, 'settings', 'delivery'), settings);
      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' });
    } catch (error) {
      console.error('Error saving delivery settings:', error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الإعدادات' });
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
        <h1 className="section-title mb-8 dark:text-gray-100">إعدادات التوصيل</h1>

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
                <label htmlFor="baseCost" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  تكلفة التوصيل الأساسية
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="baseCost"
                    value={settings.baseCost}
                    onChange={(e) => setSettings(prev => ({ ...prev, baseCost: Number(e.target.value) }))}
                    className="input-field pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                    min="0"
                    step="0.01"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">ج.م</span>
                </div>
              </div>

              <div>
                <label htmlFor="freeDeliveryThreshold" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  الحد الأدنى للطلب للتوصيل المجاني
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="freeDeliveryThreshold"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) => setSettings(prev => ({ ...prev, freeDeliveryThreshold: Number(e.target.value) }))}
                    className="input-field pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-primary-light"
                    min="0"
                    step="0.01"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">ج.م</span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  إذا كان إجمالي الطلب أكبر من أو يساوي هذا المبلغ، سيتم التوصيل مجاناً
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors dark:bg-primary-dark dark:hover:bg-primary"
            disabled={saving}
          >
            <Save className="h-5 w-5" />
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default DeliverySettingsPage; 