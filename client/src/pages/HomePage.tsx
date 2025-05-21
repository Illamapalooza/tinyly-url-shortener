import { Link } from "react-router";
import ShortenerCard from "@/components/ShortenerCard";
import { Toaster } from "@/components/ui/toaster";

function HomePage() {
  return (
    <div className="min-h-screen bg-main-gradient flex flex-col items-center justify-center">
      <ShortenerCard />
      <footer className="fixed bottom-5 left-0 w-full text-center text-gray-500 text-xs pointer-events-none select-none">
        © {new Date().getFullYear()} URL Shortener. Built with Lovable.
      </footer>
      <div className="mt-6">
        <Link to="/second" className="text-gray-600 hover:text-gray-800">
          Go to second page
        </Link>
      </div>
      <Toaster />
    </div>
  );
}

export default HomePage;
