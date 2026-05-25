import { useState } from "react";
import { Search, Paperclip } from "lucide-react";

const mockEmails = [
  {
    id: 1,
    subject: "Compliance Review - Q1 2026",
    sender: "compliance@bank.com",
    date: "Mar 4, 2026",
    body: "Dear Legal Team,\n\nWe need your review on the Q1 2026 compliance documentation. Please review the attached materials and provide feedback by end of week.\n\nThe main areas requiring attention are:\n- Updated AML procedures\n- Data privacy compliance\n- Cross-border transaction guidelines\n\nPlease let us know if you have any questions.\n\nBest regards,\nCompliance Team",
    attachments: ["Q1_Compliance_Report.pdf", "AML_Procedures.docx"],
  },
  {
    id: 2,
    subject: "Vendor Contract Amendment",
    sender: "procurement@bank.com",
    date: "Mar 3, 2026",
    body: "Hi,\n\nWe are working on amending the contract with our main software vendor. Could you review the proposed changes and advise on any legal implications?\n\nThe amendment primarily focuses on extending the service period and adjusting pricing terms.\n\nThanks,\nProcurement",
    attachments: ["Vendor_Amendment_Draft.pdf"],
  },
  {
    id: 3,
    subject: "Employee Data Privacy Inquiry",
    sender: "hr@bank.com",
    date: "Mar 2, 2026",
    body: "Hello Legal,\n\nWe have received a request from an employee regarding their personal data. They are asking about what information we store and how long we retain it.\n\nCan you help us draft a response that complies with our data protection policies?\n\nThank you,\nHR Department",
    attachments: [],
  },
  {
    id: 4,
    subject: "Regulatory Update - Banking Act",
    sender: "regulatory@bank.com",
    date: "Mar 1, 2026",
    body: "Dear Colleagues,\n\nPlease be advised of recent updates to the Banking Act that may affect our operations. We need legal analysis on implementation requirements.\n\nKey changes include:\n- Enhanced reporting obligations\n- New capital requirements\n- Updated customer protection measures\n\nRegards,\nRegulatory Affairs",
    attachments: ["Banking_Act_Updates.pdf", "Implementation_Timeline.xlsx"],
  },
];

export function Emails() {
  const [selectedEmail, setSelectedEmail] = useState(mockEmails[0]);
  const [draftReply, setDraftReply] = useState(
    `Dear Compliance Team,\n\nThank you for your email regarding the Q1 2026 compliance review.\n\nWe have reviewed the attached documentation and are pleased to confirm that the updated AML procedures align with current regulatory requirements. However, we recommend the following adjustments to the cross-border transaction guidelines:\n\n1. Include explicit reference to the latest FATF recommendations\n2. Clarify the approval process for transactions exceeding $50,000\n3. Add specific requirements for enhanced due diligence in high-risk jurisdictions\n\nRegarding data privacy compliance, the procedures are generally sound but should be updated to reflect the recent amendments to the Data Protection Act effective January 2026.\n\nWe will provide detailed written feedback by Friday, March 7, 2026.\n\nPlease let us know if you need any clarification.\n\nBest regards,\nLegal Team`
  );

  return (
    <div className="flex h-full">
      {/* Email List Panel */}
      <div className="w-[30%] bg-white border-r border-gray-200 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent"
            />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {mockEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedEmail.id === email.id ? "bg-[#FFF8DC]" : "hover:bg-gray-50"
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">{email.subject}</div>
              <div className="text-sm text-gray-600 mb-1">{email.sender}</div>
              <div className="text-xs text-gray-500">{email.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Detail Panel */}
      <div className="flex-1 bg-[#FFF8DC] overflow-y-auto">
        <div className="p-8">
          {/* Email Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">{selectedEmail.subject}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">From:</span> {selectedEmail.sender}
              </div>
              <div>
                <span className="font-medium">Date:</span> {selectedEmail.date}
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {selectedEmail.body}
            </div>

            {/* Attachments */}
            {selectedEmail.attachments.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-900 mb-3">Attachments</div>
                <div className="space-y-2">
                  {selectedEmail.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Draft Suggestion */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#806B64] mb-4">AI Draft Suggestion</h2>
            <textarea
              value={draftReply}
              onChange={(e) => setDraftReply(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button className="px-6 py-2 bg-[#AB8E51] text-white rounded-lg hover:bg-[#AB8E51]/90 transition-colors">
                Edit
              </button>
              <button className="px-6 py-2 bg-[#FFD42D] text-gray-900 rounded-lg hover:bg-[#FFD42D]/90 transition-colors">
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
