const services = [
  {
    title: "Videography",
    description:
      "Cinematic video production for brands, events, businesses, music, and promotional content.",
  },
  {
    title: "Video Editing",
    description:
      "Professional editing with pacing, color, sound, and storytelling that make content stand out.",
  },
  {
    title: "Animation",
    description:
      "Motion graphics, logo animation, visual effects, and creative animated elements for modern content.",
  },
  {
    title: "Photography",
    description:
      "High-quality photography for events, portraits, products, and branded visual content.",
  },
];

export default function Services() {
  return (
    <section className="w-full bg-orange text-black px-6 md:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <p className="uppercase tracking-[0.25em] text-sm mb-4 font-semibold">
          Our Services
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Creative services built to make your brand look unforgettable
        </h2>

        <p className="max-w-3xl text-black/80 text-lg mb-12 leading-relaxed">
          Whether you need polished promotional videos, eye-catching animation,
          or event coverage that captures the moment, K&amp;F Video Production
          offers creative solutions tailored to your vision.
        </p>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-3xl bg-black text-white p-8 border border-black/20 shadow-lg hover:-translate-y-1 transition duration-300"
            >
              <h3 className="text-2xl font-bold mb-4 text-orange">
                {service.title}
              </h3>
              <p className="text-white/75 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
