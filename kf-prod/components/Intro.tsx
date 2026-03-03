export default function Intro() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Vimeo Background */}
      <div className="absolute inset-0 overflow-hidde">
        <iframe
          src="https://player.vimeo.com/video/796183598?background=1&autoplay=1&loop=1&muted=1"
          className="absolute inset-0 h-full w-full scale-125"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 bg-black/50" /> */}

      {/* Optional Content Layer */}
      <div className="relative z-10 flex min-h-screen items-center justify-center text-white">
        <h1 className="text-4xl font-bold">K&F Video Production</h1>
      </div>
    </div>
  );
}
