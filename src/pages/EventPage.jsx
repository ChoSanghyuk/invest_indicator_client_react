import { useState, useEffect } from 'react';
import { getAllEvents, switchEventStatus, launchEvent } from '../services/event.service';
import './EventPage.css';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [processingEventId, setProcessingEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (eventId, currentStatus) => {
    try {
      setProcessingEventId(eventId);
      setError(null);
      setSuccessMessage('');

      const newStatus = !currentStatus;
      const message = await switchEventStatus(eventId, newStatus);

      setSuccessMessage(message);

      // Update local state
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, active: newStatus } : event
      ));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingEventId(null);
    }
  };

  const handleLaunchEvent = async (eventId) => {
    try {
      setProcessingEventId(eventId);
      setError(null);
      setSuccessMessage('');

      const message = await launchEvent(eventId);
      setSuccessMessage(message);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingEventId(null);
    }
  };

  if (loading) {
    return (
      <div className="event-page">
        <header className="page-header">
          <h1>Events</h1>
        </header>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-page">
      <header className="page-header">
        <h1>Events</h1>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-banner">
          {successMessage}
        </div>
      )}

      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <div className="event-title-section">
                <h2 className="event-title">{event.title}</h2>
                <span className={`event-status-badge ${event.active ? 'active' : 'inactive'}`}>
                  {event.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="event-description">{event.description}</p>
            </div>

            <div className="event-actions">
              <button
                className={`toggle-btn ${event.active ? 'active' : 'inactive'}`}
                onClick={() => handleToggleStatus(event.id, event.active)}
                disabled={processingEventId === event.id}
              >
                {processingEventId === event.id && 'processing' ? (
                  'Processing...'
                ) : event.active ? (
                  'Disable'
                ) : (
                  'Enable'
                )}
              </button>

              <button
                className="launch-btn"
                onClick={() => handleLaunchEvent(event.id)}
                disabled={processingEventId === event.id}
              >
                {processingEventId === event.id ? 'Launching...' : 'Launch Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !loading && (
        <div className="no-events">
          <p>No events available</p>
        </div>
      )}
    </div>
  );
};

export default EventPage;
