import Link from "next/link";

// web sitesinin üst kısmında (başlık) yer alacak bir navigasyon menüsü oluşturur.
export default function Header() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
                {/* My Blog Link */}
                <Link href="/" className="text-2xl font-bold">
                    My-Blog
                </Link>
                <div className="space-x-4">
                    {/* Home Link */}
                    <Link href="/" className="text-lg">
                        Home
                    </Link>
                    {/* Projects Link */}
                    <Link href="/projects" className="text-lg">
                        Projects
                    </Link>
                    {/* Contact Link */}
                    <Link href="/contact" className="text-lg">
                        Contact
                    </Link>
                </div>
            </nav>
        </header>
    );
}
