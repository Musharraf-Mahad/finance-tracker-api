import express from 'express';
import { login, register } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Musharraf
 *               email:
 *                 type: string
 *                 format: email
 *                 example: musharraf@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields or user already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: musharraf@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email or password is missing
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', login)


/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile of the currently authenticated user.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                   example: Profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65f123456789abcdef123456
 *                     name:
 *                       type: string
 *                       example: Musharraf
 *                     email:
 *                       type: string
 *                       example: musharraf@example.com
 *                     profilePicture:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/profile.jpg
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
})


export default router;