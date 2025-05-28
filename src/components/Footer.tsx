"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "General",
      links: [
        { label: "Home", href: "/" },
        { label: "Resume Analyzer", href: "/resume" },
        { label: "Prepare your career", href: "/prepareAI" },
        { label: "Discussions", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        {
          label: "Documentation",
          href: "#",
        },
        {
          label: "Raise an issue",
          href: "#",
        },
        {
          label: "Contact Us",
          href: "#",
        },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: "github",
      href: "https://github.com/friedavocadoes",
      ariaLabel: "GitHub",
    },
    {
      icon: "x",
      href: "https://twitter.com/home?lang=en",
      ariaLabel: "Twitter",
    },
    {
      icon: "instagram",
      href: "https://instagram.com/gnawthm",
      ariaLabel: "Instagram",
    },
    {
      icon: "linkedin",
      href: "https://www.linkedin.com/in/gautham-madhu/",
      ariaLabel: "LinkedIn",
    },
    { icon: "mail", href: "mailto:77gautham@gmail.com", ariaLabel: "Email" },
  ];

  return (
    <footer className="relative bg-[#0c0c0d] py-16 px-10 md:px-40 border-t border-gray-800/20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Flint.ai</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              AI Job Buddy — something that's part resume doctor, part career
              guide, part community hub
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.icon}
                  href={link.href}
                  aria-label={link.ariaLabel}
                  target="blank"
                  className="w-8 h-8 flex items-center justify-center border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  <SocialIcon name={link.icon} />
                </a>
              ))}
            </div>
          </div>
          <div></div>
          {/* Site Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">
              Feel free to reach out to us.
            </h4>
            <a
              href="mailto:help@flint.ai"
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>help@flint.ai</span>
            </a>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-gray-800/20 text-gray-500 text-sm text-center">
          <p>Copyright © {currentYear} Flint.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Helper component for rendering social icons
export function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "github":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    case "twitter":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case "x":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 47 51"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          // strokeLinecap="round"
          // strokeLinejoin="round"
        >
          <path d="M5.91992,6l14.66211,21.375l-14.35156,16.625h3.17969l12.57617,-14.57812l10,14.57813h12.01367l-15.31836,-22.33008l13.51758,-15.66992h-3.16992l-11.75391,13.61719l-9.3418,-13.61719zM9.7168,8h7.16406l23.32227,34h-7.16406z"></path>
        </svg>
      );

    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 50 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16,3c-7.16752,0 -13,5.83248 -13,13v18c0,7.16752 5.83248,13 13,13h18c7.16752,0 13,-5.83248 13,-13v-18c0,-7.16752 -5.83248,-13 -13,-13zM16,5h18c6.08648,0 11,4.91352 11,11v18c0,6.08648 -4.91352,11 -11,11h-18c-6.08648,0 -11,-4.91352 -11,-11v-18c0,-6.08648 4.91352,-11 11,-11zM37,11c-1.10457,0 -2,0.89543 -2,2c0,1.10457 0.89543,2 2,2c1.10457,0 2,-0.89543 2,-2c0,-1.10457 -0.89543,-2 -2,-2zM25,14c-6.06329,0 -11,4.93671 -11,11c0,6.06329 4.93671,11 11,11c6.06329,0 11,-4.93671 11,-11c0,-6.06329 -4.93671,-11 -11,-11zM25,16c4.98241,0 9,4.01759 9,9c0,4.98241 -4.01759,9 -9,9c-4.98241,0 -9,-4.01759 -9,-9c0,-4.98241 4.01759,-9 9,-9z"></path>
        </svg>
      );
    case "linkedin":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "mail":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    default:
      return null;
  }
}
