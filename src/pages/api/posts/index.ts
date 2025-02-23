import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../db";

//veri tabanından çekilirken kullanılan metotlar bulunur.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET metodu
    if (req.method === "GET") {
        try {
            const [rows] = await db.query("SELECT * FROM posts");
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching posts", error: (error as Error).message });
        }
    }

    // POST metodu
    if (req.method === "POST") {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        try {
            await db.query("INSERT INTO posts (title, content, published) VALUES (?, ?, ?)", [
                title,
                content,
                false, // Default olarak false, daha sonra güncellenebilir
            ]);
            return res.status(201).json({ message: "Post created successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error creating post", error: (error as Error).message });
        }
    }

    // DELETE metodu
    if (req.method === "DELETE") {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        try {
            const result = await db.query("DELETE FROM posts WHERE id = ?", [id]);

            // `result` tipini doğru şekilde belirlemek
            const affectedRows = (result as [any, any[]])[0].affectedRows;

            if (affectedRows === 0) {
                return res.status(404).json({ message: `Post with ID ${id} not found` });
            }

            return res.status(200).json({ message: "Post deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting post", error: (error as Error).message });
        }
    }

    // Diğer metodlar için 405 döndür
    res.status(405).json({ error: "Method not allowed" });
}
