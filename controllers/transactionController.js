
import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction
        });

    } catch (err) {
        next(err);
    }
};

export const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({
            createdBy: req.user._id
        });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (err) {
        next(err);
    }
};



export const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                createdBy: req.user._id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction
        });

    } catch (err) {
        next(err);
    }
};



export const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully'
        });

    } catch (err) {
        next(err);
    }
};



export const getMonthlySummary = async (req, res, next) => {
    try {
        // Get year and month from query parameters
        const now = new Date();

        const year = Number(req.query.year ?? now.getUTCFullYear());
        const month = Number(req.query.month ?? now.getUTCMonth() + 1);

        // Validate year and month
        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            year < 2000 ||
            year > 2100 ||
            month < 1 ||
            month > 12
        ) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid year and month'
            });
        }

        // Calculate monthly date range
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));

        // MongoDB aggregation pipeline
        const summary = await Transaction.aggregate([
            {
                $match: {
                    createdBy: req.user._id,
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },

            {
                $group: {
                    _id: {
                        type: '$type',
                        category: '$category'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Calculate income and expenses
        let totalIncome = 0;
        let totalExpenses = 0;

        const incomeByCategory = [];
        const expensesByCategory = [];

        summary.forEach((item) => {

            if (item._id.type === 'income') {
                totalIncome += item.total;

                incomeByCategory.push({
                    category: item._id.category,
                    total: item.total,
                    count: item.count
                });
            }

            if (item._id.type === 'expense') {
                totalExpenses += item.total;

                expensesByCategory.push({
                    category: item._id.category,
                    total: item.total,
                    count: item.count
                });
            }
        });

        res.status(200).json({
            success: true,
            month,
            year,
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            incomeByCategory,
            expensesByCategory
        });

    } catch (err) {
        next(err);
    }
};
