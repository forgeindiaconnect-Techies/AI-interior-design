import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Search, Clock, CheckCircle, RefreshCw } from 'lucide-react';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/contact');
      setMessages(res.data.data || []);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/contact/${id}/status`, { status: newStatus });
      setMessages(messages.map(msg => msg._id === id ? { ...msg, status: newStatus } : msg));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Read': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-6 h-6 text-[#1D3557]" />
              Contact Messages
            </h1>
            <p className="text-gray-500 text-sm mt-1">View and manage inquiries from the landing page Contact Us form.</p>
          </div>
          <button 
            onClick={fetchMessages}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-medium transition-colors border border-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages by name, email or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D3557]/20 focus:border-[#1D3557] transition-all text-sm"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Total Messages: {filteredMessages.length}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Sender Info</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                        <p>Loading messages...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Mail className="w-12 h-12 text-gray-300" />
                        <p className="text-lg font-medium text-gray-900">No messages found</p>
                        <p>When users submit the contact form, they will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg) => (
                    <tr key={msg._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 align-top">
                        <div className="font-bold text-gray-900">{msg.name}</div>
                        <div className="text-gray-500">{msg.email}</div>
                      </td>
                      <td className="px-6 py-4 align-top max-w-xs">
                        <p className="text-gray-700 line-clamp-3" title={msg.message}>
                          {msg.message}
                        </p>
                      </td>
                      <td className="px-6 py-4 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(msg.status)}`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <select
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                          className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg focus:ring-[#1D3557] focus:border-[#1D3557] block w-full p-2"
                        >
                          <option value="New">Mark as New</option>
                          <option value="Read">Mark as Read</option>
                          <option value="Resolved">Mark as Resolved</option>
                          <option value="Archived">Archive</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
  );
};

export default AdminContactMessages;
