import React, { useState } from 'react';
import type { Table, Server } from '../types';
import { Card } from '@/components/ui/card';

// Mock data for initial development
const mockTables: Table[] = [
  { id: 1, number: 'T1', seats: 4, status: 'available' },
  { id: 2, number: 'T2', seats: 2, status: 'occupied' },
  { id: 3, number: 'T3', seats: 6, status: 'reserved' },
  { id: 4, number: 'T4', seats: 4, status: 'available' },
];

const mockServers: Server[] = [
  { id: 1, name: 'John Doe', assignedTables: [2] },
  { id: 2, name: 'Jane Smith', assignedTables: [3] },
];

const TableManagement: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showServerAssignment, setShowServerAssignment] = useState(false);

  const getTableColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200';
      case 'occupied':
        return 'bg-red-100 hover:bg-red-200';
      case 'reserved':
        return 'bg-yellow-100 hover:bg-yellow-200';
      default:
        return 'bg-gray-100';
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowServerAssignment(true);
  };

  const assignServer = (tableId: number, serverId: number) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, serverId } : table
    ));
    setServers(servers.map(server =>
      server.id === serverId
        ? { ...server, assignedTables: [...server.assignedTables, tableId] }
        : server
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Table Layout */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Table Layout</h2>
          <div className="grid grid-cols-2 gap-4">
            {tables.map((table) => (
              <Card
                key={table.id}
                className={'p-4 cursor-pointer transition-colors ' + getTableColor(table.status)}
                onClick={() => handleTableClick(table)}
              >
                <div className="text-lg font-semibold">Table {table.number}</div>
                <div className="text-sm text-gray-600">
                  {table.seats} seats
                </div>
                <div className="text-sm font-medium capitalize">
                  {table.status}
                </div>
                {table.serverId && (
                  <div className="text-sm text-gray-600">
                    Server: {servers.find(s => s.id === table.serverId)?.name}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Server Assignment Dialog */}
          {selectedTable && showServerAssignment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <Card className="w-96 p-4">
                <h3 className="text-lg font-semibold mb-4">Assign Server to Table {selectedTable.number}</h3>
                <div className="space-y-2">
                  {servers.map(server => (
                    <button
                      key={server.id}
                      onClick={() => {
                        assignServer(selectedTable.id, server.id);
                        setShowServerAssignment(false);
                      }}
                      className="w-full p-2 text-left hover:bg-accent rounded-md transition-colors"
                    >
                      {server.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowServerAssignment(false)}
                  className="mt-4 w-full p-2 bg-secondary text-secondary-foreground rounded-md"
                >
                  Cancel
                </button>
              </Card>
            </div>
          )}
        </div>

        {/* Server Assignment */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Servers</h2>
          <div className="space-y-4">
            {servers.map((server) => (
              <Card key={server.id} className="p-4">
                <div className="font-semibold">{server.name}</div>
                <div className="text-sm text-gray-600">
                  Assigned Tables: {server.assignedTables.map(t => tables.find(table => table.id === t)?.number).join(', ')}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableManagement;
