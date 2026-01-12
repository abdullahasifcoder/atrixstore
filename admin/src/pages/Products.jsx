import { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    categoryId: '',
    description: '',
    shortDescription: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === parseInt(selectedCategory));
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';
      
      if (sortBy === 'price' || sortBy === 'stock') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setError(null);
      const response = await api.get('/api/admin/products?limit=100');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/admin/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, formData);
        alert('Product updated successfully');
      } else {
        await api.post('/api/admin/products', formData);
        alert('Product created successfully');
      }
      setIsModalOpen(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/admin/products/${id}`);
        alert('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      imageUrl: product.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      price: '',
      stock: '',
      categoryId: '',
      description: '',
      shortDescription: '',
      imageUrl: ''
    });
    setEditingProduct(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: 'name',
      label: 'Product Name',
      render: (product) => (
        <div className="flex items-center">
          {product.imageUrl && (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg mr-3"
            />
          )}
          <div>
            <div className="font-semibold text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          </div>
        </div>
      )
    },
    {
      key: 'Category',
      label: 'Category',
      render: (product) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
          {categories.find(cat => cat.id === product.categoryId)?.name || 'N/A'}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (product) => (
        <div className="text-lg font-semibold text-gray-700">
          ${parseFloat(product.price || 0).toFixed(2)}
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (product) => (
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
            product.stock > 10 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
            product.stock > 0 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
            'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {product.stock} units
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(product)}
            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium border border-indigo-100"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium border border-rose-100"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => { setLoading(true); fetchProducts(); }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Products Management</h1>
        <p className="text-gray-500">Manage your product inventory, pricing, and stock levels</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <div className="relative min-w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="createdAt">Sort by Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '⬆️' : '⬇️'}
              </button>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>➕</span>
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-indigo-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Total Products</div>
            <div className="text-2xl font-bold">{products.length}</div>
          </div>
          <div className="bg-emerald-600 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">In Stock</div>
            <div className="text-2xl font-bold">{products.filter(p => p.stock > 0).length}</div>
          </div>
          <div className="bg-amber-500 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Low Stock</div>
            <div className="text-2xl font-bold">{products.filter(p => p.stock <= 10 && p.stock > 0).length}</div>
          </div>
          <div className="bg-rose-500 p-4 rounded-lg text-white">
            <div className="text-sm opacity-90">Out of Stock</div>
            <div className="text-2xl font-bold">{products.filter(p => p.stock === 0).length}</div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table data={filteredProducts} columns={columns} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief product description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed product description..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;