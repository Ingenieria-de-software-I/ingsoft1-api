export type Options = {
    subject: string;
    text: string;
    html: string;
    replyTo?: string;
};

export type ContextExerciseFeedback = {
    ejercicio: string;
    grupo: string;
    corrector: string;
    nota: string;
    correcciones: string;
};

export type ContextExamFeedback = {
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

export type MailExerciseFeedback = Mail<ContextExerciseFeedback>;

export type MailExamFeedback = Mail<ContextExamFeedback>;
