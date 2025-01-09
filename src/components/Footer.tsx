import { Facebook, Twitter, Instagram, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full max-w-md py-8">
      <div className="flex justify-center items-center gap-8">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors hover:scale-110"
        >
          <Facebook size={28} />
          <span className="sr-only">Facebook</span>
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-400 transition-colors hover:scale-110"
        >
          <Twitter size={28} />
          <span className="sr-only">Twitter</span>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors hover:scale-110"
        >
          <Instagram size={28} />
          <span className="sr-only">Instagram</span>
        </a>
        <a
          href="mailto:contact@d79.nyc"
          className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors hover:scale-110"
        >
          <Mail size={28} />
          <span className="sr-only">Email</span>
        </a>
        <a
          href="https://www.d79.nyc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors hover:scale-110"
        >
          <Globe size={28} />
          <span className="sr-only">Website</span>
        </a>
      </div>
    </footer>
  );
} 