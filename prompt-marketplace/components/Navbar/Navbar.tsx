'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles['navbar__content']}>
          {/* Logo */}
          <Link href="/" className={styles['navbar__logo']}>
            <span className={styles['navbar__logo-icon']}>💡</span>
            <span className={styles['navbar__logo-text']}>PromptMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles['navbar__nav-links']}>
            <Link href="/" className={styles['navbar__nav-link']}>
              Browse
            </Link>
          </div>


          {/* User Actions */}
          <div className={styles['navbar__user-actions']}>
            <Link href="/login" className={styles['navbar__login-btn']}>
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={styles['navbar__mobile-menu-btn']}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12"></path>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles['navbar__mobile-menu']}>
            <div className={styles['navbar__mobile-menu-content']}>
              <Link href="/" className={styles['navbar__mobile-nav-link']} onClick={toggleMenu}>
                Browse
              </Link>
              <div className={styles['navbar__mobile-user-actions']}>
                <Link href="/login" className={styles['navbar__mobile-login-btn']} onClick={toggleMenu}>
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
