import { useState, useEffect } from 'react';
import { getAllFunds } from '../services/fund.service';
import { getAllAssets } from '../services/asset.service';
import { recordInvestment } from '../services/invest.service';
import './InvestPage.css';

const InvestPage = () => {
  const [funds, setFunds] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    fund_id: '',
    asset_id: '',
    price: '',
    count: '',
    transaction_type: 'buy',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fundsData, assetsData] = await Promise.all([
          getAllFunds(),
          getAllAssets()
        ]);
        const fundsArray = Object.values(fundsData);
        setFunds(fundsArray);
        setAssets(assetsData);

        // Set default fund if available
        if (fundsArray.length > 0) {
          setFormData(prev => ({ ...prev, fund_id: fundsArray[0].id }));
        }
        // Set default asset if available
        if (assetsData.length > 0) {
          setFormData(prev => ({ ...prev, asset_id: assetsData[0].id }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.fund_id) {
      errors.fund_id = 'Please select a fund';
    }

    if (!formData.asset_id) {
      errors.asset_id = 'Please select an asset';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (!formData.count || parseFloat(formData.count) <= 0) {
      errors.count = 'Quantity must be greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Prepare investment data
      const investData = {
        fund_id: parseInt(formData.fund_id),
        asset_id: parseInt(formData.asset_id),
        price: parseFloat(formData.price),
        count: formData.transaction_type === 'buy'
          ? parseFloat(formData.count)
          : -parseFloat(formData.count),
      };

      const message = await recordInvestment(investData);
      setSuccessMessage(message);

      // Reset form
      setFormData({
        fund_id: funds.length > 0 ? funds[0].id : '',
        asset_id: assets.length > 0 ? assets[0].id : '',
        price: '',
        count: '',
        transaction_type: 'buy',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAsset = assets.find(a => a.id === parseInt(formData.asset_id));

  return (
    <div className="invest-page">
      <header className="page-header">
        <h1>Record Investment</h1>
      </header>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-banner">
          {successMessage}
        </div>
      )}

      {!loading && (
        <form className="invest-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Transaction Type</h2>
            <div className="transaction-type-buttons">
              <button
                type="button"
                className={`type-btn ${formData.transaction_type === 'buy' ? 'active buy' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, transaction_type: 'buy' }))}
              >
                BUY
              </button>
              <button
                type="button"
                className={`type-btn ${formData.transaction_type === 'sell' ? 'active sell' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, transaction_type: 'sell' }))}
              >
                SELL
              </button>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="fund_id" className="form-label">
                Fund <span className="required">*</span>
              </label>
              <select
                id="fund_id"
                name="fund_id"
                value={formData.fund_id}
                onChange={handleChange}
                className={`form-select ${formErrors.fund_id ? 'error' : ''}`}
              >
                {funds.map(fund => (
                  <option key={fund.id} value={fund.id}>
                    {fund.name}
                  </option>
                ))}
              </select>
              {formErrors.fund_id && <span className="error-message">{formErrors.fund_id}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="asset_id" className="form-label">
                Asset <span className="required">*</span>
              </label>
              <select
                id="asset_id"
                name="asset_id"
                value={formData.asset_id}
                onChange={handleChange}
                className={`form-select ${formErrors.asset_id ? 'error' : ''}`}
              >
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.code}) - {asset.category}
                  </option>
                ))}
              </select>
              {formErrors.asset_id && <span className="error-message">{formErrors.asset_id}</span>}
            </div>
          </div>

          {selectedAsset && (
            <div className="asset-info-card">
              <h3>Asset Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Current Price:</span>
                  <span className="info-value">{selectedAsset.price?.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Currency:</span>
                  <span className="info-value">{selectedAsset.currency}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Buy Price:</span>
                  <span className="info-value">{selectedAsset.buy?.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sell Price:</span>
                  <span className="info-value">{selectedAsset.sell?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`form-input ${formErrors.price ? 'error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {formErrors.price && <span className="error-message">{formErrors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="count" className="form-label">
                  Quantity <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="count"
                  name="count"
                  value={formData.count}
                  onChange={handleChange}
                  className={`form-input ${formErrors.count ? 'error' : ''}`}
                  placeholder="0"
                  step="0.01"
                  min="0"
                />
                {formErrors.count && <span className="error-message">{formErrors.count}</span>}
              </div>
            </div>
          </div>

          {formData.price && formData.count && (
            <div className="total-amount-card">
              <span className="total-label">Total Amount:</span>
              <span className="total-value">
                {(parseFloat(formData.price) * parseFloat(formData.count)).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          )}

          <button
            type="submit"
            className={`submit-btn ${formData.transaction_type}`}
            disabled={submitting}
          >
            {submitting ? 'Recording...' : `Record ${formData.transaction_type.toUpperCase()}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default InvestPage;
