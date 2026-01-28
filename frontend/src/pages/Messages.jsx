import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import { FiSend, FiMessageSquare, FiUser, FiSearch, FiMoreVertical } from 'react-icons/fi'
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
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-3xl text-white shadow-2xl">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight mb-3">Messages 💬</h1>
            <p className="text-blue-100 text-lg">Connect with agents and property owners</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden" style={{ minHeight: '700px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-96 border-r border-gray-200 flex flex-col">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors">
                    <FiSearch className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiMessageSquare className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-sm text-gray-500">Start messaging agents about properties</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {conversations.map((conv) => (
                      <button
                        key={conv.user._id}
                        onClick={() => setSelectedConversation(conv.user._id)}
                        className={`w-full p-4 text-left transition-all duration-200 group ${
                          selectedConversation === conv.user._id
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500'
                            : 'hover:bg-gray-50 hover:border-l-4 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {conv.user.name.charAt(0).toUpperCase()}
                            </div>
                            {conv.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900 truncate">{conv.user.name}</p>
                              <span className="text-xs text-gray-500">
                                {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {selectedUser?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{selectedUser?.name}</p>
                          <p className="text-sm text-gray-600">{selectedUser?.email}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <FiMoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    {messages.map((message, index) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-lg transition-all duration-200 hover:shadow-xl ${
                            message.sender._id === user.id
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-900'
                          }`}
                        >
                          {message.property && (
                            <div className="text-xs opacity-75 mb-2 font-medium">
                              🏠 Property inquiry
                            </div>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 font-medium ${
                            message.sender._id === user.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl font-semibold"
                      >
                        <FiSend className="w-5 h-5" />
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiMessageSquare className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
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

