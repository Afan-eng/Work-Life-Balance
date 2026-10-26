import React from 'react';

export const GlobalDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-ink-900 dark:text-linen-100">Global Dashboard</h1>
      <p className="text-ink-700 dark:text-linen-200">Welcome to the global community wellness dashboard. Here you can explore insights, trends, and resources shared by users worldwide.</p>
      {/* Placeholder content – replace with real widgets later */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-ink-800 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-2 text-ink-800 dark:text-linen-100">Total Users</h2>
          <p className="text-2xl font-bold text-sage-600">0</p>
        </div>
        <div className="bg-white dark:bg-ink-800 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-2 text-ink-800 dark:text-linen-100">Active Sessions</h2>
          <p className="text-2xl font-bold text-sage-600">0</p>
        </div>
        <div className="bg-white dark:bg-ink-800 p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-2 text-ink-800 dark:text-linen-100">Posts Today</h2>
          <p className="text-2xl font-bold text-sage-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
