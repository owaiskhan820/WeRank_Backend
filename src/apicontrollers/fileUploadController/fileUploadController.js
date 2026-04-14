// fileUploadController.js

import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { authMiddleware } from '../../utils/authentication/authentication.js';
import profileService from '../../services/profile/profile.js';


const router = Router();

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'WeRank',
      public_id: file.fieldname + '_' + Date.now(),
    };
  },
});

// Configure Multer middleware
const parser = multer({ storage: storage });

router.post('/updateProfilePicture', authMiddleware, parser.single('image'), async (req, res) => {
  const userId = req.user.id
  try {
    const imageUrl = req.file.path;

    console.log("uploaded successfuly", imageUrl)
    const response = await profileService.updateProfilePicture(userId, imageUrl)

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

export default router;
