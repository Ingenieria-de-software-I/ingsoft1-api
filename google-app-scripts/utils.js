function askForConfirmation(message, callback) {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(message, ui.ButtonSet.YES_NO);
    if (response != ui.Button.YES) {
        return;
    }
    _handle(callback);
}

function _handle(callback) {
    try {
        callback();
    } catch (ex) {
        const ui = SpreadsheetApp.getUi();
        ui.alert(ex.message);
    }
}
