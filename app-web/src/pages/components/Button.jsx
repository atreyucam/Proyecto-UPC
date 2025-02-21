// src/components/Button.js
import PropTypes from "prop-types";
import { getBadgeClass } from "../../utils/helpers";

const Button = ({ text, number, onClick, icon, estado }) => {
    return (
        <button
            className={`w-full h-full ${getBadgeClass(
                estado
            )} p-4 rounded-lg shadow-md flex flex-col items-start justify-between transition duration-300`}
            onClick={onClick}
        >
            <div className="text-left flex justify-between items-center w-full">
                <div>
                    <span className="block text-lg font-bold">{text}</span>
                    {number !== undefined && (
                        <span className="block text-sm">{number}</span>
                    )}
                </div>
                {icon}
            </div>
        </button>
    );
};

// ✅ Definir PropTypes para mejor validación
Button.propTypes = {
    text: PropTypes.string.isRequired,
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.element.isRequired,
    estado: PropTypes.string,
};

export default Button;