import { useState } from 'react'
import { FiAlertTriangle, FiX } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'

const ReportModal = ({ isOpen, onClose, propertyId, targetUserId, propertyTitle }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/reports', {
        property: propertyId,
        targetUser: targetUserId,
        subject: formData.subject,
        description: formData.description
      })
      toast.success('Report submitted successfully')
      onClose()
      setFormData({ subject: '', description: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-50 rounded-full text-red-600">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Report Issue</h2>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Reporting: <span className="font-semibold">{propertyTitle}</span>
          <br />
          Please describe the issue below. Our team will investigate.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select a reason</option>
              <option value="Misleading Information">Misleading Information</option>
              <option value="Fraud/Scam">Fraud/Scam</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Already Sold/Rented">Already Sold/Rented</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Provide more details..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportModal

