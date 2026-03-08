import { useState, useEffect } from 'react';
import { getAllAssets, addAsset, formatPrice, calculatePricePosition } from '../services/asset.service';
import { CategoryList } from '../types/asset.types';
import AddAssetModal from '../components/AddAssetModal';
import './AssetsPage.css';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const assetsData = await getAllAssets();
        setAssets(assetsData);
        setFilteredAssets(assetsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    let filtered = assets;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(asset => asset.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssets(filtered);
  }, [searchTerm, selectedCategory, assets]);

  const categories = ['All', ...CategoryList];

  const handleAddAsset = async (assetData) => {
    const newAsset = await addAsset(assetData);
    setAssets(prev => [...prev, newAsset]);
  };

  return (
    <div className="assets-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Assets</h1>
          <button
            className="add-asset-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Asset
          </button>
        </div>
      </header>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by name or code..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <main className="page-content">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading assets...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <h2>Error Loading Assets</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && filteredAssets.length === 0 && (
          <div className="empty-state">
            <p>No assets found</p>
          </div>
        )}

        {!loading && !error && filteredAssets.length > 0 && (
          <div className="assets-list">
            {filteredAssets.map((asset) => {
              const position = calculatePricePosition(asset.price, asset.buy, asset.sell);
              const isNearBuy = position < 30;
              const isNearSell = position > 70;

              return (
                <div key={asset.id} className="asset-card">
                  <div className="asset-header">
                    <div className="asset-info">
                      <h3 className="asset-name">{asset.name}</h3>
                      <div className="asset-meta">
                        <span className="asset-code">{asset.code}</span>
                        <span className="asset-category">{asset.category}</span>
                      </div>
                    </div>
                    <div className="asset-price">
                      <div className="current-price">
                        {formatPrice(asset.price, asset.currency)}
                      </div>
                      <div className="currency-badge">{asset.currency}</div>
                    </div>
                  </div>

                  <div className="price-range">
                    <div className="range-labels">
                      <span className="buy-label">Buy: {formatPrice(asset.buy, asset.currency)}</span>
                      <span className="sell-label">Sell: {formatPrice(asset.sell, asset.currency)}</span>
                    </div>
                    <div className="range-bar">
                      <div
                        className="range-progress"
                        style={{ width: `${position}%` }}
                      />
                      <div
                        className="range-indicator"
                        style={{ left: `${position}%` }}
                      />
                    </div>
                  </div>

                  {(isNearBuy || isNearSell) && (
                    <div className={`alert ${isNearBuy ? 'alert-buy' : 'alert-sell'}`}>
                      {isNearBuy ? '🟢 Near Buy Price' : '🔴 Near Sell Price'}
                    </div>
                  )}

                  {asset.ema > 0 && (
                    <div className="asset-details">
                      <div className="detail-item">
                        <span className="detail-label">EMA ({asset.ndays}d):</span>
                        <span className="detail-value">{formatPrice(asset.ema, asset.currency)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Range:</span>
                        <span className="detail-value">
                          {formatPrice(asset.bottom, asset.currency)} - {formatPrice(asset.top, asset.currency)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AddAssetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAsset}
      />
    </div>
  );
};

export default AssetsPage;
