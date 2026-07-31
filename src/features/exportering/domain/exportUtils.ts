export interface ExportPayload<T = unknown> {
  version: string;
  exportedAt: string;
  payload: T;
}

export interface CalendarEvent {
  title: string;
  date?: string;
  description?: string;
  location?: string;
}

export function generateJsonExport<T>(data: T): string {
  const exportData: ExportPayload<T> = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    payload: data,
  };
  return JSON.stringify(exportData, null, 2);
}

export function generateIcsExport(events: CalendarEvent[]): string {
  const formatDate = (dateStr?: string) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  let icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Inbjudningar//NONSGML v1.0//SV',
    'CALSCALE:GREGORIAN',
  ];

  events.forEach((evt, idx) => {
    const dtStart = formatDate(evt.date);
    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:invitation-${idx}-${Date.now()}@inbjudningar`);
    icsLines.push(`DTSTAMP:${formatDate()}`);
    icsLines.push(`DTSTART:${dtStart}`);
    icsLines.push(`SUMMARY:${evt.title || 'Inbjudan'}`);
    if (evt.description) {
      icsLines.push(`DESCRIPTION:${evt.description.replace(/\n/g, '\\n')}`);
    }
    if (evt.location) {
      icsLines.push(`LOCATION:${evt.location}`);
    }
    icsLines.push('END:VEVENT');
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
