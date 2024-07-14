import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

const envPath = process.env.NODE_ENV === "test" ? '.env.test' : '.env';
dotenv.config({ path: envPath });

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME, 
    api_key: API_KEY, 
    api_secret: API_SECRET
})

export default cloudinary;