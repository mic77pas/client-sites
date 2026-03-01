import { CiMail } from "react-icons/ci";
import InstagramProfileCard from "./InstagramProfileCard";
import Image from "next/image";
import { IoMail } from "react-icons/io5";
import { LuMail } from "react-icons/lu";
import { BsInstagram, BsLinkedin } from "react-icons/bs";
import { DrawCircleText } from "./DrawText";
import TrueFocus from "./TrueFocus";
import SocialLinkCard from "./SocialLink";
import { PiLinkedinLogo } from "react-icons/pi";
import { FaYoutube } from "react-icons/fa";
import { TbBrandYoutube } from "react-icons/tb";

export default function Connect() {
  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col justify-center items-center">
        <div className="pb-8 pointer-events-none">
          <TrueFocus
            sentence="Let's Connect"
            manualMode={false}
            blurAmount={3}
            borderColor="#ffffff"
            animationDuration={0.5}
            pauseBetweenAnimations={2}
          />
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-8 items-stretch">
          <div className="flex flex-col gap-4 flex-1 self-stretch">
            <div className="flex flex-col gap-4 w-full h-full">
              <SocialLinkCard
                className="flex-1"
                href="https://www.instagram.com/nktfilms_/"
                title="Instagram"
                subtitle="@nktfilms_"
                icon={<BsInstagram size={32} />}
                backgroundSrc="/nikitaInsta.jpg"
                avatarSrc="/nikitaInsta.jpg"
                external
              />

              <SocialLinkCard
                className="flex-1"
                href="mailto:nikitichkarp@gmail.com"
                title="Email"
                subtitle="nikitichkarp@gmail.com"
                icon={<LuMail size={32} />}
                backgroundSrc="/nickMail.jpg"
                avatarSrc="/nickMail.jpg"
                external={false} // optional; mailto doesn't need _blank
              />

              <SocialLinkCard
                className="flex-1"
                href="https://www.linkedin.com/in/nik-karpov-9ab58a34b/"
                title="LinkedIn"
                subtitle="nik-karpov"
                icon={<PiLinkedinLogo size={34} />}
                backgroundSrc="/nickLinked.jpg"
                avatarSrc="/nickLinked.jpg"
                external
              />

              <SocialLinkCard
                className="flex-1"
                href="https://www.youtube.com/@nicksjuice"
                title="Youtube"
                subtitle="NicksJuice"
                icon={<TbBrandYoutube size={34} />}
                backgroundSrc="/nickBanner.jpg"
                avatarSrc="/nickYoutube.jpg"
                external
              />
            </div>
          </div>

          {/* Form (front-end only placeholder) */}
          <div className="flex flex-col gap-4 flex-1 items-center self-stretch">
            <p className="text-lg">
              ...or feel free to reach out directly here!
            </p>
            <form suppressHydrationWarning className="w-full space-y-4">
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
        </div>
      </div>
    </>
  );
}
