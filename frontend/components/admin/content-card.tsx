'use client';

import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  type: 'hero' | 'about' | 'skills' | 'projects' | 'blog' | 'experience';
  status: 'draft' | 'published';
  visible: boolean;
  lastUpdated: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string, visible: boolean) => void;
}

export function ContentCard({
  id,
  title,
  description,
  type,
  status,
  visible,
  lastUpdated,
  onEdit,
  onDelete,
  onToggleVisibility,
}: ContentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const statusColors = {
    draft: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    published: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  };

  const typeColors: Record<string, string> = {
    hero: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    about: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    skills: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
    projects: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
    blog: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    experience: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300',
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${typeColors[type]}`}>
          {type}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">{lastUpdated}</p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleVisibility?.(id, !visible)}
            className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
            title={visible ? 'Hide' : 'Show'}
          >
            {visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>

          <button
            onClick={() => onEdit?.(id)}
            className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
          >
            <Edit2 size={18} />
          </button>

          <button
            onClick={() => setIsDeleting(true)}
            className="p-2 hover:bg-red-500/10 rounded-md transition-colors text-muted-foreground hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {isDeleting && (
        <div className="mt-3 p-3 bg-red-500/10 rounded-md flex items-center justify-between">
          <p className="text-sm text-red-600 dark:text-red-400">Delete this item?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsDeleting(false)}
              className="text-xs px-2 py-1 hover:bg-red-500/20 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete?.(id)}
              className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
