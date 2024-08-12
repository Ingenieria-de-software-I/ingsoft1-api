const apiUrl = 'https://ingsoft1-api.vercel.app/api';
const notionConfig = {
    token: '',
    db_docente: '',
};
const notionExamConfig = {
    ...notionConfig,
    db_ejercicio: '',
    db_devolucion: '',
};
const notionExerciseConfig = {
    ...notionConfig,
    db_ejercicio: '',
    db_devolucion: '',
};

const api = new Api(apiUrl);

const examFeedback = new ExamFeedback(
    api,
    'DatosCorrectoresExamenes',
    'DatosDevolucionesExamenes',
    notionExamConfig,
);

const exerciseFeedback = new ExerciseFeedback(
    api,
    'DatosCorrectoresEjercicios',
    'DatosDevolucionesEjercicios',
    notionExerciseConfig,
);
