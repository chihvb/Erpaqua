import React from 'react';
import { BarChart3, LineChart, PieChart } from 'lucide-react';

export function Reports() {
  // Data for reports
  const reports = [
    {
      name: 'Sales Report',
      chart: <BarChart3 className="h-5 w-5 text-blue-500" />,
      placeholder: 'Sales Chart Placeholder',
    },
    {
      name: 'Production Report',
      chart: <LineChart className="h-5 w-5 text-green-500" />,
      placeholder: 'Production Chart Placeholder',
    },
    {
      name: 'Inventory Report',
      chart: <PieChart className="h-5 w-5 text-purple-500" />,
      placeholder: 'Inventory Chart Placeholder',
    },
  ];

  // Export all reports to CSV
  const handleExport = () => {
    const csvRows = [
      ['Report Name', 'Chart Placeholder'], // Header
      ...reports.map((report) => [report.name, report.placeholder]),
    ];

    const csvData = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reports.csv';
    link.click();
  };

  // Print individual report
  const handlePrint = (reportName: string) => {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    printWindow?.document.write(`
      <html>
        <head><title>${reportName} Details</title></head>
        <body>
          <h2>${reportName} Details</h2>
          <p>Chart: ${reportName} Chart</p>
          <p>This is a placeholder for the ${reportName} chart.</p>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports</h2>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Export All Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{report.name}</h3>
              {report.chart}
            </div>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">{report.placeholder}</span>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handlePrint(report.name)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Print {report.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
