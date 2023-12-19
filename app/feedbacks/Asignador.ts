import { Client } from '@notionhq/client';

import { Database } from '../notion/Database';
import { Identificable } from '../notion/types';
import {
    devolucionEjercicioSchema,
    devolucionExamenSchema,
    docenteSchema,
    ejercicioSchema,
} from './schemas';
import {
    Asignacion,
    Config,
    Contexto,
    Devolucion,
    Docente,
    Ejercicio,
} from './types';

export class Asignador {
    private _devolucionesACrear: Array<Devolucion> = [];
    private _devolucionesAActualizar: Array<Identificable<Devolucion>> = [];

    constructor(
        private _asignaciones: Array<Asignacion>,
        private _ejercicios: Array<Identificable<Ejercicio>>,
        private _docentes: Array<Identificable<Docente>>,
        private _devolucionesExistentes: Array<Identificable<Devolucion>>,
        private _contexto: Contexto,
    ) {}

    async asignarCorrecciones() {
        this._agruparDevoluciones();
        await this._enviar();
    }

    private _agruparDevoluciones() {
        for (const asignacion of this._asignaciones) {
            const ejercicio = this._ejercicios.find(
                (ejercicio) => ejercicio.nombre === asignacion.ejercicio,
            );
            const idDocentes = this._docentes
                .filter((docente) =>
                    asignacion.docentes.includes(docente.nombre),
                )
                .map((docente) => docente.id);

            if (!ejercicio || !idDocentes.length) continue;

            const devolucionExistente = this._devolucionesExistentes.find(
                (devolucion) =>
                    devolucion.id_ejercicio == ejercicio.id &&
                    devolucion.nombre === asignacion.nombre,
            );
            if (!devolucionExistente) {
                this._crearDevolucion(asignacion, ejercicio, idDocentes);
                continue;
            }
            if (
                idDocentes.some(
                    (id) => !devolucionExistente.id_docentes.includes(id),
                )
            ) {
                this._actualizarDevolucion(devolucionExistente, idDocentes);
                continue;
            }
        }
    }

    private _crearDevolucion(
        asignacion: Asignacion,
        ejercicio: Identificable<Ejercicio>,
        idDocentes: string[],
    ) {
        this._devolucionesACrear.push({
            nombre: asignacion.nombre,
            id_ejercicio: ejercicio.id,
            id_docentes: idDocentes,
        });
    }

    private _actualizarDevolucion(
        devolucionExistente: Identificable<Devolucion>,
        idDocentes: string[],
    ) {
        this._devolucionesAActualizar.push({
            ...devolucionExistente,
            id_docentes: idDocentes,
        });
    }

    private async _enviar() {
        await Promise.allSettled([
            this._contexto.devoluciones.create(this._devolucionesACrear),
            this._contexto.devoluciones.update(this._devolucionesAActualizar),
        ]);
    }

    static async asignarEjercicio(config: Config, asignaciones: Asignacion[]) {
        const contexto = this._contextoParaEjercicios(config);
        await this._asignarParaContexto(asignaciones, contexto);
    }

    static async asignarExamen(config: Config, asignaciones: Asignacion[]) {
        const contexto = this._contextoParaExamen(config);
        await this._asignarParaContexto(asignaciones, contexto);
    }

    private static async _asignarParaContexto(
        asignaciones: Asignacion[],
        contexto: Contexto,
    ) {
        const [ejercicios, docentes] = await Promise.all([
            this._traerEjercicios(contexto, asignaciones),
            this._traerDocentes(contexto, asignaciones),
        ]);
        const devoluciones = await this._traerDevoluciones(
            contexto,
            ejercicios,
        );
        const asignador = new this(
            asignaciones,
            ejercicios,
            docentes,
            devoluciones,
            contexto,
        );
        return await asignador.asignarCorrecciones();
    }

    private static _contextoParaEjercicios(config: Config) {
        const client = new Client({ auth: config.notion.token });
        return {
            ejercicios: this._ejercicios(client, config),
            docentes: this._docentes(client, config),
            devoluciones: this._devolucionesEjercicio(client, config),
        };
    }

    private static _contextoParaExamen(config: Config) {
        const client = new Client({ auth: config.notion.token });
        return {
            ejercicios: this._ejercicios(client, config),
            docentes: this._docentes(client, config),
            devoluciones: this._devolucionesExamen(client, config),
        };
    }

    private static _ejercicios(client: Client, config: Config) {
        return new Database(
            client,
            config.notion.db_ejercicio,
            ejercicioSchema,
        );
    }

    private static _docentes(client: Client, config: Config) {
        return new Database(client, config.notion.db_docente, docenteSchema);
    }

    private static _devolucionesEjercicio(client: Client, config: Config) {
        return new Database(
            client,
            config.notion.db_devolucion,
            devolucionEjercicioSchema,
        );
    }

    private static _devolucionesExamen(client: Client, config: Config) {
        return new Database(
            client,
            config.notion.db_devolucion,
            devolucionExamenSchema,
        );
    }

    private static async _traerEjercicios(
        contexto: Contexto,
        asignaciones: Asignacion[],
    ) {
        return await contexto.ejercicios.query({
            nombre: asignaciones.map((a) => a.ejercicio),
        });
    }

    private static async _traerDocentes(
        contexto: Contexto,
        asignaciones: Asignacion[],
    ) {
        const nombres = asignaciones.flatMap((a) => a.docentes);
        return await contexto.docentes.query({
            nombre: nombres,
        });
    }

    private static async _traerDevoluciones(
        contexto: Contexto,
        ejercicios: Identificable<Ejercicio>[],
    ) {
        return await contexto.devoluciones.query({
            id_ejercicio: ejercicios.map((e) => e.id),
        });
    }
}
