import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { ConfigModal } from '@/components/ConfigModal';
import { ThemeFormModal } from '@/components/ThemeFormModal';
import { StatusChart } from '@/components/StatusChart';
import { ThemesTable } from '@/components/ThemesTable';
import { BlogTheme } from '@/types/theme';
import { fetchThemes, getConfig } from '@/services/googleSheets';
import { toast } from 'sonner';

const Index = () => {
  const [themes, setThemes] = useState<BlogTheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<BlogTheme | null>(null);

  const checkConfig = useCallback(() => {
    const config = getConfig();
    setIsConfigured(!!config?.webAppUrl);
    return !!config?.webAppUrl;
  }, []);

  const loadThemes = useCallback(async () => {
    if (!checkConfig()) return;
    
    setLoading(true);
    try {
      const data = await fetchThemes();
      setThemes(data);
    } catch (error) {
      toast.error('Erro ao carregar temas. Verifique a configuração.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [checkConfig]);

  useEffect(() => {
    if (checkConfig()) {
      loadThemes();
    }
  }, [checkConfig, loadThemes]);

  const handleConfigChange = () => {
    if (checkConfig()) {
      loadThemes();
    } else {
      setThemes([]);
    }
  };

  const handleEdit = (theme: BlogTheme) => {
    setEditingTheme(theme);
    setFormModalOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setFormModalOpen(open);
    if (!open) {
      setEditingTheme(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-foreground bg-card">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-tight">Blog Themes Manager</h1>
          </div>
          <ConfigModal onConfigChange={handleConfigChange} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConfigured ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 border-2 border-dashed border-foreground bg-card p-8">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-bold">Configure o Google Sheets</h2>
            <p className="max-w-md text-center text-muted-foreground">
              Para começar a usar o sistema, clique no botão "Configurar Google Sheets" acima e insira a URL do seu Web App do Google Apps Script.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Chart Section */}
            <StatusChart themes={themes} />

            {/* Action Button */}
            <div className="flex justify-center sm:justify-start">
              <Button
                size="lg"
                onClick={() => setFormModalOpen(true)}
                className="gap-2 shadow-sm"
              >
                <Plus className="h-5 w-5" />
                Inserir Tema
              </Button>
            </div>

            {/* Table Section */}
            <div>
              <h2 className="mb-4 text-lg font-bold">Lista de Temas</h2>
              <ThemesTable
                themes={themes}
                onEdit={handleEdit}
                onDelete={loadThemes}
                loading={loading}
              />
            </div>
          </div>
        )}
      </main>

      {/* Form Modal */}
      <ThemeFormModal
        open={formModalOpen}
        onOpenChange={handleFormClose}
        theme={editingTheme}
        onSuccess={loadThemes}
      />
    </div>
  );
};

export default Index;
