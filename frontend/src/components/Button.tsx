type ButtonProps = {
    label: string;
    onClick?: () => void;
};

const Button = ({ label, onClick }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        >
            {label}
        </button>
    );
};

export default Button;
