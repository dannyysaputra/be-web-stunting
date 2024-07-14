import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const validateFileType = (allowedMimeTypes:string[]) => {
    return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if(allowedMimeTypes.includes(file.mimetype)){
            cb(null, true);
        } else {
            const err = new Error(`Only accepted file with type ${allowedMimeTypes.toString()}`) as any;
            cb(err, false)
        }
    }
}

const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    fileFilter: validateFileType(['image/bmp', 'image/jpeg', 'image/x-png', 'image/png', 'image/gif']),
    limits: { fileSize: 2000000 } //2mb
});

export default upload;