import { useState, useMemo, useEffect } from "react";
import { FileText, BookOpen, Scale, ExternalLink, UploadCloud, CheckCircle2, MessageSquare, MapPin, Table as TableIcon, Filter, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import { apiFetch } from "../lib/auth";

interface Document {
  id: string | number;
  title: string;
  type: string;
  site: string;
  date: string;
  description: string;
  content?: string;
  sections?: string[];
  status: string;
}

export function KnowledgeBase() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedSite, setSelectedSite] = useState<string>("All");

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setIsLoading(true);
        // We will try fetching from the user's backend endpoint 'legal_embeddings'
        let res = await apiFetch("/api/legal_embeddings");
        if (!res.ok) {
          res = await apiFetch("/legal_embeddings");
        }
        
        if (res.ok) {
          const data = await res.json();
          // Handle arrays directly, or inside a common wrapper object like 'data' or 'embeddings'
          const items = Array.isArray(data) ? data : (data.data || data.embeddings || data.items || []);
          
          const formattedData = items
            .filter((item: any) => {
              const type = (item.type || item.document_type || item.sheet || item.category || "").toLowerCase();
              const site = (item.site || item.website || "").toLowerCase();
              return type !== "unknown" && site !== "unknown";
            })
            .map((item: any, index: number) => ({
            id: item.id || item.file_id || index,
            title: item.title || (item.article_number ? `Article ${item.article_number}` : null) || item.reference || item.file_name || item.name || `Document ${index + 1}`,
            type: item.type || item.document_type || item.sheet || item.category || "Document",
            site: item.site || item.website || item.location || item.department || "",
            date: item.date || item.created_at || item.updated_at || "",
            description: item.description || item.summary || (item.content ? item.content.substring(0, 120) + "..." : (item.text ? item.text.substring(0, 120) + "..." : "No description available")),
            content: item.content || item.text || item.raw_text || "Content not available.",
            status: item.status || "Ready"
          }));
          setDocuments(formattedData);
        } else {
          console.error("Failed to load legal_embeddings. Status:", res.status);
        }
      } catch (err) {
        console.error("Error fetching legal_embeddings", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  // Dynamically extract unique types and sites from the real data
  const types = ["All", ...Array.from(new Set(documents.map(d => d.type)))].filter(Boolean);
  const sites = ["All", ...Array.from(new Set(documents.map(d => d.site)))].filter(Boolean);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesType = selectedType === "All" || doc.type === selectedType;
      const matchesSite = selectedSite === "All" || doc.site === selectedSite;
      return matchesType && matchesSite;
    });
  }, [documents, selectedType, selectedSite]);

  const getTypeColor = (type: string) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("loi")) return "bg-[#AB8E51]/10 text-[#AB8E51] border-[#AB8E51]/20";
    if (t.includes("circulaire")) return "bg-[#806B64]/10 text-[#806B64] border-[#806B64]/20";
    if (t.includes("decret") || t.includes("décret")) return "bg-amber-50 text-amber-800 border-amber-200";
    if (t.includes("arrete") || t.includes("arrêté")) return "bg-orange-50 text-orange-800 border-orange-200";
    if (t.includes("reglement") || t.includes("règlement")) return "bg-indigo-50 text-indigo-800 border-indigo-200";
    if (t.includes("directive")) return "bg-violet-50 text-violet-800 border-violet-200";
    if (t.includes("procedure")) return "bg-[#FFD42D]/20 text-gray-900 border-[#FFD42D]/30";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach((doc) => {
      counts[doc.type] = (counts[doc.type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [documents]);

  const siteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach((doc) => {
      counts[doc.site] = (counts[doc.site] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [documents]);

  const getSiteColor = (site: string) => {
    const s = site?.toLowerCase() || "";
    if (s.includes("global")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (s.includes("paris")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (s.includes("new york") || s.includes("ny")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s.includes("london")) return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  if (selectedDocument) {
    return (
      <div className="p-8 bg-[#FAFAFA] h-full overflow-auto">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedDocument(null)}
            className="mb-6 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#AB8E51] flex items-center gap-2 transition-colors bg-white border border-[#D4C9B0] rounded-lg shadow-sm hover:shadow-md"
          >
            ← Back to Table
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E8DCC8] p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#AB8E51] to-[#FFD42D]"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border ${getTypeColor(selectedDocument.type)}`}>
                    {selectedDocument.type}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${getSiteColor(selectedDocument.site)}`}>
                    <MapPin className="w-3 h-3" /> {selectedDocument.site}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedDocument.title}
                </h1>
                <p className="text-sm text-gray-500">{selectedDocument.date}</p>
              </div>
              
              <Link 
                to="/ai-assistant" 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#AB8E51] to-[#806B64] text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <MessageSquare className="w-4 h-4" />
                Chat with this Doc
              </Link>
            </div>

            <div className="prose max-w-none text-gray-700">
              <div className="whitespace-pre-wrap leading-relaxed font-serif">
                {selectedDocument.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#FAFAFA] to-[#F5F0E0] overflow-auto flex flex-col">
      {/* Sticky Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#E8DCC8] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <TableIcon className="w-6 h-6 text-[#AB8E51]" /> Article Database
          </h1>
          <p className="text-sm text-gray-500 mt-1">Live view of all embedded articles classified by Type and Site.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 w-full flex-1 flex flex-col">

        {/* Classification summary */}
        {!isLoading && documents.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-[#E8DCC8] p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#AB8E51]" /> Par type ({documents.length} articles)
              </h2>
              <div className="flex flex-wrap gap-2">
                {typeCounts.map(([type, count]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${getTypeColor(type)} ${
                      selectedType === type ? "ring-2 ring-[#AB8E51]/40" : "hover:opacity-80"
                    }`}
                  >
                    {type}
                    <span className="bg-white/60 px-1.5 py-0.5 rounded-md">{count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8DCC8] p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#806B64]" /> Par site
              </h2>
              <div className="flex flex-wrap gap-2">
                {siteCounts.map(([site, count]) => (
                  <button
                    key={site}
                    onClick={() => setSelectedSite(site)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${getSiteColor(site)} ${
                      selectedSite === site ? "ring-2 ring-[#806B64]/40" : "hover:opacity-80"
                    }`}
                  >
                    {site}
                    <span className="bg-white/60 px-1.5 py-0.5 rounded-md">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-t-2xl border border-[#E8DCC8] border-b-0 flex flex-wrap items-center gap-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">Filter by Type:</span>
            <div className="flex gap-2 flex-wrap">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedType === type 
                    ? "bg-[#AB8E51] text-white shadow-sm" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">Filter by Site:</span>
            <div className="flex gap-2 flex-wrap">
              {sites.map(site => (
                <button
                  key={site}
                  onClick={() => setSelectedSite(site)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedSite === site 
                    ? "bg-[#806B64] text-white shadow-sm" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {site}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Excel-style Data Table */}
        <div className="bg-white border border-[#E8DCC8] rounded-b-2xl shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E8DCC8] text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Site</th>
                  <th className="px-6 py-4">Extrait</th>
                  <th className="px-6 py-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-8 h-8 text-[#AB8E51] animate-spin" />
                        <span className="text-gray-500 font-medium">Loading real data from legal_embeddings...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No articles found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr 
                      key={doc.id} 
                      onClick={() => setSelectedDocument(doc)}
                      className="hover:bg-[#FAFAFA] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 group-hover:text-[#AB8E51] transition-colors">
                          {doc.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${getTypeColor(doc.type)}`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${getSiteColor(doc.site)}`}>
                          <MapPin className="w-3 h-3" /> {doc.site}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                          {doc.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Vectorized
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
