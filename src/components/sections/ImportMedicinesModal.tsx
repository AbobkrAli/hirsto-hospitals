import React, { useRef, useState } from 'react';
import Button from '../atoms/Button';
import Papa, { type ParseResult } from 'papaparse';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Package } from 'lucide-react';

interface MedicineCSVRow {
  name: string;
  ingredient: string;
  concentration: string;
  price: number;
  stock: number;
}

interface ImportMedicinesModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (medicines: MedicineCSVRow[]) => void;
}

const ImportMedicinesModal: React.FC<ImportMedicinesModalProps> = ({ open, onClose, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvData, setCsvData] = useState<MedicineCSVRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [step, setStep] = useState<'choose' | 'preview'>('choose');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<MedicineCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
  complete: (results: ParseResult<MedicineCSVRow>) => {
        // Validate required columns
        const required = ['name', 'ingredient', 'concentration', 'price', 'stock'];
        const missing = required.filter(col => !results.meta.fields?.includes(col));
        if (missing.length > 0) {
          setParseError('Missing columns: ' + missing.join(', '));
          setCsvData([]);
          return;
        }
        // Validate data
        const validRows = results.data.filter((row: MedicineCSVRow) => row.name && row.ingredient && row.concentration && !isNaN(Number(row.price)) && !isNaN(Number(row.stock)));
        if (validRows.length === 0) {
          setParseError('No valid rows found.');
          setCsvData([]);
          return;
        }
        setCsvData(validRows);
        setParseError(null);
        setStep('preview');
      },
      error: () => {
        setParseError('Failed to parse CSV. Please check the file format.');
        setCsvData([]);
      }
    });
  };

  const handleImport = () => {
    onImport(csvData);
    setCsvData([]);
    setStep('choose');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 h-[100vh] backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-lg">
              <div className="backdrop-blur-xl rounded-2xl shadow-2xl border bg-white/90 border-[#90E0EF]/30 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">
                        Import Medicines from CSV
                      </h2>
                      <p className="text-sm text-[#0077B6]/70 font-paragraphs">
                        Upload a CSV file to add multiple medicines at once
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[#1E3E72]" />
                  </button>
                </div>
                {/* File Step */}
                {step === 'choose' && (
                  <>
                    <div
                      className="mb-4 flex flex-col items-center justify-center border-2 border-dashed border-[#90E0EF] rounded-xl bg-[#F8FAFC] p-6 cursor-pointer transition hover:border-[#0077B6]/80 hover:bg-[#E0F7FA] min-h-[160px] relative"
                      style={{ minHeight: 160 }}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          const file = e.dataTransfer.files[0];
                          if ((file && file.type === 'text/csv') || file.name.endsWith('.csv')) {
                            const dt = new DataTransfer();
                            dt.items.add(file);
                            if (fileInputRef.current) fileInputRef.current.files = dt.files;
                            const event = {
                              target: { files: dt.files }
                            } as unknown as React.ChangeEvent<HTMLInputElement>;
                            handleFileChange(event);
                          }
                        }
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="import-medicine-csv-input"
                        tabIndex={-1}
                      />
                      <div className="flex flex-col items-center justify-center pointer-events-none select-none">
                        <div className="mb-2">
                          <Package className="w-8 h-8 text-[#0077B6]" />
                        </div>
                        <div className="font-semibold text-[#1E3E72]">Drag & drop your CSV file here</div>
                        <div className="text-xs text-[#0077B6]/70 mt-1">or <span className="underline">click to browse</span></div>
                        <div className="text-xs text-[#0077B6]/60 mt-2">Only .csv files are supported</div>
                        {fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0] && (
                          <div className="mt-3 text-sm text-[#0077B6] truncate max-w-[200px]">
                            Selected: {fileInputRef.current.files[0].name}
                          </div>
                        )}
                      </div>
                    </div>
                    {parseError && <div className="text-red-500 mb-2">{parseError}</div>}
                  </>
                )}
                {/* Preview Step */}
                {step === 'preview' && csvData.length > 0 && (
                  <>
                    <div className="mb-4 max-h-56 overflow-y-auto border rounded-xl bg-gray-50 p-0 shadow-sm">
                      <div className="font-semibold mb-2 px-4 pt-3">Preview:</div>
                      <table className="min-w-full text-xs text-left">
                        <thead className="sticky top-0 bg-[#CAF0F8] text-[#1E3E72] font-bold">
                          <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Ingredient</th>
                            <th className="px-4 py-2">Concentration</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvData.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F1FAFF]'}>
                              <td className="px-4 py-2 border-b border-gray-100 font-medium">{row.name}</td>
                              <td className="px-4 py-2 border-b border-gray-100">{row.ingredient}</td>
                              <td className="px-4 py-2 border-b border-gray-100">{row.concentration}</td>
                              <td className="px-4 py-2 border-b border-gray-100">{row.price}</td>
                              <td className="px-4 py-2 border-b border-gray-100">{row.stock}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => { setStep('choose'); setCsvData([]); }}>Back</Button>
                      <Button onClick={handleImport}>Send</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImportMedicinesModal;
