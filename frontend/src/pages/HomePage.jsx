import Navbar from "../components/home/Navbar";
import Banner from "../components/home/Banner";
import Courses from "../components/home/Courses";
import Teachers from "../components/home/Teachers";
import Feedbacks from "../components/home/Feedbacks";
import Faq from "../components/home/Faq";
import Footer from "../components/home/Footer";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Banner />
      <Courses />
      <Teachers />
      <Feedbacks />
      <Faq />
      <Footer />
    </>
  );
};

export default HomePage;
