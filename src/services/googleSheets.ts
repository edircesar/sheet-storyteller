import { BlogTheme, GoogleSheetsConfig, ThemeFormData } from '@/types/theme';

const CONFIG_KEY = 'google_sheets_config';

export const getConfig = (): GoogleSheetsConfig | null => {
  const stored = localStorage.getItem(CONFIG_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveConfig = (config: GoogleSheetsConfig): void => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
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
  const response = await fetch(`${baseUrl}?action=getAll`);
  
  if (!response.ok) {
    throw new Error('Erro ao buscar temas');
  }
  
  const data = await response.json();
  return data.map((row: string[], index: number) => ({
    id: index + 2, // Row number in spreadsheet (starting from 2, after header)
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
  
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create',
      dataHorario,
      tituloTema: data.tituloTema,
      descricaoTema: data.descricaoTema,
      feito: data.feito,
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar tema');
  }
};

export const updateTheme = async (id: number, data: ThemeFormData): Promise<void> => {
  const baseUrl = getBaseUrl();
  
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'update',
      rowIndex: id,
      tituloTema: data.tituloTema,
      descricaoTema: data.descricaoTema,
      feito: data.feito,
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar tema');
  }
};

export const deleteTheme = async (id: number): Promise<void> => {
  const baseUrl = getBaseUrl();
  
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'delete',
      rowIndex: id,
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao excluir tema');
  }
};
