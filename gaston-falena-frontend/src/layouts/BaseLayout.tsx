import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function BaseLayout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem", paddingTop: "80px" }}>
        <Outlet />
      </main>
    </>
  );
}
