const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const ADMIN_PIN = "9349";
const FILE = path.join(__dirname, "orders.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function orders() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

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

/* CREATE ORDER */
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
      message: "Fill all required fields."
    });
  }

  const data = orders();

  const order = {
    id: "ORD-" + Date.now().toString().slice(-8),
    name: name.trim(),
    phone: phone.trim(),
    email: email || "",
    city: city || "",
    service,
    budget: budget || "Not decided",
    delivery: delivery || "Normal",
    requirement: requirement.trim(),

    status: "Pending",
    paymentStatus: "Unpaid",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.unshift(order);
  save(data);

  res.json({
    success: true,
    order
  });
});

/* CUSTOMER TRACKING */
app.get("/api/track/:id", (req, res) => {
  const data = orders();

  const order = data.find(
    x => x.id.toLowerCase() === req.params.id.toLowerCase()
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  res.json({
    success: true,
    order
  });
});

/* ADMIN AUTH */
function auth(req, res, next) {
  if (req.headers["x-admin-pin"] !== ADMIN_PIN) {
    return res.status(401).json({
      success: false,
      message: "Invalid PIN"
    });
  }

  next();
}

/* ADMIN GET ORDERS */
app.get("/api/orders", auth, (req, res) => {
  res.json({
    success: true,
    orders: orders()
  });
});

/* ADMIN UPDATE STATUS / PAYMENT */
app.patch("/api/orders/:id", auth, (req, res) => {
  const data = orders();

  const order = data.find(
    x => x.id === req.params.id
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
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
      message: "Invalid status"
    });
  }

  if (
    req.body.paymentStatus &&
    !allowedPayment.includes(req.body.paymentStatus)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment status"
    });
  }

  if (req.body.status) {
    order.status = req.body.status;
  }

  if (req.body.paymentStatus) {
    order.paymentStatus = req.body.paymentStatus;
  }

  order.updatedAt = new Date().toISOString();

  save(data);

  res.json({
    success: true,
    order
  });
});

/* DELETE ORDER */
app.delete("/api/orders/:id", auth, (req, res) => {
  const data = orders();

  const filtered = data.filter(
    x => x.id !== req.params.id
  );

  if (filtered.length === data.length) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  save(filtered);

  res.json({
    success: true
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("╔══════════════════════════════════════╗");
  console.log("║          MAYUR SERVICES              ║");
  console.log("╠══════════════════════════════════════╣");
  console.log("║ Website : http://127.0.0.1:3000     ║");
  console.log("║ Order   : http://127.0.0.1:3000/order║");
  console.log("║ Track   : http://127.0.0.1:3000/track║");
  console.log("║ Admin   : http://127.0.0.1:3000/admin║");
  console.log("╚══════════════════════════════════════╝");
  console.log("");
});
