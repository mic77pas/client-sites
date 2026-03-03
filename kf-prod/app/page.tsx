import Intro from "../components/Intro";

export default function Home() {
  return (
    <main className="text-black justify-center items-center text-4xl font-bold">
      <section>
        <Intro />
      </section>
      <section className="bg-black h-300"></section>
    </main>
  );
}
