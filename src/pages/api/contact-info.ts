import { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db";
import { OkPacket, RowDataPacket } from "mysql2";

//veri tabanı sorgusu burada yapılır. (iletişim bilgileri sorgusu)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const [results] = await db.query<RowDataPacket[]>("SELECT * FROM contact_info LIMIT 1");

            if (results.length === 0) {
                return res.status(404).json({ message: "Contact info not found" });
            }

            res.status(200).json(results[0]);
        } catch (err) {
            return res.status(500).json({ message: "Database error", error: (err as Error).message });
        }
    } else if (req.method === "POST") {
        const { email, phone, address, linkedin, github } = req.body;
        if (!email || !phone || !address || !linkedin || !github) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        try {
            const query = `
                UPDATE contact_info
                SET email = ?, phone = ?, address = ?, linkedin = ?, github = ?
                WHERE id = 1
            `;
            const [result] = await db.query<OkPacket>(query, [email, phone, address, linkedin, github]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Contact info not found" });
            }

            res.status(200).json({ email, phone, address, linkedin, github });
        } catch (err) {
            return res.status(500).json({ message: "Error updating contact info", error: (err as Error).message });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
