import { Identificable } from '../notion/types';
import {
    AssignerRepository,
    AssignerRepositoryFactory,
    Assignment,
    Config,
    Exercise,
    Feedback,
    Teacher,
} from './types';

export class Assigner {
    constructor(private _repositoryFactory: AssignerRepositoryFactory) {}

    assignExercise(config: Config, assignments: Array<Assignment>) {
        const repository = this._repositoryFactory.forExercise(config);
        return InternalAssigner.assign(repository, assignments);
    }

    assignExam(config: Config, assignments: Array<Assignment>) {
        const repository = this._repositoryFactory.forExam(config);
        return InternalAssigner.assign(repository, assignments);
    }
}

class InternalAssigner {
    private _feedbackToBeCreated: Array<Feedback> = [];
    private _feedbacksToBeUpdated: Array<Identificable<Feedback>> = [];

    private constructor(
        private _repository: AssignerRepository,
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

        for (const assigment of this._assignments) {
            const exercise = exercises.find(
                (exercise) => exercise.nombre === assigment.ejercicio,
            );
            const teachersId = teachers
                .filter((teacher) =>
                    assigment.docentes.includes(teacher.nombre),
                )
                .map((teacher) => teacher.id);

            if (!exercise || !teachersId.length) continue;

            const storedFeedback = storedFeedbacks.find(
                (feedback) =>
                    feedback.id_ejercicio == exercise.id &&
                    feedback.nombre === assigment.nombre,
            );
            if (!storedFeedback) {
                this._createFeedback(assigment, exercise, teachersId);
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
        this._feedbackToBeCreated.push({
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
            this._repository.createFeedbacks(this._feedbackToBeCreated),
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

    static assign(
        repository: AssignerRepository,
        assigments: Array<Assignment>,
    ) {
        return new this(repository, assigments)._assign();
    }
}
