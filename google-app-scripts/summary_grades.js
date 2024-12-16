const FECHAS_FINALES = [
  'Martes 17 de diciembre',
  'Martes 4 de febrero',
  'Martes 11 de febrero',
  'Martes 18 de febrero',
];

const generarResumenesDeCursada = () => summaryGrades.generate();
const enviarResumenesDeCursada = () => summaryGrades.send();

class SummaryGrades {
  constructor(api, mailer, gradesRange) {
    this._api = api;
    this._mailer = mailer;
    this._gradesRange = gradesRange;
    this._offsets = {
      padron: 0,
      nombre: 1,
      to: 2,
      codigo_repetido: 4,
      numeros: 5,
      mars_rover1: 6,
      servicios_financieros: 7,
      mars_rover2: 8,
      primer_parcial: 10,
      segundo_parcial: 11,
      primer_recu: 12,
      segundo_recu: 13,
      segundo_parcial_o_recu: 14,
      tp_integrador: 16,
      promedio_ej_y_parcial: 18,
      punto_adicional: 19,
      nota_cursada_final: 22,
      condicion_final: 24,
      details: 26,
      sent: 27,
    };
    this._sentLabel = 'YES';
  }

  generate() {
    askForConfirmation('¿Generar los resumenes de cursada?', () => {
      const rows = getRowsFromRange(this._gradesRange);
      rows.forEach((row) => {
        if (this._wasSent(row)) return;
        const detailsResponse = this._getEmailDetails(row);
        const details = detailsResponse.getContentText();
        row[this._offsets.details] = details;
      });
      updateColumnFromRange(this._gradesRange, rows, this._offsets.details);
    });
  }

  send() {
    askForConfirmation('¿Enviar los resumenes de cursada?', () => {
      const rows = getRowsFromRange(this._gradesRange);
      rows.forEach((row) => {
        if (this._wasSent(row)) return;

        const details = row[this._offsets.details];
        if (!details) return;

        let { to, options } = JSON.parse(details);
        const { subject, text, html } = options;

        this._mailer.send(to, subject, text, html);
        row[this._offsets.sent] = this._sentLabel;
      });
      updateColumnFromRange(this._gradesRange, rows, this._offsets.sent);
    });
  }

  _wasSent(row) {
    return row[this._offsets.sent] == this._sentLabel;
  }

  _getEmailDetails(row) {
    const to = row[this._offsets.to];
    const context = {
      padron: row[this._offsets.padron],
      estudiante: row[this._offsets.nombre],
      curso: 'Ingeniería de Software I',
      ejercicios: [
        { nombre: 'Código repetido', nota: row[this._offsets.codigo_repetido] },
        { nombre: 'Números', nota: row[this._offsets.numeros] },
        { nombre: 'Mars Rover 1', nota: row[this._offsets.mars_rover1] },
        {
          nombre: 'Servicios Financieros',
          nota: row[this._offsets.servicios_financieros],
        },
        {
          nombre: 'Mars Rover 2 (El regreso)',
          nota: row[this._offsets.mars_rover2],
        },
      ],
      primer_parcial: row[this._offsets.primer_parcial],
      segundo_parcial: row[this._offsets.segundo_parcial],
      primer_recu: row[this._offsets.primer_recu],
      segundo_recu: row[this._offsets.segundo_recu],
      tp_integrador: row[this._offsets.tp_integrador],
      promedio_ej_y_parcial: row[this._offsets.promedio_ej_y_parcial],
      segundo_parcial_o_recu: row[this._offsets.segundo_parcial_o_recu],
      punto_adicional: row[this._offsets.punto_adicional],
      nota_cursada_final: row[this._offsets.nota_cursada_final],
      condicion_final: row[this._offsets.condicion_final],
      fecha_final_promociones: FECHAS_FINALES[0],
      fecha_finales: FECHAS_FINALES,
    };
    return this._api.sendSummaryGrades(to, context);
  }
}
