"use client";
import React, { useState } from "react";
import { mockStudents, Student } from "@/data/students";
import { SelectEmailType } from "./SelectEmailType";
import { ConfirmEmailType } from "./ConfirmEmailType";

export function EmailPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelectEmailModal, setShowSelectEmailModal] = useState(false);
  const [showConfirmEmailModal, setShowConfirmEmailModal] = useState(false);
  const [selectedEmailType, setSelectedEmailType] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("default");
  const itemsPerPage = 20;

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter]);

  const handleSendEmailClick = (student: Student) => {
    setSelectedStudent(student);
    setShowSelectEmailModal(true);
  };

  const handleEmailTypeSelect = (emailType: string) => {
    setSelectedEmailType(emailType);
    setShowSelectEmailModal(false);
    setShowConfirmEmailModal(true);
  };

  const handleConfirmEmail = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedStudent?.email,
          emailType: selectedEmailType,
          data: {
            studentName: selectedStudent?.name,
            courseName: selectedStudent?.course || 'Course',
            // Add other fields based on email type
            startDate: new Date().toISOString().split('T')[0],
            amountPaid: selectedStudent?.amountPaid || 0,
            balanceRemaining: selectedStudent?.balanceRemaining || 0,
            paymentPlan: selectedStudent?.paymentPlan || 'Select a plan',
            paymentDate: new Date().toISOString().split('T')[0],
            resumptionDate: new Date().toISOString().split('T')[0],
            lastProgress: selectedStudent?.lastProgress || 'Not started',
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert(`Failed to send email: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to send email. Please try again.');
    }
    
    setShowConfirmEmailModal(false);
    setSelectedEmailType("");
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Email Portal</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search and send emails to students
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
              placeholder="Search by name or email..."
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

        {/* Student List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentStudents.map((student, index) => (
              <div
                key={student.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 text-sm text-gray-900 dark:text-gray-200 font-medium">
                      {indexOfFirstStudent + index + 1}
                    </div>
                    <div className="h-10 w-10 flex-shrink-0 ml-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-sm font-medium">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.email}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSendEmailClick(student)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            ))}
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
        </div>

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

      {/* Email Type Selection Modal */}
      <SelectEmailType
        isOpen={showSelectEmailModal}
        onClose={() => setShowSelectEmailModal(false)}
        onEmailTypeSelect={handleEmailTypeSelect}
        studentName={selectedStudent?.name}
        studentEmail={selectedStudent?.email}
      />

      {/* Email Confirmation Modal */}
      <ConfirmEmailType
        isOpen={showConfirmEmailModal}
        onClose={() => setShowConfirmEmailModal(false)}
        onConfirm={handleConfirmEmail}
        emailType={selectedEmailType}
        studentName={selectedStudent?.name}
        studentEmail={selectedStudent?.email}
      />
    </div>
  );
}
