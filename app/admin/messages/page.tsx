'use client';

import { AdminLayout } from '@/components/admin/layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Mail, Trash2, CheckCircle, Clock, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MessagesPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.contact.getMessages(token!);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (msg: any) => {
    setSelectedMessage(msg);
    setIsDialogOpen(true);

    // Mark as read if unread
    if (msg.status === 'unread') {
      try {
        await api.contact.updateMessageStatus(msg.id, 'read', token!);
        fetchMessages();
      } catch (error) {
        console.error('Failed to update message status:', error);
      }
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.contact.updateMessageStatus(id, 'read', token!);
      setMessage({ type: 'success', text: 'Message marked as read!' });
      fetchMessages();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.contact.deleteMessage(id, token!);
      setMessage({ type: 'success', text: 'Message deleted!' });
      fetchMessages();
      if (selectedMessage?.id === id) {
        setIsDialogOpen(false);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Mail className="h-8 w-8" />
              Contact Messages
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage contact form submissions
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-lg px-4 py-2">
              {unreadCount} Unread
            </Badge>
          )}
        </div>

        {message.text && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No messages yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  msg.status === 'unread' ? 'border-l-4 border-l-accent bg-accent/5' : ''
                }`}
                onClick={() => handleView(msg)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{msg.name}</h3>
                            {msg.status === 'unread' && (
                              <Badge variant="default" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span>{msg.email}</span>
                            {msg.subject && (
                              <>
                                <span>•</span>
                                <span className="font-medium">{msg.subject}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-2 ml-13">
                        {msg.message}
                      </p>
                      <div className="flex items-center gap-4 mt-3 ml-13 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {msg.status === 'unread' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(msg.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(msg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Message Details
              </DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">From</label>
                  <p className="text-lg font-semibold mt-1">{selectedMessage.name}</p>
                  <p className="text-muted-foreground">{selectedMessage.email}</p>
                </div>

                {selectedMessage.subject && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Subject</label>
                    <p className="text-lg font-semibold mt-1">{selectedMessage.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Message</label>
                  <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <p>Received: {formatDate(selectedMessage.created_at)}</p>
                    <p className="flex items-center gap-2 mt-1">
                      Status:{' '}
                      <Badge variant={selectedMessage.status === 'read' ? 'secondary' : 'default'}>
                        {selectedMessage.status}
                      </Badge>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        (window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${
                          selectedMessage.subject || 'Your message'
                        }`)
                      }
                    >
                      Reply via Email
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
