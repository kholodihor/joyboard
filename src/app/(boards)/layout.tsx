import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default BoardLayout;
