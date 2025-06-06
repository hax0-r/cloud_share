// /pages/api/deleteMedia.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: "deo5ex1zo",
    api_key: "812315141563513",
    api_secret: "NqxjOcXN2jGixdMXz2L7ZVG3wzI",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { publicId } = req.body;

    if (!publicId) return res.status(400).json({ error: 'Missing publicId' });

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return res.status(200).json({ result });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete from Cloudinary', details: error });
    }
}
