import { useState } from "react";
import { Search, Filter, FileText, BookOpen, Scale, ExternalLink } from "lucide-react";

interface Document {
  id: number;
  title: string;
  type: "Law" | "Circular" | "Internal Procedure";
  date: string;
  description: string;
  content?: string;
  sections?: string[];
}

const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Banking Act 2025",
    type: "Law",
    date: "Jan 1, 2025",
    description: "Comprehensive banking regulations covering licensing, operations, and supervision",
    content: `BANKING ACT 2025

CHAPTER 1: GENERAL PROVISIONS

Article 1: Purpose and Scope
This Act establishes the legal framework for banking activities, supervision, and regulation of financial institutions operating within the jurisdiction.

Article 2: Definitions
For the purposes of this Act:
- "Bank" means any institution authorized to accept deposits and provide lending services
- "Regulatory Authority" means the Central Bank or designated supervisory body
- "Capital" means the financial resources as defined in Article 15

CHAPTER 2: LICENSING AND AUTHORIZATION

Article 3: Banking License Requirement
No person or entity may engage in banking activities without a valid license issued by the Regulatory Authority.

Article 4: Application Requirements
Applications for banking licenses must include:
a) Corporate documents and organizational structure
b) Business plan and financial projections
c) Details of shareholders and beneficial owners
d) Qualifications of management and board members
e) Internal control and risk management frameworks

Article 5: Minimum Capital Requirements
Banks must maintain minimum capital of:
- Tier 1 Capital: Not less than $50 million
- Total Capital Adequacy Ratio: Not less than 12% of risk-weighted assets

CHAPTER 3: OPERATIONAL REQUIREMENTS

Article 6: Corporate Governance
Banks must establish:
- Independent board of directors with majority non-executive members
- Audit committee, risk committee, and compliance committee
- Clear separation of management and oversight functions

Article 7: Risk Management
Banks must implement comprehensive risk management frameworks covering:
- Credit risk
- Market risk
- Operational risk
- Liquidity risk
- Compliance risk

Article 8: Customer Due Diligence
Banks must conduct appropriate customer due diligence including:
- Identity verification
- Beneficial ownership identification
- Purpose and nature of business relationship
- Ongoing monitoring of transactions`,
    sections: [
      "Chapter 1: General Provisions",
      "Chapter 2: Licensing and Authorization",
      "Chapter 3: Operational Requirements",
      "Chapter 4: Financial Reporting",
      "Chapter 5: Enforcement and Penalties",
    ],
  },
  {
    id: 2,
    title: "Anti-Money Laundering Circular 2024/08",
    type: "Circular",
    date: "Aug 15, 2024",
    description: "Enhanced due diligence requirements for high-risk transactions and customers",
    content: `CIRCULAR NO. 2024/08
ANTI-MONEY LAUNDERING - ENHANCED DUE DILIGENCE

TO: All Licensed Banks and Financial Institutions
FROM: Financial Intelligence Unit
DATE: August 15, 2024

SUBJECT: Enhanced Due Diligence Requirements

1. PURPOSE
This circular provides guidance on enhanced due diligence (EDD) measures for high-risk customers and transactions.

2. SCOPE
These requirements apply to:
- Politically Exposed Persons (PEPs)
- High-risk jurisdictions
- Complex corporate structures
- Transactions exceeding $50,000

3. ENHANCED DUE DILIGENCE MEASURES
Banks must implement the following EDD measures:

a) Source of Wealth and Funds
- Detailed documentation of customer's source of wealth
- Verification of source of funds for each transaction
- Regular updates (at least annually)

b) Enhanced Monitoring
- Real-time transaction monitoring
- Quarterly account reviews
- Investigation of unusual patterns

c) Senior Management Approval
- Approval required to establish relationship
- Annual review and re-approval of relationship

4. DOCUMENTATION REQUIREMENTS
Maintain the following for at least 7 years:
- Customer identification documents
- Source of wealth/funds documentation
- Transaction records and monitoring reports
- Risk assessment documentation

5. REPORTING OBLIGATIONS
Report to FIU within 24 hours:
- Suspicious transactions
- Attempted transactions by sanctioned entities
- Transactions involving high-risk jurisdictions`,
    sections: [
      "1. Purpose",
      "2. Scope",
      "3. Enhanced Due Diligence Measures",
      "4. Documentation Requirements",
      "5. Reporting Obligations",
      "6. Compliance Timeline",
    ],
  },
  {
    id: 3,
    title: "Data Protection Act",
    type: "Law",
    date: "Jan 1, 2024",
    description: "Personal data protection, privacy rights, and processing obligations",
  },
  {
    id: 4,
    title: "Internal Procedure: Vendor Management",
    type: "Internal Procedure",
    date: "Feb 10, 2026",
    description: "Guidelines for selecting, onboarding, and monitoring third-party vendors",
  },
  {
    id: 5,
    title: "Cross-Border Payment Directive 2025",
    type: "Circular",
    date: "Mar 1, 2025",
    description: "Requirements for processing international payments and foreign exchange",
  },
  {
    id: 6,
    title: "Internal Procedure: Incident Response",
    type: "Internal Procedure",
    date: "Nov 20, 2025",
    description: "Protocol for handling security incidents and data breaches",
  },
  {
    id: 7,
    title: "Consumer Protection Regulations",
    type: "Law",
    date: "Jun 1, 2024",
    description: "Rights of banking customers and fair treatment principles",
  },
  {
    id: 8,
    title: "Risk Management Circular 2025/12",
    type: "Circular",
    date: "Dec 1, 2025",
    description: "Updated framework for enterprise risk management and reporting",
  },
];

export function KnowledgeBase() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesType = filterType === "All" || doc.type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Law":
        return <Scale className="w-5 h-5 text-[#AB8E51]" />;
      case "Circular":
        return <FileText className="w-5 h-5 text-[#806B64]" />;
      case "Internal Procedure":
        return <BookOpen className="w-5 h-5 text-[#FFD42D]" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Law":
        return "bg-[#AB8E51]/10 text-[#AB8E51]";
      case "Circular":
        return "bg-[#806B64]/10 text-[#806B64]";
      case "Internal Procedure":
        return "bg-[#FFD42D]/20 text-gray-900";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (selectedDocument) {
    return (
      <div className="p-8 bg-[#FFF8DC] h-full overflow-auto">
        <button
          onClick={() => setSelectedDocument(null)}
          className="mb-6 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Knowledge Base
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Section Navigation */}
          {selectedDocument.sections && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
                <ul className="space-y-2">
                  {selectedDocument.sections.map((section, index) => (
                    <li key={index}>
                      <a
                        href={`#section-${index}`}
                        className="text-sm text-gray-700 hover:text-[#AB8E51] flex items-center gap-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {section}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Center/Right: Document Content */}
          <div className={selectedDocument.sections ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {selectedDocument.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        selectedDocument.type
                      )}`}
                    >
                      {selectedDocument.type}
                    </span>
                    <span>{selectedDocument.date}</span>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {selectedDocument.content || "Document content not available."}
                </div>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#806B64] mb-3">AI Explanation</h3>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-3">
                  This document establishes the fundamental legal framework for{" "}
                  {selectedDocument.type === "Law"
                    ? "regulatory compliance"
                    : selectedDocument.type === "Circular"
                    ? "operational procedures"
                    : "internal processes"}{" "}
                  within the banking sector.
                </p>
                <p>
                  Key requirements include adherence to specified standards, documentation procedures, and
                  reporting obligations. Organizations must ensure full compliance with all provisions and
                  maintain appropriate records as stipulated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#FFF8DC] h-full overflow-auto">
      {/* Page Header */}
      <h1 className="text-2xl font-semibold text-[#806B64] mb-6">Knowledge Base</h1>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-11 pr-8 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Law">Law</option>
            <option value="Circular">Circular</option>
            <option value="Internal Procedure">Internal Procedure</option>
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocument(doc)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FFF8DC] flex items-center justify-center flex-shrink-0">
                {getTypeIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{doc.title}</h3>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                    doc.type
                  )}`}
                >
                  {doc.type}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>
            <div className="text-xs text-gray-500">{doc.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
