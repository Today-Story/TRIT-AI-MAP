import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  small?: boolean;
}

const StarRating = ({ rating, small = false }: StarRatingProps) => {
  const stars = [1, 2, 3, 4, 5].map((starIndex) => {
    const fullValue = starIndex;
    const halfValue = starIndex - 0.5;

    if (rating >= fullValue) {
      return <FaStar key={starIndex} color="#007BFF" size={small ? 10 : 20} />;
    } else if (rating >= halfValue) {
      return <FaStarHalfAlt key={starIndex} color="#007BFF" size={small ? 10 : 20} />;
    } else {
      return <FaRegStar key={starIndex} color="#ccc" size={small ? 10 : 20} />;
    }
  });

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="ml-1 text-primary-300 text-xxs">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
