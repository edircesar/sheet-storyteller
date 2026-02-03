import { BlogTheme, GoogleSheetsConfig, ThemeFormData } from '@/types/theme';

const CONFIG_KEY = 'google_sheets_config';
const URL_HISTORY_KEY = 'google_sheets_url_history';

export interface UrlHistoryEntry {
  url: string;
  addedAt: string;
  label?: string;
}

export const getUrlHistory = (): UrlHistoryEntry[] => {
  const stored = localStorage.getItem(URL_HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addUrlToHistory = (url: string, label?: string): void => {
  const history = getUrlHistory();
  // Remove if already exists
  const filtered = history.filter(entry => entry.url !== url);
  // Add to beginning
  const newEntry: UrlHistoryEntry = {
    url,
    addedAt: new Date().toISOString(),
    label: label || `URL ${filtered.length + 1}`
  };
  const newHistory = [newEntry, ...filtered].slice(0, 10); // Keep max 10 entries
  localStorage.setItem(URL_HISTORY_KEY, JSON.stringify(newHistory));
};

export const removeUrlFromHistory = (url: string): void => {
  const history = getUrlHistory();
  const filtered = history.filter(entry => entry.url !== url);
  localStorage.setItem(URL_HISTORY_KEY, JSON.stringify(filtered));
};

export const getConfig = (): GoogleSheetsConfig | null => {
  const stored = localStorage.getItem(CONFIG_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveConfig = (config: GoogleSheetsConfig): void => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  // Also add to history
  addUrlToHistory(config.webAppUrl);
};

export const clearConfig = (): void => {
  localStorage.removeItem(CONFIG_KEY);
};

const getBaseUrl = (): string => {
  const config = getConfig();
  if (!config?.webAppUrl) {
    throw new Error('Google Sheets não configurado');
  }
  return config.webAppUrl;
};

export const fetchThemes = async (): Promise<BlogTheme[]> => {
  const baseUrl = getBaseUrl();
  
  const response = await fetch(`${baseUrl}?action=getAll`, {
    method: 'GET',
    redirect: 'follow',
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar temas');
  }
  
  const data = await response.json();
  return data.map((row: string[], index: number) => ({
    id: index + 2,
    dataHorario: row[0] || '',
    tituloTema: row[1] || '',
    descricaoTema: row[2] || '',
    feito: (row[3] as 'SIM' | 'NÃO') || 'NÃO',
  }));
};

export const createTheme = async (data: ThemeFormData): Promise<void> => {
  const baseUrl = getBaseUrl();
  const now = new Date();
  const dataHorario = now.toLocaleString('pt-BR');
  
  const params = new URLSearchParams({
    action: 'create',
    dataHorario,
    tituloTema: data.tituloTema,
    descricaoTema: data.descricaoTema,
    feito: data.feito,
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error('Erro ao criar tema');
  }
};

export const updateTheme = async (id: number, data: ThemeFormData): Promise<void> => {
  const baseUrl = getBaseUrl();
  
  const params = new URLSearchParams({
    action: 'update',
    rowIndex: id.toString(),
    tituloTema: data.tituloTema,
    descricaoTema: data.descricaoTema,
    feito: data.feito,
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar tema');
  }
};

export const deleteTheme = async (id: number): Promise<void> => {
  const baseUrl = getBaseUrl();
  
  const params = new URLSearchParams({
    action: 'delete',
    rowIndex: id.toString(),
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error('Erro ao excluir tema');
  }
};
