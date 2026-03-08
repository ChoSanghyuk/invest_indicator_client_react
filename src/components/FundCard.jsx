import { useState, useEffect } from 'react';
import { getFundAssets, getFundPortion, formatKRW, formatUSD } from '../services/fund.service';
import './FundCard.css';

const FundCard = ({ fund, showAmount, isFirst }) => {
  const [assets, setAssets] = useState([]);
  const [portion, setPortion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(isFirst);
  const [showUSD, setShowUSD] = useState(false);

  useEffect(() => {
    const fetchFundDetails = async () => {
      try {
        setLoading(true);
        const [assetsData, portionData] = await Promise.all([
          getFundAssets(fund.id),
          getFundPortion(fund.id)
        ]);
        setAssets(assetsData);
        setPortion(portionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (expanded) {
      fetchFundDetails();
    }
  }, [fund.id, expanded]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="fund-card">
      <div className="fund-card-header" onClick={toggleExpanded}>
        <div className="fund-card-title">
          <h3>{fund.name}</h3>
          <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
        </div>
        {showAmount && (
          <div className="fund-card-amount">
            <span className="amount-label">Total</span>
            <span className="amount-value">{formatKRW(fund.amount)}</span>
          </div>
        )}
      </div>

      {expanded && (
        <div className="fund-card-details">
          {loading && <div className="loading">Loading fund details...</div>}

          {error && <div className="error">Error: {error}</div>}

          {!loading && !error && portion && (
            <div className="fund-portion">
              <h4>Asset Allocation</h4>
              <div className="portion-bar">
                <div
                  className="portion-stable"
                  style={{ width: `${portion.stable}%` }}
                  title={`Stable: ${portion.stable}%`}
                >
                  {portion.stable > 0 && `${portion.stable}%`}
                </div>
                <div
                  className="portion-volatile"
                  style={{ width: `${portion.volatile}%` }}
                  title={`Volatile: ${portion.volatile}%`}
                >
                  {portion.volatile > 0 && `${portion.volatile}%`}
                </div>
              </div>
              <div className="portion-legend">
                <span className="legend-item">
                  <span className="legend-color stable"></span>
                  Stable: {portion.stable}%
                </span>
                <span className="legend-item">
                  <span className="legend-color volatile"></span>
                  Volatile: {portion.volatile}%
                </span>
              </div>
            </div>
          )}

          {!loading && !error && assets.length > 0 && (
            <div className="fund-assets">
              <div className="assets-header">
                <h4>Assets ({assets.length})</h4>
                {assets.some(asset => asset.amount_dollar && asset.amount_dollar !== '') && (
                  <button
                    className="currency-toggle-btn"
                    onClick={() => setShowUSD(!showUSD)}
                  >
                    {showUSD ? 'KRW' : 'USD'}
                  </button>
                )}
              </div>
              <div className="table-wrapper">
                <table className="assets-table">
                  <thead>
                    <tr>
                      <th className="col-name">Name</th>
                      <th className="col-amount">Amount {showUSD ? '(USD)' : '(KRW)'}</th>
                      <th className="col-profit">Profit</th>
                      <th className="col-category">Category</th>
                      <th className="col-quantity">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset, index) => {
                      const hasUSD = asset.amount_dollar && asset.amount_dollar !== '';
                      const displayAmount = (showUSD && hasUSD)
                        ? formatUSD(parseFloat(asset.amount_dollar))
                        : formatKRW(parseFloat(asset.amount));

                      return (
                        <tr key={index} className={asset.isStable ? 'stable-asset' : 'volatile-asset'}>
                          <td className="col-name">{asset.name}</td>
                          <td className="col-amount">{displayAmount}</td>
                          <td className={`col-profit ${asset.profit_rate ? (parseFloat(asset.profit_rate) >= 0 ? 'profit-positive' : 'profit-negative') : ''}`}>
                            {asset.profit_rate ? `${asset.profit_rate}%` : '-'}
                          </td>
                          <td className="col-category">{asset.division}</td>
                          <td className="col-quantity">{parseFloat(asset.quantity).toLocaleString('ko-KR')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && !error && assets.length === 0 && (
            <div className="no-assets">No assets in this fund</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FundCard;
