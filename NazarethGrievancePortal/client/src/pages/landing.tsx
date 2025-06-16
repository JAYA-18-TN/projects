import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const handlePortalClick = (userType: string) => {
    setLocation(`/login/${userType}`);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center">
                <span className="font-bold text-sm">NCAS</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Nazareth College</h1>
                <span className="text-sm text-gray-600">Grievance Portal</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#about" className="text-gray-600 hover:text-gray-800 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-800 transition-colors">Contact</a>
              <a href="#help" className="text-gray-600 hover:text-gray-800 transition-colors">Help</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Voice Matters</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Submit your grievances securely and track their resolution through our dedicated portal. 
            We're committed to addressing your concerns promptly and fairly.
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center space-x-2">
              <i className="fas fa-shield-alt text-green-600"></i>
              <span className="text-gray-700">Secure & Confidential</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-clock text-blue-600"></i>
              <span className="text-gray-700">24/7 Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-chart-line text-purple-600"></i>
              <span className="text-gray-700">Track Progress</span>
            </div>
          </div>
        </div>

        {/* Login Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          {/* Student Portal Card */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-green-600">
            <CardContent className="p-6 text-center">
              <div className="student-theme text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-graduate text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Student Portal</h3>
              <p className="text-gray-600 text-sm mb-6">Submit and track your academic and administrative grievances</p>
              <Button 
                onClick={() => handlePortalClick('student')}
                className="w-full student-theme hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Student Login</span>
              </Button>
            </CardContent>
          </Card>

          {/* Staff Portal Card */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-red-600">
            <CardContent className="p-6 text-center">
              <div className="staff-theme text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-tie text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Staff Portal</h3>
              <p className="text-gray-600 text-sm mb-6">Review, manage and resolve student grievances efficiently</p>
              <Button 
                onClick={() => handlePortalClick('staff')}
                className="w-full staff-theme hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Staff Login</span>
              </Button>
            </CardContent>
          </Card>

          {/* Management Portal Card */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-blue-600">
            <CardContent className="p-6 text-center">
              <div className="management-theme text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cogs text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Management Portal</h3>
              <p className="text-gray-600 text-sm mb-6">View and manage all grievances with comprehensive dashboard</p>
              <Button 
                onClick={() => handlePortalClick('management')}
                className="w-full management-theme hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Management Login</span>
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal Card */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-purple-600">
            <CardContent className="p-6 text-center">
              <div className="admin-theme text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-shield text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Admin Portal</h3>
              <p className="text-gray-600 text-sm mb-6">System administration and user management</p>
              <Button 
                onClick={() => handlePortalClick('admin')}
                className="w-full admin-theme hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Admin Login</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-lg font-semibold mb-2">Login</h3>
              <p className="text-gray-600">Access your portal using your college credentials</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-lg font-semibold mb-2">Submit</h3>
              <p className="text-gray-600">Describe your grievance using our chat interface</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 text-yellow-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-lg font-semibold mb-2">Track</h3>
              <p className="text-gray-600">Monitor the status and receive real-time updates</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h3 className="text-lg font-semibold mb-2">Resolve</h3>
              <p className="text-gray-600">Get your issue resolved by the appropriate authority</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Contact Information</h4>
              <p className="text-gray-600 flex items-center mb-2">
                <i className="fas fa-envelope mr-2"></i> grievance@ncas.in
              </p>
              <p className="text-gray-600 flex items-center">
                <i className="fas fa-phone mr-2"></i> +91 9876543210
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors">Terms of Service</a>
                <a href="#" className="block text-gray-600 hover:text-gray-800 transition-colors">FAQ</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Office Hours</h4>
              <p className="text-gray-600 mb-2">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-gray-600">&copy; 2024 Nazareth College. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
