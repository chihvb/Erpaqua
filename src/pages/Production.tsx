import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useProductionStore } from '../store/productionStore';
import { Production as ProductionType } from '../types';
import { ProductionForm } from '../components/Production/ProductionForm';
import { Modal } from '../components/UI/Modal';

export function Production() {
  const { productions, addProduction, updateProduction } = useProductionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] =
    useState<ProductionType | null>(null);

  const columnHelper = createColumnHelper<ProductionType>();
  const columns = [
    columnHelper.accessor('batchNumber', {
      header: 'Batch Number',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('startDate', {
      header: 'Start Date',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('completionDate', {
      header: 'Completion Date',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            info.getValue() === 'planned'
              ? 'bg-blue-100 text-blue-800'
              : info.getValue() === 'in-progress'
              ? 'bg-yellow-100 text-yellow-800'
              : info.getValue() === 'completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-100 text-purple-800'
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <button
          onClick={() => handleEdit(info.row.original)}
          className="text-blue-600 hover:text-blue-800"
        >
          View Details
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: productions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAdd = () => {
    setSelectedProduction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (production: ProductionType) => {
    setSelectedProduction(production);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Omit<ProductionType, 'id'>) => {
    if (selectedProduction) {
      updateProduction(selectedProduction.id, data);
    } else {
      addProduction(data);
    }
    setIsModalOpen(false);
  };

  // Export all productions to CSV
  const handleExport = () => {
    const csvRows = [
      ['Batch Number', 'Quantity', 'Start Date', 'Completion Date', 'Status'], // Header
      ...productions.map((production) => [
        production.batchNumber,
        production.quantity,
        new Date(production.startDate).toLocaleDateString(),
        new Date(production.completionDate).toLocaleDateString(),
        production.status,
      ]),
    ];

    const csvData = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'productions.csv';
    link.click();
  };

  // Print individual production details
  const handlePrint = (production: ProductionType) => {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    printWindow?.document.write(`
      <html>
        <head><title>Production Details</title></head>
        <body>
          <h2>Production Details</h2>
          <p><strong>Batch Number:</strong> ${production.batchNumber}</p>
          <p><strong>Quantity:</strong> ${production.quantity}</p>
          <p><strong>Start Date:</strong> ${new Date(
            production.startDate
          ).toLocaleDateString()}</p>
          <p><strong>Completion Date:</strong> ${new Date(
            production.completionDate
          ).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${production.status}</p>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Production</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Batch
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export All
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handlePrint(row.original)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedProduction ? 'Edit Production Batch' : 'New Production Batch'
        }
      >
        <ProductionForm
          initialData={selectedProduction || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
