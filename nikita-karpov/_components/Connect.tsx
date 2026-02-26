import { CiMail } from "react-icons/ci";
import InstagramProfileCard from "./InstagramProfileCard";
import Image from "next/image";
import { IoMail } from "react-icons/io5";
import { LuMail } from "react-icons/lu";

export default function Connect() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col justify-center items-center">
        <h2 className="font-montserrat text-3xl tracking-tight text-center mb-6">
          Let&apos;s Connect!
        </h2>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="w-full max-w-md flex flex-col gap-3 justify-center">
            <h3 className="text-center">
              Reach out directly or fill out the form here!
            </h3>
            <div className="grid grid-cols-2 gap-8 w-full mb-4">
              <InstagramProfileCard
                username="nktfilms_"
                name="Instagram"
                avatarSrc="/nikitaInsta.jpg"
                // subtitle="📸🇨🇦"
              />
              <a
                href="mailto:nikitichkarp@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="group flex flex-1 w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10 transition"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20">
                  <Image
                    src={"/nickMail.jpg"}
                    alt={`avatar`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-[14px] truncate">Email</p>
                    <span className="text-white group-hover:text-white/70 transition">
                      <LuMail size={16} />
                    </span>
                  </div>
                  <p className="text-sm text-white/70 truncate">nikitichkarp</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Form (front-end only placeholder) */}
        <form suppressHydrationWarning className="w-full max-w-md space-y-4">
          <input
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
            placeholder="Name"
          />
          <input
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
            placeholder="Email"
          />
          <textarea
            className="min-h-[120px] w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
            placeholder="Message"
          />
          <button
            type="button"
            className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
