import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-warm-white text-foreground">
      <Header />

      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-16 bg-warm-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6">📍</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl display-font text-foreground mb-4">
              Visit Us Today
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-secondary leading-relaxed max-w-3xl mx-auto">
              Come experience Perth's finest fish and chips at our Mount Pleasant location. 
              We can't wait to serve you!
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-muted-warm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Location Card */}
              <div className="menu-card text-center">
                <div className="text-5xl mb-6">🏠</div>
                <h3 className="text-2xl casual-font mb-4 text-coastal">Our Location</h3>
                <address className="not-italic text-secondary leading-relaxed text-lg">
                  123 Canning Highway<br />
                  Mount Pleasant WA 6153<br />
                  Australia
                </address>
                <div className="mt-6">
                  <Button variant="warm" size="md" asChild>
                    <a 
                      href="https://maps.google.com/?q=123+Canning+Highway+Mount+Pleasant+WA+6153" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2"
                    >
                      <span>📍</span>
                      <span>Get Directions</span>
                    </a>
                  </Button>
                </div>
              </div>
              
              {/* Hours Card */}
              <div className="menu-card text-center">
                <div className="text-5xl mb-6">🕒</div>
                <h3 className="text-2xl casual-font mb-4 text-coastal">Opening Hours</h3>
                <div className="space-y-3 text-secondary text-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Mon - Fri:</span>
                    <span>11:30am - 8:30pm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Saturday:</span>
                    <span>11:30am - 9:00pm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Sunday:</span>
                    <span>4:00pm - 8:30pm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Holidays:</span>
                    <span>4:00pm - 8:30pm</span>
                  </div>
                </div>
                <div className="mt-6 text-sm text-accent font-semibold">
                  Open 7 days a week
                </div>
              </div>
              
              {/* Contact Details Card */}
              <div className="menu-card text-center">
                <div className="text-5xl mb-6">📞</div>
                <h3 className="text-2xl casual-font mb-4 text-coastal">Get In Touch</h3>
                <div className="space-y-6 text-secondary">
                  <div>
                    <div className="font-semibold text-foreground mb-2 text-lg">Phone Orders</div>
                    <a 
                      href="tel:+61892345678" 
                      className="text-accent hover:text-accent-light transition-colors font-bold text-xl block"
                    >
                      (08) 9234 5678
                    </a>
                    <p className="text-sm mt-1">Call ahead for quick pickup</p>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-2 text-lg">Email</div>
                    <a 
                      href="mailto:info@mpfishandchips.com.au" 
                      className="text-accent hover:text-accent-light transition-colors break-all"
                    >
                      info@mpfishandchips.com.au
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Options */}
        <section className="py-20 bg-warm-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl display-font text-foreground mb-6">
              How to Order
            </h2>
            <p className="text-lg text-secondary mb-12 max-w-2xl mx-auto">
              Choose the most convenient way to enjoy our fresh fish and chips
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Online Ordering */}
              <div className="menu-card text-center">
                <div className="text-5xl mb-6">💻</div>
                <h3 className="text-2xl casual-font mb-4 text-coastal">Order Online</h3>
                <p className="mb-6 text-secondary">
                  Browse our full menu, customize your order, and get real-time pickup estimates
                </p>
                <Button variant="coastal" size="lg" asChild>
                  <Link href="/order">
                    🛒 Start Your Order
                  </Link>
                </Button>
              </div>

              {/* Phone Ordering */}
              <div className="menu-card text-center">
                <div className="text-5xl mb-6">📞</div>
                <h3 className="text-2xl casual-font mb-4 text-coastal">Call to Order</h3>
                <p className="mb-6 text-secondary">
                  Speak directly with our team for personalized service and recommendations
                </p>
                <Button variant="warm" size="lg" asChild>
                  <a href="tel:+61892345678">
                    📞 Call Now
                  </a>
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="menu-card text-center">
              <div className="text-5xl mb-6">⏰</div>
              <h3 className="text-2xl casual-font text-coastal mb-6">Pickup Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Average Wait Times:</h4>
                  <ul className="text-secondary space-y-1">
                    <li>• Online orders: 15-20 minutes</li>
                    <li>• Phone orders: 15-25 minutes</li>
                    <li>• Walk-in orders: 10-30 minutes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Busy Periods:</h4>
                  <ul className="text-secondary space-y-1">
                    <li>• Lunch: 12:00pm - 2:00pm</li>
                    <li>• Dinner: 5:30pm - 7:30pm</li>
                    <li>• Weekends: Generally busier</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder Section */}
        <section className="py-20 bg-muted-warm">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl display-font text-foreground mb-8">
              Find Us Easily
            </h2>
            <div className="bg-warm-white rounded-2xl p-12 coastal-shadow">
              <div className="text-8xl mb-6">🗺️</div>
              <h3 className="text-xl casual-font text-coastal mb-4">
                Located in the Heart of Mount Pleasant
              </h3>
              <p className="text-secondary mb-6 max-w-2xl mx-auto">
                We're conveniently located on Canning Highway with easy parking available. 
                Look for our distinctive coastal-blue signage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="coastal" size="md" asChild>
                  <a 
                    href="https://maps.google.com/?q=123+Canning+Highway+Mount+Pleasant+WA+6153" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    📍 Open in Google Maps
                  </a>
                </Button>
                <Button variant="warm" size="md" asChild>
                  <Link href="/order">
                    🍽️ Order for Pickup
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}