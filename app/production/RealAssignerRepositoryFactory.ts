import { Client } from '@notionhq/client';

import {
    AssignerRepository,
    AssignerRepositoryFactory,
    Assignment,
    Config,
    Exercise,
    Feedback,
    Teacher,
} from '../assigment/types';
import { Database } from '../notion/Database';
import { Schema } from '../notion/Schema';
import { RelationWithManyProperty } from '../notion/properties/RelationWithManyProperty';
import { RelationWithOneProperty } from '../notion/properties/RelationWithOneProperty';
import { TitleProperty } from '../notion/properties/TitleProperty';
import { Identificable } from '../notion/types';

export class RealAssignerRepositoryFactory
    implements AssignerRepositoryFactory
{
    forExercise(config: Config): AssignerRepository {
        return this._repositoryForFeedbacks(config, exerciseFeedbackSchema);
    }

    forExam(config: Config): AssignerRepository {
        return this._repositoryForFeedbacks(config, examFeedbackSchema);
    }

    private _repositoryForFeedbacks(
        config: Config,
        feedbackSchema: Schema<Feedback>,
    ): AssignerRepository {
        const client = new Client({ auth: config.notion.token });
        return new RealAssignerRepository({
            exercises: new Database(
                client,
                config.notion.db_ejercicio,
                exerciseSchema,
            ),
            teachers: new Database(
                client,
                config.notion.db_docente,
                teacherSchema,
            ),
            feedbacks: new Database(
                client,
                config.notion.db_devolucion,
                feedbackSchema,
            ),
        });
    }
}

class RealAssignerRepository implements AssignerRepository {
    constructor(
        private _databases: {
            exercises: Database<Exercise>;
            teachers: Database<Teacher>;
            feedbacks: Database<Feedback>;
        },
    ) {}

    getExercisesFrom(
        assignments: Assignment[],
    ): Promise<Identificable<Exercise>[]> {
        return this._databases.exercises.query({
            nombre: assignments.map((assignment) => assignment.nombre),
        });
    }

    getTeachersFrom(
        assignments: Assignment[],
    ): Promise<Identificable<Teacher>[]> {
        return this._databases.teachers.query({
            nombre: assignments.flatMap((assignment) => assignment.docentes),
        });
    }

    getFeedbacksFrom(
        exercises: Exercise[],
    ): Promise<Identificable<Feedback>[]> {
        return this._databases.feedbacks.query({
            id_ejercicio: exercises.map((exercise) => exercise.nombre),
        });
    }

    createFeedbacks(feedbacks: Feedback[]): Promise<Identificable<Feedback>[]> {
        return this._databases.feedbacks.create(feedbacks);
    }

    updateFeedbacks(
        feedbacks: Identificable<Feedback>[],
    ): Promise<Identificable<Feedback>[]> {
        return this._databases.feedbacks.update(feedbacks);
    }
}

const exerciseSchema = new Schema<Exercise>({
    nombre: new TitleProperty('Nombre'),
});

const teacherSchema = new Schema<Teacher>({
    nombre: new TitleProperty('Nombre'),
});

const exerciseFeedbackSchema = new Schema<Feedback>({
    nombre: new TitleProperty('Nombre'),
    id_docentes: new RelationWithManyProperty('Corrector'),
    id_ejercicio: new RelationWithOneProperty('Ejercicio'),
});

const examFeedbackSchema = new Schema<Feedback>({
    nombre: new TitleProperty('Nombre'),
    id_docentes: new RelationWithManyProperty('Corrector'),
    id_ejercicio: new RelationWithOneProperty('Examen'),
});
