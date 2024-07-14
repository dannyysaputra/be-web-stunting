import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (fileBuffer: Buffer, mimetype: string, folder: string) => {
    const fileBase64 = fileBuffer.toString('base64');
    const file = `data:${mimetype};base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(file, {
        folder: folder,
        use_filename: true,
    });

    console.log(result);

    return result;
};