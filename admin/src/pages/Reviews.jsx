import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Modal from '../components/Modal';
import Table from '../components/Table';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', rating: 'all' });
  const [adminResponse, setAdminResponse] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 1 });

  useEffect(() => {
    fetchReviews();
  }, [filter, pagination.page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', pagination.page);
      params.append('limit', 10);
      if (filter.status !== 'all') params.append('status', filter.status);
      if (filter.rating !== 'all') params.append('rating', filter.rating);
      
      const res = await axios.get(`/api/admin/reviews?${params.toString()}`);
      setReviews(res.data.reviews || []);
      setPagination(prev => ({
        ...prev,
        total: res.data.pagination?.totalPages || 1
      }));
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId, isApproved) => {
    try {
      await axios.put(`/api/admin/reviews/${reviewId}`, { isApproved });
      fetchReviews();
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`/api/admin/reviews/${reviewId}`);
      fetchReviews();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleAdminResponse = async () => {
    if (!selectedReview || !adminResponse.trim()) return;
    try {
      await axios.put(`/api/admin/reviews/${selectedReview.id}`, { 
        adminResponse: adminResponse.trim() 
      });
      fetchReviews();
      setShowModal(false);
      setAdminResponse('');
    } catch (error) {
      console.error('Failed to add response:', error);
    }
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setAdminResponse(review.adminResponse || '');
    setShowModal(true);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'product',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.product?.imageUrl && (
            <img
              src={row.product.imageUrl}
              alt={row.product.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 text-sm">{row.product?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">ID: {row.productId}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: 'user',
      cell: (row) => (
        <div>
          <p className="font-medium text-sm">{row.user?.firstName} {row.user?.lastName}</p>
          <p className="text-xs text-gray-500">{row.user?.email}</p>
        </div>
      )
    },
    {
      header: 'Rating',
      accessor: 'rating',
      cell: (row) => renderStars(row.rating)
    },
    {
      header: 'Review',
      accessor: 'comment',
      cell: (row) => (
        <div className="max-w-xs">
          {row.title && <p className="font-medium text-sm">{row.title}</p>}
          <p className="text-sm text-gray-600 truncate">{row.comment || 'No comment'}</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.isApproved 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
              : 'bg-amber-50 text-amber-700 border border-amber-100'
          }`}>
            {row.isApproved ? 'Approved' : 'Pending'}
          </span>
          {row.isVerifiedPurchase && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openReviewModal(row)}
            className="text-indigo-600 hover:text-indigo-800 p-1"
            title="View/Respond"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {!row.isApproved ? (
            <button
              onClick={() => handleStatusChange(row.id, true)}
              className="text-emerald-600 hover:text-emerald-800 p-1"
              title="Approve"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange(row.id, false)}
              className="text-slate-500 hover:text-slate-700 p-1"
              title="Unapprove"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </button>
          )}
          <button
            onClick={() => handleDelete(row.id)}
            className="text-slate-500 hover:text-slate-700 p-1"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-500 mt-1">Manage customer reviews and ratings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Reviews</p>
              <p className="text-xl font-bold text-slate-900">{reviews.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-700">{reviews.filter(r => !r.isApproved).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Verified</p>
              <p className="text-xl font-bold text-slate-700">{reviews.filter(r => r.isVerifiedPurchase).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Rating</p>
              <p className="text-xl font-bold text-blue-600">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select
              value={filter.rating}
              onChange={(e) => setFilter(prev => ({ ...prev, rating: e.target.value }))}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="all">All Ratings</option>
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={reviews}
          loading={loading}
          emptyMessage="No reviews found"
        />
        
        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.total}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.total}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedReview(null);
          setAdminResponse('');
        }}
        title="Review Details"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-6">
            {/* Product Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {selectedReview.product?.imageUrl && (
                <img
                  src={selectedReview.product.imageUrl}
                  alt={selectedReview.product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h4 className="font-semibold">{selectedReview.product?.name}</h4>
                <p className="text-sm text-gray-500">Product ID: {selectedReview.productId}</p>
              </div>
            </div>

            {/* Customer & Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Customer</label>
                <p className="font-medium">{selectedReview.user?.firstName} {selectedReview.user?.lastName}</p>
                <p className="text-sm text-gray-500">{selectedReview.user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Rating</label>
                <div className="mt-1">{renderStars(selectedReview.rating)}</div>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <label className="text-sm text-gray-500">Review</label>
              {selectedReview.title && (
                <h4 className="font-semibold mt-1">{selectedReview.title}</h4>
              )}
              <p className="mt-1 text-gray-700">{selectedReview.comment || 'No comment provided'}</p>
            </div>

            {/* Badges */}
            <div className="flex gap-2">
              {selectedReview.isVerifiedPurchase && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Purchase
                </span>
              )}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                selectedReview.isApproved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedReview.isApproved ? 'Approved' : 'Pending Approval'}
              </span>
            </div>

            {/* Admin Response */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seller Response</label>
              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Write a response to this review..."
                rows={3}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {selectedReview.adminResponseAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Last response: {new Date(selectedReview.adminResponseAt).toLocaleString()}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={() => handleDelete(selectedReview.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete Review
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(selectedReview.id, !selectedReview.isApproved)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedReview.isApproved
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {selectedReview.isApproved ? 'Unapprove' : 'Approve'}
                </button>
                <button
                  onClick={handleAdminResponse}
                  disabled={!adminResponse.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Save Response
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reviews;
