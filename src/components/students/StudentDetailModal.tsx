"use client";
import React, { useState, useEffect } from "react";
import { getStudentById, type Student } from "@/data/students";

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

export function StudentDetailModal({ isOpen, onClose, studentId }: StudentDetailModalProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && studentId) {
      const loadStudent = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getStudentById(studentId.toString());
          setStudent(data);
        } catch (err) {
          console.error('Error loading student:', err);
          setError(err instanceof Error ? err.message : 'Failed to load student details');
        } finally {
          setLoading(false);
        }
      };
      loadStudent();
    }
  }, [isOpen, studentId]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Error</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setError(null);
                  // Retry loading the student
                  const loadStudent = async () => {
                    try {
                      setLoading(true);
                      const data = await getStudentById(studentId.toString());
                      setStudent(data);
                      setError(null);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to load student details');
                    } finally {
                      setLoading(false);
                    }
                  };
                  loadStudent();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center p-4 pt-34">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full h-[85vh] max-h-[85vh] p-4 lg:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Student Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(85vh-120px)] space-y-4">
            {/* Student Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-medium">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {student.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {student.originalId}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  student.status === 'Confirmed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : student.status === 'Awaiting'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                }`}>
                  {student.status}
                </span>
              </div>
            </div>

            {/* Course & Registration */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Course & Registration Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Course
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.course}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Registration Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.regDate}</p>
                  {student.regTime && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Time: {student.regTime}
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Timestamp
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.timestamp}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Payment Plan
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.paymentPlan}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Amount Paid
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">₦{student.amountPaid.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Balance Remaining
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">₦{student.balanceRemaining.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Personal Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Gender
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.gender}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    State of Residence
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.stateOfResidence}</p>
                </div>
              </div>
            </div>

            {/* Academic & Career Details */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Academic & Career Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Learning Track
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.learningTrack}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Employment Status
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.currentEmploymentStatus}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Has Laptop & Internet
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.hasLaptopAndInternet}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 lg:col-span-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Scholarship Interest
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.wantsScholarship}</p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Contact Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.phone}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white break-all">{student.email}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 md:col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    How Did You Hear About Us
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.howDidYouHear}</p>
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Why Learn This Skill
              </h5>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {student.whyLearnThisSkill}
                </p>
              </div>
            </div>

            {/* Progress Information */}
            {student.lastProgress && (
              <div>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Progress Information
                </h5>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {student.lastProgress}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
