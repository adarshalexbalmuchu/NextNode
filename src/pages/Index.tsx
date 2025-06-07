
import Background from "@/components/Background";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TopicFilter from "@/components/TopicFilter";
import FeaturedPosts from "@/components/FeaturedPosts";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      <Background />
      <Header />
      <Hero />
      <TopicFilter />
      <FeaturedPosts />
      <Footer />
    </div>
  );
};

export default Index;
