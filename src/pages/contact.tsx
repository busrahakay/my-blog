import { useEffect, useState } from "react";

//iletişim sayfası veritabanından gelen bilgiler ile gösterilir.
export default function Contact() {
    const [contactInfo, setContactInfo] = useState({
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        github: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // API'den iletişim bilgilerini çek
        const fetchContactInfo = async () => {
            try {
                const response = await fetch("/api/contact-info");
                if (!response.ok) {
                    throw new Error("Failed to fetch contact information.");
                }
                const data = await response.json();
                setContactInfo(data);
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, []);

    if (loading) {
        return <p>Loading contact information...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">Contact Me</h1>
            <p>If you want to reach out, you can contact me via:</p>
            <p className="text-lg text-blue-500">Email: {contactInfo.email}</p>
            <p className="text-lg">Phone: {contactInfo.phone}</p>
            <p className="text-lg">Address: {contactInfo.address}</p>
            {contactInfo.linkedin && (
                <p className="text-lg">
                    LinkedIn:{" "}
                    <a
                        href={contactInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {contactInfo.linkedin}
                    </a>
                </p>
            )}
            {contactInfo.github && (
                <p className="text-lg">
                    GitHub:{" "}
                    <a
                        href={contactInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {contactInfo.github}
                    </a>
                </p>
            )}
        </div>
    );
}
