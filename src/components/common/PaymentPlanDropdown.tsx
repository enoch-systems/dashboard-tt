"use client";
import React from 'react';
import { usePaymentPlan } from '@/context/PaymentPlanContext';

interface PaymentPlanDropdownProps {
  studentId: string;
  onPlanChange?: (success: boolean) => void;
  disabled?: boolean;
}

export function PaymentPlanDropdown({ studentId, onPlanChange, disabled = false }: PaymentPlanDropdownProps) {
  const { studentPaymentPlans, updateStudentPaymentPlan, getStudentPaymentPlan, isLoading } = usePaymentPlan();
  
  const currentPlan = getStudentPaymentPlan(studentId);
  
  const paymentPlanOptions = [
    { value: 'Select a plan', label: 'Select a plan' },
    { value: 'Fully Paid', label: 'Fully Paid' },
    { value: '1st installment', label: '1st Installment' },
    { value: '2nd installment', label: '2nd Installment' }
  ];

  const handlePlanChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlan = e.target.value as any;
    
    if (newPlan === 'Select a plan') {
      onPlanChange?.(false);
      return;
    }

    const success = await updateStudentPaymentPlan(studentId, newPlan);
    onPlanChange?.(success);
  };

  return (
    <div className="relative">
      <select
        value={currentPlan}
        onChange={handlePlanChange}
        disabled={disabled || isLoading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {paymentPlanOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {isLoading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
