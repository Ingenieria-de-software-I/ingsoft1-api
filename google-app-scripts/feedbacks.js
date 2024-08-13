class Feedback {
    constructor(api, correctorsRange, feedbacksRange, notion) {
        this._api = api;
        this._correctorsRange = correctorsRange;
        this._feedbacksRange = feedbacksRange;
        this._config = { notion };
    }

    assign(exerciseName, correctorsColumn) {
        askForConfirmation(
            `¿Quiere cargar los correctores de ${exerciseName}?`,
            () => {
                const assignments = this._generateAssignments(
                    exerciseName,
                    correctorsColumn,
                );
                this._sendAssignments(this._config, assignments);
            },
        );
    }

    extract(exerciseName, feedbackColumn) {
        askForConfirmation(
            `¿Quiere descargar las correcciones de ${exerciseName}?`,
            () => {
                const rows = this._getValuesFromRange(this._feedbacksRange);

                const response = this._getFeedbacks(this._config, exerciseName);
                const feedbacks = JSON.parse(response.getContentText());

                feedbacks.forEach((feedback) => {
                    const row = rows.find(
                        (row) => this._assignmentName(row) === feedback.nombre,
                    );
                    if (!row) return;
                    const response = this._api.getContentFromPage(
                        this._config.token,
                        feedback.id,
                    );
                    const content = response.getContentText();
                    row[feedbackColumn] = content;
                });

                this._setValuesForRange(this._feedbacksRange, rows);
            },
        );
    }

    _generateAssignments(exerciseName, correctorsColumn) {
        const rows = this._getValuesFromRange(this._correctorsRange);
        return rows.map((row) => ({
            nombre: this._assignmentName(row),
            docentes: this._splitNames(row[correctorsColumn]),
            ejercicio: exerciseName,
        }));
    }

    _getValuesFromRange(range) {
        return SpreadsheetApp.getActiveSheet().getRange(range).getValues();
    }

    _setValuesForRange(range, values) {
        return SpreadsheetApp.getActiveSheet()
            .getRange(range)
            .setValues(values);
    }

    _splitNames(names) {
        return names?.split(',').map((name) => name.trim()) || [];
    }

    _sendAssignments(config, assignments) {
        throw new Error('Should be implemented');
    }

    _getFeedbacks(config, exerciseName) {
        throw new Error('Should be implemented');
    }

    _assignmentName(row) {
        throw new Error('Should be implemented');
    }
}

class ExerciseFeedback extends Feedback {
    _sendAssignments(config, assignments) {
        return this._api.assignExercise(config, assignments);
    }

    _getFeedbacks(config, exerciseName) {
        return this._api.getExerciseFeedbacks(config, exerciseName);
    }

    _assignmentName(row) {
        return `Grupo ${row[0]}`;
    }
}

class ExamFeedback extends Feedback {
    _sendAssignments(config, assignments) {
        return this._api.assignExam(config, assignments);
    }

    _getFeedbacks(config, exerciseName) {
        return this._api.getExamFeedbacks(config, exerciseName);
    }

    _assignmentName(row) {
        const padron = row[0];
        const nombreCompleto = row[1];
        return `${padron} - ${nombreCompleto}`;
    }
}
