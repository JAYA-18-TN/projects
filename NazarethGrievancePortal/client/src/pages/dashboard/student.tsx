import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { ChatInterface } from "@/components/chat-interface";
import { GrievanceTable } from "@/components/grievance-table";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("newGrievance");

  const { data: grievances = [] } = useQuery({
    queryKey: ["/api/grievances", user?.id],
    queryFn: () => fetch(`/api/grievances?userId=${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  const renderContent = () => {
    switch (activeSection) {
      case "newGrievance":
        return (
          <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <div className="flex items-center text-white">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-plus text-sm"></i>
                </div>
                <div>
                  <h2 className="font-bold text-lg">New Student Grievance</h2>
                  <p className="text-green-100 text-sm">Submit your academic concerns</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ChatInterface 
                userType="student" 
                onGrievanceSubmitted={(id) => {
                  setActiveSection("myGrievances");
                }}
              />
            </div>
          </div>
        );

      case "myGrievances":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-list text-green-600 text-xl mr-3"></i>
                  My Grievances
                </div>
                <Button variant="outline">
                  <i className="fas fa-download mr-2"></i>Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GrievanceTable grievances={grievances} />
            </CardContent>
          </Card>
        );

      case "notifications":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-bell text-green-600 text-xl mr-3"></i>
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <i className="fas fa-info-circle text-blue-600 mt-1 mr-3"></i>
                    <div>
                      <h4 className="font-semibold text-blue-800">Grievance Update</h4>
                      <p className="text-blue-700">Your grievance has been assigned to the Faculty Relations Committee.</p>
                      <p className="text-sm text-blue-600 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <i className="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
                    <div>
                      <h4 className="font-semibold text-green-800">Grievance Resolved</h4>
                      <p className="text-green-700">Your grievance regarding library access has been resolved.</p>
                      <p className="text-sm text-green-600 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Compact Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-600 to-green-700 text-white shadow-xl">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-user-graduate text-sm"></i>
            </div>
            <div>
              <h2 className="font-bold text-sm">Student Portal</h2>
              <p className="text-green-200 text-xs">Nazareth College</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: "newGrievance", icon: "fas fa-plus", label: "New Grievance" },
              { id: "myGrievances", icon: "fas fa-list", label: "My Grievances" },
              { id: "notifications", icon: "fas fa-bell", label: "Notifications", badge: "2" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id 
                    ? "bg-white bg-opacity-20 shadow-md transform scale-105" 
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                  activeSection === item.id ? "bg-white bg-opacity-20" : ""
                }`}>
                  <i className={item.icon}></i>
                </div>
                <span className="font-medium text-sm">{item.label}</span>
                {item.badge && (
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1 ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
            
            <div className="pt-3 border-t border-green-500 border-opacity-30 mt-4">
              {[
                { icon: "fas fa-calendar", label: "Calendar" },
                { icon: "fas fa-question-circle", label: "Support" }
              ].map((item, index) => (
                <button key={index} className="w-full text-left flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs">
                    <i className={item.icon}></i>
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full text-white hover:bg-red-500 hover:bg-opacity-20 justify-start p-3 rounded-lg transition-all duration-200 text-sm"
          >
            <i className="fas fa-sign-out-alt mr-2 text-xs"></i>
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Compact Header */}
        <header className="bg-white shadow-md border-b p-4 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Student Grievance Portal
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">Submit and track your grievances</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Welcome</p>
                <p className="font-semibold text-sm text-gray-800">Student User</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center shadow-md">
                <i className="fas fa-user text-sm"></i>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
