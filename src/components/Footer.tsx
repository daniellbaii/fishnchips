export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-warm-muted py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-lg display-font text-coastal mb-1">
              Mount Pleasant Fish & Chips
            </h3>
            <p className="text-sm text-secondary">
              Since 1985 • Perth, Australia
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex space-x-6 text-sm">
            <a 
              href="/#menu" 
              className="text-secondary hover:text-coastal transition-colors"
            >
              Menu
            </a>
            <a 
              href="/#about" 
              className="text-secondary hover:text-coastal transition-colors"
            >
              About
            </a>
            <a 
              href="/#contact" 
              className="text-secondary hover:text-coastal transition-colors"
            >
              Contact
            </a>
            <a 
              href="/order" 
              className="text-accent hover:text-warm transition-colors font-medium"
            >
              Order Online
            </a>
          </nav>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-secondary">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}