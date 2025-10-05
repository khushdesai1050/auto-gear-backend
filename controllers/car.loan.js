// server/controllers/car.loan.js
const { getDb } = require("../Config/db.config.js");

exports.addCarLoanLead = async (req, res) => {
  try {
    const { name, mobile, email, make, model, variant, service } = req.body;

    const db = getDb(); // promise-based pool

    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Database not initialized",
      });
    }

    // Basic validation
    if (!name || !mobile || !email || !make || !model || !variant || !service) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Use async/await with promise-based query
    const [result] = await db.query(
      `INSERT INTO car_loan_inquiries 
      (name, mobile, email, make, model, variant, service)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, mobile, email, make, model, variant, service]
    );

    return res.status(200).json({
      success: true,
      message: "Inquiry saved successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
