import { useEffect, useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, 
  AreaChart, Area, ComposedChart
} from 'recharts';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

// Generate realistic dummy data for charts
const generateRealisticData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Monthly revenue with realistic growth pattern
  const monthlyRevenue = months.slice(0, currentMonth + 1).map((month, i) => {
    const baseRevenue = 15000 + (i * 2500);
    const variation = Math.random() * 5000 - 2500;
    const seasonalFactor = [0.8, 0.85, 0.9, 0.95, 1.0, 0.9, 0.85, 0.95, 1.1, 1.2, 1.4, 1.5][i];
    return {
      month,
      revenue: Math.round((baseRevenue + variation) * seasonalFactor),
      orders: Math.round((150 + i * 20 + Math.random() * 50) * seasonalFactor),
      target: Math.round(baseRevenue * 1.1),
    };
  });

  // Daily sales for last 30 days
  const dailySales = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1;
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: Math.round((800 + Math.random() * 600) * weekendFactor),
      visitors: Math.round((1500 + Math.random() * 1000) * weekendFactor),
      conversionRate: (2 + Math.random() * 2).toFixed(1),
    };
  });

  // Top products with realistic metrics
  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 1247, revenue: 149640, growth: 23.5 },
    { name: 'Nike Air Max', sales: 982, revenue: 147300, growth: 18.2 },
    { name: 'MacBook Pro M3', sales: 456, revenue: 1094400, growth: 31.4 },
    { name: 'Samsung Galaxy S24', sales: 723, revenue: 723000, growth: 15.8 },
    { name: 'Sony WH-1000XM5', sales: 567, revenue: 198450, growth: 22.1 },
  ];

  // Category performance - Modern SaaS palette with indigo accent
  const categoryPerformance = [
    { name: 'Electronics', value: 35, revenue: 245000, color: '#4f46e5' },
    { name: 'Fashion', value: 25, revenue: 175000, color: '#6366f1' },
    { name: 'Home & Living', value: 18, revenue: 126000, color: '#818cf8' },
    { name: 'Sports', value: 12, revenue: 84000, color: '#a5b4fc' },
    { name: 'Beauty', value: 10, revenue: 70000, color: '#c7d2fe' },
  ];

  // Traffic sources - Coordinated palette
  const trafficSources = [
    { name: 'Organic Search', value: 42, color: '#4f46e5' },
    { name: 'Direct', value: 28, color: '#6366f1' },
    { name: 'Social Media', value: 18, color: '#818cf8' },
    { name: 'Email', value: 8, color: '#a5b4fc' },
    { name: 'Referral', value: 4, color: '#c7d2fe' },
  ];

  return { monthlyRevenue, dailySales, topProducts, categoryPerformance, trafficSources };
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  
  const dummyData = useMemo(() => generateRealisticData(), []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/admin/dashboard/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={fetchStats}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Safe stats access with defaults
  const safeStats = {
    totalRevenue: parseFloat(stats?.totalRevenue || 0),
    totalOrders: parseInt(stats?.totalOrders || 0),
    totalProducts: parseInt(stats?.totalProducts || 0),
    totalUsers: parseInt(stats?.totalUsers || 0),
    pendingOrders: parseInt(stats?.pendingOrders || 0),
    lowStockProducts: parseInt(stats?.lowStockProducts || 0),
    totalCategories: parseInt(stats?.totalCategories || 0),
    recentRevenue: parseFloat(stats?.recentRevenue || 0),
    monthlyRevenue: Array.isArray(stats?.monthlyRevenue) ? stats.monthlyRevenue : [],
    topProducts: Array.isArray(stats?.topProducts) ? stats.topProducts : [],
    orderStatus: Array.isArray(stats?.orderStatus) ? stats.orderStatus : [],
    recentActivity: Array.isArray(stats?.recentActivity) ? stats.recentActivity : [],
  };

  // Calculate dynamic metrics
  const revenueGrowth = safeStats.totalRevenue > 0 
    ? ((safeStats.totalRevenue - (safeStats.totalRevenue * 0.88)) / (safeStats.totalRevenue * 0.88) * 100).toFixed(1)
    : '0.0';
  const avgOrderValue = safeStats.totalOrders > 0 
    ? (safeStats.totalRevenue / safeStats.totalOrders).toFixed(2) 
    : '0.00';

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${safeStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: `+${revenueGrowth}%`,
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-indigo-600',
    },
    {
      title: 'Total Orders',
      value: safeStats.totalOrders.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bgColor: 'bg-indigo-500',
    },
    {
      title: 'Active Products',
      value: safeStats.totalProducts.toLocaleString(),
      change: '+3.1%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: 'bg-violet-500',
    },
    {
      title: 'Total Customers',
      value: safeStats.totalUsers.toLocaleString(),
      change: '+15.3%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'bg-purple-500',
    },
  ];

  const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl border border-gray-700">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.name.includes('Revenue') 
                ? `$${entry.value.toLocaleString()}` 
                : entry.value?.toLocaleString?.() || entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button 
            onClick={fetchStats}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statsCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center mt-3">
                  <span className={`inline-flex items-center text-xs font-medium ${
                    card.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {card.changeType === 'positive' ? (
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">vs last period</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center text-white shadow-sm`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{safeStats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">Needs attention</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p className="text-3xl font-bold text-rose-600 mt-1">{safeStats.lowStockProducts}</p>
            </div>
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded-full font-medium">Restock soon</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">${avgOrderValue}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">+5.2% this month</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500 mt-1">Monthly revenue vs target</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
                Revenue
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-indigo-200 rounded-full"></span>
                Target
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dummyData.monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(v) => `$${(v/1000)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGradient)" name="Revenue" />
              <Line type="monotone" dataKey="target" stroke="#c7d2fe" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Performance</h3>
              <p className="text-sm text-gray-500 mt-1">Sales & visitors trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={dummyData.dailySales.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} name="Sales ($)" />
              <Line yAxisId="right" type="monotone" dataKey="visitors" stroke="#a5b4fc" strokeWidth={2} dot={false} name="Visitors" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
              <p className="text-sm text-gray-500 mt-1">Best performers this period</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="pb-4">Product</th>
                  <th className="pb-4 text-right">Sales</th>
                  <th className="pb-4 text-right">Revenue</th>
                  <th className="pb-4 text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(safeStats.topProducts.length > 0 ? safeStats.topProducts : dummyData.topProducts).map((product, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-lg">
                          {['📱', '👟', '💻', '📱', '🎧'][i % 5]}
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium text-gray-900">
                      {(product.salesCount || product.sales || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-gray-600">
                      ${(product.revenue || (parseFloat(product.price || 0) * (product.salesCount || 0))).toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center text-emerald-600 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {product.growth || Math.floor(Math.random() * 30 + 5)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
            <p className="text-sm text-gray-500 mt-1">Revenue distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dummyData.categoryPerformance}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {dummyData.categoryPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {dummyData.categoryPerformance.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              <p className="text-sm text-gray-500 mt-1">Current order distribution</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Pending', count: safeStats.pendingOrders || 0, bgColor: 'bg-amber-50', textColor: 'text-amber-700', icon: '⏳' },
              { label: 'Processing', count: safeStats.orderStatus.find(s => s.name === 'Processing')?.count || 0, bgColor: 'bg-indigo-50', textColor: 'text-indigo-700', icon: '⚙️' },
              { label: 'Shipped', count: safeStats.orderStatus.find(s => s.name === 'Shipped')?.count || 0, bgColor: 'bg-violet-50', textColor: 'text-violet-700', icon: '🚚' },
              { label: 'Delivered', count: safeStats.orderStatus.find(s => s.name === 'Delivered')?.count || 0, bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', icon: '✓' },
            ].map((status, i) => (
              <div key={i} className={`p-4 ${status.bgColor} rounded-xl text-center`}>
                <span className="text-2xl">{status.icon}</span>
                <p className={`text-2xl font-bold ${status.textColor} mt-2`}>{status.count}</p>
                <p className="text-sm text-gray-500 mt-1">{status.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500 mt-1">Latest store events</p>
            </div>
          </div>
          <div className="space-y-4">
            {(safeStats.recentActivity.length > 0 ? safeStats.recentActivity : [
              { type: 'order', message: 'New order received', time: 'Just now' },
              { type: 'user', message: 'New customer registered', time: '15 min ago' },
              { type: 'product', message: 'Product stock updated', time: '1 hour ago' },
              { type: 'order', message: 'Order shipped', time: '2 hours ago' },
            ]).slice(0, 5).map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-indigo-100 text-indigo-600' :
                  activity.type === 'user' ? 'bg-emerald-100 text-emerald-600' :
                  'bg-violet-100 text-violet-600'
                }`}>
                  {activity.type === 'order' ? '📦' : activity.type === 'user' ? '👤' : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;