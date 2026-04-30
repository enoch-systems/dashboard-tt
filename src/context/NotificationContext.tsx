"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPendingPaymentReceiptsCount, markReceiptAsViewed, getViewedReceipts } from '@/lib/paymentReceiptService';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface NotificationContextType {
  viewedRequests: Set<number>;
  markAsViewed: (requestId: number) => void;
  pendingCount: number;
  refreshPendingCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [viewedRequests, setViewedRequests] = useState<Set<number>>(new Set());
  const [pendingCount, setPendingCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const refreshPendingCount = async () => {
    try {
      const count = await getPendingPaymentReceiptsCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Error refreshing pending count:', error);
    }
  };

  const markAsViewed = async (requestId: number) => {
    if (userId) {
      // Mark as viewed in database
      await markReceiptAsViewed(requestId.toString(), userId);
      // Update local state
      setViewedRequests(prev => new Set(prev).add(requestId));
    }
  };

  // Load viewed receipts from database on mount and user auth change
  useEffect(() => {
    const loadViewedReceipts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const viewed = await getViewedReceipts(user.id);
        // Convert Set of strings to Set of numbers safely
        const viewedNumbers = new Set(Array.from(viewed).map(id => parseInt(id)).filter(n => !isNaN(n)));
        setViewedRequests(viewedNumbers);
      }
    };

    loadViewedReceipts();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadViewedReceipts();
      } else {
        setUserId(null);
        setViewedRequests(new Set());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Refresh pending count every 30 seconds
  useEffect(() => {
    refreshPendingCount();
    const interval = setInterval(refreshPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      viewedRequests,
      markAsViewed,
      pendingCount,
      refreshPendingCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
