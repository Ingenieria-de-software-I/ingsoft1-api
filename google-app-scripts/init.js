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

const examFeedbacks = new ExamFeedbacks(
    api,
    'DatosCorrectoresExamenes',
    'DatosDevolucionesExamenes',
    notionExamConfig,
);

const exerciseFeedbacks = new ExerciseFeedbacks(
    api,
    'DatosCorrectoresEjercicios',
    'DatosDevolucionesEjercicios',
    notionExerciseConfig,
);
