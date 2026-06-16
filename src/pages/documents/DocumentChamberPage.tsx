import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Upload, FileText, Eye, CheckCircle2, Pencil, Share2, Download } from 'lucide-react';
import { Document } from '../../types';
import { SignaturePad } from '../../components/documents/SignaturePad';

const initialDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Term Sheet.pdf',
    type: 'PDF',
    size: '1.2 MB',
    lastModified: '2026-06-08',
    shared: true,
    url: 'https://example.com/term-sheet.pdf',
    ownerId: 'system'
  },
  {
    id: 'doc-2',
    name: 'Investor Agreement.pdf',
    type: 'PDF',
    size: '2.4 MB',
    lastModified: '2026-06-10',
    shared: false,
    url: 'https://example.com/investor-agreement.pdf',
    ownerId: 'system'
  }
];

const statusOptions = ['Draft', 'In Review', 'Signed'] as const;

type DocumentStatus = (typeof statusOptions)[number];

export const DocumentChamberPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(documents[0]?.id ?? null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('PDF');
  const [status, setStatus] = useState<DocumentStatus>('Draft');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(documents[0]?.url ?? null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const selectedDocument = useMemo(
    () => documents.find((doc) => doc.id === selectedDocumentId) ?? null,
    [documents, selectedDocumentId]
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setUploadError('Only PDF and Word documents are supported for this demo.');
      return;
    }

    setUploadError(null);
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() ?? 'DOC',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      lastModified: new Date(file.lastModified).toISOString().slice(0, 10),
      shared: false,
      url: URL.createObjectURL(file),
      ownerId: user?.id ?? 'unknown'
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocumentId(newDoc.id);
    setPreviewUrl(newDoc.url);
    setFileName('');
    setFileType(newDoc.type);
    setStatus('Draft');
  };

  const handleStatusUpdate = (nextStatus: DocumentStatus) => {
    setStatus(nextStatus);
  };

  const handleSaveDocument = () => {
    if (!selectedDocument) return;
    setDocuments((prev) => prev.map((doc) => {
      if (doc.id !== selectedDocument.id) return doc;
      return {
        ...doc,
        lastModified: new Date().toISOString().slice(0, 10),
        shared: status !== 'Draft',
      };
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Document Chamber</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Upload, preview and mock-sign contracts for your most important deals.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary">Role: {user?.role === 'entrepreneur' ? 'Founder' : 'Investor'}</Badge>
          <Badge variant="outline">Documents: {documents.length}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-[1fr_1.5fr] gap-4 md:gap-6">
        <Card className="space-y-4 md:col-span-1">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
                <p className="text-sm text-gray-500">Drag or browse to add a contract for preview and e-sign.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-primary-500 hover:text-primary-600">
                <Upload size={18} />
                <span>Select File</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {uploadError && (
              <div className="rounded-2xl border border-error-200 bg-error-50 p-4 text-sm text-error-700">
                {uploadError}
              </div>
            )}

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <Input
                label="Document Name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                fullWidth
                placeholder="Enter file name"
              />
              <Input
                label="Document Type"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                fullWidth
                placeholder="PDF / DOCX"
              />
            </div>
            <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3">
              {statusOptions.map((option) => (
                <Button
                  key={option}
                  variant={status === option ? 'primary' : 'outline'}
                  onClick={() => handleStatusUpdate(option)}
                  fullWidth
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button variant="success" onClick={handleSaveDocument} disabled={!selectedDocument}>
              Save Document Status
            </Button>
          </CardBody>
        </Card>

        <Card className="space-y-6">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
            <p className="text-sm text-gray-500">Quick access to uploaded contracts and signed assets.</p>
          </CardHeader>
          <CardBody className="space-y-3">
            {documents.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => {
                  setSelectedDocumentId(doc.id);
                  setPreviewUrl(doc.url);
                  setStatus('Draft');
                }}
                className={`w-full rounded-2xl border p-4 text-left transition ${selectedDocumentId === doc.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary-100 p-2 text-primary-700">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.size} • {doc.type}</p>
                    </div>
                  </div>
                  <Badge variant={doc.shared ? 'success' : 'outline'}>{doc.shared ? 'Shared' : 'Private'}</Badge>
                </div>
              </button>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr] gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
                <p className="text-sm text-gray-500">View the selected document or a placeholder preview.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" leftIcon={<Eye size={16} />}>
                  Preview
                </Button>
                <Button variant="ghost" size="sm" leftIcon={<Download size={16} />}>
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-[540px] overflow-hidden rounded-3xl border border-gray-200 bg-gray-950 text-white">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  title="Document Preview"
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-12 text-center text-sm text-gray-300">
                  Select a document to preview the contents in the chamber.
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4 md:col-span-1 md:col-start-1 lg:col-span-1 lg:col-start-auto">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">E-signature</h2>
              <p className="text-sm text-gray-500">Draw your signature and save a document-ready signoff.</p>
            </CardHeader>
            <CardBody>
              <SignaturePad
                initialDataUrl={signatureDataUrl ?? undefined}
                onSave={(dataUrl) => setSignatureDataUrl(dataUrl)}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Document Status</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-gray-600">Current Status</p>
                  <Badge variant={status === 'Draft' ? 'warning' : status === 'In Review' ? 'accent' : 'success'}>
                    {status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-gray-500">Saving the document updates the mock contract state and refreshes the chamber metadata.</p>
              </div>
              <div className="grid gap-3">
                <Button variant="primary" onClick={handleSaveDocument}>
                  Save Document Metadata
                </Button>
                <Button variant="outline" onClick={() => setStatus('Signed')}>
                  Mark as Signed
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
