import "../../App.css";
import PageHead from "../PageHead/PageHead";
import Features from "./Features";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import Navbar from "./Navbar";
import WhyChooseUs from "./WhyChooseUs";


function LandingPage() {
  return (
    <>
    <PageHead pageTitle="Digital Axis" />
      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      <WhyChooseUs />
      <Footer />

    </>
  );
}

export default LandingPage;