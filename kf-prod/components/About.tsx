export default function About() {
  return (
    <section className="w-full bg-black text-white px-6 md:px-16 py-20">
      <div className="mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-orange uppercase tracking-[0.25em] text-sm mb-4">
            About K&F Video Production
          </p>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Bringing stories to life through
            <span className="text-orange"> video, visuals, and creativity</span>
          </h2>

          <p className="text-white/80 text-lg leading-relaxed mb-6">
            K&amp;F Video Production is a creative media company focused on
            producing visually compelling content for brands, events,
            businesses, and individuals. We combine cinematic storytelling,
            clean editing, and modern visual design to create content that feels
            professional, memorable, and impactful.
          </p>

          <p className="text-white/70 leading-relaxed">
            Our specialties include videography, video editing, animation, and
            photography — giving clients a full creative solution from concept
            to final delivery.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-orange text-xl font-semibold mb-2">
              Cinematic Videography
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              High-quality visuals for events, brands, promos, and storytelling.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-orange text-xl font-semibold mb-2">
              Professional Editing
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Clean, engaging edits designed to keep viewers watching.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-orange text-xl font-semibold mb-2">
              Motion & Animation
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Graphics and animation that elevate your content and brand.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-orange text-xl font-semibold mb-2">
              Photography
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Sharp, polished imagery for portraits, events, and campaigns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
