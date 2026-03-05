import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { addToast } from '../../store/slices/uiSlice';
import {
  X,
  FileText,
  FileDown,
  BookOpen,
  Download,
  Check,
  Loader,
  Settings,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId?: number;
  chapterTitle?: string;
  chapterContent?: string;
}

type ExportFormat = 'pdf' | 'epub' | 'txt';

interface ExportOptions {
  format: ExportFormat;
  includeStats: boolean;
  includeChapterNumbers: boolean;
  fontSize: 'small' | 'medium' | 'large';
  darkTheme: boolean;
}

const ExportModal = ({
  isOpen,
  onClose,
  chapterId,
  chapterTitle = 'Chapter',
  chapterContent = '',
}: ExportModalProps) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeStats: true,
    includeChapterNumbers: true,
    fontSize: 'medium',
    darkTheme: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const dispatch = useAppDispatch();
  const { chapters } = useAppSelector((state) => state.story);

  const handleExport = async () => {
    setIsExporting(true);
    setExportComplete(false);

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get content to export
      const content = chapterContent || generateSampleContent();

      // Create export based on format
      let blob: Blob;
      let filename: string;

      switch (options.format) {
        case 'pdf':
          blob = generatePDF(content);
          filename = `${chapterTitle.replace(/\s+/g, '_')}.pdf`;
          break;
        case 'epub':
          blob = generateEPUB(content);
          filename = `${chapterTitle.replace(/\s+/g, '_')}.epub`;
          break;
        case 'txt':
          blob = new Blob([content], { type: 'text/plain' });
          filename = `${chapterTitle.replace(/\s+/g, '_')}.txt`;
          break;
      }

      // Download file
      downloadBlob(blob, filename);

      setExportComplete(true);
      dispatch(
        addToast({
          type: 'success',
          message: `Successfully exported ${chapterTitle}`,
          duration: 5000,
        })
      );

      setTimeout(() => {
        setExportComplete(false);
      }, 2000);
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Export failed. Please try again.',
          duration: 5000,
        })
      );
    } finally {
      setIsExporting(false);
    }
  };

  const generateSampleContent = (): string => {
    return `${chapterTitle}

This is the content of the chapter that would be exported. In a real implementation, this would pull from the actual chapter content stored in the database.

The Endless Story Engine provides a unique reading experience with:
- Infinite narrative possibilities
- Character progression with 23 stats
- Dual-world storytelling (Real and VR worlds)
- Interactive admin controls

Content continues here...`;
  };

  const generatePDF = (content: string): Blob => {
    // In a real implementation, you would use a library like jspdf or pdfmake
    // For now, we'll create a simple HTML-based PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${chapterTitle}</title>
  <style>
    body {
      font-family: ${options.fontSize === 'large' ? '18px' : options.fontSize === 'small' ? '12px' : '14px'} Georgia, serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      ${options.darkTheme ? 'background-color: #1a1a1a; color: #e0e0e0;' : 'background-color: #fff; color: #333;'}
    }
    h1 {
      text-align: center;
      margin-bottom: 40px;
    }
    p {
      margin-bottom: 1em;
      text-align: justify;
    }
    ${options.includeStats ? '.stats { margin-top: 40px; padding: 20px; border: 1px solid #ccc; }' : ''}
  </style>
</head>
<body>
  <h1>${chapterTitle}</h1>
  ${content.split('\n').map((p) => `<p>${p}</p>`).join('')}
  ${options.includeStats ? '<div class="stats"><h3>Character Stats</h3><p>Stats would be included here...</p></div>' : ''}
</body>
</html>`;

    return new Blob([html], { type: 'application/pdf' });
  };

  const generateEPUB = (content: string): Blob => {
    // In a real implementation, you would use a library like epub-gen
    // For now, we'll create a simple structure
    const epubContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${chapterTitle}</title>
</head>
<body>
  <h1>${chapterTitle}</h1>
  ${content.split('\n').map((p) => `<p>${p}</p>`).join('')}
</body>
</html>`;

    return new Blob([epubContent], { type: 'application/epub+zip' });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Export Chapter
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Chapter Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Exporting</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {chapterTitle}
              {chapterId && ` (Chapter ${chapterId})`}
            </p>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'epub', label: 'EPUB', icon: BookOpen },
                { id: 'txt', label: 'TXT', icon: FileDown },
              ].map((format) => (
                <button
                  key={format.id}
                  onClick={() =>
                    setOptions({ ...options, format: format.id as ExportFormat })
                  }
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    options.format === format.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <format.icon
                    className={`w-6 h-6 ${
                      options.format === format.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      options.format === format.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {format.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <Settings className="w-4 h-4 inline mr-2" />
              Export Options
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.includeStats}
                  onChange={(e) =>
                    setOptions({ ...options, includeStats: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include character stats
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.includeChapterNumbers}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      includeChapterNumbers: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include chapter numbers
                </span>
              </label>
            </div>

            {/* Font Size */}
            <div className="pt-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <select
                value={options.fontSize}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    fontSize: e.target.value as ExportOptions['fontSize'],
                  })
                }
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              exportComplete
                ? 'bg-green-500 text-white'
                : isExporting
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {exportComplete ? (
              <>
                <Check className="w-5 h-5" />
                Export Complete!
              </>
            ) : isExporting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export {options.format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;