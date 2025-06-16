import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { generateGrievanceId } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "system";
  message: string;
  timestamp: Date;
  options?: string[];
}

interface ChatInterfaceProps {
  userType: string;
  onGrievanceSubmitted?: (grievanceId: string) => void;
}

export function ChatInterface({ userType, onGrievanceSubmitted }: ChatInterfaceProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [step, setStep] = useState(1);
  const [grievanceData, setGrievanceData] = useState({
    category: "",
    description: "",
    location: "",
    subject: ""
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useQuery({
    queryKey: ["/api/categories", userType],
    queryFn: () => fetch(`/api/categories?userType=${userType}`).then(res => res.json()),
  });

  const { data: chatQuestions } = useQuery({
    queryKey: ["/api/chat-questions", userType],
    queryFn: () => fetch(`/api/chat-questions?userType=${userType}`).then(res => res.json()),
  });

  const submitGrievanceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/grievances", data);
      return response.json();
    },
    onSuccess: (data) => {
      const grievanceId = generateGrievanceId();
      addSystemMessage(`Thank you! Your grievance has been submitted successfully with ID ${grievanceId}. You will receive updates on the progress.`);
      onGrievanceSubmitted?.(grievanceId);
      queryClient.invalidateQueries({ queryKey: ["/api/grievances"] });
    },
  });

  useEffect(() => {
    if (chatQuestions && chatQuestions.length > 0) {
      const firstQuestion = chatQuestions.find((q: any) => q.step === 1);
      if (firstQuestion) {
        addSystemMessage(firstQuestion.question, categories?.map((c: any) => c.name));
      }
    }
  }, [chatQuestions, categories]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (sender: "user" | "system", message: string, options?: string[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addSystemMessage = (message: string, options?: string[]) => {
    setTimeout(() => {
      addMessage("system", message, options);
    }, 500);
  };

  const addUserMessage = (message: string) => {
    addMessage("user", message);
  };

  const handleCategorySelect = (category: string) => {
    addUserMessage(category);
    setGrievanceData(prev => ({ ...prev, category }));
    setStep(2);
    
    const nextQuestion = chatQuestions?.find((q: any) => q.step === 2);
    if (nextQuestion) {
      addSystemMessage(nextQuestion.question);
    }
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    addUserMessage(currentInput);

    if (step === 2) {
      setGrievanceData(prev => ({ 
        ...prev, 
        description: currentInput,
        subject: currentInput.slice(0, 50) + (currentInput.length > 50 ? "..." : "")
      }));
      setStep(3);
      
      const nextQuestion = chatQuestions?.find((q: any) => q.step === 3);
      if (nextQuestion) {
        const locations = ["Main Campus", "Hostel Block A", "Hostel Block B", "Library", "Cafeteria"];
        addSystemMessage(nextQuestion.question, locations);
      }
    } else if (step === 3) {
      setGrievanceData(prev => ({ ...prev, location: currentInput }));
      setStep(4);
      
      // Submit grievance
      if (user) {
        submitGrievanceMutation.mutate({
          userId: user.id,
          userType: user.role,
          category: grievanceData.category,
          subject: grievanceData.subject,
          description: grievanceData.description,
          location: currentInput,
          priority: "medium"
        });
      }
    }

    setCurrentInput("");
  };

  const handleLocationSelect = (location: string) => {
    addUserMessage(location);
    setGrievanceData(prev => ({ ...prev, location }));
    setStep(4);
    
    // Submit grievance
    if (user) {
      submitGrievanceMutation.mutate({
        userId: user.id,
        userType: user.role,
        category: grievanceData.category,
        subject: grievanceData.subject,
        description: grievanceData.description,
        location,
        priority: "medium"
      });
    }
  };

  const getProgressSteps = () => {
    return [
      { step: 1, label: "Category", active: step >= 1, completed: step > 1 },
      { step: 2, label: "Details", active: step >= 2, completed: step > 2 },
      { step: 3, label: "Submit", active: step >= 3, completed: step > 3 },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {getProgressSteps().map((progressStep, index) => (
          <div key={progressStep.step} className="flex items-center">
            <div className={`progress-step ${progressStep.completed ? 'completed' : progressStep.active ? 'active' : ''}`}>
              {progressStep.step}
            </div>
            <span className="text-sm text-gray-600 ml-2">{progressStep.label}</span>
            {index < getProgressSteps().length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Container */}
      <Card className="h-96 flex flex-col bg-gray-50">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="chat-message mb-4">
              {msg.sender === "user" ? (
                <div className={`${userType === 'student' ? 'bg-green-500' : userType === 'staff' ? 'bg-red-500' : userType === 'management' ? 'bg-blue-500' : 'bg-purple-500'} text-white rounded-lg p-3 shadow-sm ml-auto max-w-xs`}>
                  <div className="text-xs opacity-80 mb-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p>{msg.message}</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p className="text-gray-700">{msg.message}</p>
                  
                  {msg.options && (
                    <div className="mt-3 space-y-2">
                      {msg.options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start"
                          onClick={() => {
                            if (step === 1) {
                              handleCategorySelect(option);
                            } else if (step === 3) {
                              handleLocationSelect(option);
                            }
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        {step > 1 && step < 4 && (
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your response here..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!currentInput.trim()}
                className={`${userType === 'student' ? 'student-theme' : userType === 'staff' ? 'staff-theme' : userType === 'management' ? 'management-theme' : 'admin-theme'} text-white`}
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Send
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
