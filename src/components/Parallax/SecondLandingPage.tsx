"use client";

export default function SecondLandingPage() {
  return (
    <div id="second-page">
      <div style={{ height: "150vh", background: "black" }} className="text-center text-white flex items-center justify-center">
        {/* Simulate taller content */}
        This div is taller than 100vh to force scroll.
      </div>
    </div>
  );
}
