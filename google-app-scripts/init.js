const emailName = 'Docentes IS1 - Leveroni';
const emailDocentes = 'fiuba-ingsoft1-doc@googlegroups.com';

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
const mailer = new Mailer(emailName, emailDocentes);

const examFeedbacks = new ExamFeedbacks(
  api,
  mailer,
  'DatosCorrectoresExamenes',
  'DatosDevolucionesExamenes',
  notionExamConfig,
);

const exerciseFeedbacks = new ExerciseFeedbacks(
  api,
  mailer,
  'DatosCorrectoresEjercicios',
  'DatosDevolucionesEjercicios',
  notionExerciseConfig,
);
