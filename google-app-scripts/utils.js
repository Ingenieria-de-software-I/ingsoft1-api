function askForConfirmation(message, callback) {
  const ui = SpreadsheetApp.getUi();
  Logger.log('Esperando a la confirmación del usuario...');
  const response = ui.alert(message, ui.ButtonSet.YES_NO);
  if (response != ui.Button.YES) {
    return;
  }

  try {
    callback();
  } catch (ex) {
    const ui = SpreadsheetApp.getUi();
    ui.alert(ex.message);
  }
}

function getRowsFromRange(rangeName) {
  return SpreadsheetApp.getActiveSheet().getRange(rangeName).getValues();
}

function updateColumnFromRange(rangeName, rows, column) {
  const range = SpreadsheetApp.getActiveSheet().getRange(rangeName);
  const newRange = range.offset(0, column, range.getNumRows(), 1);
  const values = rows.map((row) => row.slice(column, column + 1));
  newRange.setValues(values);
}
