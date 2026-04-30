"use client";
import React, { useState, useEffect } from "react";
import { mockPaymentRequests, PaymentRequest } from "@/data/paymentRequests";
import { useNotifications } from "@/context/NotificationContext";

export function PaymentChecker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("default");
  const { viewedRequests, markAsViewed } = useNotifications();
  const itemsPerPage = 20;

  const filteredRequests = mockPaymentRequests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm)
  );

  // Sort by date/time
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (dateFilter === "newest") {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    } else if (dateFilter === "oldest") {
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    }
    return 0; // default - no sorting
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = sortedRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Reset to page 1 when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter]);

  const handleStatusChange = (requestId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
    // This will be connected to an API to update the status
    console.log(`Updating request ${requestId} to ${newStatus}`);
    // For now, just log it - you'll implement the actual API call later
  };

  const handleImageClick = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setShowImageModal(true);
    // Mark this request as viewed using shared context
    markAsViewed(request.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Payment Checker</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage payment proof submissions
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="default">Default</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Payment Requests List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentRequests.map((request, index) => (
              <div
                key={request.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="w-8 text-sm text-gray-900 dark:text-gray-200 font-medium mt-1">
                      {indexOfFirstRequest + index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-base font-medium text-gray-900 dark:text-white mb-2">
                        {request.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {request.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Phone: {request.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {!viewedRequests.has(request.id) && (
                      <div className="text-amber-600 dark:text-amber-400 text-xs font-medium animate-bounce sticky -top-1">
                        New message!
                      </div>
                    )}
                    <button
                      onClick={() => handleImageClick(request)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      View Proof
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-900 dark:text-white font-medium">No payment requests found</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Try adjusting your search criteria
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {indexOfFirstRequest + 1} to {Math.min(indexOfLastRequest, filteredRequests.length)} of {filteredRequests.length} requests
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setShowImageModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Payment Proof - {selectedRequest.name}
                </h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">¥{selectedRequest.amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Payment Date:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedRequest.paymentDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedRequest.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedRequest.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Submitted:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedRequest.submittedAt}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
                {/* This will display the actual uploaded image */}
                <div className="text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Payment proof image will be displayed here
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    Image URL: {selectedRequest.imageUrl}
                  </p>
                </div>
              </div>

                          </div>
          </div>
        </div>
      )}
    </div>
  );
}
