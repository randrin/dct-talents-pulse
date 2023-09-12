import cloudinary from "cloudinary";
import config from "../config/index.js";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const uploadImages = async (req, res) => {
  await cloudinary.v2.uploader.upload(
    req.body.image,
    {
      public_id: `dct-image-${Date.now()}`,
      resource_type: "image", // jpeg, png
      chunk_size: 6000000,
    },
    (error, result) => {
      if (error) {
        return res.status(500).send({ success: false, error });
      }
      res.status(200).send({
        public_id: result.public_id,
        url: result.secure_url,
        version: result.version,
        signature: result.signature,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
        created_at: result.created_at,
        bytes: result.bytes,
        type: result.type,
        secure_url: result.secure_url,
      });
    }
  );
};

export const removeImage = async (req, res) => {
  let file_id = req.body.public_id;
  await cloudinary.v2.uploader.destroy(file_id, (error, result) => {
    if (error) {
      return res.status(500).send({ success: false, error });
    }
    res.status(200).send({});
  });
};
