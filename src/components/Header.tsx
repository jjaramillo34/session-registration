import Image from "next/image";
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full max-w-md flex flex-col items-center py-6 space-y-4">
      <div className="relative w-[290px] h-[125px]">
        <Image
          src="/img/d79-logo.png"
          alt="D79 Logo"
          fill
          sizes="(max-width: 290px) 100vw, 290px"
          priority
          className="object-contain"
        />
      </div>
      <nav className="flex space-x-4">
        <Link 
          href="/" 
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Register
        </Link>
        <Link 
          href="/sessions" 
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          View Sessions
        </Link>
      </nav>
    </header>
  );
} 