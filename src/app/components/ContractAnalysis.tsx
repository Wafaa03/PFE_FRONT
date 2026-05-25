import { useState } from "react";
import { Upload, FileText } from "lucide-react";

interface ClauseAnalysis {
  title: string;
  comment: string;
  suggestion: string;
  reference: string;
}

export function ContractAnalysis() {
  const [contractUploaded, setContractUploaded] = useState(false);

  const mockContractText = `VENDOR SERVICE AGREEMENT

This Vendor Service Agreement ("Agreement") is entered into as of January 15, 2026 ("Effective Date") by and between:

BANK CORPORATION ("Client"), a banking institution organized under the laws of [Jurisdiction], with its principal place of business at [Address]

AND

TECH SOLUTIONS INC. ("Vendor"), a corporation organized under the laws of [Jurisdiction], with its principal place of business at [Address]

1. SERVICES
The Vendor agrees to provide software development and maintenance services as described in Exhibit A attached hereto.

2. TERM
This Agreement shall commence on the Effective Date and continue for a period of three (3) years, unless earlier terminated in accordance with Section 8.

3. COMPENSATION
Client shall pay Vendor a monthly fee of $50,000, payable within 30 days of invoice receipt.

4. CONFIDENTIALITY
Each party agrees to maintain the confidentiality of all proprietary information disclosed by the other party during the term of this Agreement and for a period of five (5) years thereafter.

5. INTELLECTUAL PROPERTY
All intellectual property developed by Vendor in the course of providing Services shall be the exclusive property of Client.

6. LIABILITY
Vendor's total liability under this Agreement shall not exceed the total fees paid by Client in the twelve (12) months preceding the claim.

7. DATA PROTECTION
Vendor shall comply with all applicable data protection laws and regulations in the processing of any personal data provided by Client.

8. TERMINATION
Either party may terminate this Agreement with 90 days written notice. Client may terminate immediately for cause upon material breach by Vendor.

9. GOVERNING LAW
This Agreement shall be governed by the laws of [Jurisdiction].

10. DISPUTE RESOLUTION
Any disputes arising under this Agreement shall be resolved through binding arbitration in accordance with the rules of [Arbitration Association].`;

  const clauseAnalyses: ClauseAnalysis[] = [
    {
      title: "Services Definition (Section 1)",
      comment:
        "The services are defined by reference to Exhibit A. This is standard practice and allows flexibility in modifying service scope.",
      suggestion:
        "Ensure Exhibit A contains detailed specifications and performance metrics. Consider adding a change control procedure for service modifications.",
      reference: "Best Practice: Contract Drafting Guidelines, Chapter 4",
    },
    {
      title: "Term and Renewal (Section 2)",
      comment:
        "Three-year term without automatic renewal provision. This provides certainty but requires active renegotiation.",
      suggestion:
        "Consider adding an optional renewal clause with 180-day notice requirement. Include provisions for annual rate adjustments tied to inflation index.",
      reference: "Banking Regulations: Vendor Management Guidelines, Section 3.2",
    },
    {
      title: "Payment Terms (Section 3)",
      comment:
        "30-day payment terms are reasonable. Monthly fee structure provides predictability for budgeting.",
      suggestion:
        "Add provisions for late payment interest and detailed invoicing requirements. Consider volume discounts if services expand.",
      reference: "Commercial Contract Standards, Article 12",
    },
    {
      title: "Confidentiality (Section 4)",
      comment:
        "Five-year post-termination confidentiality period is adequate for most banking information.",
      suggestion:
        "Consider perpetual confidentiality for trade secrets and customer information. Add specific carve-outs for legally required disclosures.",
      reference: "Data Protection Act, Section 8; Banking Secrecy Law, Article 15",
    },
    {
      title: "Intellectual Property (Section 5)",
      comment:
        "Work-for-hire provision ensures bank owns all deliverables. This is appropriate for custom development.",
      suggestion:
        "Clarify treatment of Vendor's pre-existing IP and tools. Add representation that work doesn't infringe third-party rights. Include indemnification clause.",
      reference: "Intellectual Property Rights in Banking, Chapter 6",
    },
    {
      title: "Liability Cap (Section 6)",
      comment:
        "Liability limited to 12 months of fees may be insufficient for critical banking systems. Standard cap is typically 1-2x annual contract value.",
      suggestion:
        "Increase liability cap to 2x annual fees ($1.2M) or remove cap for gross negligence, willful misconduct, and data breaches. Add specific liability for regulatory fines.",
      reference: "Banking Vendor Contracts: Risk Management, Section 5.4",
    },
    {
      title: "Data Protection (Section 7)",
      comment:
        "Generic data protection obligation without specific safeguards. Insufficient for banking regulatory requirements.",
      suggestion:
        "Add detailed data processing terms including: security standards (ISO 27001), encryption requirements, breach notification (24-hour requirement), audit rights, and sub-processor approval process. Reference Data Processing Addendum.",
      reference: "Data Protection Act, Articles 28-32; Banking Data Security Directive 2024",
    },
    {
      title: "Termination Rights (Section 8)",
      comment:
        "90-day notice for convenience termination is standard. Immediate termination for material breach is appropriate.",
      suggestion:
        "Define 'material breach' explicitly. Add termination rights for regulatory requirements or vendor's financial instability. Include transition assistance obligations (90 days minimum).",
      reference: "Banking Vendor Management Framework, Section 7",
    },
  ];

  const handleUpload = () => {
    setContractUploaded(true);
  };

  return (
    <div className="p-8 bg-[#FFF8DC] h-full overflow-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#806B64] mb-2">Contract Analysis</h1>
        <button
          onClick={handleUpload}
          className="px-6 py-2 bg-[#FFD42D] text-gray-900 rounded-lg hover:bg-[#FFD42D]/90 transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Contract
        </button>
      </div>

      {!contractUploaded ? (
        /* Empty State */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-[#FFF8DC] rounded-full flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 text-[#AB8E51]" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Upload a contract to begin analysis</h2>
          <p className="text-gray-600 text-center max-w-md">
            Our AI will analyze the contract and provide structured feedback on each clause with suggestions and legal references.
          </p>
        </div>
      ) : (
        /* Contract Analysis View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Contract Text Viewer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-lg font-semibold text-[#806B64] mb-4">Contract Document</h2>
            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">
              {mockContractText}
            </div>
          </div>

          {/* Right: Analysis Panel */}
          <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-lg font-semibold text-[#806B64] mb-4 sticky top-0 bg-[#FFF8DC] py-2">
              Clause Analysis
            </h2>
            {clauseAnalyses.map((clause, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">{clause.title}</h3>
                
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">AI Comment</div>
                  <div className="text-sm text-gray-600">{clause.comment}</div>
                </div>

                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Suggested Modification</div>
                  <div className="text-sm text-gray-600">{clause.suggestion}</div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Legal Reference:</span> {clause.reference}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
