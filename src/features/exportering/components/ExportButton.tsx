import React, { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { generateJsonExport, generateIcsExport, downloadFile } from '../domain/exportUtils';

interface ExportButtonProps {
  exportData?: Record<string, unknown>;
  events?: Array<{ title: string; date?: string; description?: string; location?: string }>;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  exportData = { message: 'Inbjudningar och inställningar' },
  events = [
    {
      title: 'Språkfika i Mölndal',
      date: new Date().toISOString(),
      description: 'Samling för språkträning och gemenskap.',
      location: 'Mölndals Bibliotek',
    },
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportJson = () => {
    const content = generateJsonExport(exportData);
    downloadFile(content, 'inbjudningar-export.json', 'application/json');
    setIsOpen(false);
  };

  const handleExportIcs = () => {
    const content = generateIcsExport(events);
    downloadFile(content, 'inbjudning.ics', 'text/calendar');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Exportera</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 p-1 border border-slate-100">
          <button
            onClick={handleExportJson}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Exportera Data (JSON)</span>
          </button>
          <button
            onClick={handleExportIcs}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>Exportera Kalender (.ics)</span>
          </button>
        </div>
      )}
    </div>
  );
};
