export type Options = {
    subject: string;
    text: string;
    html: string;
};

export type ContextNotaEjercicio = {
    ejercicio: string;
    grupo: string;
    corrector: string;
    nota: string;
    correcciones: string;
};

export type ContextNotaExamen = {
    examen: string;
    nombre: string;
    padron: string;
    corrector: string;
    correcciones: string;
    nota: string;
    puntos_extras: string;
    nota_final: string;
};
