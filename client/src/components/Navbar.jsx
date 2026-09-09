export function Navbar({
  brandName = '3D World',
  links = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Case studies', href: '#' },
    { name: 'Blogs', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  ctaText = 'Lorem ipsum',
}) {
  return (
    <header className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <a href="#" className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
          3D
        </span>
        {brandName}
      </a>

      <nav>
        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        {ctaText}
      </button>
    </header>
  );
}

export default Navbar;
