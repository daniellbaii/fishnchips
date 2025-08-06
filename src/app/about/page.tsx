import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-white text-foreground">
      <Header />

      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-16 bg-warm-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6">🏖️</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl display-font text-foreground mb-4">
              Our Story
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-secondary leading-relaxed max-w-3xl mx-auto">
              Mount Pleasant Fish and Chips has been serving the Perth community with authentic, 
              fresh seafood for nearly four decades.
            </p>
          </div>
        </section>

        {/* Main Story Section */}
        <section className="py-20 bg-muted-warm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Story Content */}
              <div className="space-y-6">
                <div className="text-4xl mb-4">🐟</div>
                <h2 className="text-2xl sm:text-3xl display-font text-coastal mb-6">
                  Fresh Fish, Family Tradition
                </h2>
                <div className="space-y-4 text-lg text-secondary leading-relaxed">
                  <p>
                    Since opening our doors in 1985, Mount Pleasant Fish and Chips has been 
                    more than just a restaurant – we're a cornerstone of the local community. 
                    What started as a small family business has grown into Perth's beloved 
                    destination for authentic fish and chips.
                  </p>
                  <p>
                    Our commitment to quality begins at dawn when we select only the freshest 
                    local fish from trusted suppliers. Every piece is hand-battered using our 
                    traditional recipe that's been perfected over generations.
                  </p>
                  <p>
                    We hand-cut our chips daily from premium potatoes, ensuring that crispy 
                    exterior and fluffy interior that our customers have come to expect. 
                    It's this attention to detail that has made us a family favorite for 
                    three generations.
                  </p>
                </div>
              </div>

              {/* Stats/Highlights */}
              <div className="grid grid-cols-2 gap-6">
                <div className="menu-card text-center">
                  <div className="text-4xl mb-3">📅</div>
                  <div className="text-3xl font-bold text-coastal mb-2">39+</div>
                  <div className="text-sm text-secondary">Years Serving Perth</div>
                </div>
                <div className="menu-card text-center">
                  <div className="text-4xl mb-3">🐟</div>
                  <div className="text-3xl font-bold text-accent mb-2">100%</div>
                  <div className="text-sm text-secondary">Fresh Local Fish</div>
                </div>
                <div className="menu-card text-center">
                  <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
                  <div className="text-3xl font-bold text-seafoam mb-2">3</div>
                  <div className="text-sm text-secondary">Generations</div>
                </div>
                <div className="menu-card text-center">
                  <div className="text-4xl mb-3">⭐</div>
                  <div className="text-3xl font-bold text-sand mb-2">1985</div>
                  <div className="text-sm text-secondary">Established</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-warm-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl display-font text-foreground mb-4">
                What We Stand For
              </h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Our values have guided us for nearly four decades and continue to drive everything we do.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🌊</div>
                <h3 className="text-xl casual-font text-coastal mb-4">Fresh & Local</h3>
                <p className="text-secondary leading-relaxed">
                  We source our fish daily from local Perth suppliers, ensuring the freshest 
                  catch goes straight from the ocean to your plate.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">👨‍🍳</div>
                <h3 className="text-xl casual-font text-coastal mb-4">Traditional Methods</h3>
                <p className="text-secondary leading-relaxed">
                  Our time-honored recipes and cooking techniques have been passed down through 
                  generations, preserving authentic flavors.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="text-xl casual-font text-coastal mb-4">Family Care</h3>
                <p className="text-secondary leading-relaxed">
                  Every meal is prepared with the same love and attention we'd give to our 
                  own family members.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-muted-warm text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-5xl mb-6">🍽️</div>
            <h2 className="text-2xl sm:text-3xl display-font text-foreground mb-6">
              Taste the Tradition
            </h2>
            <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
              Experience nearly four decades of Perth's finest fish and chips. 
              Visit us today or place an order for pickup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="coastal" size="lg" className="px-8" asChild>
                <Link href="/order">
                  🛒 Order Online
                </Link>
              </Button>
              <Button variant="warm" size="lg" className="px-8" asChild>
                <Link href="/contact">
                  📍 Visit Our Store
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}