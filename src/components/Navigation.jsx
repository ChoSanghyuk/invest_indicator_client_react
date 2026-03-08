import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <>
      <nav className="navigation">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          <span className="nav-icon">💰</span>
          <span className="nav-label">Funds</span>
        </NavLink>
        <NavLink to="/assets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Assets</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          <span className="nav-icon">📈</span>
          <span className="nav-label">History</span>
        </NavLink>
        <NavLink to="/market" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          <span className="nav-icon">🌐</span>
          <span className="nav-label">Market</span>
        </NavLink>
        <button className="nav-link menu-button" onClick={toggleMenu}>
          <span className="nav-icon">☰</span>
          <span className="nav-label">More</span>
        </button>
      </nav>

      {showMenu && (
        <>
          <div className="menu-overlay" onClick={closeMenu}></div>
          <div className="menu-dropdown">
            <div className="menu-header">
              <h3>More Pages</h3>
              <button className="menu-close" onClick={closeMenu}>✕</button>
            </div>
            <div className="menu-items">
              <NavLink to="/settings" className="menu-item" onClick={closeMenu}>
                <span className="menu-item-icon">⚙️</span>
                <span className="menu-item-label">Settings</span>
              </NavLink>
              <NavLink to="/profile" className="menu-item" onClick={closeMenu}>
                <span className="menu-item-icon">👤</span>
                <span className="menu-item-label">Profile</span>
              </NavLink>
              <NavLink to="/reports" className="menu-item" onClick={closeMenu}>
                <span className="menu-item-icon">📄</span>
                <span className="menu-item-label">Reports</span>
              </NavLink>
              <NavLink to="/analytics" className="menu-item" onClick={closeMenu}>
                <span className="menu-item-icon">📉</span>
                <span className="menu-item-label">Analytics</span>
              </NavLink>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;
