import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { GrievanceTable } from "@/components/grievance-table";
import { apiRequest } from "@/lib/queryClient";

export default function ManagementDashboard() {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState("allGrievances");
  const queryClient = useQueryClient();

  const { data: grievances = [] } = useQuery({
    queryKey: ["/api/grievances"],
    queryFn: () => fetch("/api/grievances").then(res => res.json()),
  });

  const updateGrievanceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/grievances/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grievances"] });
    },
  });

  const handleStatusUpdate = (id: number, status: string) => {
    updateGrievanceMutation.mutate({ id, updates: { status } });
  };

  const handleAssign = (id: number) => {
    updateGrievanceMutation.mutate({ id, updates: { assignedTo: 1 } });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "allGrievances":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-list text-blue-600 text-xl mr-3"></i>
                All Grievances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GrievanceTable 
                grievances={grievances}
                showUserType={true}
                showActions={true}
                onStatusUpdate={handleStatusUpdate}
                onAssign={handleAssign}
              />
            </CardContent>
          </Card>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-800">{grievances.length}</h3>
                      <p className="text-gray-600">Total Grievances</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <i className="fas fa-clock text-yellow-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {grievances.filter(g => g.status === "submitted" || g.status === "under review").length}
                      </h3>
                      <p className="text-gray-600">Pending Review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full">
                      <i className="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {grievances.filter(g => g.status === "resolved").length}
                      </h3>
                      <p className="text-gray-600">Resolved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <i className="fas fa-chart-line text-purple-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {grievances.length > 0 ? Math.round((grievances.filter(g => g.status === "resolved").length / grievances.length) * 100) : 0}%
                      </h3>
                      <p className="text-gray-600">Resolution Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Grievance Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    grievances.reduce((acc: any, g) => {
                      acc[g.category] = (acc[g.category] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([category, count]) => {
                    const percentage = grievances.length > 0 ? (count as number / grievances.length) * 100 : 0;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-gray-600">{category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "reports":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-file-alt text-blue-600 text-xl mr-3"></i>
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <i className="fas fa-chart-bar text-gray-400 text-6xl mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Reports Coming Soon</h3>
                <p className="text-gray-500">Detailed reports and analytics will be available here.</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <i className="fas fa-cogs text-lg"></i>
            </div>
            <div>
              <h2 className="font-semibold">Management Portal</h2>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("allGrievances")}
              className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === "allGrievances" ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <i className="fas fa-list"></i>
              <span>All Grievances</span>
            </button>
            
            <button
              onClick={() => setActiveSection("analytics")}
              className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === "analytics" ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <i className="fas fa-chart-bar"></i>
              <span>Analytics</span>
            </button>
            
            <button
              onClick={() => setActiveSection("reports")}
              className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === "reports" ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <i className="fas fa-file-alt"></i>
              <span>Reports</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full text-white hover:bg-white hover:bg-opacity-10 justify-start"
          >
            <i className="fas fa-sign-out-alt mr-3"></i>
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Management Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Management User</span>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                <i className="fas fa-user text-sm"></i>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
