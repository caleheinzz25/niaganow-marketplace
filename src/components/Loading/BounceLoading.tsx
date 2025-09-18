export const BounceLoading = () => {
  return (
    <>
      {/* <!-- 9. Bouncing Balls --> */}
      <div class="bg-white rounded-xl w-full h-80 p-6 flex flex-col justify-center items-center space-y-4 transition-transform hover:scale-105">
        <div class="flex justify-center items-center space-x-2">
          <div
            class="h-5 w-5 rounded-full bg-primary-500 animate-bounce"
            style="animation-delay: 0ms"
          ></div>
          <div
            class="h-5 w-5 rounded-full bg-primary-500 animate-bounce"
            style="animation-delay: 150ms"
          ></div>
          <div
            class="h-5 w-5 rounded-full bg-primary-500 animate-bounce"
            style="animation-delay: 300ms"
          ></div>
        </div>
      </div>
    </>
  );
};
