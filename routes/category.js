import express from "express";
import { getCategories } from "../controllers/categoryController.js";

const router = express.Router();


/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get predefined categories
 *     description: Returns available income and expense categories.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     expense:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [Food, Transportation, Shopping, Rent]
 *                     income:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [Salary, Business, Freelancing, Gift]
 */

// GET /categories
router.get("/", getCategories);

export default router;