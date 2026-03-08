import { useState, useEffect } from 'react';
import { getMarketStatus, getWeeklyIndicators, updateMarketStatus } from '../services/market.service';
import { MarketLevelNames, MarketLevelDescriptions, MarketLevelColors } from '../types/market.types';
import './MarketPage.css';

const MarketPage = () => {
  const [marketStatus, setMarketStatus] = useState(null);
  const [weeklyIndicators, setWeeklyIndicators] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const [status, indicators] = await Promise.all([
        getMarketStatus(),
        getWeeklyIndicators()
      ]);
      setMarketStatus(status);
      setSelectedStatus(status.Status);
      setWeeklyIndicators(indicators);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === marketStatus.Status) {
      setShowUpdateForm(false);
      return;
    }

    try {
      setUpdating(true);
      await updateMarketStatus(selectedStatus);
      await fetchMarketData();
      setShowUpdateForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const cancelUpdate = () => {
    setSelectedStatus(marketStatus.Status);
    setShowUpdateForm(false);
  };

  const renderMiniGraph = (data, name) => {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="graph-container">
        <div className="mini-graph">
          {data.map((value, index) => {
            const height = ((value - min) / range) * 100;
            const isLast = index === data.length - 1;
            return (
              <div key={index} className="graph-bar-wrapper">
                <div className="bar-value-tooltip">{value.toLocaleString()}</div>
                <div
                  className={`mini-graph-bar ${isLast ? 'current' : ''}`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
                {isLast && <div className="bar-label">Now</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getFearGreedColor = (value) => {
    const numValue = parseInt(value);
    if (numValue >= 75) return '#10b981'; // Extreme Greed
    if (numValue >= 55) return '#22c55e'; // Greed
    if (numValue >= 45) return '#eab308'; // Neutral
    if (numValue >= 25) return '#f97316'; // Fear
    return '#dc2626'; // Extreme Fear
  };

  return (
    <div className="market-page">
      <header className="page-header">
        <h1>Market Status</h1>
      </header>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading market data...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && marketStatus && (
        <>
          <div className="market-status-card">
            <div className="status-header">
              <span className="status-label">Current Market Status</span>
              <div className="status-header-right">
                <span className="status-date">
                  {new Date(marketStatus.CreatedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {!showUpdateForm && (
                  <button
                    className="update-status-btn"
                    onClick={() => setShowUpdateForm(true)}
                  >
                    Update
                  </button>
                )}
              </div>
            </div>

            {!showUpdateForm ? (
              <>
                <div
                  className="status-badge"
                  style={{ backgroundColor: MarketLevelColors[marketStatus.Status] }}
                >
                  {MarketLevelNames[marketStatus.Status]}
                </div>
                <div className="status-description">
                  {MarketLevelDescriptions[marketStatus.Status]}
                </div>
              </>
            ) : (
              <div className="update-form">
                <h3>Select New Market Status</h3>
                <div className="status-options">
                  {Object.keys(MarketLevelNames).map((level) => {
                    const levelNum = parseInt(level);
                    return (
                      <button
                        key={level}
                        className={`status-option ${selectedStatus === levelNum ? 'selected' : ''}`}
                        onClick={() => setSelectedStatus(levelNum)}
                        disabled={updating}
                      >
                        <div
                          className="option-indicator"
                          style={{ backgroundColor: MarketLevelColors[level] }}
                        />
                        <div className="option-info">
                          <span className="option-name">{MarketLevelNames[level]}</span>
                          <span className="option-desc">{MarketLevelDescriptions[level]}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="update-actions">
                  <button
                    className="btn-cancel-update"
                    onClick={cancelUpdate}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-confirm-update"
                    onClick={handleUpdateStatus}
                    disabled={updating || selectedStatus === marketStatus.Status}
                  >
                    {updating ? 'Updating...' : 'Confirm Update'}
                  </button>
                </div>
              </div>
            )}

            <div className="market-levels-guide">
              <h3>Market Levels</h3>
              <div className="levels-list">
                {Object.keys(MarketLevelNames).map((level) => (
                  <div
                    key={level}
                    className={`level-item ${parseInt(level) === marketStatus.Status ? 'active' : ''}`}
                  >
                    <div
                      className="level-indicator"
                      style={{ backgroundColor: MarketLevelColors[level] }}
                    />
                    <div className="level-info">
                      <span className="level-name">{MarketLevelNames[level]}</span>
                      <span className="level-desc">{MarketLevelDescriptions[level]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {weeklyIndicators && (
            <div className="indicators-section">
              <h2>Weekly Indicators</h2>
              <div className="indicators-grid">
                {Object.entries(weeklyIndicators).map(([name, data]) => {
                  const isFearGreed = name === "Fear & Greed Index";
                  const indicatorColor = isFearGreed ? getFearGreedColor(data.value) : '#667eea';

                  return (
                    <div key={name} className="indicator-card">
                      <div className="indicator-header">
                        <span className="indicator-name">{name}</span>
                        <span
                          className="indicator-status"
                          style={{
                            color: isFearGreed ? indicatorColor : '#374151',
                            fontWeight: isFearGreed ? '700' : '500'
                          }}
                        >
                          {data.status}
                        </span>
                      </div>
                      <div
                        className="indicator-value"
                        style={{ color: isFearGreed ? indicatorColor : '#111827' }}
                      >
                        {data.value}
                      </div>
                      {renderMiniGraph(data.graph, name)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarketPage;
