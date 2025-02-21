import AIsearch from "@components/AIsearch";

const About = () => {
  return (
    <div className="text-center">
      <div
        style={{
          position: "absolute",
          top: "60px", // SearchBar 아래에 배치 (필요에 따라 조정)
          left: 0,
          width: "100%",
          zIndex: 1000, // 충분히 큰 z-index 값
        }}
      >
        <AIsearch />
      </div>
      <p className="text-gray-600">This app is built with React, TypeScript, and Tailwind CSS.</p>
    </div>
  );
};

export default About;
