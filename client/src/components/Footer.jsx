export function Footer({
  brandName = '3D World',
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  moreLink = { text: 'Lorem ipsum', href: '#' },
  columns = [
    {
      title: 'About Us',
      links: [
        { name: 'Careers', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Buildings', href: '#' },
      ],
    },
    {
      title: 'Help',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Forums', href: '#' },
        { name: 'Training', href: '#' },
        { name: 'Contact Us', href: '#' },
      ],
    },
  ],
}) {
  return (
    <footer className="bg-gray-900 px-8 py-14 text-gray-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <div className="h-5 w-5 rounded-sm bg-gray-600" />
            <span>{brandName}</span>
          </div>

          <p className="text-xs leading-relaxed text-gray-400">
            {description}
          </p>

          <a
            href={moreLink.href}
            className="inline-block text-xs font-medium text-white underline underline-offset-4"
          >
            {moreLink.text}
          </a>
        </div>

        <div className="flex gap-16">
          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                {column.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
