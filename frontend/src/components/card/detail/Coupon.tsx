import { useState } from "react";

import { cn } from "@utils/cn";

interface CouponContentProps {
  id: number;
  content: string;
  description: string;
}

interface CouponProps {
  coupons: CouponContentProps[];
  buttonText: string;
  onClick: (id: number) => void;
}

export default function Coupon({ coupons, buttonText, onClick }: CouponProps) {
  const [isVeiwMore, setIsViewMore] = useState(false);

  const onClickViewMore = () => {
    setIsViewMore(true);
  };

  return (
    <div
      className={cn(
        "aspect-hide-card space-y-2 overflow-hidden relative",
        isVeiwMore && "overflow-visible"
      )}
    >
      {coupons.map((coupon) => (
        <div
          key={coupon.id}
          className="bg-gray-200 aspect-square flex flex-col justify-end rounded-xl overflow-hidden"
        >
          <div className="bg-primary-100 p-2">
            <p className="text-xxs font-semibold">{coupon.content}</p>
            <p className="text-xs text-primary-300 font-bold">{coupon.description}</p>
          </div>
          <button
            onClick={() => onClick(coupon.id)}
            className="py-1 text-sm bg-primary-300 text-white font-medium"
          >
            {buttonText}
          </button>
        </div>
      ))}
      {!isVeiwMore && (
        <div className="absolute bottom-0 flex justify-center w-full bg-gradient-to-t from-white to-transparent">
          <button
            onClick={onClickViewMore}
            className="bg-primary-100 rounded-full py-1 px-2 text-xxs text-primary-300 font-bold"
          >
            VIEW MORE
          </button>
        </div>
      )}
    </div>
  );
}
