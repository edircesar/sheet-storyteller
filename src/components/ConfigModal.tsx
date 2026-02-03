import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Trash2, History } from 'lucide-react';
import { getConfig, saveConfig, clearConfig, getUrlHistory, removeUrlFromHistory, UrlHistoryEntry } from '@/services/googleSheets';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConfigModalProps {
  onConfigChange: () => void;
}

export function ConfigModal({ onConfigChange }: ConfigModalProps) {
  const [open, setOpen] = useState(false);
  const existingConfig = getConfig();
  const [webAppUrl, setWebAppUrl] = useState(existingConfig?.webAppUrl || '');
  const [urlHistory, setUrlHistory] = useState<UrlHistoryEntry[]>([]);

  useEffect(() => {
    if (open) {
      setUrlHistory(getUrlHistory());
      const config = getConfig();
      if (config?.webAppUrl) {
        setWebAppUrl(config.webAppUrl);
      }
    }
  }, [open]);

  const handleSave = () => {
    if (!webAppUrl.trim()) {
      toast.error('Por favor, insira a URL do Web App');
      return;
    }

    saveConfig({ webAppUrl: webAppUrl.trim() });
    setUrlHistory(getUrlHistory());
    toast.success('Configuração salva com sucesso!');
    setOpen(false);
    onConfigChange();
  };

  const handleClear = () => {
    clearConfig();
    setWebAppUrl('');
    toast.success('Configuração removida');
    onConfigChange();
  };

  const handleSelectFromHistory = (url: string) => {
    setWebAppUrl(url);
  };

  const handleRemoveFromHistory = (url: string) => {
    removeUrlFromHistory(url);
    setUrlHistory(getUrlHistory());
    toast.success('URL removida do histórico');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configurar Google Sheets
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg border-2 border-border shadow-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Configurar Google Sheets</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="webAppUrl" className="font-medium">
              URL do Web App (Google Apps Script)
            </Label>
            <Input
              id="webAppUrl"
              value={webAppUrl}
              onChange={(e) => setWebAppUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="border-2 border-border"
            />
            <p className="text-sm text-muted-foreground">
              Cole aqui a URL do seu Web App do Google Apps Script
            </p>
          </div>

          {/* URL History */}
          {urlHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <Label className="font-medium">Histórico de URLs</Label>
              </div>
              <ScrollArea className="h-32 rounded-md border-2 border-border">
                <div className="p-2 space-y-1">
                  {urlHistory.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between gap-2 rounded p-2 text-sm transition-colors hover:bg-accent ${
                        entry.url === webAppUrl ? 'bg-accent' : ''
                      }`}
                    >
                      <button
                        onClick={() => handleSelectFromHistory(entry.url)}
                        className="flex-1 text-left truncate"
                        title={entry.url}
                      >
                        <span className="block truncate font-medium">
                          {entry.url.slice(0, 45)}...
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(entry.addedAt)}
                        </span>
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromHistory(entry.url)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                Clique em uma URL para selecioná-la. A última URL usada é carregada automaticamente.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Salvar
            </Button>
            {existingConfig && (
              <Button variant="outline" onClick={handleClear}>
                Limpar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
