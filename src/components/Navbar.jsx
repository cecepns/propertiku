import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import Logo from '../assets/logo.jpeg';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50 border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-all">
            <img src={Logo} className="w-32 md:w-44 h-auto" />
          </Link>

          <div className="flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/properti"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
            >
              Properti
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all group-hover:w-full"></span>
            </Link>
            {/* <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
            >
              Kontak
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800 transition-all group-hover:w-full"></span>
            </a> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
