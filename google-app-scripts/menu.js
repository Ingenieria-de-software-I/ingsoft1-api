// Planilla
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Ing Soft 1');
  menu.addSubMenu(_menuDeCarga(ui));
  menu.addSubMenu(_menuDeDescarga(ui));
  menu.addSubMenu(_menuDeEnvio(ui));
  menu.addToUi();
}

function _menuDeCarga(ui) {
  const menu = ui.createMenu('Cargar correctores');
  return _agregarEjerciciosYExamenes(menu, 'asignar');
}

function _menuDeDescarga(ui) {
  const menu = ui.createMenu('Descargar correcciones');
  return _agregarEjerciciosYExamenes(menu, 'descargarDevolucion');
}

function _menuDeEnvio(ui) {
  const menu = ui.createMenu('Enviar emails');
  return _agregarEjerciciosYExamenes(menu, 'enviarDevolucion');
}
function _agregarEjerciciosYExamenes(menu, fnPrefix) {
  exercises.concat(exams).forEach((name) => {
    const fnSuffix = name.replaceAll('ó', 'o').replaceAll('ú', 'u').replaceAll(' ', '');
    menu.addItem(name, `${fnPrefix}${fnSuffix}`);
  });
  return menu;
}
