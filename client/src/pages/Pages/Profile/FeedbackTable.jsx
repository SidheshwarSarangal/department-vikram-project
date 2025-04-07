import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Assets/css/feedback.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeedbackTable = ({ user }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);


  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response =
          user?.userType === 'admin'
            ? await axios.get('http://localhost:5000/getAllFeedbacks')
            : await axios.get(`http://localhost:5000/getUserFeedbacks/${user.username}`);
        setFeedbackList(response.data);
        console.log("responsetable",response);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    if (user) fetchFeedback();
  }, [user]);

  const handleStatusChange = async (newStatus, id) => {
    try {
      let endpoint = '';

      if (newStatus === 'accepted and closed') {
        endpoint = `http://localhost:5000/feedbackAccept/${id}`;
      } else if (newStatus === 'rejected and closed') {
        endpoint = `http://localhost:5000/feedbackReject/${id}`;
      }
      else{
        endpoint = `http://localhost:5000/makeStatusSubmitted/${id}`;
      }

      if (endpoint) {
        const res = await axios.put(endpoint);
        console.log(res.data.message);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          textAlign: "center",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500); // wait 1.5 seconds before reloading
        // Optionally refresh feedback list here
      } else {
        toast.info("Status remains same", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          textAlign: "center",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500); // wait 1.5 seconds before reloading
      }
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update feedback status", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        textAlign: "center",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500); // wait 1.5 seconds before reloadingff
      
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deleteFeedback/${id}`);
      setFeedbackList((prev) => prev.filter((item) => item._id !== id));
      toast.success('Feedback deleted successfully!', {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        style: { textAlign: 'center' }
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback.', {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        style: { textAlign: 'center' }
      });
    }
  };

  const handlePopupClose = () => setSelectedFeedback(null);

  return (
    <div className="feedback-table-container">
      <ToastContainer /> {/* This should be somewhere inside your component */}

      <table className="feedback-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Phone</th>
            <th>Query</th>
            <th>Status</th>
            <th>Deletion</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((item) => (
            <tr key={item._id}>
              <td className="query-snippet" onClick={() => setSelectedFeedback(item)}>{item.username}</td>
              <td className="query-snippet" onClick={() => setSelectedFeedback(item)}>{item.phone}</td>
              <td className="query-snippet" onClick={() => setSelectedFeedback(item)}>
                {item.feedback.length > 40 ? item.feedback.slice(0, 40) + '...' : item.feedback}
              </td>
              <td>{user?.userType === "admin" ? (
                <div style={{ margin: '1rem', fontFamily: 'poppins' }}>
                  <label htmlFor={`statusDropdown-${item._id}`} style={{ marginRight: '0.5rem' }}>Update Status:</label>
                  <select
                    id={`statusDropdown-${item._id}`}
                    value={item.status}
                    onChange={(e) => handleStatusChange(e.target.value, item._id)}
                    className="profile-button"
                    style={{
                      backgroundColor: 'white',
                      color: '#000',
                      border: '1px solid #ccc',
                      padding: '0.5rem',
                      fontFamily: 'poppins',
                    }}
                  >
                    <option value="submitted">submitted</option>
                    <option value="accepted and closed">accepted and closed</option>
                    <option value="rejected and closed">rejected and closed</option>
                  </select>
                </div>
              ) : (
                item.status && (
                  <div style={{ margin: '1rem', color: '#2b6cb0', fontFamily: 'poppins' }}>
                    {item.status}
                  </div>
                )
              )}
              </td>
              <td className="action-buttons">
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFeedback && (
        <div className="popup-overlay" onClick={handlePopupClose}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Full Query from {selectedFeedback.username}</h3>
            <p>{selectedFeedback.feedback}</p>
            <span onClick={handlePopupClose} className="profile-button" style={{color:"gray", ":hover": { color: "white" }}}>Close</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTable;
