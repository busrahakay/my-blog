import { useEffect, useState } from "react";
import Link from "next/link"; // Link import ediliyor

//post sayfası veritabanından gelen bilgiler ile gösterilir.
type Post = {
    id: number;
    title: string;
    content: string;
    published: boolean;
};

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetch("/api/posts")
            .then((res) => res.json())
            .then((data: Post[]) => setPosts(data));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">Welcome to My Blog</h1>
            <div>
                <h2 className="text-2xl mb-4 text-yellow-500">Recent Posts</h2>
                {posts.map((post) => (
                    <div key={post.id} className="border p-4 rounded mb-4">
                        <h3 className="text-xl font-bold">{post.title}</h3>
                        <p>{post.content}</p>
                        <p className="text-sm text-gray-500">
                            Status: {post.published ? "Published" : "Draft"}
                        </p>
                    </div>
                ))}
            </div>
            {/*<div className="mt-8">*/}
            {/*    <h2 className="text-2xl mb-4">Explore More</h2>*/}
            {/*    <ul className="space-y-2">*/}
            {/*        <li>*/}
            {/*            <Link href="/projects" className="text-lg text-blue-500">*/}
            {/*                Projects*/}
            {/*            </Link>*/}
            {/*        </li>*/}
            {/*        <li>*/}
            {/*            <Link href="/contact" className="text-lg text-blue-500">*/}
            {/*                Contact*/}
            {/*            </Link>*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</div>*/}
        </div>
    );
}
