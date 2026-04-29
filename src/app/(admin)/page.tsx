import type { Metadata } from "next";
import { StudentDatabaseTable } from "@/components/students/StudentDatabaseTable";
import React from "react";

export const metadata: Metadata = {
  title:
    "Student Database | TT Academy - Next.js Dashboard Template",
  description: "Student Database Management System for TT Academy",
};

export default function StudentDatabase() {
  return <StudentDatabaseTable />;
}
