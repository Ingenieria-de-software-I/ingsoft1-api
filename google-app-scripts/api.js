/**
 * Repo: https://github.com/mrti259/ingsoft1-api
 */

class Api {
    constructor(baseUrl) {
        this._baseUrl = baseUrl;
    }

    _post(path, data) {
        const url = this._baseUrl + path;
        const options = {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify(data),
        };
        const response = UrlFetchApp.fetch(url, options);
        const statusCode = response.getResponseCode();
        const content = response.getContentText();
        Logger.log(JSON.stringify({ statusCode, content }, null, 2));
        return response;
    }

    //#region Cargar Correctores

    assignExam(config, asignaciones) {
        return this._post('/assignExam', { config, asignaciones });
    }

    assignExercise(config, asignaciones) {
        return this._post('/assignExercise', { config, asignaciones });
    }

    //#endregion

    //#region  Descargar devoluciones

    getContentFromPage(notion, page_id) {
        return this._post('/getContentFromPage', {
            notion,
            page_id,
        });
    }

    getExamFeedbacks(config, ejercicio) {
        return this._post('/getExamFeedbacks', { config, ejercicio });
    }

    getExerciseFeedbacks(config, ejercicio) {
        return this._post('/getExerciseFeedbacks', { config, ejercicio });
    }

    //#endregion

    //#region Enviar notas

    sendExamFeedback(to, context) {
        return this._post('/sendExamFeedback', { to, context });
    }

    sendExerciseFeedback(to, context) {
        return this._post('/sendExerciseFeedback', { to, context });
    }

    sendSummaryFeedback(to, context) {
        return this._post('/sendSummaryFeedback', { to, context });
    }

    //#endregion
}
