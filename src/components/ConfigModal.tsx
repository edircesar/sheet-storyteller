import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { getConfig, saveConfig, clearConfig } from '@/services/googleSheets';
import { toast } from 'sonner';

interface ConfigModalProps {
  onConfigChange: () => void;
}

export function ConfigModal({ onConfigChange }: ConfigModalProps) {
  const [open, setOpen] = useState(false);
  const existingConfig = getConfig();
  const [webAppUrl, setWebAppUrl] = useState(existingConfig?.webAppUrl || '');

  const handleSave = () => {
    if (!webAppUrl.trim()) {
      toast.error('Por favor, insira a URL do Web App');
      return;
    }

    saveConfig({ webAppUrl: webAppUrl.trim() });
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Configurar Google Sheets
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-foreground shadow-md">
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
              className="border-2 border-foreground"
            />
            <p className="text-sm text-muted-foreground">
              Cole aqui a URL do seu Web App do Google Apps Script
            </p>
          </div>
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
