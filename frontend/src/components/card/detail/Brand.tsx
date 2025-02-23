import { AiFillInstagram } from "react-icons/ai";
import { SiTiktok } from "react-icons/si";

export default function Brand() {
  const campaigns = [
    {
      id: 1,
      title: "시술 30% 할인 쿠폰 캠페인",
      brand: "브랜드 이름",
      period: "02.18 - 03.18",
      status: "진행중",
    },
    {
      id: 2,
      title: "시술 30% 할인 쿠폰 캠페인",
      brand: "브랜드 이름",
      period: "02.18 - 03.18",
      status: "진행중",
    },
    {
      id: 3,
      title: "시술 30% 할인 쿠폰 캠페인",
      brand: "브랜드 이름",
      period: "02.18 - 03.18",
      status: "진행중",
    },
  ];

  return (
    <div className="flex flex-col">
      {campaigns.map((item) => (
        <div key={item.id} className="flex gap-3 py-3 border-b border-primary-200 last:border-none">
          <div className="w-1/3 shrink-0 aspect-square rounded-xl bg-primary-300" />
          <div className="flex-1 flex flex-col justify-between font-medium">
            <div className="space-y-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xxs text-white bg-primary-300 rounded-full py-1 px-2">
                  {item.status}
                </span>
                <div className="flex items-center gap-1">
                  <SiTiktok size={16} />
                  <AiFillInstagram size={16} />
                </div>
              </div>
              <p className="line-clamp-1 text-sm font-semibold leading-4 text-primary-300">
                {item.title}
              </p>
              <p className="line-clamp-1 text-xs">{item.brand}</p>
            </div>
            <p className="text-xs">{item.period}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
