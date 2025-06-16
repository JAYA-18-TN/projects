import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsModalProps {
  userType: string;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsModal({ userType, isOpen, onClose, onAccept }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  const { data: settings = [] } = useQuery({
    queryKey: ["/api/settings"],
    enabled: isOpen,
  });

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  const getTermsContent = () => {
    const termsKey = `${userType}_terms`;
    const termsSetting = (settings as any[]).find((s: any) => s.key === termsKey);
    
    const defaultTerms = {
      student: `Welcome to Nazareth College Grievance Portal. By using this portal, you agree to the following terms and conditions:

1. All submitted grievances will be handled with strict confidentiality.
2. Information provided will be used only for addressing your concerns.
3. False complaints or misuse of this system may result in disciplinary action.
4. The college reserves the right to prioritize grievances based on severity.
5. You will receive updates on your grievance through this portal.
6. Students must provide accurate information when submitting grievances.
7. All communications must adhere to the college's code of conduct.

These terms are subject to change. The latest version will always be available on this portal.`,

      staff: `Welcome to the Staff Grievance Portal. By using this system, you acknowledge and agree to:

1. All grievances submitted will be treated with appropriate confidentiality.
2. Information provided will be used solely for resolution purposes.
3. Misuse or false reporting may result in disciplinary measures.
4. The institution reserves the right to investigate all claims thoroughly.
5. Updates will be provided through this portal system.
6. Staff members must provide accurate and complete information.
7. All interactions must maintain professional standards.

These terms may be updated periodically. Current terms are always available in this portal.`,

      management: `Welcome to the Management Grievance Portal. By using this system, you acknowledge and agree to:

1. All grievances and decisions will be handled with appropriate confidentiality.
2. Information provided will be used for organizational improvement and resolution.
3. Management decisions must be fair, transparent, and well-documented.
4. The institution reserves the right to review all management actions.
5. Regular updates must be provided on grievance resolutions.
6. Management personnel must maintain high professional standards.
7. All decisions must align with institutional policies and values.

These terms may be updated periodically. Current terms are always available in this portal.`,

      admin: `Welcome to the Administrative Portal. By using this system, you acknowledge and agree to:

1. All system configurations will be handled with appropriate security measures.
2. Administrative access requires responsible and ethical usage.
3. Data privacy and security must be maintained at all times.
4. The institution reserves the right to audit all administrative actions.
5. System changes must be documented and approved where necessary.
6. Administrative personnel must maintain highest professional standards.
7. All actions must comply with institutional policies and legal requirements.

These terms may be updated periodically. Current terms are always available in this portal.`
    };

    return {
      title: `${userType.charAt(0).toUpperCase() + userType.slice(1)} Terms of Use`,
      content: termsSetting?.value || defaultTerms[userType as keyof typeof defaultTerms] || defaultTerms.student
    };
  };

  const terms = getTermsContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
              <i className="fas fa-file-contract text-white text-lg"></i>
            </div>
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Terms & Conditions
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[50vh] my-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Nazareth College Grievance Portal - {terms.title}
            </h3>
            
            <div className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">
              {terms.content}
            </div>
          </div>
        </div>

        <div className="flex items-center mb-6 space-x-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Checkbox 
            id="acceptTerms"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked === true)}
            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <label htmlFor="acceptTerms" className="text-gray-700 font-medium text-sm">
            I have read and agree to the terms and conditions
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6 py-2 border-gray-300 hover:border-gray-400 text-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!accepted}
            className={`px-6 py-2 transition-all duration-200 ${
              accepted 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105" 
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Accept & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
