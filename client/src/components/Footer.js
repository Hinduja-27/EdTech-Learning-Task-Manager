import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600">© {new Date().getFullYear()} EdTech Learning Campus</div>
        <div className="flex items-center gap-4 mt-3 md:mt-0">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900">Twitter</a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900">Facebook</a>
        </div>
      </div>
    </footer>
  );
}
