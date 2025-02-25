import CampaignLayout from "@components/layout/CampaignLayout";
import CampaignApplyPage from "@pages/campaign/Apply";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Layout } from "./components";
import { About, CampaignDetailPage, CampaignPage, Home, MapPage } from "./pages"; // ✅ MapPage 추가

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MapPage />} /> {/* ✅ MapPage를 기본 경로로 설정 */}
          <Route path="/home" element={<Home />} /> {/* 기존 Home 페이지는 /home으로 이동 */}
          <Route path="/about" element={<About />} />
          <Route path="/campaign" element={<CampaignLayout />}>
            <Route path="/campaign" element={<CampaignPage />} />
            <Route path="/campaign/:id" element={<CampaignDetailPage />} />
            <Route path="/campaign/apply/:id" element={<CampaignApplyPage />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
