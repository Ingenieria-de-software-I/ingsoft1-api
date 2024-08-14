// Asignar ejercicio
const asignarCodigoRepetido = () => _assignExercise(1);
const asignarNumeros = () => _assignExercise(2);
const asignarMarsRover1 = () => _assignExercise(3);
const asignarServiciosFinancieros = () => _assignExercise(4);
const asignarMarsRover2 = () => _assignExercise(5);
const asignarTusLibros = () => _assignExercise(6);

// Descargar devoluciones ejercicio
const descargarDevolucionCodigoRepetido = () => _extractExerciseFeedbacks(1);
const descargarDevolucionNumeros = () => _extractExerciseFeedbacks(2);
const descargarDevolucionMarsRover1 = () => _extractExerciseFeedbacks(3);
const descargarDevolucionServiciosFinancieros = () =>
    _extractExerciseFeedbacks(4);
const descargarDevolucionMarsRover2 = () => _extractExerciseFeedbacks(5);
const descargarDevolucionTusLibros = () => _extractExerciseFeedbacks(6);

// Enviar email
const enviarDevolucionCodigoRepetido = () => _sendExerciseFeedbacks(1);
const enviarDevolucionNumeros = () => _sendExerciseFeedbacks(2);
const enviarDevolucionMarsRover1 = () => _sendExerciseFeedbacks(3);
const enviarDevolucionServiciosFinancieros = () => _sendExerciseFeedbacks(4);
const enviarDevolucionMarsRover2 = () => _sendExerciseFeedbacks(5);
const enviarDevolucionTusLibros = () => _sendExerciseFeedbacks(6);

const exercises = [
    'Código Repetido',
    'Números',
    'Mars Rover 1',
    'Servicios Financieros',
    'Mars Rover 2',
    'Tus Libros',
];

function _assignExercise(exerciseNumber) {
    const exerciseName = exercises[exerciseNumber - 1];
    const correctorsColumn = exerciseNumber;
    exerciseFeedbacks.assign(exerciseName, correctorsColumn);
}

function _extractExerciseFeedbacks(exerciseNumber) {
    const exerciseName = exercises[exerciseNumber - 1];
    const feedbackColumn = 2 + 4 * (exerciseNumber - 1);
    exerciseFeedbacks.extract(exerciseName, feedbackColumn);
}

function _sendExerciseFeedbacks(exerciseNumber) {
    const exerciseName = exercises[exerciseNumber - 1];
}
