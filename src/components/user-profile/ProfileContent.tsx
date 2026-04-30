"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function ProfileContent() {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isClient] = useState(true);

  useEffect(() => {
    if (isEditingPersonal) {
      const timer = setTimeout(() => {
        setIsEditingPersonal(false);
        setShowComingSoon(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isEditingPersonal]);

  
  const personalInfo = {
    firstName: "Amah",
    lastName: "Precious",
    email: "amahchibu@gmail.com",
    phone: "08034826276",
    bio: "CEO | Founder, Tech tailblazer Academy"
  };

  return (
    <div className="w-full px-2">
      {/* Main Profile Card */}
      <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {/* Profile Header */}
        <div className="p-6 pb-4">
          <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-6">Profile</h1>
          
          {/* User Info Row */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Image
                width={64}
                height={64}
                src="/belo.png"
                alt="Profile"
                className="rounded-full"
              />
              <div>
                <h2 className="text-gray-900 dark:text-white text-lg font-semibold">Amah Precious</h2>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <span>CEO | PH, Nigeria</span>
                </div>
              </div>
            </div>
            
            {/* Social Icons & Edit */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a3142] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a3142] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2a3142] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
              <div className="relative">
                {isClient && showComingSoon && (
                  <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    This feature would be available soon
                    <div className="absolute bottom-0 right-2 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                  </div>
                )}
                <button 
                  onClick={() => {
                    setIsEditingPersonal(true);
                    setShowComingSoon(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-[#2a3142] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800"></div>

        {/* Personal Information Section */}
        <div className="p-6">
          <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-gray-500 text-xs mb-1">First Name</label>
              <p className="text-gray-900 dark:text-white font-medium">{personalInfo.firstName}</p>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Last Name</label>
              <p className="text-gray-900 dark:text-white font-medium">{personalInfo.lastName}</p>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Email address</label>
              <p className="text-gray-900 dark:text-white font-medium">{personalInfo.email}</p>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1">Phone</label>
              <p className="text-gray-900 dark:text-white font-medium">{personalInfo.phone}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-500 text-xs mb-1">Bio</label>
              <p className="text-gray-900 dark:text-white font-medium">{personalInfo.bio}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800"></div>

        {/* Manage My Business Section */}
        <div className="p-6">
          <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-6">Manage My Business</h3>
          
          <div className="space-y-3">
            <a 
              href="https://business.facebook.com/latest/home?nav_ref=bm_home_redirect&business_id=1984480999152309&asset_id=110220428843203" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Image
                    width={20}
                    height={20}
                    src="/icons/facebook.png"
                    alt="Facebook"
                    className="w-5 h-5"
                  />
                </div>
                <div className="text-left">
                  <p className="text-gray-900 dark:text-white font-medium">Meta Business</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage your business accounts</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <a 
              href="https://chat.whatsapp.com/Bi5XuFToVdjBPRvIawWz5W" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Image
                    width={20}
                    height={20}
                    src="/icons/whatsappi.png"
                    alt="WhatsApp"
                    className="w-5 h-5"
                  />
                </div>
                <div className="text-left">
                  <p className="text-gray-900 dark:text-white font-medium">WhatsApp Group</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage your community</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
