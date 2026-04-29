"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type PaymentPlan = "Select a plan" | "Fully Paid" | "1st installment" | "2nd installment";

interface PaymentPlanContextType {
  studentPaymentPlans: { [key: number]: PaymentPlan };
  updateStudentPaymentPlan: (studentId: number, plan: PaymentPlan) => void;
  getStudentPaymentPlan: (studentId: number) => PaymentPlan;
}

const PaymentPlanContext = createContext<PaymentPlanContextType | undefined>(undefined);

export function PaymentPlanProvider({ children }: { children: ReactNode }) {
  const [studentPaymentPlans, setStudentPaymentPlans] = useState<{ [key: number]: PaymentPlan }>({});

  const updateStudentPaymentPlan = (studentId: number, plan: PaymentPlan) => {
    setStudentPaymentPlans((prev) => ({
      ...prev,
      [studentId]: plan,
    }));
  };

  const getStudentPaymentPlan = (studentId: number): PaymentPlan => {
    return studentPaymentPlans[studentId] || "Select a plan";
  };

  return (
    <PaymentPlanContext.Provider value={{ studentPaymentPlans, updateStudentPaymentPlan, getStudentPaymentPlan }}>
      {children}
    </PaymentPlanContext.Provider>
  );
}

export function usePaymentPlan() {
  const context = useContext(PaymentPlanContext);
  if (context === undefined) {
    throw new Error("usePaymentPlan must be used within a PaymentPlanProvider");
  }
  return context;
}
