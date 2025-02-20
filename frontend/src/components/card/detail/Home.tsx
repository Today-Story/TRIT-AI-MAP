import StarRating from "@components/StarRating";

import { MdArrowForward } from "react-icons/md";

import Coupon from "./Coupon";

const tritCoupons = [
  {
    id: 1,
    content: "리뷰 작성 고객님들께 드려요",
    description: "30% OFF COUPON",
  },
  {
    id: 2,
    content: "리뷰 작성 고객님들께 드려요",
    description: "30% OFF COUPON",
  },
];

const brandCoupons = [
  {
    id: 1,
    content: "시술 30% 할인 쿠폰",
    description: "02.18 - 03.18",
    buttonText: "GET BENEFIT",
  },
  {
    id: 2,
    content: "시술 30% 할인 쿠폰",
    description: "02.18 - 03.18",
    buttonText: "GET BENEFIT",
  },
];

interface HomeProps {
  onClickViewMore: (menu: string) => void;
}

export default function Home({ onClickViewMore }: HomeProps) {
  const onClickGetCoupon = (id: number) => {
    // TODO: GET Coupon API 연동
  };
  return (
    <div className="py-3 space-y-5">
      <div className="flex gap-5">
        <div className="flex-1 space-y-1">
          <h2 className="font-bold">TRIT COUPON</h2>
          <Coupon coupons={tritCoupons} buttonText="GET COUPON" onClick={onClickGetCoupon} />
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="font-bold">BRAND COUPON</h2>
          <Coupon coupons={brandCoupons} buttonText="GET BENEFIT" onClick={onClickGetCoupon} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <h2 className="font-bold">VIDEO</h2>
          <button
            className="text-sm flex gap-1 items-center"
            onClick={() => onClickViewMore("Video")}
          >
            VIEW MORE
            <MdArrowForward />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto relative">
          <div className="bg-gray-200 aspect-video-vertical rounded-2xl w-1/3 shrink-0" />
          <div className="bg-gray-200 aspect-video-vertical rounded-2xl w-1/3 shrink-0" />
          <div className="bg-gray-200 aspect-video-vertical rounded-2xl w-1/3 shrink-0" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <h2 className="font-bold">PRODUCT</h2>
          <button
            className="text-sm flex gap-1 items-center"
            onClick={() => onClickViewMore("Product")}
          >
            VIEW MORE
            <MdArrowForward />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto relative">
          <div className="w-2/5 shrink-0 gap-2">
            <div className="w-full bg-gray-200 aspect-square" />
            <div className="bg-primary-100 p-2">
              <p className="font-semibold">PRODUCT</p>
              <StarRating small rating={4.5} />
              <p className="text-primary-300">$99.00</p>
            </div>
          </div>
          <div className="w-2/5 shrink-0 gap-2">
            <div className="w-full bg-gray-200 aspect-square" />
            <div className="bg-primary-100 p-2">
              <p className="font-semibold">PRODUCT</p>
              <StarRating small rating={4.5} />
              <p className="text-primary-300">$99.00</p>
            </div>
          </div>
          <div className="w-2/5 shrink-0 gap-2">
            <div className="w-full bg-gray-200 aspect-square" />
            <div className="bg-primary-100 p-2">
              <p className="font-semibold">PRODUCT</p>
              <StarRating small rating={4.5} />
              <p className="text-primary-300">$99.00</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <h2 className="font-bold">RESERVATION</h2>
          <button
            className="text-sm flex gap-1 items-center"
            onClick={() => onClickViewMore("Book")}
          >
            VIEW MORE
            <MdArrowForward />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col gap-3 relative bg-primary-100 rounded-lg p-2">
            <div className="flex justify-between">
              <div className="flex flex-col justify-between">
                <p className="font-semibold">피부 광택 시술</p>
                <p className="font-medium text-sm">피부에 빛을 내주는~~</p>
              </div>
              <div className="w-1/5 bg-gray-200 rounded-lg aspect-square" />
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-primary-300 font-medium">시술 정보1 / 시술 정보2 / 월-금</span>
              <button className="text-white bg-primary-300 rounded-full py-1 px-2 font-semibold">
                BOOK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
