const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const ADMIN_PIN = "9349";
const FILE = path.join(__dirname, "orders.json");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function getOrders() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");

  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveOrders(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/* ================= PAGES ================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/order", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "order.html"));
});

app.get("/track", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "track.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

/* ================= CREATE ORDER ================= */

app.post("/api/orders", (req, res) => {

  const {
    name,
    phone,
    email,
    city,
    service,
    budget,
    delivery,
    requirement
  } = req.body;

  if (!name || !phone || !service || !requirement) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields."
    });
  }

  const data = getOrders();

  const order = {
    id: "ORD-" + Date.now().toString().slice(-8),

    name: String(name).trim(),
    phone: String(phone).trim(),
    email: String(email || "").trim(),
    city: String(city || "").trim(),

    service: String(service).trim(),
    budget: String(budget || "Not decided").trim(),
    delivery: String(delivery || "Normal").trim(),

    requirement: String(requirement).trim(),

    status: "Pending",
    paymentStatus: "Unpaid",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.unshift(order);

  saveOrders(data);

  res.json({
    success: true,
    order
  });
});

/* ================= CUSTOMER TRACKING ================= */

app.get("/api/track/:id", (req, res) => {

  const data = getOrders();

  const order = data.find(
    x => x.id.toLowerCase() ===
         req.params.id.toLowerCase()
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found."
    });
  }

  res.json({
    success: true,
    order
  });
});

/* ================= ADMIN AUTH ================= */

function adminAuth(req, res, next) {

  const pin = req.headers["x-admin-pin"];

  if (pin !== ADMIN_PIN) {
    return res.status(401).json({
      success: false,
      message: "Invalid Admin PIN."
    });
  }

  next();
}

/* ================= ADMIN ORDERS ================= */

app.get("/api/orders", adminAuth, (req, res) => {

  const data = getOrders();

  res.json({
    success: true,
    orders: data
  });
});

/* ================= ADMIN UPDATE ================= */

app.patch("/api/orders/:id", adminAuth, (req, res) => {

  const data = getOrders();

  const order = data.find(
    x => x.id === req.params.id
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found."
    });
  }

  const allowedStatus = [
    "Pending",
    "In Progress",
    "Review",
    "Completed",
    "Cancelled"
  ];

  const allowedPayment = [
    "Unpaid",
    "Payment Submitted",
    "Verified"
  ];

  if (
    req.body.status &&
    !allowedStatus.includes(req.body.status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status."
    });
  }

  if (
    req.body.paymentStatus &&
    !allowedPayment.includes(req.body.paymentStatus)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment status."
    });
  }

  if (req.body.status) {
    order.status = req.body.status;
  }

  if (req.body.paymentStatus) {
    order.paymentStatus = req.body.paymentStatus;
  }

  order.updatedAt = new Date().toISOString();

  saveOrders(data);

  res.json({
    success: true,
    order
  });
});

/* ================= DELETE ================= */

app.delete("/api/orders/:id", adminAuth, (req, res) => {

  const data = getOrders();

  const filtered = data.filter(
    x => x.id !== req.params.id
  );

  if (filtered.length === data.length) {
    return res.status(404).json({
      success: false,
      message: "Order not found."
    });
  }

  saveOrders(filtered);

  res.json({
    success: true
  });
});

/* ================= SERVER ================= */

app.listen(PORT, "0.0.0.0", () => {

  console.log("");
  console.log("╔══════════════════════════════════════╗");
  console.log("║          MAYUR SERVICES              ║");
  console.log("╠══════════════════════════════════════╣");
  console.log("║ HOME  : http://127.0.0.1:3000       ║");
  console.log("║ ORDER : http://127.0.0.1:3000/order ║");
  console.log("║ TRACK : http://127.0.0.1:3000/track ║");
  console.log("║ ADMIN : http://127.0.0.1:3000/admin ║");
  console.log("╚══════════════════════════════════════╝");
  console.log("");
});
