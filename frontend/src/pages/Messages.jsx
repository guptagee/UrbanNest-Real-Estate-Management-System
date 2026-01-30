import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
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
      const response = await api.get('/messages/conversations')
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
      const response = await api.get(`/messages?conversationWith=${conversationWith}`)
      setMessages(response.data.data.reverse())
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      await api.post('/messages', {
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
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Messages</h1>
              <p className="text-gray-600 text-sm">Chat with property owners and agents</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-bold text-gray-900">Conversations</h2>
                <p className="text-xs text-gray-600 mt-1">{conversations.length} active chats</p>
              </div>
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMessageSquare className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium text-sm">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-2">Start chatting with property owners</p>
                </div>
              ) : (
                <div>
                  {conversations.map((conv) => (
                    <button
                      key={conv.user._id}
                      onClick={() => setSelectedConversation(conv.user._id)}
                      className={`w-full p-4 text-left hover:bg-purple-50 transition-all duration-200 border-b border-gray-100 ${selectedConversation === conv.user._id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                        }`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {conv.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900 truncate">{conv.user.name}</p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 font-bold ml-2">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conv.lastMessage.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(conv.lastMessage.createdAt).toLocaleString()}
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
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedUser?.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-bold text-gray-900">{selectedUser?.name}</p>
                        <p className="text-xs text-gray-600">{selectedUser?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-xl px-4 py-3 ${message.sender._id === user.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-900'
                            }`}
                        >
                          {message.property && (
                            <div className="text-xs opacity-75 mb-2 font-semibold">
                              🏠 Property inquiry
                            </div>
                          )}
                          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                          <p className={`text-xs mt-2 ${message.sender._id === user.id ? 'text-purple-100' : 'text-gray-500'
                            }`}>
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 flex items-center transition-colors font-semibold"
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
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiMessageSquare className="h-12 w-12 text-gray-300" />
                    </div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</p>
                    <p className="text-gray-500 text-sm">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Messages
