import { UtensilsCrossed } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 text-center text-gray-700">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {/* Footer Logo */}
        <div>
          <h1 className="text-2xl font-medium flex justify-center items-center gap-2 mb-4">
            Better
            <UtensilsCrossed size={32} color="green" />
            Eats
          </h1>
          <p>Your Solution to be Healthy.</p>
        </div>

        {/* Footer Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-3">Social Media</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                className="hover:text-green-primary transition duration-150 ease-in-out"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                className="hover:text-green-primary transition duration-150 ease-in-out"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                className="hover:text-green-primary transition duration-150 ease-in-out"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                className="hover:text-green-primary transition duration-150 ease-in-out"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>

        {/* Footer Contact */}
        <div>
          <h3 className="text-lg font-bold mb-3">Contact</h3>
          <p>(021) 12345678</p>
          <p>Jakarta, Indonesia</p>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} BetterEats Jakarta, Indonesia
      </div>
    </footer>
  );
}
