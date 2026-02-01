# Configuração do Google Apps Script

Para conectar este sistema à sua planilha do Google Sheets, siga os passos abaixo:

## 1. Estrutura da Planilha

Crie uma planilha no Google Sheets com as seguintes colunas na primeira linha:

| A | B | C | D |
|---|---|---|---|
| data-horario | titulo do tema | descrição do tema | feito |

## 2. Criar o Web App

1. Abra sua planilha no Google Sheets
2. Vá em **Extensões** > **Apps Script**
3. Apague qualquer código existente e cole o código abaixo:

```javascript
const SHEET_NAME = 'Sheet1'; // Altere se sua aba tiver outro nome

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getAll') {
    return getAllData();
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ error: 'Ação inválida' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  if (action === 'create') {
    return createRecord(data);
  } else if (action === 'update') {
    return updateRecord(data);
  } else if (action === 'delete') {
    return deleteRecord(data);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ error: 'Ação inválida' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // Remove header row
  const records = data.slice(1);
  
  return ContentService
    .createTextOutput(JSON.stringify(records))
    .setMimeType(ContentService.MimeType.JSON);
}

function createRecord(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  sheet.appendRow([
    data.dataHorario,
    data.tituloTema,
    data.descricaoTema,
    data.feito
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateRecord(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const row = data.rowIndex;
  
  sheet.getRange(row, 2).setValue(data.tituloTema);
  sheet.getRange(row, 3).setValue(data.descricaoTema);
  sheet.getRange(row, 4).setValue(data.feito);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function deleteRecord(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.deleteRow(data.rowIndex);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Publicar como Web App

1. Clique em **Implantar** > **Nova implantação**
2. Em "Tipo", selecione **App da Web**
3. Configure:
   - **Descrição**: Blog Themes API
   - **Executar como**: Eu mesmo
   - **Quem tem acesso**: Qualquer pessoa
4. Clique em **Implantar**
5. Autorize o aplicativo quando solicitado
6. Copie a **URL do Web App**

## 4. Configurar no Sistema

1. Abra o Blog Themes Manager
2. Clique em "Configurar Google Sheets"
3. Cole a URL do Web App
4. Clique em "Salvar"

Pronto! O sistema está conectado à sua planilha.

## Notas Importantes

- Se você alterar o código do Apps Script, será necessário criar uma nova implantação
- A URL muda a cada nova implantação
- Certifique-se de que a aba da planilha se chama "Sheet1" ou altere a variável `SHEET_NAME` no código
