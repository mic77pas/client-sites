import Image from "next/image";
import Link from "next/link";

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="group relative text-sm tracking-wide text-white/80 hover:text-white transition"
  >
    {label}
    <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white/80 transition-all duration-300 group-hover:w-full" />
  </Link>
);

export default function Header() {
  return (
    <header className="hidden md:block fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-md">
          <Link href="#top" className="flex items-center gap-3">
            <Image
              src="/nick2.png"
              alt="Nikita Karpov"
              width={44}
              height={44}
              priority
              className=" transition-transform duration-300 hover:scale-110"
            />
          </Link>

          <nav className="hidden md:block">
            <ul className="font-montserrat flex space-x-8">
              <li>
                <Link href="#about" className="nav-link">
                  About
                </Link>
              </li>
              <li>
                <Link href="#work" className="nav-link">
                  Work
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
      </div>
    </header>
  );
}
