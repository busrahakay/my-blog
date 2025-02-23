import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db"; // Veritabanı bağlantısı
import { OkPacket, RowDataPacket } from "mysql2";

//veri tabanı sorgusu burada yapılır. (proje silme-ekleme-güncelleme sorgusu)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const [results] = await db.query<RowDataPacket[]>("SELECT * FROM projects");
            return res.status(200).json(results); // Projeleri döndür
        } catch (err) {
            return res.status(500).json({ message: "Database error", error: (err as Error).message });
        }
    } else if (req.method === "POST") {
        const { title, description, url } = req.body;

        if (!title || !description || !url) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        try {
            const query = `INSERT INTO projects (title, description, url) VALUES (?, ?, ?)`;
            const [result] = await db.query<OkPacket>(query, [title, description, url]);
            return res.status(201).json({ id: result.insertId, title, description, url });
        } catch (err) {
            return res.status(500).json({ message: "Error inserting project", error: (err as Error).message });
        }
    } else if (req.method === "PUT") {
        const { id, title, description, url } = req.body;

        if (!id || !title || !description || !url) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        try {
            const query = `UPDATE projects SET title = ?, description = ?, url = ? WHERE id = ?`;
            const [result] = await db.query<OkPacket>(query, [title, description, url, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Project not found" });
            }

            return res.status(200).json({ id, title, description, url });
        } catch (err) {
            return res.status(500).json({ message: "Error updating project", error: (err as Error).message });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing project ID" });
        }

        try {
            const query = `DELETE FROM projects WHERE id = ?`;
            const [result] = await db.query<OkPacket>(query, [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Project not found" });
            }

            return res.status(200).json({ message: "Project deleted successfully" });
        } catch (err) {
            return res.status(500).json({ message: "Error deleting project", error: (err as Error).message });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
