import Blog from "@/components/layouts/Blog/Blog";
import Header from "@/components/Header/Header";
import Hero from "@/components/layouts/Hero/Hero";

export default function Home() {
  return (
    <div>
      <div className="home px-10">
        <Header />

        <Hero />
      </div>
      <Blog />
    </div>
  );
}
