import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Brand */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30"
              >
                <Leaf className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-heading font-bold text-white">
                GreenLoop
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Turn your trash into treasure. Join the green revolution and make
              recycling rewarding for everyone.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["About Us", "How It Works", "Contact", "FAQ"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-5 group-hover:ml-0" />
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* For Users */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              For Users
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/register"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-5 group-hover:ml-0" />
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-5 group-hover:ml-0" />
                  Become a Collector
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-5 group-hover:ml-0" />
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-5 group-hover:ml-0" />
                  Sign Up
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-5 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@greenloop.com"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-400 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-800 group-hover:bg-green-500/20 rounded-xl flex items-center justify-center transition-colors">
                    <Mail className="w-4 h-4 text-green-500" />
                  </div>
                  <span>support@greenloop.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+84123456789"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-400 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-800 group-hover:bg-green-500/20 rounded-xl flex items-center justify-center transition-colors">
                    <Phone className="w-4 h-4 text-green-500" />
                  </div>
                  <span>+84 123 456 789</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-500" />
                  </div>
                  <span>Ho Chi Minh City, Vietnam</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center"
            >
              <Leaf className="w-5 h-5 text-green-500" />
            </motion.div>
          </div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-gray-500">
            © {currentYear} GreenLoop. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
            for a greener planet
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-green-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-green-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
