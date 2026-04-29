import React from "react";

export function StudentPerformanceChart() {
  const performanceData = [
    { category: "Mathematics", average: 85, target: 80 },
    { category: "Science", average: 78, target: 75 },
    { category: "English", average: 92, target: 85 },
    { category: "History", average: 88, target: 80 },
    { category: "Computer Science", average: 95, target: 90 },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Student Performance Overview
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Average scores by subject
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Average</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Target</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {performanceData.map((subject) => (
          <div key={subject.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {subject.category}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {subject.average}% / {subject.target}%
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gray-400"
                style={{ width: `${subject.target}%` }}
              ></div>
              <div
                className={`absolute left-0 top-0 h-full rounded-full ${
                  subject.average >= subject.target ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${subject.average}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-500/10">
          <p className="text-sm font-medium text-green-900 dark:text-green-400">
            Above Target
          </p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-400">
            {performanceData.filter(s => s.average >= s.target).length}
          </p>
        </div>
        <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-500/10">
          <p className="text-sm font-medium text-orange-900 dark:text-orange-400">
            Below Target
          </p>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-400">
            {performanceData.filter(s => s.average < s.target).length}
          </p>
        </div>
      </div>
    </div>
  );
}
