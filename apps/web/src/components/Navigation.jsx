"use client";

import { useState } from 'react';
import { Shield, FileText, Users, Activity, MapPin, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: Shield },
    { name: 'Report Crime', href: '/report', icon: FileText },
    { name: 'Criminals', href: '/criminals', icon: Users },
    { name: 'Activity Feed', href: '/feed', icon: Activity },
    { name: 'Crime Map', href: '/map', icon: MapPin }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Shield size={24} className="text-black" />
            <span className="text-xl font-bold text-black">Crime Awareness</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors font-medium"
              >
                <item.icon size={18} />
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-black transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors font-medium py-2"
                >
                  <item.icon size={18} />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}