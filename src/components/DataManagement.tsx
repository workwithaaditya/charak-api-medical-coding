import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

interface DataManagementProps {
  userRole: 'DOCTOR' | 'GOVERNMENT' | 'ADMIN';
}

const DataManagement: React.FC<DataManagementProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'disorders' | 'patients'>('disorders');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      let result: any;
      switch (activeTab) {
        case 'users':
          // Mock users data since we don't have a users endpoint yet
          result = [{ id: '1', username: 'demo', role: 'DOCTOR' }];
          setData(Array.isArray(result) ? result : []);
          break;
        case 'disorders':
          result = await apiService.getDisorders({ search: searchQuery, limit: 100 });
          setData((result as any)?.disorders || []);
          break;
        case 'patients':
          result = await apiService.getPatients({ search: searchQuery, limit: 100 });
          setData((result as any)?.patients || []);
          break;
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await loadData();
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      switch (activeTab) {
        case 'users':
          await apiService.deleteUser(id);
          break;
        case 'disorders':
          await apiService.deleteDisorder(id);
          break;
        case 'patients':
          await apiService.deletePatient(id);
          break;
      }
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        switch (activeTab) {
          case 'disorders':
            await apiService.updateDisorder(editingItem.id, formData);
            break;
          case 'patients':
            await apiService.updatePatient(editingItem.id, formData);
            break;
        }
      } else {
        switch (activeTab) {
          case 'users':
            await apiService.createUser(formData);
            break;
          case 'disorders':
            await apiService.createDisorder(formData);
            break;
          case 'patients':
            await apiService.createPatient(formData);
            break;
        }
      }
      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save item');
    }
  };

  if (userRole !== 'ADMIN' && userRole !== 'GOVERNMENT') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">You don't have permission to access data management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Management</h2>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['users', 'disorders', 'patients'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      {(activeTab === 'disorders' || activeTab === 'patients') && (
        <div className="flex gap-4">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No data found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {activeTab === 'users' && (
                  <>
                    <th className="border border-gray-300 p-2">Username</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Role</th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Created</th>
                  </>
                )}
                {activeTab === 'disorders' && (
                  <>
                    <th className="border border-gray-300 p-2">English Name</th>
                    <th className="border border-gray-300 p-2">Sanskrit Name</th>
                    <th className="border border-gray-300 p-2">ICD-11</th>
                    <th className="border border-gray-300 p-2">NAMASTE</th>
                    <th className="border border-gray-300 p-2">Category</th>
                  </>
                )}
                {activeTab === 'patients' && (
                  <>
                    <th className="border border-gray-300 p-2">ABHA ID</th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Gender</th>
                    <th className="border border-gray-300 p-2">Phone</th>
                    <th className="border border-gray-300 p-2">Email</th>
                  </>
                )}
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  {activeTab === 'users' && (
                    <>
                      <td className="border border-gray-300 p-2">{item.username}</td>
                      <td className="border border-gray-300 p-2">{item.email}</td>
                      <td className="border border-gray-300 p-2">{item.role}</td>
                      <td className="border border-gray-300 p-2">
                        {[item.firstName, item.lastName].filter(Boolean).join(' ') || 'N/A'}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </>
                  )}
                  {activeTab === 'disorders' && (
                    <>
                      <td className="border border-gray-300 p-2">{item.englishName}</td>
                      <td className="border border-gray-300 p-2">{item.sanskritName || 'N/A'}</td>
                      <td className="border border-gray-300 p-2">{item.icd11Code}</td>
                      <td className="border border-gray-300 p-2">{item.namasteCode}</td>
                      <td className="border border-gray-300 p-2">{item.category}</td>
                    </>
                  )}
                  {activeTab === 'patients' && (
                    <>
                      <td className="border border-gray-300 p-2">{item.abhaId}</td>
                      <td className="border border-gray-300 p-2">
                        {[item.firstName, item.lastName].filter(Boolean).join(' ') || 'N/A'}
                      </td>
                      <td className="border border-gray-300 p-2">{item.gender || 'N/A'}</td>
                      <td className="border border-gray-300 p-2">{item.phone || 'N/A'}</td>
                      <td className="border border-gray-300 p-2">{item.email || 'N/A'}</td>
                    </>
                  )}
                  <td className="border border-gray-300 p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'users' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      value={formData.username || ''}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  {!editingItem && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      value={formData.role || 'DOCTOR'}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="DOCTOR">Doctor</option>
                      <option value="GOVERNMENT">Government</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'disorders' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">English Name</label>
                    <input
                      type="text"
                      value={formData.englishName || ''}
                      onChange={(e) => setFormData({...formData, englishName: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sanskrit Name</label>
                    <input
                      type="text"
                      value={formData.sanskritName || ''}
                      onChange={(e) => setFormData({...formData, sanskritName: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ICD-11 Code</label>
                    <input
                      type="text"
                      value={formData.icd11Code || ''}
                      onChange={(e) => setFormData({...formData, icd11Code: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">NAMASTE Code</label>
                    <input
                      type="text"
                      value={formData.namasteCode || ''}
                      onChange={(e) => setFormData({...formData, namasteCode: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </>
              )}

              {activeTab === 'patients' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">ABHA ID</label>
                    <input
                      type="text"
                      value={formData.abhaId || ''}
                      onChange={(e) => setFormData({...formData, abhaId: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;