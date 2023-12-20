import { Identificable } from '../notion/types';

export type Assignment = {
    nombre: string;
    docentes: Array<string>;
    ejercicio: string;
};

export type Exercise = {
    nombre: string;
};

export type Teacher = {
    nombre: string;
};

export type Feedback = {
    nombre: string;
    id_docentes: Array<string>;
    id_ejercicio: string;
};

export type Config = {
    notion: {
        token: string;
        db_docente: string;
        db_ejercicio: string;
        db_devolucion: string;
    };
};

export interface AssignerRepository {
    getExercisesFrom(
        assignments: Array<Assignment>,
    ): Promise<Array<Identificable<Exercise>>>;
    getTeachersFrom(
        assignments: Array<Assignment>,
    ): Promise<Array<Identificable<Teacher>>>;
    getFeedbacksFrom(
        exercises: Array<Exercise>,
    ): Promise<Array<Identificable<Feedback>>>;
    createFeedbacks(
        feedbacks: Array<Feedback>,
    ): Promise<Array<Identificable<Feedback>>>;
    updateFeedbacks(
        feedbacks: Array<Identificable<Feedback>>,
    ): Promise<Array<Identificable<Feedback>>>;
}

export interface AssignerRepositoryFactory {
    forExercise(config: Config): AssignerRepository;
    forExam(config: Config): AssignerRepository;
}
