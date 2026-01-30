import {
  IoCameraOutline,
  IoVideocamOutline,
  IoLaptopOutline,
} from "react-icons/io5";

const Pill = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
    <span className="opacity-80 group-hover:opacity-100 transition">
      {icon}
    </span>
    <span className="tracking-wide">{label}</span>
  </div>
);

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Left: title + pills */}
        <div>
          <h2 className="font-montserrat text-3xl tracking-tight">About</h2>
          <p className="mt-3 text-white/70 leading-relaxed max-w-md">
            Multi-disciplinary creator focused on emotion, movement, and clean
            composition.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Pill icon={<IoCameraOutline size={18} />} label="Photography" />
            <Pill icon={<IoVideocamOutline size={18} />} label="Videography" />
            <Pill icon={<IoLaptopOutline size={18} />} label="Editing" />
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs tracking-[0.3em] text-white/60">BASED</div>
            <div className="mt-2 text-white/90">Aurora • Toronto / GTA</div>
            <div className="mt-1 text-sm text-white/60">
              Available for projects + collaborations
            </div>
          </div>
        </div>

        {/* Right: image block */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[url('/toronto.jpg')] bg-cover bg-[position:50%_60%]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
          <div className="relative p-6 flex h-[320px] items-end">
            <div className="max-w-md">
              <div className="text-xs tracking-[0.3em] text-white/60">
                STYLE
              </div>
              <div className="mt-2 text-lg text-white/90">
                Cinematic, minimal, story-first.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
