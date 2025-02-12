type CardProps = {
    title: string;
    description: string;
};

const Card = ({ title, description }: CardProps) => {
    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

export default Card;
