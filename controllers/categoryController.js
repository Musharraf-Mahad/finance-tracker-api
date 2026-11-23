import categories from "../config/categories.js";

export const getCategories = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      error: error.message
    });
  }
};