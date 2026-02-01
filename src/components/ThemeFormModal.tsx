import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogTheme, ThemeFormData } from '@/types/theme';
import { createTheme, updateTheme } from '@/services/googleSheets';
import { toast } from 'sonner';

interface ThemeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme?: BlogTheme | null;
  onSuccess: () => void;
}

export function ThemeFormModal({ open, onOpenChange, theme, onSuccess }: ThemeFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ThemeFormData>({
    tituloTema: '',
    descricaoTema: '',
    feito: 'NÃO',
  });

  useEffect(() => {
    if (theme) {
      setFormData({
        tituloTema: theme.tituloTema,
        descricaoTema: theme.descricaoTema,
        feito: theme.feito,
      });
    } else {
      setFormData({
        tituloTema: '',
        descricaoTema: '',
        feito: 'NÃO',
      });
    }
  }, [theme, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tituloTema.trim()) {
      toast.error('O título do tema é obrigatório');
      return;
    }

    setLoading(true);
    try {
      if (theme?.id) {
        await updateTheme(theme.id, formData);
        toast.success('Tema atualizado com sucesso!');
      } else {
        await createTheme(formData);
        toast.success('Tema criado com sucesso!');
      }
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar tema');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-foreground shadow-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {theme ? 'Editar Tema' : 'Inserir Novo Tema'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="font-medium">
              Título do Tema *
            </Label>
            <Input
              id="titulo"
              value={formData.tituloTema}
              onChange={(e) => setFormData({ ...formData, tituloTema: e.target.value })}
              placeholder="Digite o título do tema"
              className="border-2 border-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao" className="font-medium">
              Descrição do Tema
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricaoTema}
              onChange={(e) => setFormData({ ...formData, descricaoTema: e.target.value })}
              placeholder="Digite a descrição ou links de referência"
              className="border-2 border-foreground min-h-[120px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feito" className="font-medium">
              Status
            </Label>
            <Select
              value={formData.feito}
              onValueChange={(value: 'SIM' | 'NÃO') => setFormData({ ...formData, feito: value })}
            >
              <SelectTrigger className="border-2 border-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-2 border-foreground">
                <SelectItem value="NÃO">NÃO</SelectItem>
                <SelectItem value="SIM">SIM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : theme ? 'Atualizar' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
