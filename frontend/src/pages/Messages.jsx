import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FiSend, FiMessageSquare, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Messages = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [propertyId, setPropertyId] = useState(searchParams.get('property') || null)
  const [receiverId, setReceiverId] = useState(searchParams.get('receiver') || null)

  useEffect(() => {
    fetchConversations()
    if (receiverId) {
      setSelectedConversation(receiverId)
    }
  }, [receiverId])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations')
      setConversations(response.data.data)
      
      if (receiverId && !selectedConversation) {
        setSelectedConversation(receiverId)
      } else if (response.data.data.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data.data[0].user._id)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const fetchMessages = async (conversationWith) => {
    try {
      const response = await axios.get(`/api/messages?conversationWith=${conversationWith}`)
      setMessages(response.data.data.reverse())
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      await axios.post('/api/messages', {
        receiver: selectedConversation,
        property: propertyId || undefined,
        content: newMessage.trim()
      })
      
      setNewMessage('')
      fetchMessages(selectedConversation)
      fetchConversations()
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const selectedUser = conversations.find(c => c.user._id === selectedConversation)?.user

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex" style={{ height: '600px' }}>
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FiMessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No conversations yet</p>
              </div>
            ) : (
              <div>
                {conversations.map((conv) => (
                  <button
                    key={conv.user._id}
                    onClick={() => setSelectedConversation(conv.user._id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${
                      selectedConversation === conv.user._id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conv.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{conv.user.name}</p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedUser?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{selectedUser?.name}</p>
                      <p className="text-sm text-gray-500">{selectedUser?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender._id === user.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {message.property && (
                          <div className="text-xs opacity-75 mb-1">
                            Re: Property inquiry
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender._id === user.id ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center"
                    >
                      <FiSend className="mr-2" />
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiMessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages

