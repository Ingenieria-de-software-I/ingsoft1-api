import { Identificable } from '../persistance/notion/types';

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

export interface Repository {
    getExercisesFrom(
        assignments: Array<Assignment>,
    ): Promise<Array<Identificable<Exercise>>>;
    getTeachersFrom(
        assignments: Array<Assignment>,
    ): Promise<Array<Identificable<Teacher>>>;
    getFeedbacksFrom(
        exercises: Array<Identificable<Exercise>>,
    ): Promise<Array<Identificable<Feedback>>>;
    createFeedbacks(
        feedbacks: Array<Feedback>,
    ): Promise<Array<Identificable<Feedback>>>;
    updateFeedbacks(
        feedbacks: Array<Identificable<Feedback>>,
    ): Promise<Array<Identificable<Feedback>>>;
}

export interface RepositoryFactory {
    forExercise(config: Config): Repository;
    forExam(config: Config): Repository;
}

export class Assigner {
    constructor(private _repositoryFactory: RepositoryFactory) {}

    assignExercise(config: Config, assignments: Array<Assignment>) {
        const repository = this._repositoryFactory.forExercise(config);
        return InternalAssigner.assign(repository, assignments);
    }

    assignExam(config: Config, assignments: Array<Assignment>) {
        const repository = this._repositoryFactory.forExam(config);
        return InternalAssigner.assign(repository, assignments);
    }

    getExerciseFeedbacks(config: Config, exercise: string) {
        const repository = this._repositoryFactory.forExercise(config);
        return InternalAssigner.getFeedbacks(repository, exercise);
    }

    getExamFeedbacks(config: Config, exam: string) {
        const repository = this._repositoryFactory.forExam(config);
        return InternalAssigner.getFeedbacks(repository, exam);
    }
}

class InternalAssigner {
    private _feedbacksToBeCreated: Array<Feedback> = [];
    private _feedbacksToBeUpdated: Array<Identificable<Feedback>> = [];

    private constructor(
        private _repository: Repository,
        private _assignments: Array<Assignment>,
    ) {}

    private async _assign() {
        await this._prepareSubmission();
        await this._submit();
    }

    private async _prepareSubmission() {
        const [exercises, teachers] = await Promise.all([
            this._getExercises(),
            this._getTeachers(),
        ]);
        const storedFeedbacks = await this._getFeedbacksFrom(exercises);

        for (const assignment of this._assignments) {
            const exercise = exercises.find(
                (exercise) => exercise.nombre === assignment.ejercicio,
            );
            const teachersId = teachers
                .filter((teacher) =>
                    assignment.docentes.includes(teacher.nombre),
                )
                .map((teacher) => teacher.id);

            if (!exercise || !teachersId.length) continue;

            const storedFeedback = storedFeedbacks.find(
                (feedback) =>
                    feedback.id_ejercicio == exercise.id &&
                    feedback.nombre === assignment.nombre,
            );
            if (!storedFeedback) {
                this._createFeedback(assignment, exercise, teachersId);
                continue;
            }
            if (
                teachersId.some(
                    (teacherId) =>
                        !storedFeedback.id_docentes.includes(teacherId),
                )
            ) {
                this._updateFeedback(storedFeedback, teachersId);
                continue;
            }
        }
    }

    private _createFeedback(
        assignment: Assignment,
        exercise: Identificable<Exercise>,
        teacherIds: string[],
    ) {
        this._feedbacksToBeCreated.push({
            nombre: assignment.nombre,
            id_ejercicio: exercise.id,
            id_docentes: teacherIds,
        });
    }

    private _updateFeedback(
        storedFeedback: Identificable<Feedback>,
        teacherIds: string[],
    ) {
        this._feedbacksToBeUpdated.push({
            ...storedFeedback,
            id_docentes: teacherIds,
        });
    }

    private async _submit() {
        await Promise.allSettled([
            this._repository.createFeedbacks(this._feedbacksToBeCreated),
            this._repository.updateFeedbacks(this._feedbacksToBeUpdated),
        ]);
    }

    private _getExercises(): Promise<Array<Identificable<Exercise>>> {
        return this._repository.getExercisesFrom(this._assignments);
    }

    private _getTeachers(): Promise<Array<Identificable<Teacher>>> {
        return this._repository.getTeachersFrom(this._assignments);
    }

    private _getFeedbacksFrom(
        exercises: Array<Identificable<Exercise>>,
    ): Promise<Array<Identificable<Feedback>>> {
        return this._repository.getFeedbacksFrom(exercises);
    }

    private async _getFeedbacks(): Promise<Array<Identificable<Feedback>>> {
        const exercises = await this._getExercises();
        return await this._getFeedbacksFrom(exercises);
    }

    static assign(repository: Repository, assignments: Array<Assignment>) {
        return new this(repository, assignments)._assign();
    }

    static getFeedbacks(repository: Repository, exercise: string) {
        return new this(repository, [
            {
                nombre: '',
                docentes: [],
                ejercicio: exercise,
            },
        ])._getFeedbacks();
    }
}
