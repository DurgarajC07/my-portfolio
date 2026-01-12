'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ProfileData, TerminalOutput } from '@/lib/types';
import { CommandParser } from '@/lib/commands';

interface TerminalProps {
  data: ProfileData;
}

export default function Terminal({ data }: TerminalProps) {
  const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const parser = CommandParser.getInstance();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Welcome message
    const welcomeOutput: TerminalOutput = {
      id: 'welcome',
      type: 'system',
      content: (
        <div className="space-y-4">
          <pre className="text-green-400 text-xs md:text-sm">
{`
 █████╗ ██╗     ██████╗ ███████╗    ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
██╔══██╗██║    ██╔═══██╗██╔════╝    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
███████║██║    ██║   ██║███████╗    ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
██╔══██║██║    ██║   ██║╚════██║    ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
██║  ██║██║    ╚██████╔╝███████║    ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
╚═╝  ╚═╝╚═╝     ╚═════╝ ╚══════╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ 
`}
          </pre>
          <div className="text-cyan-400 space-y-2">
            <div className="text-xl font-bold">Welcome to {data.personal.name}'s AI OS Portfolio</div>
            <div className="text-gray-400">{data.personal.tagline}</div>
            <div className="text-sm text-gray-500 mt-4">
              Type <span className="text-green-400">help</span> to see available commands
            </div>
          </div>
        </div>
      ),
      timestamp: new Date(),
    };
    setOutputs([welcomeOutput]);
  }, [data.personal.name, data.personal.tagline]);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  useEffect(() => {
    if (input) {
      const sugg = parser.getAutocompleteSuggestions(input);
      setSuggestions(sugg.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [input, parser]);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    // Add command to outputs
    const commandOutput: TerminalOutput = {
      id: `cmd-${Date.now()}`,
      type: 'command',
      content: cmd,
      timestamp: new Date(),
    };

    const results = parser.parse(cmd, data);

    // Check for clear command
    if (results.length > 0 && results[0].content === '__CLEAR__') {
      setOutputs([]);
      setInput('');
      return;
    }

    setOutputs((prev) => [...prev, commandOutput, ...results]);
    setCommandHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInput('');
    setSuggestions([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
        setSuggestions([]);
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="min-h-screen bg-black text-white font-mono p-4 md:p-8"
      onClick={focusInput}
    >
      <div className="max-w-7xl mx-auto">
        {/* Terminal Header */}
        <div className="mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-gray-500 text-sm">
            {data.personal.name}@ai-os-portfolio:~$
          </div>
        </div>

        {/* Terminal Output */}
        <div className="space-y-4 mb-4">
          {outputs.map((output) => (
            <div key={output.id} className="animate-fade-in">
              {output.type === 'command' && (
                <div className="flex gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-white">{output.content as string}</span>
                </div>
              )}
              {output.type === 'output' && (
                <div className="ml-4 text-gray-300">{output.content}</div>
              )}
              {output.type === 'error' && (
                <div className="ml-4 text-red-400">{output.content}</div>
              )}
              {output.type === 'system' && (
                <div className="text-cyan-400">{output.content}</div>
              )}
            </div>
          ))}
          <div ref={outputEndRef} />
        </div>

        {/* Autocomplete Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-2 ml-4 flex gap-2 flex-wrap">
            {suggestions.map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(sugg);
                  setSuggestions([]);
                  inputRef.current?.focus();
                }}
                className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded hover:bg-gray-700 hover:text-green-400 transition-colors"
              >
                {sugg}
              </button>
            ))}
          </div>
        )}

        {/* Terminal Input */}
        <div className="flex gap-2 items-center">
          <span className="text-green-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white"
            placeholder="Type a command... (try 'help')"
            autoFocus
          />
          <span className="animate-pulse text-green-400">|</span>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-4 border-t border-gray-800 text-xs text-gray-600">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-gray-500">Kernel:</span> AI-OS v1.0
            </div>
            <div>
              <span className="text-gray-500">Shell:</span> Next.js Terminal
            </div>
            {mounted && (
              <div>
                <span className="text-gray-500">Session:</span> Active
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
