import { useState } from "react";

import { cn } from "@utils/cn";

import { AiFillInstagram, AiFillTikTok, AiFillYoutube } from "react-icons/ai";
import { MdBookmark, MdFavoriteBorder, MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";

const getDDay = (applicationEnd: string) => {
  const now = new Date();
  const end = new Date(applicationEnd);

  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "OVER";
  }

  return `D-${diffDays}`;
};

const campaignData = [
  {
    id: 1,
    title: "신제품 런칭 캠페인",
    brandName: "ABC Company",
    image: "",
    applicationStart: "2025-03-01",
    applicationEnd: "2024-12-30",
    selectionStart: "2025-03-11",
    selectionEnd: "2025-03-15",
    announcement: "2025-03-16",
    resultAnnouncement: "2025-03-20",
    people: 50,
    videoMin: 30,
    videoMax: 120,
    sns: ["youtube", "instagram"],
    missionText: "제품 사용후기를 동영상으로 제작",
    productDetail: "제품의 상세 설명",
    rewardCredit: "1000",
    rewardAdditional: "추가 보너스 지급",
    notes: "주의사항 내용",
    location: "Seoul",
    reserveTime: "2025-03-05",
    visitTime: "2025-03-06",
    status: "PENDING",
    createdAt: "2025-02-25",
  },
  {
    id: 2,
    title: "겨울 신상 의류 체험단 모집",
    brandName: "Fashionista",
    image: "",
    applicationStart: "2025-01-15",
    applicationEnd: "2025-01-25",
    selectionStart: "2025-01-26",
    selectionEnd: "2025-01-28",
    announcement: "2025-01-29",
    resultAnnouncement: "2025-02-05",
    people: 30,
    videoMin: 0,
    videoMax: 0,
    sns: ["instagram"],
    missionText: "신상 의류 착용 후 스타일링 공유",
    productDetail: "따뜻하고 스타일리쉬한 겨울 의류",
    rewardCredit: "500",
    rewardAdditional: "우수 후기 선정 시 추가 상품 증정",
    notes: "#겨울패션 #ootd 해시태그 필수",
    location: "Busan",
    reserveTime: null,
    visitTime: null,
    status: "ACTIVE",
    createdAt: "2025-01-10",
  },
  {
    id: 3,
    title: "프리미엄 커피 시음단 모집",
    brandName: "CoffeeLover",
    image: "",
    applicationStart: "2024-12-01",
    applicationEnd: "2024-12-10",
    selectionStart: "2024-12-11",
    selectionEnd: "2024-12-15",
    announcement: "2024-12-16",
    resultAnnouncement: "2024-12-20",
    people: 20,
    videoMin: 0,
    videoMax: 0,
    sns: ["youtube", "instagram"],
    missionText: "커피 시음 후 솔직한 후기 작성",
    productDetail: "최고급 원두로 만든 프리미엄 커피",
    rewardCredit: "700",
    rewardAdditional: "커피 선물 세트 증정",
    notes: "커피를 사랑하는 분들만 지원해주세요",
    location: "Incheon",
    reserveTime: null,
    visitTime: null,
    status: "CLOSED",
    createdAt: "2024-11-25",
  },
  {
    id: 4,
    title: "새해맞이 다이어트 챌린지",
    brandName: "HealthyLife",
    image: "",
    applicationStart: "2024-12-20",
    applicationEnd: "2024-12-31",
    selectionStart: "2025-01-02",
    selectionEnd: "2025-01-05",
    announcement: "2025-01-06",
    resultAnnouncement: "2025-01-10",
    people: 15,
    videoMin: 60,
    videoMax: 180,
    sns: ["youtube", "instagram", "tiktok"],
    missionText: "다이어트 과정 영상으로 기록",
    productDetail: "체지방 감소에 도움을 주는 건강기능식품",
    rewardCredit: "1200",
    rewardAdditional: "다이어트 성공 시 추가 리워드",
    notes: "#다이어트 #건강 #챌린지 해시태그 필수",
    location: "Daegu",
    reserveTime: null,
    visitTime: null,
    status: "PENDING",
    createdAt: "2024-12-15",
  },
];

const trendingCampaigns = [
  {
    id: 1,
    title: "[BRAND] Campaign Title Text Please",
    sns: ["youtube", "instagram", "tiktok"],
  },
  {
    id: 2,
    title: "[BRAND] Campaign Title Text Please",
    sns: ["youtube", "instagram"],
  },
  {
    id: 3,
    title: "[BRAND] Campaign Title Text Please",
    sns: ["youtube", "tiktok"],
  },
  {
    id: 4,
    title: "[BRAND] Campaign Title Text Please",
    sns: ["instagram", "tiktok"],
  },
  {
    id: 5,
    title: "[BRAND] Campaign Title Text Please",
    sns: ["youtube"],
  },
];

const categories = ["ALL", "TRAVEL", "FOOD", "SHOPPING", "BEAUTY"];

export default function CampaignPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const onToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const onSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <main>
      <section className="bg-primary-100 py-6 px-3 space-y-3">
        <h2 className="text-primary-300 font-bold">TRENDING CAMPAIGNS</h2>
        <div className="flex overflow-x-scroll hide-scrollbar gap-2">
          {trendingCampaigns.map((campaign, idx) => (
            <div key={idx} className="shrink-0 max-w-28 space-y-1">
              <div className="aspect-square bg-gray-200 rounded-xl relative">
                {idx < 3 && (
                  <div className="absolute -top-1 left-1 text-primary-300 z-10 flex justify-center items-center">
                    <MdBookmark size={36} />
                    <span className="text-white text-xs font-medium absolute">{idx + 1}위</span>
                  </div>
                )}
              </div>
              <p className="line-clamp-2 text-sm text-dark-blue font-medium">{campaign.title}</p>
              <div className="flex text-lg gap-0.5">
                {campaign.sns.includes("youtube") && <AiFillYoutube />}
                {campaign.sns.includes("instagram") && <AiFillInstagram />}
                {campaign.sns.includes("tiktok") && <AiFillTikTok />}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-6 px-3 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-primary-300 font-bold">CAMPAIGNS</h2>
          <div className="relative">
            <button
              onClick={onToggleDropdown}
              className="flex text-sm items-center gap-2 text-primary-300 rounded-full bg-primary-200 px-3 py-1 font-semibold"
            >
              {selectedCategory}
              <MdKeyboardArrowDown
                size={24}
                className={cn("transition-transform", isOpen && "rotate-180")}
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-10 text-sm">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-primary-300"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {campaignData.map((item) => (
            <Link key={item.id} className="space-y-2" to={`/campaign/${item.id}`}>
              <div className="aspect-square bg-gray-200 rounded-xl relative text-primary-300">
                <span className="text-xs font-semibold absolute top-3 left-3 rounded-full bg-primary-100 px-3 py-1">
                  {item.location}
                </span>
                <button className="absolute bottom-3 right-3">
                  <MdFavoriteBorder size={24} />
                </button>
              </div>
              <div className="flex gap-1 text-lg items-center">
                {item.sns.includes("youtube") && <AiFillYoutube />}
                {item.sns.includes("instagram") && <AiFillInstagram />}
                {item.sns.includes("tiktok") && <AiFillTikTok />}
                <span className="px-3 py-1 rounded-full bg-primary-200 text-primary-300 text-xs font-semibold">
                  {getDDay(item.applicationEnd)}
                </span>
              </div>
              <p className="text-sm font-medium line-clamp-2 text-dark-blue">{item.title}</p>
              <p className="text-xs text-primary-300 font-medium">{item.rewardAdditional}</p>
              <div className="flex justify-between text-xs text-primary-300">
                <span className="font-semibold">Apply 121</span>
                <span>Recruit {item.people}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
