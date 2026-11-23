
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';

// Upload profile picture
export const uploadProfilePicture = async (req, res, next) => {
    try {
        // Check whether a file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a profile picture'
            });
        }

        // Find authenticated user
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Upload image to Cloudinary using memory buffer
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'finance-tracker/profiles',
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            Readable.from(req.file.buffer).pipe(uploadStream);
        });

        // Save image information in MongoDB
        user.profilePicture = uploadResult.secure_url;
        user.profilePicturePublicId = uploadResult.public_id;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            data: {
                profilePicture: user.profilePicture,
                publicId: user.profilePicturePublicId
            }
        });

    } catch (err) {
        next(err);
    }
};
