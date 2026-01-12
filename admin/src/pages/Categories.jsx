import { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setError(null);
      const response = await api.get('/admin/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formData);
        alert('Category updated successfully');
      } else {
        await api.post('/admin/categories', formData);
        alert('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/admin/categories/${id}`);
        alert('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting category');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image: '' });
    setEditingCategory(null);
  };

  const columns = [
    {
      header: 'Image',
      render: (row) => (
        <div className="flex justify-center">
          <img
            src={row.image || 'https://via.placeholder.com/60x60/e5e7eb/9ca3af?text=No+Image'}
            alt={row.name}
            className="w-14 h-14 object-cover rounded-lg border border-gray-100 shadow-sm"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/60x60/e5e7eb/9ca3af?text=No+Image';
            }}
          />
        </div>
      )
    },
    { 
      header: 'Category Name', 
      render: (row) => (
        <div className="font-semibold text-gray-900 text-lg">{row.name}</div>
      )
    },
    { 
      header: 'Description', 
      render: (row) => (
        <div className="text-gray-600 max-w-xs truncate" title={row.description}>
          {row.description || <span className="italic text-gray-400">No description</span>}
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${row.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-rose-800 mb-2">Error Loading Categories</h3>
        <p className="text-rose-600 mb-4">{error}</p>
        <button 
          onClick={() => { setLoading(true); fetchCategories(); }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Categories Management
            </h1>
            <p className="text-gray-500 mt-2">Organize your products with categories</p>
          </div>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium flex items-center"
          >
            <span className="mr-2 text-xl">+</span> Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          data={categories}
          actions={(row) => (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(row)}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium border border-indigo-100"
                title="Edit Category"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-xs font-medium border border-rose-100"
                title="Delete Category"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">📁 Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="Enter category name..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">📝 Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              placeholder="Brief category description..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">🖼️ Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="form-input"
              placeholder="https://example.com/category-image.jpg"
            />
            {formData.image && (
              <div className="mt-3 flex justify-center">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="btn-secondary"
            >
              ❌ Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingCategory ? '✅ Update Category' : '🚀 Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
