import React from "react";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  enrollmentDate: string;
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Emma Johnson",
    email: "emma.johnson@email.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    enrollmentDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    enrollmentDate: "2024-01-20",
  },
  {
    id: 3,
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    phone: "+1 (555) 345-6789",
    status: "inactive",
    enrollmentDate: "2023-12-10",
  },
  {
    id: 4,
    name: "James Davis",
    email: "james.davis@email.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    enrollmentDate: "2024-02-01",
  },
  {
    id: 5,
    name: "Olivia Martinez",
    email: "olivia.martinez@email.com",
    phone: "+1 (555) 567-8901",
    status: "active",
    enrollmentDate: "2024-02-15",
  },
  {
    id: 6,
    name: "Daniel Brown",
    email: "daniel.brown@email.com",
    phone: "+1 (555) 678-9012",
    status: "active",
    enrollmentDate: "2024-03-01",
  },
];

export function StudentList() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Student Directory
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage and view all student information
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Enrollment Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {mockStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {student.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {student.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      student.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {student.enrollmentDate}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
