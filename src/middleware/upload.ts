import multer from "multer";

const upload = multer({
	storage: multer.memoryStorage(), // Загрузка файлов в память
	limits: {
		fileSize: 1024 * 1024 * 20, // Ограничение размера файла (20MB)
	},
});

export default upload;
