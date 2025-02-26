import { useState } from "react";

import { cn } from "@utils/cn";

import { AiFillInstagram, AiFillTikTok, AiFillYoutube } from "react-icons/ai";
import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

export default function CampaignApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 아코디언 열림/닫힘 상태
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const onRouteDetail = () => {
    navigate(`/campaign/${id}`);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <header className="bg-primary-300 flex text-white justify-between items-center p-3">
        <h1 className="text-base font-bold">신청하는 캠페인 이름</h1>
        <button onClick={onRouteDetail}>
          <MdClose size={24} />
        </button>
      </header>

      <section className="p-3 flex-1 space-y-8 text-dark-blue">
        <div className="space-y-4">
          <h2 className="font-bold border-b-2 border-placeholder pb-2">REQUIRED INFO</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Name</label>
            <input
              className="rounded-lg p-3 text-sm bg-primary-200 placeholder:text-gray-500 outline-none"
              placeholder="Enter name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">E-mail</label>
            <input
              type="email"
              className="rounded-lg p-3 text-sm bg-primary-200 placeholder:text-gray-500 outline-none"
              placeholder="Enter email"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Phone</label>
            <div className="bg-primary-200 rounded-lg text-sm flex items-center">
              <span className="bg-primary-100 p-3 rounded-s-lg">+82</span>
              <input
                type="tel"
                className="bg-transparent p-3 outline-none placeholder:text-gray-500"
                placeholder="010-1234-5678"
              />
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-sm font-medium">Birth</label>
              <input
                type="date"
                className="rounded-lg p-3 bg-primary-200 text-sm outline-none"
                placeholder="year.month.day"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <span className="text-sm font-medium">Gender</span>
              <div className="flex items-center gap-4 text-sm h-full">
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" />
                  Male
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" />
                  Female
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="gender" />
                  Other
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">SNS</label>
            <div className="bg-primary-200 rounded-lg text-sm flex items-center p-3 gap-2">
              <AiFillInstagram size={24} />
              <input
                type="text"
                className="rounded-lg text-sm bg-primary-200 placeholder:text-gray-500 outline-none"
                placeholder="Enter Instagram ID"
              />
            </div>
            <div className="bg-primary-200 rounded-lg text-sm flex items-center p-3 gap-2">
              <AiFillYoutube size={24} />
              <input
                type="text"
                className="rounded-lg text-sm bg-primary-200 placeholder:text-gray-500 outline-none"
                placeholder="Enter Youtube Channel"
              />
            </div>
            <div className="bg-primary-200 rounded-lg text-sm flex items-center p-3 gap-2">
              <AiFillTikTok size={24} />
              <input
                type="text"
                className="rounded-lg text-sm bg-primary-200 placeholder:text-gray-500 outline-none"
                placeholder="Enter TikTok ID"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold border-b-2 border-placeholder pb-2">APPLICATION INFO</h2>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Self-introduction</label>
            <textarea
              rows={3}
              className="rounded-lg p-3 text-sm bg-primary-200 placeholder:text-gray-500 outline-none resize-none"
              placeholder="Enter self-introduction"
            />
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <label className="text-sm font-medium">Booking Product Options</label>
            <button
              onClick={() => setIsBookingOpen((prev) => !prev)}
              className="bg-primary-200 text-start p-3 rounded-lg flex justify-between items-center"
            >
              Beauty Treatment
              <MdKeyboardArrowDown
                size={24}
                color="#007FFF"
                className={cn("transition-transform", isBookingOpen && "rotate-180")}
              />
            </button>
            {isBookingOpen && (
              <div className="bg-primary-200 p-3 rounded-lg text-sm mt-1">
                <p>예) ① 피부관리 패키지, ② 네일아트 추가 옵션 등</p>
                <p>추가 상품 정보를 표시할 수 있습니다.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold border-b-2 border-placeholder pb-2">TERMS OF SERVICE</h2>

          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />I agree to the terms and conditions (Required)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />I agree to the privacy policy (Required)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />I agree to the collection of personal information (Required)
            </label>
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" />I agree to all.
            </label>

            <button
              onClick={() => setIsTermsOpen((prev) => !prev)}
              className="bg-primary-200 text-start p-3 rounded-lg flex justify-between items-center"
            >
              View Terms
              <MdKeyboardArrowDown
                size={24}
                color="#007FFF"
                className={cn("transition-transform", isTermsOpen && "rotate-180")}
              />
            </button>
            {isTermsOpen && (
              <div className="bg-primary-200 p-3 rounded-lg text-sm mt-1">
                <p>이용약관 내용이 여기에 노출됩니다.</p>
                <p>예) 본 서비스 이용 시 주의사항, 책임범위 등등</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="pb-6 px-3">
        <button className="w-full py-3 bg-primary-300 text-white font-semibold rounded-md text-sm">
          Apply
        </button>
      </footer>
    </main>
  );
}
