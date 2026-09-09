export function HeroCard({ title, desc }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white p-4">
      <div className="h-6 w-6 shrink-0 bg-gray-200" />
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

export default HeroCard;
