import { ReactNode } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen gradient-mesh">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
