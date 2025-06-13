import { Link } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="site-footer-glass relative mt-16"
      role="contentinfo"
      style={{
        backgroundColor: 'rgba(10, 10, 20, 0.2)',
        backdropFilter: 'blur(15px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 -4px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="container mx-auto px-8 sm:px-12 max-w-6xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <img
                src="/NextNode-Logo.svg"
                alt="NextNode Logo"
                className="h-8 w-auto filter brightness-0 invert hover:filter hover:brightness-100 hover:invert-0 hover:hue-rotate-90 transition-all duration-300"
              />
            </div>
            <p className="text-sm text-gray-300 font-light leading-relaxed max-w-xs">
              Connecting ideas, building futures through intelligent content curation.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-medium text-white uppercase tracking-wider">Legal</h4>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-light hover:bg-green-400/10 hover:backdrop-blur-sm hover:shadow-sm hover:shadow-green-400/20 px-3 py-2 rounded-md -mx-3 group"
              >
                <span className="group-hover:drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]">
                  Privacy Policy
                </span>
              </Link>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-light hover:bg-green-400/10 hover:backdrop-blur-sm hover:shadow-sm hover:shadow-green-400/20 px-3 py-2 rounded-md -mx-3 group"
              >
                <span className="group-hover:drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]">
                  Terms of Service
                </span>
              </Link>
            </nav>
          </div>

          {/* Social & Actions */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-4">
              <h4 className="text-sm font-medium text-white uppercase tracking-wider">Connect</h4>
              <div className="flex items-center space-x-4">
                <a
                  href="https://instagram.com/nextnode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-110 hover:brightness-110 p-2 hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20 rounded-lg group"
                  aria-label="Follow us on Instagram"
                >
                  <svg
                    className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.017 0C8.396 0 7.954.01 6.74.048 2.608.092.394 2.297.35 6.428.313 7.634.303 8.076.303 11.686c0 3.61.01 4.052.047 5.258.044 4.13 2.249 6.336 6.379 6.379 1.206.037 1.648.047 5.258.047 3.61 0 4.052-.01 5.258-.047 4.13-.043 6.336-2.249 6.379-6.379.037-1.206.047-1.648.047-5.258 0-3.61-.01-4.052-.047-5.258C23.98 2.297 21.775.092 17.645.049 16.439.01 15.997 0 12.017 0zm0 2.165c3.557 0 3.975.01 5.178.047 3.086.04 4.553 1.507 4.593 4.593.037 1.203.047 1.621.047 5.178 0 3.557-.01 3.975-.047 5.178-.04 3.086-1.507 4.553-4.593 4.593-1.203.037-1.621.047-5.178.047-3.557 0-3.975-.01-5.178-.047-3.086-.04-4.553-1.507-4.593-4.593-.037-1.203-.047-1.621-.047-5.178 0-3.557.01-3.975.047-5.178.04-3.086 1.507-4.553 4.593-4.593 1.203-.037 1.621-.047 5.178-.047zm0 3.68a5.503 5.503 0 1 0 0 11.005A5.503 5.503 0 0 0 12.017 5.845zm0 9.058a3.555 3.555 0 1 1 0-7.11 3.555 3.555 0 0 1 0 7.11zm6.967-9.26a1.287 1.287 0 1 1-2.573 0 1.287 1.287 0 0 1 2.573 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                <a
                  href="https://linkedin.com/company/nextnode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-110 hover:brightness-110 p-2 hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20 rounded-lg group"
                  aria-label="Connect with us on LinkedIn"
                >
                  <svg
                    className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="self-start text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105 p-3 hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20 rounded-lg backdrop-blur-sm border border-white/20 hover:border-green-400/40 group"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 font-light">
              © {new Date().getFullYear()} NextNode. All rights reserved.
            </p>
            <div className="text-xs text-gray-500 font-light">Crafted with precision and care</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
