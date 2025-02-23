type BlogPostProps = {
    title: string;
    content: string;
    published: boolean;
};

// bir blog yazısının başlığını, içeriğini ve yayınlanma durumunu gösterir.
export default function BlogPost({ title, content, published }: BlogPostProps) {
    return (
        <article className="border border-gray-300 p-4 rounded shadow-sm">
            <h2 className="text-xl font-bold">{title}</h2>
            <p>{content}</p>
            <p className="text-sm text-gray-500">
                Status: {published ? "Published" : "Draft"}
            </p>
        </article>
    );
}
