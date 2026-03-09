import API_CONFIG from '../config/api.config';

/**
 * Get all events
 * @returns {Promise<Array>} Array of events
 */
export const getAllEvents = async () => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: 'Daily Market Update',
            description: 'Updates market indicators daily',
            active: true
          },
          {
            id: 2,
            title: 'Portfolio Rebalancing',
            description: 'Rebalances portfolio based on market conditions',
            active: false
          },
          {
            id: 3,
            title: 'Asset Price Sync',
            description: 'Synchronizes asset prices from external sources',
            active: true
          },
          {
            id: 4,
            title: 'Monthly Report Generation',
            description: 'Generates monthly performance reports',
            active: false
          }
        ]);
      }, 300);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/events/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Switch event status (enable/disable)
 * @param {number} id - Event ID
 * @param {boolean} active - New active status
 * @returns {Promise<string>} Success message
 */
export const switchEventStatus = async (id, active) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Event 실행 성공');
      }, 300);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/events/switch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, active }),
  });

  if (!response.ok) {
    throw new Error(`Failed to switch event status: ${response.statusText}`);
  }

  return response.text();
};

/**
 * Launch event manually
 * @param {number} id - Event ID
 * @returns {Promise<string>} Success message
 */
export const launchEvent = async (id) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('event 실행 성공');
      }, 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/events/launch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error(`Failed to launch event: ${response.statusText}`);
  }

  return response.text();
};
