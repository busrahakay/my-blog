import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db"; // Veritabanı bağlantısı
import { OkPacket, RowDataPacket } from "mysql2";

//veri tabanı sorgusu burada yapılır. (post silme-ekleme-güncelleme sorgusu)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Request Method:", req.method); // Hangi HTTP metodu kullanılıyor?
    console.log("Request Body:", req.body); // Gelen body içeriği

    if (req.method === "GET") {
        try {
            const [results] = await db.query<RowDataPacket[]>("SELECT * FROM posts");
            console.log("Fetched Posts:", results); // Gelen sonuçları logla
            return res.status(200).json(results);
        } catch (err) {
            console.error("Error fetching posts:", err);
            return res.status(500).json({ message: "Database error", error: (err as Error).message });
        }
    } else if (req.method === "POST") {
        const { title, content, published } = req.body;

        if (!title || !content) {
            console.log("Validation failed: Missing title or content");
            return res.status(400).json({ message: "Missing required fields: title or content" });
        }

        try {
            // Eğer kullanıcı `published` göndermiyorsa, varsayılan olarak false değerini ayarlayın.
            const query = `INSERT INTO posts (title, content, published) VALUES (?, ?, ?)`;
            const [result] = await db.query<OkPacket>(query, [title, content, published ?? false]);

            console.log("Inserted Post:", result);
            return res.status(201).json({
                id: result.insertId,
                title,
                content,
                published: published ?? false,
            });
        } catch (err) {
            console.error("Error inserting post:", err);
            return res.status(500).json({ message: "Error inserting post", error: (err as Error).message });
        }
    } else if (req.method === "PUT") {
        const { id, title, content, published } = req.body;

        // Gelen verilerin kontrolü
        if (!id || !title || !content) {
            console.error("Validation failed: Missing id, title, or content");
            return res.status(400).json({ message: "Missing required fields: id, title, or content" });
        }

        try {
            const query = `UPDATE posts SET title = ?, content = ?, published = ? WHERE id = ?`;
            const [result] = await db.query<OkPacket>(query, [title, content, published ?? false, id]);

            console.log("Update Result:", result);

            if (result.affectedRows === 0) {
                console.warn(`Post with ID ${id} not found`);
                return res.status(404).json({ message: `Post with ID ${id} not found` });
            }

            return res.status(200).json({
                id,
                title,
                content,
                published: published ?? false,
                message: "Post updated successfully"
            });
        } catch (err) {
            console.error("Error updating post:", err);
            return res.status(500).json({ message: "Error updating post", error: (err as Error).message });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.body;

        if (!id) {
            console.log("Validation failed: Missing post ID");
            return res.status(400).json({ message: "Missing post ID" });
        }

        try {
            const query = `DELETE FROM posts WHERE id = ?`;
            const [result] = await db.query<OkPacket>(query, [id]);

            console.log("Delete Result:", result);

            if (result.affectedRows === 0) {
                console.log(`Post with ID ${id} not found`);
                return res.status(404).json({ message: `Post with ID ${id} not found` });
            }

            return res.status(200).json({ message: "Post deleted successfully" });
        } catch (err) {
            console.error("Error deleting post:", err);
            return res.status(500).json({ message: "Error deleting post", error: (err as Error).message });
        }
    } else {
        console.log("Unsupported method:", req.method);
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
