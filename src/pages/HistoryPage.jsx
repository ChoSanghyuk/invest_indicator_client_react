import { useState, useEffect } from 'react';
import { getAllFunds, getFundHistory, formatKRW } from '../services/fund.service';
import { formatDateForAPI } from '../types/history.types';
import './HistoryPage.css';

const HistoryPage = () => {
  // Set default date range: 1 month before today to today
  const getDefaultDates = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    return {
      end: formatDateForAPI(today),
      start: formatDateForAPI(oneMonthAgo)
    };
  };

  const defaultDates = getDefaultDates();

  const [funds, setFunds] = useState([]);
  const [selectedFundId, setSelectedFundId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);

  // Fetch all funds
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setLoading(true);
        const fundsData = await getAllFunds();
        const fundsArray = Object.values(fundsData);
        setFunds(fundsArray);

        // Select first fund by default
        if (fundsArray.length > 0) {
          setSelectedFundId(fundsArray[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  // Fetch history when fund or dates change
  useEffect(() => {
    if (!selectedFundId) return;

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        const historyData = await getFundHistory(selectedFundId, startDate, endDate);
        setHistory(historyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [selectedFundId, startDate, endDate]);

  const handleFundChange = (e) => {
    setSelectedFundId(parseInt(e.target.value));
  };

  const clearDates = () => {
    setStartDate('');
    setEndDate('');
  };

  // Calculate total amounts
  const totalBuyAmount = history
    .filter(item => item.count > 0)
    .reduce((sum, item) => sum + (item.count * item.price), 0);

  const totalSellAmount = history
    .filter(item => item.count < 0)
    .reduce((sum, item) => sum + (Math.abs(item.count) * item.price), 0);

  return (
    <div className="history-page">
      <header className="page-header">
        <h1>Investment History</h1>
      </header>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading funds...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && funds.length > 0 && (
        <>
          <div className="filters-section">
            <div className="fund-selector">
              <label htmlFor="fund-select" className="filter-label">Fund</label>
              <select
                id="fund-select"
                value={selectedFundId || ''}
                onChange={handleFundChange}
                className="fund-select"
              >
                {funds.map((fund) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="date-filters">
              <div className="date-input-row">
                <div className="date-input-group">
                  <label htmlFor="start-date" className="filter-label">From</label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="date-input"
                  />
                </div>

                <div className="date-input-group">
                  <label htmlFor="end-date" className="filter-label">To</label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>

              {(startDate || endDate) && (
                <button onClick={clearDates} className="clear-dates-btn">
                  Clear Dates
                </button>
              )}
            </div>
          </div>

          <div className="summary-cards">
            <div className="summary-card buy">
              <span className="summary-label">Total Bought</span>
              <span className="summary-value">{formatKRW(totalBuyAmount)}</span>
              <span className="summary-count">{history.filter(h => h.count > 0).length} transactions</span>
            </div>
            <div className="summary-card sell">
              <span className="summary-label">Total Sold</span>
              <span className="summary-value">{formatKRW(totalSellAmount)}</span>
              <span className="summary-count">{history.filter(h => h.count < 0).length} transactions</span>
            </div>
          </div>

          <main className="page-content">
            {historyLoading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading history...</p>
              </div>
            )}

            {!historyLoading && history.length === 0 && (
              <div className="empty-state">
                <p>No transaction history for this fund</p>
              </div>
            )}

            {!historyLoading && history.length > 0 && (
              <div className="history-list">
                {history.map((item, index) => {
                  const isBuy = item.count > 0;
                  const totalAmount = Math.abs(item.count) * item.price;
                  const date = new Date(item.created_at.replace(' ', 'T'));

                  return (
                    <div key={index} className={`history-item ${isBuy ? 'buy' : 'sell'}`}>
                      <div className="history-header">
                        <div className="history-type">
                          <span className={`type-badge ${isBuy ? 'buy' : 'sell'}`}>
                            {isBuy ? 'BUY' : 'SELL'}
                          </span>
                          <span className="asset-name">{item.asset_name}</span>
                        </div>
                        <div className="history-date">
                          {date.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      <div className="history-details">
                        <div className="detail-row">
                          <span className="detail-label">Quantity:</span>
                          <span className="detail-value">{Math.abs(item.count).toLocaleString('ko-KR')}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Price:</span>
                          <span className="detail-value">{formatKRW(item.price)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Total:</span>
                          <span className={`detail-value total ${isBuy ? 'buy' : 'sell'}`}>
                            {formatKRW(totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="history-time">
                        {date.toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default HistoryPage;
