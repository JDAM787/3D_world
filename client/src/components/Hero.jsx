import { HeroCard } from './HeroCard';

export function Hero({
  cards = [
    { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor' },
    { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor' },
    { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor' },
    { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor' },
  ],
}) {
  return (
    <section className="flex flex-1 flex-col justify-between bg-gray-900 text-white">
      <div className="mx-auto w-full max-w-7xl px-8 py-20">
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Lorem ipsum dolor <span className="text-gray-400">sit amet.</span>
          </h1>

          <p className="text-sm text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <div className="flex flex-wrap gap-4">
            <button type="button" className="rounded-lg bg-gray-700 px-5 py-2.5 text-sm font-medium text-white">
              Lorem ipsum
            </button>
            <button type="button" className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300">
              Lorem ipsum
            </button>
          </div>

          <p className="flex items-center gap-2 text-xs text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            Lorem ipsum dolor sit amet
          </p>
        </div>
      </div>

      <div className="w-full border-t border-gray-800 bg-gray-950 px-8 py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <HeroCard key={index} title={card.title} desc={card.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
