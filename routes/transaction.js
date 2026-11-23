import express from 'express';
import { createTransaction, deleteTransaction, getMonthlySummary, getTransactions, updateTransaction } from '../controllers/transactionController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validateZod.js';
import { transactionValidationSchema } from '../schemas/transactionSchema.js';


const router = express.Router();

router.use(protect)

/**
 * @swagger
 * /transactions/monthly-summary:
 *   get:
 *     summary: Get monthly transaction summary
 *     description: Retrieves monthly income, expenses, and balance summary for the authenticated user.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 11
 *         description: Month number (1-12)
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *         description: Year of the summary
 *     responses:
 *       200:
 *         description: Monthly summary retrieved successfully
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
 *                     totalIncome:
 *                       type: number
 *                       example: 5000
 *                     totalExpense:
 *                       type: number
 *                       example: 2000
 *                     balance:
 *                       type: number
 *                       example: 3000
 *       400:
 *         description: Invalid month or year
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/monthly-summary', getMonthlySummary);



/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all user transactions
 *     description: Retrieves all transactions belonging to the authenticated user.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 674abc123456789abcdef123
 *                       type:
 *                         type: string
 *                         enum: [income, expense]
 *                         example: expense
 *                       category:
 *                         type: string
 *                         example: Food
 *                       amount:
 *                         type: number
 *                         example: 500
 *                       description:
 *                         type: string
 *                         example: Lunch with friends
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: string
 *                         example: 674abc123456789abcdef456
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal server error
 */

router.get('/', getTransactions);


/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Creates a new income or expense transaction for the authenticated user.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - category
 *               - amount
 *             properties:
 *               title:
 *                  type: string
 *                  example: Grocaries 
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Food
 *               amount:
 *                 type: number
 *                 example: 500
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-11-22"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid transaction data
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/', validate(transactionValidationSchema),createTransaction)

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     description: Updates an existing transaction belonging to the authenticated user.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: 674abc123456789abcdef123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Food
 *               amount:
 *                 type: number
 *                 example: 750
 *               description:
 *                 type: string
 *                 example: Updated lunch expense
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-11-22"
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Invalid transaction data or ID
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', validate(transactionValidationSchema), updateTransaction);


/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Deletes an existing transaction belonging to the authenticated user.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: 674abc123456789abcdef123
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       400:
 *         description: Invalid transaction ID
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteTransaction);



export default router