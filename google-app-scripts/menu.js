// Planilla
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    const menu = ui.createMenu('Ing Soft 1');
    menu.addSubMenu(_menuDeCarga(ui));
    menu.addSubMenu(_menuDeDescarga(ui));
    menu.addSubMenu(menuDeEnvioDeNotas(ui));
    menu.addToUi();
}

function _menuDeCarga(ui) {
    const menu = ui.createMenu('Cargar correctores');
    _agregarEjercciosYExamenes(menu, 'asignar');
}

function _menuDeDescarga(ui) {
    const menu = ui.createMenu('Descargar correcciones');
    _agregarEjercciosYExamenes(menu, 'descargarDevolucion');
}

function _menuDeEnvio(ui) {
    const menu = ui.createMenu('Enviar emails');
    _agregarEjercciosYExamenes(menu, 'sendEmail');
}
function _agregarEjercciosYExamenes(menu, fnPrefix) {
    exercises.concat(exam).forEach((name) => {
        const fnSuffix = name
            .replace('ó', 'o')
            .replace('ú', 'u')
            .replace(' ', '');
        menu.addItem(name, `${fnPrefix}${fnSuffix}`);
    });
}
