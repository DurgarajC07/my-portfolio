'use client';

import React from "react"

import { X, Save, ChevronDown, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  name: string;
  title: string;
  content: string;
  visible: boolean;
  order: number;
}

interface SectionEditorProps {
  section: Section;
  onSave?: (section: Section) => void;
  onClose?: () => void;
  onDelete?: () => void;
}

export function SectionEditor({
  section,
  onSave,
  onClose,
  onDelete,
}: SectionEditorProps) {
  const [formData, setFormData] = useState(section);
  const [expanded, setExpanded] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, visible: !prev.visible }));
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <GripVertical size={18} className="text-muted-foreground" />
          <div>
            <p className="font-semibold text-foreground">{formData.name}</p>
            <p className="text-xs text-muted-foreground">{formData.title}</p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={cn('transition-transform', expanded && 'rotate-180')}
        />
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-border">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Section Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Visible on Portfolio</label>
            <button
              onClick={handleToggle}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                formData.visible
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-red-500/20 text-red-600 dark:text-red-400'
              )}
            >
              {formData.visible ? 'Visible' : 'Hidden'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={onDelete}
              className="px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors text-sm font-medium"
            >
              Delete
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-md transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSave?.(formData);
                  onClose?.();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors text-sm font-medium"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
