import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Assets/css/feedback.css';

const FeedbackTable = ({ user }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response =
          user?.type === 'admin'
            ? await axios.get('http://localhost:5000/getAllFeedbacks')
            : await axios.get(`http://localhost:5000/getUserFeedbacks/${user.username}`);
        setFeedbackList(response.data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    if (user) fetchFeedback();
  }, [user]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const endpoint =
        status === 'accepted and closed'
          ? `/api/feedbackAccept/${id}`
          : `/api/feedbackReject/${id}`;
      const res = await axios.put(endpoint);
      const updated = res.data.feedback;

      setFeedbackList((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/deleteFeedback/${id}`);
      setFeedbackList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const handlePopupClose = () => setSelectedFeedback(null);

  return (
    <div className="feedback-table-container">
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Phone</th>
            <th>Query</th>
            <th>Status</th>
            {user?.type === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((item) => (
            <tr key={item._id}>
              <td>{item.username}</td>
              <td>{item.phone}</td>
              <td className="query-snippet" onClick={() => setSelectedFeedback(item)}>
                {item.feedback.length > 40 ? item.feedback.slice(0, 40) + '...' : item.feedback}
              </td>
              <td>{item.status}</td>
              {user?.type === 'admin' && (
                <td className="action-buttons">
                  <button onClick={() => handleStatusUpdate(item._id, 'accepted and closed')}>Accept</button>
                  <button onClick={() => handleStatusUpdate(item._id, 'rejected and closed')}>Reject</button>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFeedback && (
        <div className="popup-overlay" onClick={handlePopupClose}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Full Query from {selectedFeedback.username}</h3>
            <p>{selectedFeedback.feedback}</p>
            <span onClick={handlePopupClose} className="profile-button">Close</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTable;
