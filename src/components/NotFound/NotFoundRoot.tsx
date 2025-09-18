export const NotFoundPage = () => {
  const handleGoBack = (e: any) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div class="bg-gray-900 text-white h-screen-fit flex flex-col items-center justify-center font-sans overflow-hidden relative">
      {/* Background pattern */}
      <div class="absolute inset-0 bg-pattern opacity-20"></div>

      {/* Floating decorative elements */}
      <div
        class="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-500 rounded-full opacity-20 blur-md floating"
        style={{ "animation-delay": "0s" }}
      ></div>
      <div
        class="absolute bottom-1/3 right-1/5 w-12 h-12 bg-indigo-500 rounded-full opacity-20 blur-md floating"
        style={{ "animation-delay": "1.5s" }}
      ></div>
      <div
        class="absolute top-1/3 right-1/4 w-10 h-10 bg-purple-500 rounded-full opacity-20 blur-md floating"
        style={{ "animation-delay": "0.7s" }}
      ></div>

      <div class="max-w-6xl mx-auto px-6 py-12 text-center relative z-10">
        <div class="mb-8">
          <div class="glow text-9xl font-bold mb-4">404</div>
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            Lost in the Digital Void
          </h1>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            The page you're looking for has disappeared into the ether. Maybe
            it's moved, maybe it never existed. Either way, let's get you back
            on track.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/"
            class="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <i class="fas fa-home"></i>
            Go Home
          </a>
          <a
            href="#"
            onClick={handleGoBack}
            class="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gray-500/10 flex items-center gap-2"
          >
            <i class="fas fa-chevron-left"></i>
            Go Back
          </a>
        </div>

        <div class="relative">
          <div class="floating">
            <div class="text-gray-400 text-sm mb-2">
              Still confused? Try searching:
            </div>
            <div class="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search..."
                class="w-full px-5 py-3 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button class="absolute right-3 top-3 text-gray-400 hover:text-white">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated astronaut illustration */}
      <div class="absolute right-10 bottom-10 hidden lg:block">
        <div class="floating" style={{ "animation-delay": "0.5s" }}>
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Helmet */}
            <circle cx="100" cy="70" r="50" fill="#3B82F6" opacity="0.8" />
            <circle cx="100" cy="70" r="40" fill="#EFF6FF" />
            {/* Visor */}
            <path
              d="M70 70C70 54.54 84.54 40 100 40C115.46 40 130 54.54 130 70"
              stroke="#1E3A8A"
              stroke-width="5"
            />
            {/* Body */}
            <rect
              x="72"
              y="120"
              width="56"
              height="70"
              rx="10"
              fill="#3B82F6"
              opacity="0.8"
            />
            {/* Arms */}
            <rect
              x="40"
              y="120"
              width="32"
              height="15"
              rx="5"
              fill="#3B82F6"
              opacity="0.8"
            />
            <rect
              x="128"
              y="120"
              width="32"
              height="15"
              rx="5"
              fill="#3B82F6"
              opacity="0.8"
            />
            {/* Legs */}
            <rect
              x="76"
              y="190"
              width="15"
              height="30"
              rx="5"
              fill="#3B82F6"
              opacity="0.8"
            />
            <rect
              x="109"
              y="190"
              width="15"
              height="30"
              rx="5"
              fill="#3B82F6"
              opacity="0.8"
            />
            {/* Stars */}
            <circle cx="30" cy="30" r="2" fill="white" />
            <circle cx="170" cy="40" r="1" fill="white" />
            <circle cx="50" cy="80" r="1.5" fill="white" />
            <circle cx="180" cy="100" r="2" fill="white" />
            <circle cx="20" cy="150" r="1" fill="white" />
          </svg>
        </div>
      </div>

      {/* Grid pattern */}
      <svg
        class="absolute left-0 top-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern
          id="grid-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(0,0)"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(59, 130, 246, 0.05)"
            stroke-width="1"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* CSS styles */}
      <style>{`
        .glow {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 
                       0 0 20px rgba(59, 130, 246, 0.6), 
                       0 0 30px rgba(59, 130, 246, 0.4);
        }
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};
