import { Outlet } from "react-router-dom";

export default function CampaignLayout() {
  return (
    <div className="max-w-mobile mx-auto h-screen">
      <Outlet />
    </div>
  );
}
