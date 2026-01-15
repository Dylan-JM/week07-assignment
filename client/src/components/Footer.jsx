export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="w-full px-6 py-6 flex items-center justify-between">
        <span className="text-sm">© 2026 Forum - Dylan Marley</span>

        <div className="flex items-center gap-8 text-sm">
          <a href="#" className="hover:text-purple-400 transition">
            Privacy
          </a>
          <a href="#" className="hover:text-purple-400 transition">
            Terms
          </a>
          <a href="#" className="hover:text-purple-400 transition">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
