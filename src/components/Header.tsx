export default function Header() {
  return (
    <header className="bg-warm-white coastal-shadow sticky top-0 z-50 wave-border">
      <nav className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl display-font text-coastal">
            <a href="/" className="hover:text-primary-dark transition-colors">
              Mount Pleasant Fish and Chips
            </a>
          </h1>
          
          <ul className="flex space-x-6 items-center">
            <li>
              <a 
                href="/#menu" 
                className="hover:text-coastal transition-all duration-300 font-medium"
              >
                Menu
              </a>
            </li>
            <li>
              <a 
                href="/#about" 
                className="hover:text-coastal transition-all duration-300 font-medium"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="/#contact" 
                className="hover:text-coastal transition-all duration-300 font-medium"
              >
                Contact
              </a>
            </li>
            <li>
              <a 
                href="/order" 
                className="btn-coastal"
              >
                Order Online
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}