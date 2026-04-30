"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchStudents, type Student } from "@/data/students";
import { StudentDetailModal } from "./StudentDetailModal";
import { usePaymentPlan, PaymentPlan } from "@/context/PaymentPlanContext";

export function StudentDatabaseTable() {
  const { updateStudentPaymentPlan, getStudentPaymentPlan } = usePaymentPlan();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>("All Students");
  const [openPaymentPlanDropdown, setOpenPaymentPlanDropdown] = useState<number | null>(null);
  const [lockedPaymentPlans, setLockedPaymentPlans] = useState<{ [key: number]: boolean }>({});
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [editedPaymentPlans, setEditedPaymentPlans] = useState<{ [key: number]: number }>({});
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("default");
  const itemsPerPage = 20;
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const paymentPlanDropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Fetch students from Supabase
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStudents();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load students');
        console.error('Error loading students:', err);
      } finally {
        setLoading(false);
      }
    };
  
    loadStudents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setPaymentDropdownOpen(false);
      }
    };
    if (paymentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [paymentDropdownRef, paymentDropdownOpen]);

  // Auto-clear edited payment plans after 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setEditedPaymentPlans(prev => {
        const filtered = Object.fromEntries(
          Object.entries(prev).filter(([_, timestamp]) => now - timestamp < 4000)
        );
        return filtered;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);

  // Auto-clear edit messages after 3 seconds
  useEffect(() => {
    if (editMessage) {
      const timer = setTimeout(() => {
        setEditMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [editMessage]);

  const setPaymentPlanDropdownRef = useCallback((studentId: number) => (el: HTMLDivElement | null) => {
    paymentPlanDropdownRefs.current[studentId] = el;
  }, []);

  const handlePaymentPlanChange = async (studentId: number, plan: PaymentPlan) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      if (plan === "Select a plan") {
        setEditMessage({ type: 'error', text: 'Please select a valid payment plan' });
        return;
      }

      try {
        const success = await updateStudentPaymentPlan(student.originalId, plan);
        if (success) {
          setEditMessage({ type: 'success', text: `Payment plan updated to "${plan}" for ${student.name}` });
          setLockedPaymentPlans(prev => ({ ...prev, [studentId]: true }));
        } else {
          setEditMessage({ type: 'error', text: 'Failed to update payment plan. Please try again.' });
        }
      } catch (error) {
        setEditMessage({ type: 'error', text: 'Error updating payment plan. Please try again.' });
      }
    }
    setOpenPaymentPlanDropdown(null);
  };

  const handleEditClick = (studentId: number) => {
    setEditingStudentId(studentId);
    setShowEditConfirmModal(true);
  };

  const confirmEdit = () => {
    if (editingStudentId !== null) {
      // Unlock payment plan after editing is confirmed
      setLockedPaymentPlans(prev => ({ ...prev, [editingStudentId]: false }));
      // Open dropdown for immediate editing
      setOpenPaymentPlanDropdown(editingStudentId);
      // Track edited payment plan with timestamp for animation
      setEditedPaymentPlans(prev => ({ ...prev, [editingStudentId]: Date.now() }));
    }
    setShowEditConfirmModal(false);
    setEditingStudentId(null);
  };

  const cancelEdit = () => {
    setShowEditConfirmModal(false);
    setEditingStudentId(null);
  };

  const filteredStudents = students.filter(
    (student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPaymentFilter = 
        selectedPaymentFilter === "All Students" ||
        getStudentPaymentPlan(student.originalId) === selectedPaymentFilter;
      
      return matchesSearch && matchesPaymentFilter;
    }
  );

  // Calculate gender statistics
  const genderStats = filteredStudents.reduce(
    (acc, student) => {
      if (student.gender === "Male") {
        acc.male++;
      } else if (student.gender === "Female") {
        acc.female++;
      }
      return acc;
    },
    { male: 0, female: 0 }
  );

  // Sort by date/time
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (dateFilter === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (dateFilter === "oldest") {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return 0; // default - no sorting
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

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
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPaymentFilter, dateFilter]);

  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="py-6">
        {/* Header */}
        <div className="mb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-2 sm:mb-3">
              Student Database
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              Manage and view all student information and payment details
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="relative max-w-md sm:max-w-lg lg:max-w-xl flex-1">
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
                className="block w-full pl-10 pr-3 py-3 sm:py-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm sm:text-base"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 sm:py-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm sm:text-base"
              >
                <option value="default">Default</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading students...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400 flex items-center gap-4 flex-wrap">
              Total students: <span className="font-semibold text-gray-900 dark:text-white">{filteredStudents.length}</span>
              <span className="text-gray-400">|</span>
              Male: <span className="font-semibold text-blue-600 dark:text-blue-400">{genderStats.male}</span>
              <span className="text-gray-400">|</span>
              Female: <span className="font-semibold text-pink-600 dark:text-pink-400">{genderStats.female}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Payment Status Dropdown */}
              <div className="relative" ref={paymentDropdownRef}>
                <button
                  onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-md transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                >
                  Payment Status
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {paymentDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          setSelectedPaymentFilter("All Students");
                          setPaymentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        All Students
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPaymentFilter("Fully Paid");
                          setPaymentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Fully Paid
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPaymentFilter("1st installment");
                          setPaymentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        1st installment
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPaymentFilter("2nd installment");
                          setPaymentDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        2nd installment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Message Display */}
          {editMessage && (
            <div className={`mb-4 p-4 rounded-md ${
              editMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400'
                : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
            }`}>
              <div className="flex items-center">
                {editMessage.type === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-medium">{editMessage.text}</span>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    NO.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    STUDENT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    CONTACT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    COURSE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    REG. DATE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    PAYMENT PLAN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    AMOUNT PAID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    BALANCE REMAINING
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    EDIT PLAN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {indexOfFirstStudent + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {student.regDate}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {student.regTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative" ref={setPaymentPlanDropdownRef(student.id)}>
                        <button
                          onClick={() => lockedPaymentPlans[student.id] ? null : setOpenPaymentPlanDropdown(openPaymentPlanDropdown === student.id ? null : student.id)}
                          disabled={lockedPaymentPlans[student.id]}
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold items-center gap-1 relative ${
                            getStudentPaymentPlan(student.originalId) === "Fully Paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : getStudentPaymentPlan(student.originalId) === "1st installment"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : getStudentPaymentPlan(student.originalId) === "2nd installment"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          } ${lockedPaymentPlans[student.id] ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'} transition-opacity duration-200 ${
                            editedPaymentPlans[student.id] ? 'animate-pulse border-2 border-red-500' : ''
                          }`}
                        >
                          {getStudentPaymentPlan(student.originalId)}
                          {getStudentPaymentPlan(student.originalId) === "Select a plan" && (
                            <svg 
                              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                                openPaymentPlanDropdown === student.id ? 'rotate-180' : ''
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                          {editedPaymentPlans[student.id] && (
                            <svg 
                              className="w-4 h-4 ml-1 text-red-500 animate-bounce"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                        
                        {openPaymentPlanDropdown === student.id && !lockedPaymentPlans[student.id] && (
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handlePaymentPlanChange(student.id, "Select a plan")}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Select a plan
                              </button>
                              <button
                                onClick={() => handlePaymentPlanChange(student.id, "Fully Paid")}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Fully Paid
                              </button>
                              <button
                                onClick={() => handlePaymentPlanChange(student.id, "1st installment")}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                1st installment
                              </button>
                              <button
                                onClick={() => handlePaymentPlanChange(student.id, "2nd installment")}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                2nd installment
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                      {(() => {
                        const plan = getStudentPaymentPlan(student.originalId);
                        if (plan === "Fully Paid") return "50,000";
                        if (plan === "1st installment") return "30,000";
                        if (plan === "2nd installment") return (
                          <div>
                            <div>20,000</div>
                            <div className="text-[10px] text-gray-500">+30,000<br />1st pay</div>
                          </div>
                        );
                        return "N/A";
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {(() => {
                        const plan = getStudentPaymentPlan(student.originalId);
                        if (plan === "Fully Paid") return "0";
                        if (plan === "1st installment") return "20,000";
                        if (plan === "2nd installment") return "0";
                        return "N/A";
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <button 
                        onClick={() => handleEditClick(student.id)}
                        className={`${
                          lockedPaymentPlans[student.id] 
                            ? 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300' 
                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer'
                        } transition-colors duration-200`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <button 
                        onClick={() => {
                          setSelectedStudentId(student.id);
                          setShowStudentDetailModal(true);
                        }}
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 hover:border-blue-700 dark:border-blue-400 dark:hover:border-blue-300 rounded transition-colors duration-200"
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentStudents.length === 0 && (
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
                <p className="text-gray-900 dark:text-white font-medium">No students found</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Try adjusting your search criteria
                </p>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
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
      )}

      {/* Edit Confirmation Modal */}
      {showEditConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={cancelEdit}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Payment Plan
                </h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to edit the payment plan for this student? This will unlock the payment plan selection for modification.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                >
                  Confirm Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
        <StudentDetailModal
          isOpen={showStudentDetailModal}
          onClose={() => {
            setShowStudentDetailModal(false);
            setSelectedStudentId(null);
          }}
          studentId={selectedStudentId || 0}
        />
      </div>
    </div>
  );
}
