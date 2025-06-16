import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStatusColor, getPriorityColor, formatDate } from "@/lib/utils";

interface Grievance {
  id: number;
  userId: number;
  userType: string;
  category: string;
  subject: string;
  description: string;
  location?: string;
  priority: string;
  status: string;
  assignedTo?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface GrievanceTableProps {
  grievances: Grievance[];
  showUserType?: boolean;
  showActions?: boolean;
  onStatusUpdate?: (id: number, status: string) => void;
  onAssign?: (id: number) => void;
}

export function GrievanceTable({ 
  grievances, 
  showUserType = false, 
  showActions = false,
  onStatusUpdate,
  onAssign 
}: GrievanceTableProps) {
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedGrievances = grievances
    .filter(g => filterStatus === "all" || g.status === filterStatus)
    .filter(g => filterCategory === "all" || g.category === filterCategory)
    .sort((a, b) => {
      if (!sortColumn) return 0;
      
      let aValue: any = a[sortColumn as keyof Grievance];
      let bValue: any = b[sortColumn as keyof Grievance];
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const categories = [...new Set(grievances.map(g => g.category))];
  const statuses = [...new Set(grievances.map(g => g.status))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline">
          <i className="fas fa-download mr-2"></i>
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("id")}
              >
                ID
                {sortColumn === "id" && (
                  <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1`}></i>
                )}
              </TableHead>
              
              {showUserType && (
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("userType")}
                >
                  User Type
                  {sortColumn === "userType" && (
                    <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1`}></i>
                  )}
                </TableHead>
              )}
              
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("category")}
              >
                Category
                {sortColumn === "category" && (
                  <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1`}></i>
                )}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("subject")}
              >
                Subject
                {sortColumn === "subject" && (
                  <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1`}></i>
                )}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("priority")}
              >
                Priority
                {sortColumn === "priority" && (
                  <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1`}></i>
                )}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                Status
                {sortColumn === "status" && (
                  <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1`}></i>
                )}
              </TableHead>
              
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("createdAt")}
              >
                Date
                {sortColumn === "createdAt" && (
                  <i className={`fas fa-sort-${sortDirection === "asc" ? "up" : "down"} ml-1`}></i>
                )}
              </TableHead>
              
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedGrievances.map((grievance) => (
              <TableRow key={grievance.id} className="hover:bg-gray-50">
                <TableCell>#{grievance.id.toString().padStart(3, "0")}</TableCell>
                
                {showUserType && (
                  <TableCell>
                    <Badge 
                      className={
                        grievance.userType === "student" ? "bg-green-100 text-green-800" :
                        grievance.userType === "staff" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }
                    >
                      {grievance.userType.charAt(0).toUpperCase() + grievance.userType.slice(1)}
                    </Badge>
                  </TableCell>
                )}
                
                <TableCell>{grievance.category}</TableCell>
                <TableCell className="max-w-xs truncate">{grievance.subject}</TableCell>
                
                <TableCell>
                  <Badge className={getPriorityColor(grievance.priority)}>
                    {grievance.priority.charAt(0).toUpperCase() + grievance.priority.slice(1)}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge className={getStatusColor(grievance.status)}>
                    {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
                  </Badge>
                </TableCell>
                
                <TableCell>{formatDate(grievance.createdAt)}</TableCell>
                
                {showActions && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" title="View Details">
                        <i className="fas fa-eye text-blue-600"></i>
                      </Button>
                      
                      {grievance.status !== "resolved" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            title="Assign"
                            onClick={() => onAssign?.(grievance.id)}
                          >
                            <i className="fas fa-user-plus text-green-600"></i>
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            title="Update Status"
                            onClick={() => onStatusUpdate?.(grievance.id, "under review")}
                          >
                            <i className="fas fa-edit text-purple-600"></i>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedGrievances.length} of {grievances.length} grievances
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">Previous</Button>
          <Button size="sm" className="bg-blue-600 text-white">1</Button>
          <Button size="sm" variant="outline">2</Button>
          <Button size="sm" variant="outline">3</Button>
          <Button size="sm" variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
}
