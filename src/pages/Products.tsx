import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useProductStore } from '../store/productStore';
import { Product } from '../types';
import { ProductForm } from '../components/Products/ProductForm';
import { Modal } from '../components/UI/Modal';

export function Products() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const columnHelper = createColumnHelper<Product>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Product Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('size', {
      header: 'Size (ml)',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: 'Price ($)',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('stock', {
      header: 'Stock',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('batchNumber', {
      header: 'Batch Number',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePrint(info.row.original)}
            className="p-1 text-green-600 hover:text-green-800"
          >
            Print
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleSubmit = (data: Omit<Product, 'id'>) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, data);
    } else {
      addProduct(data);
    }
    setIsModalOpen(false);
  };

  // Export all products to CSV
  const handleExport = () => {
    const csvRows = [
      ['Product Name', 'Size (ml)', 'Price ($)', 'Stock', 'Batch Number'], // Header
      ...products.map((product) => [
        product.name,
        product.size,
        product.price.toFixed(2),
        product.stock,
        product.batchNumber,
      ]),
    ];

    const csvData = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  // Print individual product details
  const handlePrint = (product: Product) => {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    printWindow?.document.write(`
      <html>
        <head><title>Product Details</title></head>
        <body>
          <h2>Product Details</h2>
          <p><strong>Product Name:</strong> ${product.name}</p>
          <p><strong>Size (ml):</strong> ${product.size}</p>
          <p><strong>Price ($):</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Stock:</strong> ${product.stock}</p>
          <p><strong>Batch Number:</strong> ${product.batchNumber}</p>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          initialData={selectedProduct || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
