import Blog from "@/components/layouts/Blog/Blog";
import Header from "@/components/Header/Header";
import Hero from "@/components/layouts/Hero/Hero";
import Author from "@/components/layouts/Author/Author";
import FAQ from "@/components/layouts/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";
import { metadata } from "./metadata";

export default function Home() {
  return (
    <div>
      <div className="px-10">
        <Header />

        <Hero />
      </div>
      <Blog />
      <Author />
      <div className="px-10">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
}
export { metadata };
