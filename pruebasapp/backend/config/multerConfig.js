// config/multerConfig.js
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); // Especifica la carpeta donde quieres almacenar las imágenes
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname); // Obtiene la extensión del archivo original
    const uniqueFilename = `${uuidv4()}${extension}`; // Genera un nombre de archivo único utilizando UUID
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

export default upload;
