// src/utils/helpers.js
export const getBadgeClass = (estado) => {
    const badgeClasses = {
        Pendiente: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        "En progreso": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        Resuelto: "bg-green-100 text-green-800 hover:bg-green-200",
        Falso: "bg-red-100 text-red-800 hover:bg-red-200",
        default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };
    return badgeClasses[estado] || badgeClasses.default;
};
