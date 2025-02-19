import { Button, Card } from "../components";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold text-center">Welcome to My App</h1>
      <Card title="About Us" description="Learn more about our app." />
      <Button label="Get Started" onClick={() => alert("Getting Started!")} />
    </div>
  );
};

export default Home;
