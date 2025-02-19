import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Layout } from "./components";
import { About, Home, MapPage } from "./pages"; // ✅ MapPage 추가

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MapPage />} /> {/* ✅ MapPage를 기본 경로로 설정 */}
          <Route path="/home" element={<Home />} /> {/* 기존 Home 페이지는 /home으로 이동 */}
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
