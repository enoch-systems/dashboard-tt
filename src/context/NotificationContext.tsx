"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchPaymentReceipts, markReceiptAsViewed, getViewedReceipts } from '@/lib/paymentReceiptService';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface NotificationContextType {
  viewedRequests: Set<string>;
  markAsViewed: (requestId: string) => Promise<void>;
  pendingCount: number;
  refreshPendingCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [viewedRequests, setViewedRequests] = useState<Set<string>>(new Set());
  const [pendingCount, setPendingCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const refreshPendingCount = async (
    targetUserId: string | null = userId,
    providedViewedRequests?: Set<string>,
  ) => {
    if (!targetUserId) {
      setPendingCount(0);
      return;
    }

    try {
      const pendingReceipts = await fetchPaymentReceipts('pending', 200);
      const viewedSet = providedViewedRequests ?? await getViewedReceipts(targetUserId);
      const unreadCount = pendingReceipts.filter(
        (receipt) => !viewedSet.has(receipt.id),
      ).length;

      setPendingCount(unreadCount);
    } catch (error) {
      console.error('Error refreshing pending count:', error);
    }
  };

  const markAsViewed = async (requestId: string) => {
    if (!userId || !requestId || viewedRequests.has(requestId)) {
      return;
    }

    try {
      await markReceiptAsViewed(requestId, userId);
    } catch (error) {
      console.error('Error marking receipt as viewed:', error);
    }

    setViewedRequests((prev) => {
      const next = new Set(prev);
      next.add(requestId);
      return next;
    });
    setPendingCount((prev) => Math.max(prev - 1, 0));
  };

  // Load viewed receipts from database on mount and user auth change
  useEffect(() => {
    const loadViewedReceipts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const viewed = await getViewedReceipts(user.id);
        setViewedRequests(viewed);
        await refreshPendingCount(user.id, viewed);
      } else {
        setUserId(null);
        setViewedRequests(new Set());
        setPendingCount(0);
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
        setPendingCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Refresh pending count every 30 seconds
  useEffect(() => {
    refreshPendingCount();
    const interval = setInterval(() => {
      refreshPendingCount();
    }, 15000);
    return () => clearInterval(interval);
  }, [userId]);

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
