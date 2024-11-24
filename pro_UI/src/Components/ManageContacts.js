import React, { useState, useEffect } from 'react';
import { Loader2, Mail, Trash2, RefreshCcw } from 'lucide-react';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactCount, setContactCount] = useState(0);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/get/contact', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add the admin token from localStorage
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setContacts(result.data);
        setContactCount(result.count);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to fetch contacts');
      }
    } catch (err) {
      setError(err.message || 'Error fetching contact submissions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setContacts(contacts.filter(contact => contact._id !== id));
        setContactCount(prev => prev - 1);
      } else {
        throw new Error(result.message || 'Failed to delete contact');
      }
    } catch (err) {
      setError(err.message || 'Error deleting contact');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Contact Submissions</h2>
          <p className="text-gray-400">Total messages: {contactCount}</p>
        </div>
        <button
          onClick={fetchContacts}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 transition-colors"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-gray-900 rounded-lg">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No contact submissions yet</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-800"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-full pr-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()} {new Date(contact.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-yellow-600" />
                    <p className="text-yellow-600">{contact.email}</p>
                  </div>
                  <p className="text-gray-400">{contact.phone}</p>
                  <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap">{contact.message}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-500">
                      Subject: <span className="text-gray-300">{contact.subject || 'Not specified'}</span>
                    </p>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete contact"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageContacts;