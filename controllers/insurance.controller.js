const fs = require("fs");
const path = require("path");
const { getDb } = require("../Config/db.config");

exports.addInsuranceInquiry = async (req, res) => {
  const db = getDb();

  try {
    const {
      name,
      mobile,
      email,
      make,
      model,
      variant,
      rto_location,
      fuel_type,
      existing_insurance_company,
      ncb_expiring_policy,
      idv,
      claim_status,
    } = req.body;

    if (!name || !mobile || !email || !make || !model || !variant || !rto_location || !fuel_type || !existing_insurance_company || !ncb_expiring_policy || !idv || !claim_status) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    let fileData = null;
    if (req.file) {
      fileData = fs.readFileSync(req.file.path);
      fs.unlink(req.file.path, () => {});
    }

    const [result] = await db.query(
      `INSERT INTO insurance_inquiries
       (name, mobile, email, make, model, variant, rto_location, fuel_type, existing_insurance_company, ncb_expiring_policy, idv, claim_status, policy_copy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, mobile, email, make, model, variant, rto_location, fuel_type, existing_insurance_company, ncb_expiring_policy, idv, claim_status, fileData]
    );

    res.status(201).json({
      success: true,
      message: "Insurance inquiry saved successfully!",
      inquiry_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getPolicyFile = async (req, res) => {
  const db = getDb();
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT policy_copy FROM insurance_inquiries WHERE id = ?",
      [id]
    );

    if (!rows.length || !rows[0].policy_copy)
      return res.status(404).send("No file found");

    res.setHeader("Content-Type", "application/pdf");
    res.send(rows[0].policy_copy);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Server error" });
  }
};
