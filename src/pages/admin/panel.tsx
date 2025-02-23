import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ContentState, convertFromHTML, convertToRaw } from "draft-js";
import MyEditor from "../../components/MyEditor";  // Az önce oluşturduğumuz editör bileşeni

//admin panelinin tüm sayfalarının arayüzü ve bütün buton tasarımları burada yapılır.
type Post = {
    id: number;
    title: string;
    content: string;
    published: boolean;
};

type ContactInfo = {
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
};

type Project = {
    id: number;
    title: string;
    description: string;
    url: string;
};

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState("contact");
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState({ title: "", content: "", published: false });
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        github: "",
    });
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProject, setNewProject] = useState({ title: "", description: "", url: "" });
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [fontStyle, setFontStyle] = useState(localStorage.getItem("fontStyle") || "serif");
    const [fontWeight, setFontWeight] = useState(localStorage.getItem("fontWeight") || "normal");

    const router = useRouter();

    useEffect(() => {
        if (sessionStorage.getItem("isAdmin") !== "true") {
            router.push("/admin");
        } else {
            fetch("/api/posts").then((res) => res.json()).then(setPosts);
            fetch("/api/contact-info").then((res) => res.json()).then(setContactInfo);
            fetch("/api/projects").then((res) => res.json()).then(setProjects);
        }
        document.body.style.fontFamily = fontStyle;
        document.body.style.fontWeight = fontWeight;
    }, [router, fontStyle, fontWeight]);

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = editingPost || newPost;
        if (!payload.title.trim() || !payload.content.trim()) {
            alert("Title and content cannot be empty.");
            return;
        }

        const response = await fetch("/api/posts_old", {
            method: editingPost ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert(editingPost ? "Post updated successfully" : "Post added successfully");
            fetch("/api/posts").then((res) => res.json()).then(setPosts);
            setNewPost({ title: "", content: "", published: false });
            setEditingPost(null);
        } else {
            const error = await response.json();
            alert(`Failed: ${error.message}`);
        }
    };

    const deletePost = async (id: number) => {
        const response = await fetch("/api/posts", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (response.ok) {
            alert("Post deleted successfully");
            setPosts(posts.filter((post) => post.id !== id));
        } else {
            const error = await response.json();
            alert(`Failed to delete post: ${error.message}`);
        }
    };

    const editPost = (post: Post) => {
        setEditingPost(post);
    };

    const handleContactInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("/api/contact-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contactInfo),
        });
        if (response.ok) {
            alert("Contact info updated successfully");
        } else {
            const error = await response.json();
            alert(`Failed to update contact info: ${error.message}`);
        }
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = editingProject || newProject;
        if (!payload.title.trim() || !payload.description.trim()) {
            alert("Title and description cannot be empty.");
            return;
        }

        const response = await fetch("/api/projects", {
            method: editingProject ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            alert(editingProject ? "Project updated successfully" : "Project added successfully");
            fetch("/api/projects").then((res) => res.json()).then(setProjects);
            setNewProject({ title: "", description: "", url: "" });
            setEditingProject(null);
        } else {
            const error = await response.json();
            alert(`Failed: ${error.message}`);
        }
    };

    const deleteProject = async (id: number) => {
        const response = await fetch("/api/projects", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (response.ok) {
            alert("Project deleted successfully");
            setProjects(projects.filter((project) => project.id !== id));
        } else {
            const error = await response.json();
            alert(`Failed to delete project: ${error.message}`);
        }
    };

    const editProject = (project: Project) => {
        setEditingProject(project);
    };

    const handleFontStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFontStyle = e.target.value;
        setFontStyle(newFontStyle);
        localStorage.setItem("fontStyle", newFontStyle);  // Store user preference
    };

    const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFontWeight = e.target.value;
        setFontWeight(newFontWeight);
        localStorage.setItem("fontWeight", newFontWeight);  // Store user preference
    };

    return (
        <div className="flex">
            {/* Navbar */}
            <nav className="w-1/5 min-h-screen bg-gray-100 p-4">
                <h1 className="text-2xl font-bold text-center text-gray-600 border-b-2 border-gray-300 pb-2">
                    Admin Panel
                </h1>
                <ul className="space-y-4">
                    <li>
                        <button
                            className={`w-full text-left p-2 rounded ${
                                activeTab === "contact" ? "bg-blue-500 text-white" : "bg-white text-black"
                            }`}
                            onClick={() => setActiveTab("contact")}
                        >
                            Contact Info
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full text-left p-2 rounded ${
                                activeTab === "posts" ? "bg-blue-500 text-white" : "bg-white text-black"
                            }`}
                            onClick={() => setActiveTab("posts")}
                        >
                            Posts
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full text-left p-2 rounded ${
                                activeTab === "projects" ? "bg-blue-500 text-white" : "bg-white text-black"
                            }`}
                            onClick={() => setActiveTab("projects")}
                        >
                            Projects
                        </button>
                    </li>
                </ul>

                {/* Font Style and Weight Selection */}
                <div className="mt-4">
                    <label className="block">Font Style:</label>
                    <select onChange={handleFontStyleChange} value={fontStyle} className="w-full p-2 mt-2 border rounded">
                        <option value="serif">Serif</option>
                        <option value="sans-serif">Sans-serif</option>
                        <option value="monospace">Monospace</option>
                    </select>
                </div>
                <div className="mt-4">
                    <label className="block">Font Weight:</label>
                    <select onChange={handleFontWeightChange} value={fontWeight} className="w-full p-2 mt-2 border rounded">
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="lighter">Lighter</option>
                    </select>
                </div>
            </nav>

            {/* Main Content */}
            <main className="w-3/4 p-4">
                {/* Contact Info Tab */}
                {activeTab === "contact" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Contact Info</h1>
                        <form onSubmit={handleContactInfoSubmit} className="space-y-4 mb-8">
                            <input
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                placeholder="Email"
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                value={contactInfo.phone}
                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                placeholder="Phone"
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                value={contactInfo.address}
                                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                                placeholder="Address"
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                value={contactInfo.linkedin}
                                onChange={(e) => setContactInfo({ ...contactInfo, linkedin: e.target.value })}
                                placeholder="LinkedIn"
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                value={contactInfo.github}
                                onChange={(e) => setContactInfo({ ...contactInfo, github: e.target.value })}
                                placeholder="GitHub"
                                className="w-full p-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="w-full p-2 bg-blue-500 text-white rounded"
                            >
                                Save
                            </button>
                        </form>
                    </div>
                )}

                {/* Posts Tab */}
                {activeTab === "posts" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Posts</h1>
                        <form onSubmit={handlePostSubmit} className="space-y-4 mb-8">
                            <input
                                type="text"
                                value={editingPost ? editingPost.title : newPost.title}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    editingPost
                                        ? setEditingPost({...editingPost, title: value})
                                        : setNewPost({...newPost, title: value});
                                }}
                                placeholder="Title"
                                className="w-full p-2 border rounded"
                            />
                            <textarea
                                value={editingPost ? editingPost.content : newPost.content}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    editingPost
                                        ? setEditingPost({...editingPost, content: value})
                                        : setNewPost({...newPost, content: value});
                                }}
                                placeholder="Content"
                                className="w-full p-2 border rounded"
                            />
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editingPost ? editingPost.published : newPost.published}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        editingPost
                                            ? setEditingPost({...editingPost, published: checked})
                                            : setNewPost({...newPost, published: checked});
                                    }}
                                />
                                <span className="ml-2">Published</span>
                            </label>
                            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                                {editingPost ? "Update Post" : "Add Post"}
                            </button>
                        </form>

                        <ul>
                            {posts.map((post) => (
                                <li key={post.id} className="border-b py-2 flex justify-between">
                                    <span>{post.title}</span>
                                    <div>
                                        <button
                                            onClick={() => editPost(post)}
                                            className="px-4 py-1 bg-yellow-500 text-white rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deletePost(post.id)}
                                            className="px-4 py-1 bg-red-500 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === "projects" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Projects</h1>
                        <form onSubmit={handleProjectSubmit} className="space-y-4 mb-8">
                            <input
                                type="text"
                                value={editingProject ? editingProject.title : newProject.title}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    editingProject
                                        ? setEditingProject({...editingProject, title: value})
                                        : setNewProject({...newProject, title: value});
                                }}
                                placeholder="Project Title"
                                className="w-full p-2 border rounded"
                            />
                            <textarea
                                value={editingProject ? editingProject.description : newProject.description}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    editingProject
                                        ? setEditingProject({...editingProject, description: value})
                                        : setNewProject({...newProject, description: value});
                                }}
                                placeholder="Project Description"
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="url"
                                value={editingProject ? editingProject.url : newProject.url}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    editingProject
                                        ? setEditingProject({...editingProject, url: value})
                                        : setNewProject({...newProject, url: value});
                                }}
                                placeholder="Project URL"
                                className="w-full p-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="w-full p-2 bg-blue-500 text-white rounded"
                            >
                                {editingProject ? "Update Project" : "Add Project"}
                            </button>
                        </form>

                        {projects.map((project) => (
                            <div key={project.id} className="border-b-2 mb-4 pb-4">
                                <h2 className="text-xl font-semibold">{project.title}</h2>
                                <p className="text-gray-700">{project.description}</p>
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View Project
                                </a>
                                <div className="mt-2 flex space-x-2">
                                    <button
                                        onClick={() => editProject(project)}
                                        className="px-4 py-1 bg-yellow-500 text-white rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteProject(project.id)}
                                        className="px-4 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
