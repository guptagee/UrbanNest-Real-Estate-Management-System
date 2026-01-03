import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import BuyerDashboard from '../components/dashboard/BuyerDashboard'
import AdminDashboard from './AdminDashboard'
import AgentDashboard from './AgentDashboard'

const Dashboard = () => {
  const { user } = useAuth()

  // Role-Based Views
  if (user?.role === 'user') {
    return (
      <DashboardLayout user={user}>
        <BuyerDashboard user={user} />
      </DashboardLayout>
    )
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />
  }

  // Agent View - Show AgentDashboard component
  return <AgentDashboard />
}

export default Dashboard
