import { CampaignDTO } from "@services/campaign";

import { AiFillInstagram, AiFillTikTok, AiFillYoutube } from "react-icons/ai";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdArrowForward, MdOutlineCheck, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface StateProps {
  state: {
    item: CampaignDTO;
  };
}

const getDDay = (applicationEnd: string) => {
  const now = new Date();
  const end = new Date(applicationEnd);

  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "OVER";
  }

  return `${diffDays} days left`;
};

const formatDate = (date: string) => {
  return date.split("-").splice(1, 2).join(".");
};

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    state: { item },
  }: StateProps = useLocation();

  const onRouteApply = () => {
    navigate(`/campaign/apply/${id}`);
  };

  const onRouteBack = () => {
    navigate("/campaign");
  };

  console.log(item);

  return (
    <main>
      <header className="bg-primary-100 px-3 pt-3">
        <button className="text-dark-blue" onClick={onRouteBack}>
          <MdOutlineKeyboardArrowLeft size={24} />
        </button>
      </header>
      <section className="flex gap-3 bg-primary-100 pb-6 px-3 ">
        <div className="flex-1  font-semibold flex flex-col justify-between">
          <div className="flex flex-col gap-2 text-xs text-primary-300">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary-200 rounded-full">ONGOING</span>
              <span className="gradient-chip relative px-3 py-1 bg-primary-200 rounded-full">
                +3P
              </span>
            </div>
            <span className="text-dark-blue text-base">
              [{item.brandName}] {item.title}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex gap-1">
              {item.sns.includes("youtube") && <AiFillYoutube size={24} />}
              {item.sns.includes("instagram") && <AiFillInstagram size={24} />}
              {item.sns.includes("tiktok") && <AiFillTikTok size={24} />}
            </div>
            <span className="text-sm text-primary-300">{getDDay(item.applicationEnd)}</span>
          </div>
        </div>
        {/* <div className="flex-1 bg-gray-200 aspect-square rounded-xl" /> */}
        <img src={item.image} alt={item.title} className="w-1/2 aspect-square rounded-xl " />
      </section>

      <section className="text-sm py-3 mx-3 flex flex-col border-t-2 border-b-2 border-placeholder gap-3">
        <div className="flex text-placeholder">
          <div className="flex-1 flex items-center gap-2">
            <div className="aspect-square w-3 h-3 bg-placeholder rounded-full" />
            Application Period
          </div>
          <span className="flex-1">
            {formatDate(item.selectionStart)} ~ {formatDate(item.selectionEnd)}
          </span>
        </div>
        <div className="flex text-primary-300 font-semibold">
          <div className="flex-1 flex items-center gap-2">
            <div className="aspect-square w-3 h-3 bg-primary-300 rounded-full" />
            Creator Presentation
          </div>
          <span className="flex-1">{formatDate(item.selectionEnd)}</span>
        </div>
        <div className="flex text-placeholder">
          <div className="flex-1 flex items-center gap-2">
            <div className="aspect-square w-3 h-3 bg-placeholder rounded-full" />
            Campaign Result
          </div>
          <span className="flex-1">{formatDate(item.resultAnnouncement)}</span>
        </div>
        <div className="text-primary-300 bg-primary-100 rounded-full px-6 py-2 flex">
          <span className="flex-1">applicant</span>
          <span className="flex-1">
            112 <span className="text-placeholder">/ {item.people}명</span>
          </span>
        </div>
      </section>

      <section className="space-y-3 p-3 bg-primary-100">
        <div className="flex justify-between">
          <h2 className="font-bold">VIDEO</h2>
          <button className="text-sm flex gap-1 items-center">
            VIEW MORE
            <MdArrowForward />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-scroll hide-scrollbar">
          <div className="space-y-2">
            <div className="aspect-video-vertical w-36 bg-primary-200 rounded-lg text-primary-300 flex justify-center items-center">
              <AiFillInstagram size={32} />
            </div>
            <div className="flex items-center gap-1">
              <IoPersonCircleOutline size={24} />
              <span className="text-sm">PROFILE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="p-3">
        <h2 className="font-bold text-primary-300">MISSION</h2>
        <div className="space-y-2 py-2 mt-2 border-t-2 border-placeholder">
          <div className="text-dark-blue flex gap-1">
            <MdOutlineCheck />
            <p className="text-sm font-semibold">
              Video Length : {item.videoMin}sec - {item.videoMax}sec
            </p>
          </div>
          <div className="text-dark-blue flex gap-1">
            <MdOutlineCheck />
            <p className="text-sm">Get treatment at {item.brandName} and record the process</p>
          </div>
        </div>
      </section>

      <div className="h-3 bg-primary-200" />

      <section className="p-3">
        <h2 className="font-bold text-primary-300">REWARD</h2>
        <div className="py-2 mt-2 border-t-2 border-placeholder flex gap-2">
          <div className="relative gradient-chip px-3 py-1 text-xs text-primary-300 font-semibold">
            +3P credit
          </div>
          <div className="relative gradient-chip px-3 py-1 text-xs text-primary-300 font-semibold">
            Reward Product
          </div>
        </div>
      </section>

      <div className="h-3 bg-primary-200" />

      <section className="p-3">
        <h2 className="font-bold text-primary-300">PRODUCT DETAIL</h2>
        <div className="py-2 mt-2 border-t-2 border-placeholder flex gap-2 text-sm">
          {item.productDetail}
        </div>
      </section>

      <div className="h-3 bg-primary-200" />

      <section className="p-3">
        <h2 className="font-bold text-primary-300">ADDITIONAL INFORMATION</h2>
        <div className="py-2 mt-2 border-t-2 border-placeholder flex gap-2 text-sm">
          {item.notes}
        </div>
      </section>

      <div className="h-3 bg-primary-200" />

      <section className="p-3">
        <h2 className="font-bold text-primary-300">VISIT AND RESERVATION</h2>
        <div className="py-2 mt-2 border-t-2 border-placeholder flex gap-2 text-sm">
          Visit and Reservation Section
        </div>
      </section>

      <footer className="pb-6 px-3">
        <button
          className="w-full py-3 bg-primary-300 text-white font-semibold rounded-md text-sm"
          onClick={onRouteApply}
        >
          Apply
        </button>
      </footer>
    </main>
  );
}
