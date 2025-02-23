import { useEffect, useState } from "react";

//proje sayfası veritabanından gelen bilgiler ile gösterilir.
type Project = {
    id: number;
    title: string;
    description: string;
    url: string;
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // API'den projeleri çek
        const fetchProjects = async () => {
            try {
                const response = await fetch("/api/projects");
                if (!response.ok) {
                    throw new Error("Failed to fetch projects.");
                }
                const data: Project[] = await response.json();
                setProjects(data);
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return <p>Loading projects...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">Projects</h1>
            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="border p-4 rounded">
                        <h2 className="text-xl font-bold">{project.title}</h2>
                        <p>{project.description}</p>
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                        >
                            {project.url}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
