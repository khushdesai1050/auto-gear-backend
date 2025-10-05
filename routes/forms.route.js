const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/insurance_policies");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, "policy_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Import controllers
const { addCarLoanLead } = require("../controllers/car.loan");
const { addSellCarLead } = require("../controllers/sell.car.loan.form");
const { addInsuranceInquiry, getPolicyFile } = require("../controllers/insurance.controller");

// Routes
router.post("/inquiry", addCarLoanLead);
router.post("/sell-car", addSellCarLead);
router.post("/insurance-inquiry", upload.single("policy_copy"), addInsuranceInquiry);
router.get("/insurance-inquiry/:id", getPolicyFile);

module.exports = router;
