import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState("userManagement");
  const queryClient = useQueryClient();

  // User Management State
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  // Chat Questions State
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionStep, setNewQuestionStep] = useState(1);
  const [newQuestionUserType, setNewQuestionUserType] = useState("student");

  // Terms State
  const [studentTerms, setStudentTerms] = useState("");
  const [staffTerms, setStaffTerms] = useState("");

  // Theme State
  const [themeColors, setThemeColors] = useState({
    student: "#28a745",
    staff: "#dc3545", 
    management: "#007bff",
    admin: "#6f42c1"
  });
  const [backgroundGradient, setBackgroundGradient] = useState("green");
  const [fontSize, setFontSize] = useState("medium");
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Data Queries
  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
    queryFn: () => fetch("/api/users").then(res => res.json()),
  });

  const { data: chatQuestions = [] } = useQuery({
    queryKey: ["/api/chat-questions"],
    queryFn: () => fetch("/api/chat-questions").then(res => res.json()),
  });

  const { data: settings = [] } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: () => fetch("/api/settings").then(res => res.json()),
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setNewUserEmail("");
      setNewUserRole("");
      setNewUserPassword("");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/users/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (questionData: any) => {
      const response = await apiRequest("POST", "/api/chat-questions", questionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-questions"] });
      setNewQuestion("");
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/chat-questions/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-questions"] });
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async (settingData: any) => {
      const response = await apiRequest("POST", "/api/settings", settingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  // Event Handlers
  const handleCreateUser = () => {
    if (newUserEmail && newUserRole && newUserPassword) {
      createUserMutation.mutate({
        email: newUserEmail,
        role: newUserRole,
        password: newUserPassword
      });
    }
  };

  const handleDeactivateUser = (userId: number) => {
    updateUserMutation.mutate({
      id: userId,
      updates: { isActive: false }
    });
  };

  const handleCreateQuestion = () => {
    if (newQuestion && newQuestionUserType) {
      createQuestionMutation.mutate({
        question: newQuestion,
        step: newQuestionStep,
        userType: newQuestionUserType
      });
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    updateQuestionMutation.mutate({
      id: questionId,
      updates: { isActive: false }
    });
  };

  const handleSaveTerms = () => {
    updateSettingMutation.mutate({
      key: "student_terms",
      value: studentTerms,
      category: "terms"
    });
    updateSettingMutation.mutate({
      key: "staff_terms", 
      value: staffTerms,
      category: "terms"
    });
  };

  const handleApplyTheme = () => {
    Object.entries(themeColors).forEach(([role, color]) => {
      updateSettingMutation.mutate({
        key: `${role}_color`,
        value: color,
        category: "theme"
      });
    });
    
    updateSettingMutation.mutate({
      key: "background_gradient",
      value: backgroundGradient,
      category: "theme"
    });
    
    updateSettingMutation.mutate({
      key: "font_size",
      value: fontSize,
      category: "theme"
    });
    
    updateSettingMutation.mutate({
      key: "dark_mode_enabled",
      value: darkModeEnabled.toString(),
      category: "theme"
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "userManagement":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-users text-purple-600 text-xl mr-3"></i>
                  User Management
                </div>
                <div className="flex space-x-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-48"
                    />
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-32"
                    />
                    <Button 
                      onClick={handleCreateUser}
                      className="admin-theme text-white"
                      disabled={createUserMutation.isPending}
                    >
                      <i className="fas fa-plus mr-2"></i>Add User
                    </Button>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            user.role === "student" ? "bg-green-100 text-green-800" :
                            user.role === "staff" ? "bg-red-100 text-red-800" :
                            user.role === "management" ? "bg-blue-100 text-blue-800" :
                            "bg-purple-100 text-purple-800"
                          }
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" title="Edit">
                            <i className="fas fa-edit text-blue-600"></i>
                          </Button>
                          {user.isActive && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              title="Deactivate"
                              onClick={() => handleDeactivateUser(user.id)}
                            >
                              <i className="fas fa-ban text-red-600"></i>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case "chatQuestions":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-comments text-purple-600 text-xl mr-3"></i>
                  Chat Questions Management
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Question text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-64"
                  />
                  <Select value={newQuestionStep.toString()} onValueChange={(v) => setNewQuestionStep(parseInt(v))}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Step" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newQuestionUserType} onValueChange={setNewQuestionUserType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleCreateQuestion}
                    className="admin-theme text-white"
                    disabled={createQuestionMutation.isPending}
                  >
                    <i className="fas fa-plus mr-2"></i>Add Question
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chatQuestions.filter((q: any) => q.isActive).map((question: any) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">Step {question.step} Question</h4>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <i className="fas fa-edit text-blue-600"></i>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <i className="fas fa-trash text-red-600"></i>
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{question.question}</p>
                    <Badge className="bg-gray-100 text-gray-600">
                      Used for: {question.userType.charAt(0).toUpperCase() + question.userType.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "termsConditions":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-file-contract text-purple-600 text-xl mr-3"></i>
                  Terms & Conditions Management
                </div>
                <Button 
                  onClick={handleSaveTerms}
                  className="admin-theme text-white"
                  disabled={updateSettingMutation.isPending}
                >
                  <i className="fas fa-save mr-2"></i>Save Changes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Terms & Conditions
                  </Label>
                  <Textarea
                    className="h-40"
                    value={studentTerms}
                    onChange={(e) => setStudentTerms(e.target.value)}
                    placeholder="Enter student terms and conditions..."
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Staff Terms & Conditions
                  </Label>
                  <Textarea
                    className="h-40"
                    value={staffTerms}
                    onChange={(e) => setStaffTerms(e.target.value)}
                    placeholder="Enter staff terms and conditions..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "themeSettings":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-palette text-purple-600 text-xl mr-3"></i>
                  Theme Settings
                </div>
                <Button 
                  onClick={handleApplyTheme}
                  className="admin-theme text-white"
                  disabled={updateSettingMutation.isPending}
                >
                  <i className="fas fa-save mr-2"></i>Apply Changes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Color Scheme</h3>
                  <div className="space-y-4">
                    {Object.entries(themeColors).map(([role, color]) => (
                      <div key={role}>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          {role.charAt(0).toUpperCase() + role.slice(1)} Portal Color
                        </Label>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="color" 
                            value={color}
                            onChange={(e) => setThemeColors(prev => ({ ...prev, [role]: e.target.value }))}
                            className="w-12 h-8 border border-gray-300 rounded"
                          />
                          <Input
                            value={color}
                            onChange={(e) => setThemeColors(prev => ({ ...prev, [role]: e.target.value }))}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Layout Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Gradient
                      </Label>
                      <Select value={backgroundGradient} onValueChange={setBackgroundGradient}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="green">Green Gradient (Current)</SelectItem>
                          <SelectItem value="blue">Blue Gradient</SelectItem>
                          <SelectItem value="neutral">Neutral Gradient</SelectItem>
                          <SelectItem value="custom">Custom Gradient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size
                      </Label>
                      <Select value={fontSize} onValueChange={setFontSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium (Current)</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="darkMode"
                        checked={darkModeEnabled}
                        onCheckedChange={setDarkModeEnabled}
                      />
                      <Label htmlFor="darkMode">Enable Dark Mode Option</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Preview */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme Preview</h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(themeColors).map(([role, color]) => (
                      <div 
                        key={role}
                        className="text-white p-3 rounded-lg text-center"
                        style={{ backgroundColor: color }}
                      >
                        <i className={`fas ${
                          role === "student" ? "fa-user-graduate" :
                          role === "staff" ? "fa-user-tie" :
                          role === "management" ? "fa-cogs" :
                          "fa-user-shield"
                        } mb-2`}></i>
                        <div className="text-sm">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "systemSettings":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-cog text-purple-600 text-xl mr-3"></i>
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <i className="fas fa-cog text-gray-400 text-6xl mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">System Settings</h3>
                <p className="text-gray-500">Advanced system configuration options will be available here.</p>
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
      <div className="w-64 bg-purple-600 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <i className="fas fa-user-shield text-lg"></i>
            </div>
            <div>
              <h2 className="font-semibold">Admin Portal</h2>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("userManagement")}
              className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === "userManagement" ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <i className="fas fa-users"></i>
              <span>User Management</span>
            </button>
            
            <button
              onClick={() => setActiveSection("chatQuestions")}
              className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === "chatQuestions" ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <i className="fas fa-comments"></i>
              <span>Chat Questions</span>
            </button>
            
            <button
              onClick={() => setActiveSection("termsConditions")}
              className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === "termsConditions" ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <i className="fas fa-file-contract"></i>
              <span>Terms & Conditions</span>
            </button>
            
            <button
              onClick={() => setActiveSection("themeSettings")}
              className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === "themeSettings" ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <i className="fas fa-palette"></i>
              <span>Theme Settings</span>
            </button>
            
            <button
              onClick={() => setActiveSection("systemSettings")}
              className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeSection === "systemSettings" ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <i className="fas fa-cog"></i>
              <span>System Settings</span>
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
            <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Admin User</span>
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center">
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
