import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import fs from "fs";

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

export async function POST(req) {
  const form = formidable({ multiples: false });

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve(
          NextResponse.json(
            { error: "Error parsing the file" },
            { status: 500 }
          )
        );
        return;
      }

      const file = files.image;

      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "receiver_orgs",
        });

        resolve(
          NextResponse.json(
            { url: result.secure_url },
            { status: 200 }
          )
        );
      } catch (error) {
        resolve(
          NextResponse.json(
            { error: "Upload to Cloudinary failed" },
            { status: 500 }
          )
        );
      }
    });
  });
}