export default function FuturisticFooter() {
  return (
    <footer className="relative inset-0 z-[-10] top-17 bg-black text-white py-16 mt-24 px-6 sm:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Branding */}
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            CvWizardAI
          </h2>
          <p className="text-gray-300 text-sm">
            Your AI-powered career assistant — auto-optimize resumes, master job
            matching, and export in one click.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Explore</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#features" className="hover:text-cyan-400 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-cyan-400 transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="#builder" className="hover:text-cyan-400 transition">
                CV Builder
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-cyan-400 transition">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Social + Updates */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Stay Updated</h3>
          <p className="text-gray-400 text-sm">
            Join our newsletter for updates and career tips.
          </p>
          <form className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="you@domain.com"
              className="bg-black/30 border border-white/20 text-white px-4 py-2 rounded-md placeholder-gray-400 focus:outline-none w-full"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 transition px-4 py-2 rounded-md text-white font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 mt-16 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CvWizardAI — Built with 💡 and 🔥 by
        Suprio.
      </div>
    </footer>
  );
}
