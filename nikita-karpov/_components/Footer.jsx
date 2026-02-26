import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="px-4 py-5 text-sm text-white/70 flex flex-row items-center justify-center w-full gap-2 bg-linear-to-t from-[#0c0e0c]">
        <Image
          src="/nick2.png"
          alt="Nikita Karpov"
          width={22}
          height={22}
          priority
        />{" "}
        © {new Date().getFullYear()} Nik Karpov
      </div>
    </footer>
  );
}
