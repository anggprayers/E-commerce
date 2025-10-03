import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"), false);
};

const uploadMemory = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Match frontend fields: image1, image2, image3, image4
export const uploadMemoryFields = uploadMemory.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]);

export default uploadMemory;
