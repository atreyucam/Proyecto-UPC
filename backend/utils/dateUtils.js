const moment = require("moment");

// 📌 Función para obtener fechas según el período solicitado
exports.getFechasPorPeriodo = (periodo) => {
    let fechaInicio, fechaFin;

    switch (periodo) {
        case "mes_actual":
            fechaInicio = moment().startOf("month").format("YYYY-MM-DD");
            fechaFin = moment().endOf("month").format("YYYY-MM-DD");
            break;
        case "ultimos_3_meses":
            fechaInicio = moment().subtract(2, "months").startOf("month").format("YYYY-MM-DD");
            fechaFin = moment().endOf("month").format("YYYY-MM-DD");
            break;
        case "ultimos_6_meses":
            fechaInicio = moment().subtract(5, "months").startOf("month").format("YYYY-MM-DD");
            fechaFin = moment().endOf("month").format("YYYY-MM-DD");
            break;
        case "este_anio":
            fechaInicio = moment().startOf("year").format("YYYY-MM-DD");
            fechaFin = moment().endOf("year").format("YYYY-MM-DD");
            break;
        default:
            throw new Error("Período no válido");
    }

    return { fechaInicio, fechaFin };
};
