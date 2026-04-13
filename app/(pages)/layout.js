
import Header from "@/Components/header/Header";
import Services from "../components/Services";
import Footer from "../components/Footer.js";

export default function PagesLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Services />
      <Footer />
    </>
  );
}
