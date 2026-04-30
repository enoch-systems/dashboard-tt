"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentRequest } from '@/data/paymentRequests';

interface NotificationContextType {
  viewedRequests: Set<number>;
  markAsViewed: (requestId: number) => void;
  newPaymentRequests: PaymentRequest[];
  setNewPaymentRequests: (requests: PaymentRequest[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [viewedRequests, setViewedRequests] = useState<Set<number>>(new Set());
  const [newPaymentRequests, setNewPaymentRequests] = useState<PaymentRequest[]>([]);

  const markAsViewed = (requestId: number) => {
    setViewedRequests(prev => new Set(prev).add(requestId));
  };

  return (
    <NotificationContext.Provider value={{
      viewedRequests,
      markAsViewed,
      newPaymentRequests,
      setNewPaymentRequests
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
