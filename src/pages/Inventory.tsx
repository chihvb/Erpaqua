import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useInventoryStore } from '../store/inventoryStore';
import { useProductStore } from '../store/productStore';
import { Inventory as InventoryType } from '../types';
import { InventoryForm } from '../components/Inventory/InventoryForm';
import { Modal } from '../components/UI/Modal';

export function Inventory() {
  const { inventory, addInventory, updateInventory } = useInventoryStore();
  const { products } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryType | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]); // For storing parsed CSV data

  const columnHelper = createColumnHelper<InventoryType>();
  const columns = [
    columnHelper.accessor('productId', {
      header: 'Product',
      cell: (info) => {
        const product = products.find((p) => p.id === info.getValue());
        return product?.name || 'Unknown Product';
      },
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('lastUpdated', {
      header: 'Last Updated',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <button
          onClick={() => handleEdit(info.row.original)}
          className="text-blue-600 hover:text-blue-800"
        >
          Update Stock
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: inventory,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAdd = () => {
    setSelectedInventory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (inventory: InventoryType) => {
    setSelectedInventory(inventory);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Omit<InventoryType, 'id'>) => {
    if (selectedInventory) {
      updateInventory(selectedInventory.id, data);
    } else {
      addInventory(data);
    }
    setIsModalOpen(false);
  };

  // Export inventory to CSV
  const handleExport = () => {
    const csvRows = [
      ['Product', 'Quantity', 'Location', 'Last Updated'], // Header
      ...inventory.map((inv) => [
        products.find((p) => p.id === inv.productId)?.name || 'Unknown Product',
        inv.quantity,
        inv.location,
        new Date(inv.lastUpdated).toLocaleDateString(),
      ]),
    ];

    const csvData = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventory.csv';
    link.click();
  };

  // Import inventory from CSV
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const parsedData = lines.slice(1).map((line) => {
        const [productName, quantity, location, lastUpdated] = line.split(',');
        return {
          productName,
          quantity: parseInt(quantity, 10),
          location,
          lastUpdated,
        };
      });
      setCsvData(parsedData);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (csvData.length > 0) {
      // Here you can map through the parsed data and add it to the inventory store
      csvData.forEach((data) => {
        // Map CSV data to Inventory model and add it
        const product = products.find((p) => p.name === data.productName);
        if (product) {
          addInventory({
            productId: product.id,
            quantity: data.quantity,
            location: data.location,
            lastUpdated: new Date(data.lastUpdated),
          });
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Stock
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export Inventory
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="px-4 py-2 bg-gray-200 rounded-md"
          />
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Import Inventory
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
        title={selectedInventory ? 'Update Stock' : 'Add Stock'}
      >
        <InventoryForm
          initialData={selectedInventory || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
