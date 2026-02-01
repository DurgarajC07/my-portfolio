'use client';

import { AdminLayout } from '@/components/admin/layout';
import { FileText, Download, Trash2, Check, Upload } from 'lucide-react';
import { useState } from 'react';

interface Resume {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  active: boolean;
}

const initialResumes: Resume[] = [
  {
    id: '1',
    name: 'Resume_2024.pdf',
    uploadedAt: '2024-01-15',
    size: '2.4 MB',
    active: true,
  },
  {
    id: '2',
    name: 'Resume_2023.pdf',
    uploadedAt: '2023-12-01',
    size: '2.1 MB',
    active: false,
  },
];

export default function ResumeManagerPage() {
  const [resumes, setResumes] = useState(initialResumes);
  const [isDragging, setIsDragging] = useState(false);

  const handleSetActive = (id: string) => {
    setResumes(resumes.map(r => ({ ...r, active: r.id === id })));
  };

  const handleDelete = (id: string) => {
    setResumes(resumes.filter(r => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText size={32} />
            Resume Manager
          </h1>
          <p className="text-muted-foreground mt-1">Upload and manage your resume files</p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
        >
          <Upload size={48} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-lg font-medium text-foreground mb-1">Upload a new resume</p>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your PDF file here, or click to select
          </p>
          <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
            Choose File
          </button>
          <p className="text-xs text-muted-foreground mt-3">Supported formats: PDF (Max 10MB)</p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-600 dark:text-blue-400 text-sm">
          <p className="font-medium mb-1">Active Resume</p>
          <p>The active resume will be available for download from your portfolio website. You can have only one active resume at a time.</p>
        </div>

        {/* Resumes List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Your Resumes</h3>

          {resumes.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <FileText size={48} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-foreground font-medium mb-1">No resumes uploaded</p>
              <p className="text-muted-foreground text-sm">Upload your first resume to get started</p>
            </div>
          ) : (
            resumes.map(resume => (
              <div
                key={resume.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${resume.active ? 'bg-accent/10 border-accent' : 'bg-card border-border hover:border-accent/50'}`}
              >
                <div className="flex items-center gap-4">
                  <FileText size={24} className={resume.active ? 'text-accent' : 'text-muted-foreground'} />
                  <div>
                    <p className="font-medium text-foreground">{resume.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{resume.size}</span>
                      <span>•</span>
                      <span>Uploaded {resume.uploadedAt}</span>
                      {resume.active && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-accent font-medium">
                            <Check size={14} />
                            Active
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!resume.active && (
                    <button
                      onClick={() => handleSetActive(resume.id)}
                      className="px-3 py-1 text-sm border border-border text-foreground rounded hover:bg-muted transition-colors font-medium"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    title="Download"
                    className="p-2 text-muted-foreground hover:text-accent rounded-lg hover:bg-muted transition-colors"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    title="Delete"
                    className="p-2 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Download Link */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Resume Download Link</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Your active resume will be available at:
          </p>
          <div className="flex items-center gap-2 p-3 bg-input rounded-lg">
            <code className="text-sm text-foreground flex-1">yourportfolio.com/resume.pdf</code>
            <button className="px-3 py-1 text-sm bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors font-medium">
              Copy
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
