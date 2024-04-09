import {
    Config,
    Repository,
    RepositoryFactory,
} from '../../app/system/assigner';

export class RepositoryFactoryStub implements RepositoryFactory {
    forExam(config: Config): Repository {
        return this._repositoryBehaviours;
    }

    forExercise(config: Config): Repository {
        return this._repositoryBehaviours;
    }

    changeBehaviour(newBehaviours: Partial<Repository>) {
        Object.assign(this._repositoryBehaviours, newBehaviours);
    }

    private _repositoryBehaviours = {
        constructor: { name: 'AssignerRepotioryStrub' },
        getExercisesFrom() {
            throw new Error(
                `No behaviour defined for ${this.constructor.name}.${this.getExercisesFrom.name}.`,
            );
        },
        getTeachersFrom() {
            throw new Error(
                `No behaviour defined for ${this.constructor.name}.${this.getTeachersFrom.name}.`,
            );
        },
        getFeedbacksFrom() {
            throw new Error(
                `No behaviour defined for ${this.constructor.name}.${this.getFeedbacksFrom.name}.`,
            );
        },
        createFeedbacks() {
            throw new Error(
                `No behaviour defined for ${this.constructor.name}.${this.createFeedbacks.name}.`,
            );
        },
        updateFeedbacks() {
            throw new Error(
                `No behaviour defined for ${this.constructor.name}.${this.updateFeedbacks.name}.`,
            );
        },
    };
}
