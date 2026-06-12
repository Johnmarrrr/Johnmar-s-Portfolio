const Message = require('../models/Message');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a message (contact form submission)
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    const createdMessage = await newMessage.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mark message as read/unread
// @route   PUT /api/messages/:id
// @access  Private
const updateMessageStatus = async (req, res) => {
  const { read } = req.body;

  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      message.read = read !== undefined ? read : message.read;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      await Message.deleteOne({ _id: req.params.id });
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  createMessage,
  updateMessageStatus,
  deleteMessage,
};
