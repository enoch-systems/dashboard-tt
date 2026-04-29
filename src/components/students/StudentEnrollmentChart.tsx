import React from "react";

export function StudentEnrollmentChart() {
  const enrollmentData = [
    { month: "Jan", enrollments: 45 },
    { month: "Feb", enrollments: 52 },
    { month: "Mar", enrollments: 38 },
    { month: "Apr", enrollments: 61 },
    { month: "May", enrollments: 55 },
    { month: "Jun", enrollments: 72 },
  ];

  const maxEnrollments = Math.max(...enrollmentData.map(d => d.enrollments));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Student Enrollment Trends
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Monthly student enrollment statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">New Students</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {enrollmentData.map((data) => (
          <div key={data.month} className="flex items-center gap-4">
            <div className="w-8 text-sm font-medium text-gray-600 dark:text-gray-400">
              {data.month}
            </div>
            <div className="flex-1">
              <div className="relative h-8 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <div
                  className="absolute left-0 top-0 h-full rounded-lg bg-blue-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${(data.enrollments / maxEnrollments) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-right text-sm font-semibold text-gray-900 dark:text-white">
              {data.enrollments}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
        <div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-400">
            Total Enrollments This Year
          </p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-400">
            {enrollmentData.reduce((sum, data) => sum + data.enrollments, 0)}
          </p>
        </div>
        <div className="flex items-center gap-1 text-green-600">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-sm font-medium">+18.5%</span>
        </div>
      </div>
    </div>
  );
}
