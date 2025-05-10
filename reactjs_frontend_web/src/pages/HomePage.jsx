import Header from "../components/common/Navbar";
import MainContent from "../components/home/MainHome";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <MainContent />
    </div>
  );
}
