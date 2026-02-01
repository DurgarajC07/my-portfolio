'use client';

import { AdminLayout } from '@/components/admin/layout';
import { Save, Upload, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const defaultColors = {
  primary: '#06b6d4',
  secondary: '#0891b2',
  accent: '#06b6d4',
  background: '#0f1419',
  foreground: '#e8eaed',
};

export default function ThemeManagerPage() {
  const [colors, setColors] = useState(defaultColors);
  const [darkMode, setDarkMode] = useState(true);
  const [fontFamily, setFontFamily] = useState('Inter');

  const handleColorChange = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Theme Manager</h1>
          <p className="text-muted-foreground mt-1">Customize your portfolio appearance</p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Appearance Mode</h3>

          <div className="flex gap-4">
            <button
              onClick={() => setDarkMode(false)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${!darkMode ? 'bg-accent text-accent-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}
            >
              <Sun size={20} />
              Light Mode
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${darkMode ? 'bg-accent text-accent-foreground' : 'bg-muted text-foreground hover:bg-muted/80'}`}
            >
              <Moon size={20} />
              Dark Mode
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors">
              System Default
            </button>
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Picker */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Color Scheme</h3>

            <div className="space-y-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground capitalize">
                      {key}
                    </label>
                    <span className="text-xs text-muted-foreground">{value}</span>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-10 rounded-lg cursor-pointer border border-border"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
              <Save size={18} />
              Save Colors
            </button>
          </div>

          {/* Preview */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>

            <div
              className="rounded-lg p-8 mb-4 text-white"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              <p className="font-bold text-lg mb-2">Primary Color</p>
              <p className="text-sm opacity-90">This is your brand color</p>
            </div>

            <div
              className="rounded-lg p-6 mb-4 flex flex-col gap-3"
              style={{
                backgroundColor: colors.background,
                color: colors.foreground,
                border: `1px solid ${colors.secondary}`,
              }}
            >
              <p className="font-bold">Card Preview</p>
              <button
                className="px-4 py-2 rounded font-medium w-fit transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: colors.accent,
                  color: '#fff',
                }}
              >
                Action Button
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Colors are being applied in real-time
            </p>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Typography</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Heading Font
              </label>
              <select className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Inter</option>
                <option>Poppins</option>
                <option>Sora</option>
                <option>Playfair Display</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Body Font
              </label>
              <select className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Inter</option>
                <option>Roboto</option>
                <option>Open Sans</option>
                <option>Lato</option>
              </select>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
            <Save size={18} />
            Save Typography
          </button>
        </div>

        {/* Logo & Favicon */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Branding</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Logo
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, SVG, JPG (Max 5MB)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Favicon
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, ICO (32x32px)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Custom CSS</h3>

          <textarea
            placeholder="Add custom CSS rules here..."
            rows={8}
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
          />

          <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
            <Save size={18} />
            Save Custom CSS
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
