import {
    AssignerRepository,
    AssignerRepositoryFactory,
    Config,
} from '../../app/feedbacks/assigner';

export class AssignerRepositoryFactoryStub
    implements AssignerRepositoryFactory
{
    forExam(config: Config): AssignerRepository {
        return this._repositoryBehaviours;
    }

    forExercise(config: Config): AssignerRepository {
        return this._repositoryBehaviours;
    }

    changeBehaviour(newBehaviours: Partial<AssignerRepository>) {
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
