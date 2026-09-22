export function Navbar({
  brandName = '3D World',
  links = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  ctaText = 'Inicia Sesión',
  SegundoBoton = 'Registrarse',
  currentView = 'home',
  onHomeClick,
  onLoginClick,
  onRegisterClick,
}) {
  return (
    <header className="relative flex w-full items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <a
        href="#"
        onClick={(e) => {
          if (onHomeClick) {
            e.preventDefault();
            onHomeClick();
          }
        }}
        className="flex items-center gap-2 text-lg font-bold text-gray-900"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
          3D
        </span>
        {brandName}
      </a>

      <nav className="absolute left-1/2 -translate-x-1/2">
        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => {
                  if (link.name === 'Home' && onHomeClick) {
                    e.preventDefault();
                    onHomeClick();
                  }
                }}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-3">
        {currentView !== 'login' && (
          <button
            type="button"
            onClick={onLoginClick}
            className={
              currentView === 'register'
                ? 'rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800'
                : 'rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900'
            }
          >
            {ctaText}
          </button>
        )}
        {currentView !== 'register' && (
          <button
            type="button"
            onClick={onRegisterClick}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            {SegundoBoton}
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
