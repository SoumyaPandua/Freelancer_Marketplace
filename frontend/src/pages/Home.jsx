import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6">
      {/* Hero Section */}
      <header className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to <span className="text-yellow-300">Freelancer Marketplace</span>
        </h1>
        <p className="text-lg font-medium mb-6">
          Connect with top freelancers and clients worldwide. Find projects, build your portfolio,
          and collaborate in a streamlined platform designed for success.
        </p>
        <a
          href="/projects"
          className="inline-block bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-400 transition-all"
        >
          Explore Projects
        </a>
      </header>

      {/* Features Section */}
      <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 max-w-5xl">
        <div className="bg-white text-black rounded-lg p-6 shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">For Freelancers</h2>
          <p className="text-sm mb-4">
            Showcase your skills, bid on projects, and grow your career with exciting opportunities.
          </p>
          <a
            href="/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Get Started as a Freelancer
          </a>
        </div>

        <div className="bg-white text-black rounded-lg p-6 shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">For Clients</h2>
          <p className="text-sm mb-4">
            Post projects, hire skilled freelancers, and bring your ideas to life effortlessly.
          </p>
          <a
            href="/register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Get Started as a Client
          </a>
        </div>

        <div className="bg-white text-black rounded-lg p-6 shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Secure Payments</h2>
          <p className="text-sm mb-4">
            Enjoy secure transactions and seamless communication throughout your projects.
          </p>
          <a
            href="/about"
            className="text-blue-500 font-semibold hover:underline"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;