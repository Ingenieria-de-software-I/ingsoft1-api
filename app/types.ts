export type Options = {
    subject: string;
    text: string;
    html: string;
    replyTo?: string;
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

type Mail<Context> = { to: string; context: Context };

export type MailNotaEjercicio = Mail<ContextNotaEjercicio>;

export type MailNotaExamen = Mail<ContextNotaExamen>;
