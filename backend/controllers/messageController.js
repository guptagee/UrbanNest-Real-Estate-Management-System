const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all messages for user
// @route   GET /api/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { conversationWith } = req.query;

    let query = {
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    };

    if (conversationWith) {
      query = {
        $or: [
          { sender: req.user.id, receiver: conversationWith },
          { sender: conversationWith, receiver: req.user.id }
        ]
      };
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .populate('property', 'title images price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get conversations list
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .sort('-createdAt');

    // Group by conversation partner
    const conversations = {};
    messages.forEach(msg => {
      const partnerId = msg.sender._id.toString() === req.user.id 
        ? msg.receiver._id.toString() 
        : msg.sender._id.toString();
      
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          user: msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender,
          lastMessage: msg,
          unreadCount: 0
        };
      }

      if (!msg.read && msg.receiver._id.toString() === req.user.id) {
        conversations[partnerId].unreadCount++;
      }
    });

    res.status(200).json({
      success: true,
      count: Object.keys(conversations).length,
      data: Object.values(conversations)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new message
// @route   POST /api/messages
// @access  Private
exports.createMessage = async (req, res) => {
  try {
    const { receiver, property, subject, content } = req.body;

    // Check if receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    req.body.sender = req.user.id;

    const message = await Message.create(req.body);

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .populate('property', 'title images price');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this message as read'
      });
    }

    message.read = true;
    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

