export const Footer = () => {
  return (
    <>
      {/* <!-- Footer --> */}
      <footer class="bg-gray-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* <!-- About --> */}
            <div>
              <h3 class="text-lg font-semibold mb-4">About EzyShop</h3>
              <p class="text-gray-400 mb-4">
                We bring you premium products that elevate your everyday life
                with quality and style.
              </p>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-white">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="text-gray-400 hover:text-white">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="text-gray-400 hover:text-white">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="text-gray-400 hover:text-white">
                  <i class="fab fa-pinterest"></i>
                </a>
              </div>
            </div>

            {/* <!-- Quick Links --> */}
            <div>
              <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
              <ul class="space-y-2">
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    Shop
                  </a>
                </li>
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* <!-- Customer Service --> */}
            <div>
              <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
              <ul class="space-y-2">
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    Return Policy
                  </a>
                </li>
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" class="text-gray-400 hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* <!-- Contact --> */}
            <div>
              <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
              <ul class="space-y-2">
                <li class="text-gray-400">
                  <i class="fas fa-map-marker-alt mr-2 text-indigo-500"></i> 123
                  Bekasi, Cikarang Barat
                </li>
                <li class="text-gray-400">
                  <i class="fas fa-phone-alt mr-2 text-indigo-500"></i> +1 (555)
                  123-4567
                </li>
                <li class="text-gray-400">
                  <i class="fas fa-envelope mr-2 text-indigo-500"></i>{" "}
                  support@ezyshop.com
                </li>
              </ul>
            </div>
          </div>
          <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p class="text-sm">© 2023 Haven. All rights reserved.</p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-sm hover:text-white">
                Privacy Policy
              </a>
              <a href="#" class="text-sm hover:text-white">
                Terms of Service
              </a>
              <a href="#" class="text-sm hover:text-white">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
