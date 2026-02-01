import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { BlogTheme } from '@/types/theme';
import { deleteTheme } from '@/services/googleSheets';
import { toast } from 'sonner';

interface ThemesTableProps {
  themes: BlogTheme[];
  onEdit: (theme: BlogTheme) => void;
  onDelete: () => void;
  loading: boolean;
}

// Helper to detect and render links in text
function renderWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary underline hover:opacity-80"
        >
          Link <ExternalLink className="h-3 w-3" />
        </a>
      );
    }
    return part;
  });
}

export function ThemesTable({ themes, onEdit, onDelete, loading }: ThemesTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteTheme(id);
      toast.success('Tema excluído com sucesso!');
      onDelete();
    } catch (error) {
      toast.error('Erro ao excluir tema');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center border-2 border-foreground bg-card">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (themes.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center border-2 border-foreground bg-card">
        <p className="text-muted-foreground">Nenhum tema cadastrado</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-foreground hover:bg-transparent">
            <TableHead className="font-bold">Data/Hora</TableHead>
            <TableHead className="font-bold">Título</TableHead>
            <TableHead className="font-bold max-w-[300px]">Descrição</TableHead>
            <TableHead className="font-bold text-center">Status</TableHead>
            <TableHead className="font-bold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {themes.map((theme) => (
            <TableRow key={theme.id} className="border-b border-foreground/20 hover:bg-accent/50">
              <TableCell className="whitespace-nowrap font-mono text-sm">
                {theme.dataHorario}
              </TableCell>
              <TableCell className="font-medium">{theme.tituloTema}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {renderWithLinks(theme.descricaoTema)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={theme.feito === 'SIM' ? 'default' : 'secondary'}
                  className={
                    theme.feito === 'SIM'
                      ? 'border-2 border-foreground bg-chart-2 text-foreground'
                      : 'border-2 border-foreground bg-chart-1 text-foreground'
                  }
                >
                  {theme.feito}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(theme)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        disabled={deletingId === theme.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-2 border-foreground">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Deseja realmente excluir o tema "{theme.tituloTema}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-2 border-foreground">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => theme.id && handleDelete(theme.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
