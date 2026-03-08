import { useState } from 'react';
import { CategoryList } from '../types/asset.types';
import './AddAssetModal.css';

const AddAssetModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: CategoryList[0],
    code: '',
    currency: 'WON',
    top: '',
    bottom: '',
    sell: '',
    buy: '',
    ema: '',
    ndays: '20',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      // Convert string values to numbers
      const assetData = {
        name: formData.name.trim(),
        category: formData.category,
        code: formData.code.trim(),
        currency: formData.currency,
        top: formData.top ? parseFloat(formData.top) : 0,
        bottom: formData.bottom ? parseFloat(formData.bottom) : 0,
        sell: formData.sell ? parseFloat(formData.sell) : 0,
        buy: formData.buy ? parseFloat(formData.buy) : 0,
        ema: formData.ema ? parseFloat(formData.ema) : 0,
        ndays: formData.ndays ? parseInt(formData.ndays) : 20,
      };

      await onAdd(assetData);

      // Reset form
      setFormData({
        name: '',
        category: CategoryList[0],
        code: '',
        currency: 'WON',
        top: '',
        bottom: '',
        sell: '',
        buy: '',
        ema: '',
        ndays: '20',
      });
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New Asset</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g., Apple Inc."
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-select ${errors.category ? 'error' : ''}`}
              >
                {CategoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="currency" className="form-label">
                Currency <span className="required">*</span>
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={`form-select ${errors.currency ? 'error' : ''}`}
              >
                <option value="WON">WON</option>
                <option value="USD">USD</option>
              </select>
              {errors.currency && <span className="error-message">{errors.currency}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="code" className="form-label">Code/Ticker</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., AAPL"
            />
          </div>

          <div className="form-section">
            <h3 className="section-title">Price Settings</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="buy" className="form-label">Buy Price</label>
                <input
                  type="number"
                  id="buy"
                  name="buy"
                  value={formData.buy}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sell" className="form-label">Sell Price</label>
                <input
                  type="number"
                  id="sell"
                  name="sell"
                  value={formData.sell}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bottom" className="form-label">Bottom</label>
                <input
                  type="number"
                  id="bottom"
                  name="bottom"
                  value={formData.bottom}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="top" className="form-label">Top</label>
                <input
                  type="number"
                  id="top"
                  name="top"
                  value={formData.top}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">EMA Settings (Optional)</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ema" className="form-label">EMA Value</label>
                <input
                  type="number"
                  id="ema"
                  name="ema"
                  value={formData.ema}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ndays" className="form-label">Period (Days)</label>
                <input
                  type="number"
                  id="ndays"
                  name="ndays"
                  value={formData.ndays}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="20"
                  min="1"
                />
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="submit-error">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAssetModal;
