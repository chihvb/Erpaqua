import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useOrderStore } from '../store/orderStore';
import { Order } from '../types';
import { OrderForm } from '../components/Orders/OrderForm';
import { Modal } from '../components/UI/Modal';

export function Orders() {
  const { orders, addOrder, updateOrder } = useOrderStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const columnHelper = createColumnHelper<Order>();
  const columns = [
    columnHelper.accessor('customerName', {
      header: 'Customer',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('orderDate', {
      header: 'Order Date',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Total Amount',
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            info.getValue() === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : info.getValue() === 'processing'
              ? 'bg-blue-100 text-blue-800'
              : info.getValue() === 'shipped'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-green-100 text-green-800'
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
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAdd = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Omit<Order, 'id'>) => {
    if (selectedOrder) {
      updateOrder(selectedOrder.id, data);
    } else {
      addOrder(data);
    }
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const csvRows = [
      ['Customer', 'Order Date', 'Total Amount', 'Status'], // Header
      ...orders.map((order) => [
        order.customerName,
        new Date(order.orderDate).toLocaleDateString(),
        `$${order.totalAmount.toFixed(2)}`,
        order.status,
      ]),
    ];

    const csvData = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders.csv';
    link.click();
  };

  const handlePrint = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    printWindow?.document.write(`
      <html>
        <head><title>Order Details</title></head>
        <body>
          <h2>Order Details</h2>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Order Date:</strong> ${new Date(
            order.orderDate
          ).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Order
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export Orders
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
        title={selectedOrder ? 'Order Details' : 'New Order'}
      >
        <OrderForm
          initialData={selectedOrder || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
