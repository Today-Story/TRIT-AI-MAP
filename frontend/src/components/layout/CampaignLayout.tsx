import { Outlet } from "react-router-dom";

export default function CampaignLayout() {
  return (
    <div className="max-w-mobile mx-auto h-screen pt-[60px] pb-[84px]">
      <Outlet />
    </div>
  );
}
