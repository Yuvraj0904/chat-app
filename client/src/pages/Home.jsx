import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import bgImg from "../assets/bg_img.png";
const Home = () => {
  return (
    <div
      style={{ backgroundImage: `url(${bgImg})` }}
      className='flex flex-col items-center justify-center min-h-screen
      bg-cover bg-center bg-cyan-100'
    >
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
