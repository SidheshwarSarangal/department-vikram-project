// controllers/feedbackController.js
const Feedback = require('../models/feedback');

exports.addFeedback = async (req, res) => {
  try {
    const { username, phone, feedback } = req.body;

    // Basic validation
    if (!username || !phone || !feedback) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create and save feedback
    const newFeedback = new Feedback({
      username,
      phone,
      feedback
    });

    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.removeFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// Set Status: Accepted and Closed
exports.setStatusAcceptedAndClose = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { status: 'accepted and closed' },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback marked as accepted and closed', feedback: updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Set Status: Rejected and Closed
exports.setStatusRejectedAndClose = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { status: 'rejected and closed' },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback marked as rejected and closed', feedback: updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.makeStatusSubmitted = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { status: 'submitted' },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback marked as submitted', feedback: updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback status to submitted:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


exports.viewAllQuery = async (req, res) => {
  try {
    const allQueries = await Feedback.find().sort({ time: -1 }); // Newest first
    res.status(200).json(allQueries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queries', error });
  }
};

// View queries by a specific username
exports.viewUserQuery = async (req, res) => {
  const { username } = req.params;

  try {
    const userQueries = await Feedback.find({ username }).sort({ time: -1 });

    if (!userQueries.length) {
      return res.status(404).json({ message: 'No queries found for this user' });
    }

    res.status(200).json(userQueries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user queries', error });
  }
};