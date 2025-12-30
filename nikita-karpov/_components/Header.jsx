import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed z-5 w-full bg-black h-20 px-4 text-white flex items-center justify-center shadow-[0_4px_30px_rgba(0,0,0,0.8)] -mb-20">
      <div className="flex flex-row items-center justify-between w-full max-w-7xl">
        <Link href="/">
          <Image
            src="/nick.png"
            alt="Nikita Karpov"
            width={60}
            height={60}
            priority
            className="transition-transform duration-300 hover:scale-110"
          />
        </Link>

        <nav>
          <ul className="font-montserrat flex space-x-8">
            <li>
              <Link href="#about" className="nav-link">
                About
              </Link>
            </li>
            <li>
              <Link href="#portfolio" className="nav-link">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="#contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
