"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { mockStudents, Student } from "@/data/students";
import { usePaymentPlan } from "@/context/PaymentPlanContext";

export function StudentDatabaseTable() {
  const { studentPaymentPlans, updateStudentPaymentPlan, getStudentPaymentPlan } = usePaymentPlan();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>("All Students");
  const [openPaymentPlanDropdown, setOpenPaymentPlanDropdown] = useState<number | null>(null);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const paymentPlanDropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setPaymentDropdownOpen(false);
      }
      if (openPaymentPlanDropdown !== null) {
        const dropdown = paymentPlanDropdownRefs.current[openPaymentPlanDropdown];
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenPaymentPlanDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [paymentDropdownRef, paymentPlanDropdownRefs, openPaymentPlanDropdown]);

  const setPaymentPlanDropdownRef = useCallback((studentId: number) => (el: HTMLDivElement | null) => {
    paymentPlanDropdownRefs.current[studentId] = el;
  }, []);

  const filteredStudents = mockStudents.filter(
    (student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPaymentFilter = 
        selectedPaymentFilter === "All Students" ||
        getStudentPaymentPlan(student.id) === selectedPaymentFilter;
      
      return matchesSearch && matchesPaymentFilter;
    }
  );

  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Student Database</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all student information and payment details
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
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
              placeholder="Search by name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400">
              Total students: <span className="font-semibold text-gray-900 dark:text-white">{filteredStudents.length}</span>
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
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-xs font-medium">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {student.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {student.regDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative" ref={setPaymentPlanDropdownRef(student.id)}>
                        <button
                          onClick={() => setOpenPaymentPlanDropdown(openPaymentPlanDropdown === student.id ? null : student.id)}
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold items-center gap-1 ${
                            getStudentPaymentPlan(student.id) === "Fully Paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : getStudentPaymentPlan(student.id) === "1st installment"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : getStudentPaymentPlan(student.id) === "2nd installment"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          } hover:opacity-80 transition-opacity duration-200 cursor-pointer`}
                        >
                          {getStudentPaymentPlan(student.id)}
                          <svg 
                            className={`w-3 h-3 transition-transform duration-200 ${
                              openPaymentPlanDropdown === student.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {openPaymentPlanDropdown === student.id && (
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  updateStudentPaymentPlan(student.id, "Select a plan");
                                  setOpenPaymentPlanDropdown(null);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Select a plan
                              </button>
                              <button
                                onClick={() => {
                                  updateStudentPaymentPlan(student.id, "Fully Paid");
                                  setOpenPaymentPlanDropdown(null);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Fully Paid
                              </button>
                              <button
                                onClick={() => {
                                  updateStudentPaymentPlan(student.id, "1st installment");
                                  setOpenPaymentPlanDropdown(null);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                1st installment
                              </button>
                              <button
                                onClick={() => {
                                  updateStudentPaymentPlan(student.id, "2nd installment");
                                  setOpenPaymentPlanDropdown(null);
                                }}
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
                        const plan = getStudentPaymentPlan(student.id);
                        if (plan === "Fully Paid") return "50,000";
                        if (plan === "1st installment") return "30,000";
                        if (plan === "2nd installment") return (
                          <div>
                            <div>20,000</div>
                            <div className="text-xs text-amber-100 dark:text-amber-70">+30,000 (1st installment)</div>
                          </div>
                        );
                        return "N/A";
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {(() => {
                        const plan = getStudentPaymentPlan(student.id);
                        if (plan === "Fully Paid") return "0";
                        if (plan === "1st installment") return "20,000";
                        if (plan === "2nd installment") return "0";
                        return "N/A";
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
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
        </div>
      </div>
    </div>
  );
}
