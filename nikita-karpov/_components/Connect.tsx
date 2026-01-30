export default function Connect() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <h2 className="font-montserrat text-3xl tracking-tight">Connect</h2>
            {/* <p className="mt-2 text-white/70">
              Quick message. Simple. No fluff.
            </p> */}

            <div className="mt-6 space-y-3 text-sm">
              <a
                href="mailto:nik@example.com"
                className="block text-white/80 hover:text-white transition"
              >
                nik@example.com
              </a>
              <div className="flex gap-4 text-white/70">
                <a
                  className="hover:text-white transition"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <a
                  className="hover:text-white transition"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                </a>
                {/* <a
                  className="hover:text-white transition"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                >
                  Vimeo
                </a> */}
              </div>
            </div>
          </div>

          {/* Form (front-end only placeholder) */}
          <form className="w-full md:max-w-md space-y-4">
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

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/45 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Nik Karpov</span>
        </div>
      </div>
    </section>
  );
}
