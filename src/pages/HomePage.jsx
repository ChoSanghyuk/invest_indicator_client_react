import { useState, useEffect } from 'react';
import { getAllFunds } from '../services/fund.service';
import FundCard from '../components/FundCard';
import './HomePage.css';

const HomePage = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAmounts, setShowAmounts] = useState(false);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setLoading(true);
        const fundsData = await getAllFunds();
        const fundsArray = Object.values(fundsData);
        setFunds(fundsArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <h1>Investment Portfolio</h1>
          <button
            className="toggle-amount-btn"
            onClick={() => setShowAmounts(!showAmounts)}
            title={showAmounts ? "Hide amounts" : "Show amounts"}
          >
            {showAmounts ? '👁️ Hide' : '👁️‍🗨️ Show'}
          </button>
        </div>
      </header>

      <main className="home-content">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading funds...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <h2>Error Loading Funds</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && funds.length === 0 && (
          <div className="empty-state">
            <p>No funds available</p>
          </div>
        )}

        {!loading && !error && funds.length > 0 && (
          <div className="funds-grid">
            {funds.map((fund, index) => (
              <FundCard key={fund.id} fund={fund} showAmount={showAmounts} isFirst={index === 0} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
