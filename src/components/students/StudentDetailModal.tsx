"use client";
import React, { useState, useEffect } from "react";
import { getStudentById, type Student } from "@/data/students";

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
}

export function StudentDetailModal({ isOpen, onClose, studentId }: StudentDetailModalProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      const loadStudent = async () => {
        try {
          setLoading(true);
          const data = await getStudentById(studentId.toString());
          setStudent(data);
        } catch (err) {
          console.error('Error loading student:', err);
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
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white text-lg font-medium">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {student.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Personal Information
              </h5>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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

            {/* Academic Details */}
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
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Employment Status
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.currentEmploymentStatus}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Has Laptop & Internet
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.hasLaptopAndInternet}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 lg:col-span-3">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.phone}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{student.email}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
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
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 lg:col-span-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    How Did You Hear
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
