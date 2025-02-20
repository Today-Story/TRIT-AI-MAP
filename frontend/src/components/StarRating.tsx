import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
  const stars = [1, 2, 3, 4, 5].map((starIndex) => {
    const fullValue = starIndex;
    const halfValue = starIndex - 0.5;

    if (rating >= fullValue) {
      return <FaStar key={starIndex} color="#007BFF" />;
    } else if (rating >= halfValue) {
      return <FaStarHalfAlt key={starIndex} color="#007BFF" />;
    } else {
      return <FaRegStar key={starIndex} color="#ccc" />;
    }
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {stars}
      <span style={{ marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
