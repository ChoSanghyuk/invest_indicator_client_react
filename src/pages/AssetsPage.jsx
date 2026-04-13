import { useState, useEffect, useRef } from 'react';
import { getAllAssets, addAsset, updateAsset, deleteAsset, formatPrice, calculatePricePosition } from '../services/asset.service';
import { CategoryList } from '../types/asset.types';
import AddAssetModal from '../components/AddAssetModal';
import UpdateAssetModal from '../components/UpdateAssetModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import './AssetsPage.css';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);

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

  const handleUpdateAsset = async (assetData) => {
    await updateAsset(assetData);
    // Refresh assets after update
    const updatedAssets = await getAllAssets();
    setAssets(updatedAssets);
  };

  const handleAssetDoubleClick = (asset) => {
    setSelectedAsset(asset);
    setShowUpdateModal(true);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    isSwiping.current = false;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    const movementDistance = Math.abs(touchStartX.current - touchEndX.current);

    // Mark as swiping if movement exceeds a small threshold
    if (movementDistance > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (asset) => {
    // Only process if this was actually a swipe, not a tap
    if (isSwiping.current) {
      const swipeDistance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 50; // minimum distance for a valid swipe

      // Left swipe (swiping from right to left)
      if (swipeDistance > minSwipeDistance) {
        setAssetToDelete(asset);
        setShowDeleteDialog(true);
      }
    }

    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
    isSwiping.current = false;
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;

    try {
      await deleteAsset(assetToDelete.id);
      // Refresh assets after delete
      const updatedAssets = await getAllAssets();
      setAssets(updatedAssets);
      setShowDeleteDialog(false);
      setAssetToDelete(null);
    } catch (error) {
      console.error('Failed to delete asset:', error);
      // You could add error handling UI here
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setAssetToDelete(null);
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
                <div
                  key={asset.id}
                  className="asset-card"
                  onDoubleClick={() => handleAssetDoubleClick(asset)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(asset)}
                >
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

      <UpdateAssetModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedAsset(null);
        }}
        onUpdate={handleUpdateAsset}
        asset={selectedAsset}
      />

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        assetName={assetToDelete?.name}
      />
    </div>
  );
};

export default AssetsPage;
