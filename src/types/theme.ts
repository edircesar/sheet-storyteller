export interface BlogTheme {
  id?: number;
  dataHorario: string;
  tituloTema: string;
  descricaoTema: string;
  feito: 'SIM' | 'NÃO';
}

export interface GoogleSheetsConfig {
  webAppUrl: string;
}

export interface ThemeFormData {
  tituloTema: string;
  descricaoTema: string;
  feito: 'SIM' | 'NÃO';
}
