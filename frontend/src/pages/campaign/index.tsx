import { useState } from "react";

import beauty1 from "@assets/beauty_1.png";
import beauty2 from "@assets/beauty_2.png";
import clinic1 from "@assets/clinic_1.png";
import clinic2 from "@assets/clinic_2.png";
import { CampaignDTO } from "@services/campaign";
import { cn } from "@utils/cn";

import { AiFillInstagram, AiFillTikTok, AiFillYoutube } from "react-icons/ai";
import { MdBookmark, MdFavoriteBorder, MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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

const campaignData: CampaignDTO[] = [
  {
    id: 1,
    title: "New Product Launch Campaign",
    brandName: "ABC Company",
    image: clinic1,
    applicationStart: "2025-03-01",
    applicationEnd: "2025-03-10",
    selectionStart: "2025-03-11",
    selectionEnd: "2025-03-15",
    announcement: "2025-03-16",
    resultAnnouncement: "2025-03-20",
    people: 50,
    videoMin: 30,
    videoMax: 120,
    sns: ["youtube", "instagram"],
    missionText: "Create a video review of the product",
    productDetail: "Detailed description of the product",
    rewardCredit: "1000",
    rewardAdditional: "Additional bonus payment",
    notes: "Notes content",
    location: "Seoul",
    reserveTime: "2025-03-05",
    visitTime: "2025-03-06",
    status: "PENDING",
    createdAt: "2025-02-25",
  },
  {
    id: 2,
    title: "Winter New Clothes Experience Group Recruitment",
    brandName: "Fashionista",
    image: clinic2,
    applicationStart: "2025-03-15",
    applicationEnd: "2025-03-25",
    selectionStart: "2025-03-26",
    selectionEnd: "2025-03-28",
    announcement: "2025-03-29",
    resultAnnouncement: "2025-04-05",
    people: 30,
    videoMin: 0,
    videoMax: 0,
    sns: ["instagram"],
    missionText: "Share styling after wearing new clothes",
    productDetail: "Warm and stylish winter clothes",
    rewardCredit: "500",
    rewardAdditional: "Additional gifts for excellent reviews",
    notes: "#winterfashion #ootd hashtags required",
    location: "Busan",
    reserveTime: null,
    visitTime: null,
    status: "ACTIVE",
    createdAt: "2025-01-10",
  },
  {
    id: 3,
    title: "Premium Coffee Tasting Group Recruitment",
    brandName: "CoffeeLover",
    image: beauty1,
    applicationStart: "2025-03-01",
    applicationEnd: "2025-03-10",
    selectionStart: "2025-03-11",
    selectionEnd: "2025-03-15",
    announcement: "2025-03-16",
    resultAnnouncement: "2025-03-20",
    people: 20,
    videoMin: 0,
    videoMax: 0,
    sns: ["youtube", "instagram"],
    missionText: "Write an honest review after tasting coffee",
    productDetail: "Premium coffee made with the finest beans",
    rewardCredit: "700",
    rewardAdditional: "Coffee gift set",
    notes: "Only those who love coffee, please apply",
    location: "Incheon",
    reserveTime: null,
    visitTime: null,
    status: "CLOSED",
    createdAt: "2024-11-25",
  },
  {
    id: 4,
    title: "New Year's Diet Challenge",
    brandName: "HealthyLife",
    image: beauty2,
    applicationStart: "2025-02-20",
    applicationEnd: "2025-02-31",
    selectionStart: "2025-03-02",
    selectionEnd: "2025-03-05",
    announcement: "2025-03-06",
    resultAnnouncement: "2025-03-10",
    people: 15,
    videoMin: 60,
    videoMax: 180,
    sns: ["youtube", "instagram", "tiktok"],
    missionText: "Record the diet process on video",
    productDetail: "Health functional food that helps reduce body fat",
    rewardCredit: "1200",
    rewardAdditional: "Additional rewards for successful diets",
    notes: "#diet #health #challenge hashtags required",
    location: "Daegu",
    reserveTime: null,
    visitTime: null,
    status: "PENDING",
    createdAt: "2025-03-15",
  },
];

const categories = ["ALL", "TRAVEL", "FOOD", "SHOPPING", "BEAUTY"];

export default function CampaignPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const navigate = useNavigate();

  const onToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const onSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  const onRouteDetail = (item: CampaignDTO) => {
    navigate(`/campaign/${item.id}`, { state: { item } });
  };

  return (
    <main>
      <section className="bg-primary-100 py-6 px-3 space-y-3">
        <h2 className="text-primary-300 font-bold">TRENDING CAMPAIGNS</h2>
        <div className="flex overflow-x-scroll hide-scrollbar gap-2">
          {campaignData.map((campaign, idx) => (
            <button
              key={idx}
              className="shrink-0 max-w-28 space-y-1 text-start"
              onClick={() => onRouteDetail(campaign)}
            >
              <div className="aspect-square relative">
                <img src={campaign.image} alt={campaign.title} className="rounded-xl " />
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
            </button>
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
          {campaignData.map((campaign) => (
            <button
              key={campaign.id}
              className="space-y-2 text-start"
              onClick={() => onRouteDetail(campaign)}
            >
              <div className="aspect-square relative text-primary-300">
                <img src={campaign.image} alt={campaign.title} className="rounded-xl " />
                <span className="text-xs font-semibold absolute top-3 left-3 rounded-full bg-primary-100 px-3 py-1">
                  {campaign.location}
                </span>
                <button className="absolute bottom-3 right-3">
                  <MdFavoriteBorder size={24} />
                </button>
              </div>
              <div className="flex gap-1 text-lg items-center">
                {campaign.sns.includes("youtube") && <AiFillYoutube />}
                {campaign.sns.includes("instagram") && <AiFillInstagram />}
                {campaign.sns.includes("tiktok") && <AiFillTikTok />}
                <span className="px-3 py-1 rounded-full bg-primary-200 text-primary-300 text-xs font-semibold">
                  {getDDay(campaign.applicationEnd)}
                </span>
              </div>
              <p className="text-sm font-medium line-clamp-2 text-dark-blue">{campaign.title}</p>
              <p className="text-xs text-primary-300 font-medium">{campaign.rewardAdditional}</p>
              <div className="flex justify-between text-xs text-primary-300">
                <span className="font-semibold">Apply 121</span>
                <span>Recruit {campaign.people}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
