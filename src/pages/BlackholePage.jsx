import { useState, useEffect } from 'react';
import { getBlackholeProfit, formatProfitRate, formatAvaxAmount, formatUsdcAmount } from '../services/blackhole.service';
import './BlackholePage.css';

const BlackholePage = () => {
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseDate, setBaseDate] = useState('');

  useEffect(() => {
    // Set default base date to one week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const formattedDate = oneWeekAgo.toISOString().split('T')[0];
    setBaseDate(formattedDate);
    fetchProfitData(formattedDate);
  }, []);

  const fetchProfitData = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlackholeProfit(date);
      setProfitData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setBaseDate(newDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (baseDate) {
      fetchProfitData(baseDate);
    }
  };

  const getProfitColor = (rate) => {
    if (rate > 0) return '#10b981'; // Green for profit
    if (rate < 0) return '#dc2626'; // Red for loss
    return '#6b7280'; // Gray for neutral
  };

  return (
    <div className="blackhole-page">
      <header className="page-header">
        <h1>Blackhole DEX Monitor</h1>
        <p className="page-subtitle">Avalanche Network</p>
      </header>

      <div className="date-selector-card">
        <form onSubmit={handleSubmit} className="date-form">
          <label htmlFor="baseDate" className="date-label">
            Base Date
          </label>
          <div className="date-input-group">
            <input
              type="date"
              id="baseDate"
              value={baseDate}
              onChange={handleDateChange}
              className="date-input"
              max={new Date().toISOString().split('T')[0]}
            />
            <button type="submit" className="date-submit-btn" disabled={loading}>
              {loading ? 'Loading...' : 'Update'}
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profit data...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && profitData && (
        <>
          <div className="profit-summary-card">
            <h2>Profit Summary</h2>
            <div
              className="profit-rate-display"
              style={{ color: getProfitColor(profitData.profitRate) }}
            >
              <span className="profit-rate-value">
                {formatProfitRate(profitData.profitRate)}
              </span>
              <span className="profit-indicator">
                {profitData.profitRate > 0 ? '↗' : profitData.profitRate < 0 ? '↘' : '→'}
              </span>
            </div>
            <p className="profit-date-info">
              Since {new Date(baseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="metrics-grid">
            <div className="metric-card highlight">
              <div className="metric-header">
                <span className="metric-icon">💵</span>
                <span className="metric-name">Profit (USDC)</span>
              </div>
              <div
                className="metric-value"
                style={{ color: getProfitColor(profitData.profitRate) }}
              >
                {formatUsdcAmount(profitData.profitAmtUsdc)}
              </div>
              <div className="metric-description">
                Total profit in USDC
              </div>
            </div>

            <div className="metric-card highlight">
              <div className="metric-header">
                <span className="metric-icon">🔺</span>
                <span className="metric-name">Profit (AVAX)</span>
              </div>
              <div
                className="metric-value"
                style={{ color: getProfitColor(profitData.profitRate) }}
              >
                {formatAvaxAmount(profitData.profitAmtAvax)}
              </div>
              <div className="metric-description">
                Total profit in AVAX
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">📊</span>
                <span className="metric-name">Current Total Asset</span>
              </div>
              <div className="metric-value">
                {formatUsdcAmount(profitData.currentTotalAsset)}
              </div>
              <div className="metric-description">
                Current total value
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">💰</span>
                <span className="metric-name">Base Total Asset</span>
              </div>
              <div className="metric-value">
                {formatUsdcAmount(profitData.baseTotalAsset)}
              </div>
              <div className="metric-description">
                Starting value at base date
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>About Blackhole DEX</h3>
            <p>
              Blackhole is a decentralized exchange (DEX) on the Avalanche network.
              This dashboard monitors your investment performance by tracking total assets
              and profit changes over time.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default BlackholePage;
