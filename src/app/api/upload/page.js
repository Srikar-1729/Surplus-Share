
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

export const config = {
  api: {
    bodyParser: false, 
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing the file' });

    const file = files.image; // `image` is the name of the input field

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'receiver_orgs', // Optional: folder name in Cloudinary
      });
      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      return res.status(500).json({ error: 'Upload to Cloudinary failed' });
    }
  });
}