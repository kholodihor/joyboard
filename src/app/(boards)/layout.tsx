import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default BoardLayout;
