
import express from 'express';

import { uploadProfilePicture } from '../controllers/uploadController.js';
import { protect } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();


/**
 * @swagger
 * /upload/profile-picture:
 *   post:
 *     summary: Upload profile picture
 *     description: Uploads a user's profile picture to Cloudinary and updates their profile.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePicture
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile picture uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     profilePicture:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/profile.jpg
 *                     publicId:
 *                       type: string
 *                       example: finance-tracker/profiles/abc123
 *       400:
 *         description: No file uploaded or invalid file format
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post(
    '/profile-picture',
    protect,
    upload.single('profilePicture'),
    uploadProfilePicture
);

export default router;
