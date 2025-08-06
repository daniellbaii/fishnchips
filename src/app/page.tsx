import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MenuCard from '@/components/menu/MenuCard';
import MenuItem from '@/components/menu/MenuItem';
import Button from '@/components/ui/Button';
import { menuItems } from '@/data/menuItems';

export default function Home() {
  return (
    <div className="min-h-screen bg-warm-white text-foreground">
      <Header />

      <main>
        <section className="hero hero-gradient py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-32 h-32 bg-seafoam rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-32 w-40 h-40 bg-ocean-light rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-1/3 w-36 h-36 bg-accent-light rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl display-font mb-8 text-foreground leading-tight">
              Authentic Fish & Chips
              <span className="block text-coastal text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2">Since 1985</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-12 text-secondary max-w-3xl mx-auto leading-relaxed">
              Fresh fish, golden crispy chips, and traditional Australian seafood served with love in the heart of Mount Pleasant, Perth. 
              <span className="block mt-2 text-lg text-accent font-semibold">Four decades of family tradition</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="coastal" size="lg" className="px-8" asChild>
                <a href="tel:+61892345678">
                  📞 Call to Order: (08) 9234 5678
                </a>
              </Button>
              <Button variant="warm" size="lg" className="px-8" asChild>
                <Link href="#menu">
                  🍟 View Our Menu
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="menu" className="py-20 bg-muted-warm relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl display-font text-center mb-4 text-foreground">Our Fresh Menu</h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">Locally sourced fish, hand-cut chips, and traditional favorites prepared fresh daily</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <MenuCard title="Fresh Fish" icon="🐟">
                <ul className="space-y-4">
                  {menuItems.filter(item => item.category === 'fish').slice(0, 4).map(item => (
                    <MenuItem key={item.id} variant="list" item={item} />
                  ))}
                </ul>
              </MenuCard>

              <MenuCard title="Chips & Sides" icon="🍟">
                <ul className="space-y-4">
                  {menuItems.filter(item => item.category === 'sides').map(item => (
                    <MenuItem key={item.id} variant="list" item={item} />
                  ))}
                </ul>
              </MenuCard>

              <MenuCard title="Seafood Specials" icon="🦐">
                <ul className="space-y-4">
                  {menuItems.filter(item => item.category === 'seafood').map(item => (
                    <MenuItem key={item.id} variant="list" item={item} />
                  ))}
                </ul>
              </MenuCard>
            </div>
            
            {/* Call to Action Button */}
            <div className="text-center mt-12">
              <Button variant="coastal" size="lg" className="px-8" asChild>
                <Link href="/order">
                  🍽️ View Full Menu & Order Online
                </Link>
              </Button>
              <p className="text-sm text-secondary mt-3">
                Customize your order and get pickup ready times
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-warm-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="sand-texture h-full w-full"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <div className="mb-8">
              <div className="text-6xl mb-4">🏖️</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl display-font text-foreground mb-4">Our Story</h2>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            </div>
            <div className="space-y-8 text-lg text-secondary leading-relaxed">
              <p className="text-xl font-medium text-foreground">
                Mount Pleasant Fish and Chips has been serving the Perth community since 1985. We pride ourselves on using only the freshest local fish and hand-cut chips cooked to perfection.
              </p>
              <p>
                Our family-run business is committed to traditional cooking methods and quality ingredients that have made us a local favorite for nearly four decades. Every piece of fish is hand-battered, every chip is hand-cut, and every meal is prepared with the same care we'd serve our own family.
              </p>
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-coastal mb-2">39+</div>
                  <div className="text-sm text-secondary">Years Serving Perth</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">100%</div>
                  <div className="text-sm text-secondary">Fresh Local Fish</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-seafoam mb-2">3</div>
                  <div className="text-sm text-secondary">Generations</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-muted-warm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl display-font text-foreground mb-4">Come Visit Us</h2>
              <p className="text-lg text-secondary">We can't wait to serve you our famous fish and chips!</p>
            </div>
            <div className="contact-info grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="menu-card text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl casual-font mb-4 text-coastal">Location</h3>
                <address className="not-italic text-secondary leading-relaxed">
                  123 Canning Highway<br />
                  Mount Pleasant WA 6153<br />
                  Australia
                </address>
                <div className="mt-4">
                  <a href="#" className="text-accent hover:text-accent-light transition-colors font-medium">📍 Get Directions</a>
                </div>
              </div>
              
              <div className="menu-card text-center">
                <div className="text-4xl mb-4">🕒</div>
                <h3 className="text-xl casual-font mb-4 text-coastal">Opening Hours</h3>
                <ul className="space-y-3 text-secondary leading-relaxed">
                  <li><span className="font-medium text-foreground">Mon - Fri:</span> 11:30am - 8:30pm</li>
                  <li><span className="font-medium text-foreground">Saturday:</span> 11:30am - 9:00pm</li>
                  <li><span className="font-medium text-foreground">Sunday:</span> 4:00pm - 8:30pm</li>
                  <li><span className="font-medium text-foreground">Holidays:</span> 4:00pm - 8:30pm</li>
                </ul>
              </div>
              
              <div className="menu-card text-center">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl casual-font mb-4 text-coastal">Get In Touch</h3>
                <ul className="space-y-4 text-secondary">
                  <li>
                    <div className="font-medium text-foreground mb-1">Phone</div>
                    <a href="tel:+61892345678" className="text-accent hover:text-accent-light transition-colors font-semibold text-lg">(08) 9234 5678</a>
                  </li>
                  <li>
                    <div className="font-medium text-foreground mb-1">Email</div>
                    <a href="mailto:info@mpfishandchips.com.au" className="text-accent hover:text-accent-light transition-colors break-all">info@mpfishandchips.com.au</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
