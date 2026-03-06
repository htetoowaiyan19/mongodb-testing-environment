const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "..", "local-data");

const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Riley",
  "Sam",
  "Casey",
  "Avery",
  "Jamie",
  "Parker",
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Seattle",
  "Boston",
  "Miami",
  "Austin",
  "Denver",
  "San Diego",
];

const categories = [
  "Electronics",
  "Books",
  "Home",
  "Sports",
  "Fashion",
  "Beauty",
  "Toys",
  "Office",
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function makeUsers(count) {
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const name = `${firstNames[i % firstNames.length]} ${index}`;
    return {
      userId: `U${String(index).padStart(4, "0")}`,
      name,
      email: `user${index}@demo.local`,
      age: 18 + (i % 40),
      city: cities[i % cities.length],
      active: i % 3 !== 0,
      score: 50 + (i % 51),
      joinedAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
    };
  });
}

function makeProducts(count) {
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const price = Number((10 + (i % 90) * 1.25).toFixed(2));
    return {
      productId: `P${String(index).padStart(4, "0")}`,
      name: `Product ${index}`,
      category: categories[i % categories.length],
      price,
      stock: 10 + (i % 70),
      rating: Number((3 + (i % 20) / 10).toFixed(1)),
      discontinued: i % 17 === 0,
      tags: [
        categories[i % categories.length].toLowerCase(),
        i % 2 === 0 ? "featured" : "standard",
      ],
    };
  });
}

function makeOrders(count) {
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const quantity = 1 + (i % 5);
    const unitPrice = Number((12 + (i % 80) * 1.1).toFixed(2));
    const total = Number((quantity * unitPrice).toFixed(2));
    return {
      orderId: `O${String(index).padStart(5, "0")}`,
      userId: `U${String((i % 150) + 1).padStart(4, "0")}`,
      productId: `P${String((i % 150) + 1).padStart(4, "0")}`,
      quantity,
      unitPrice,
      total,
      status: ["pending", "paid", "shipped", "completed"][i % 4],
      createdAt: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
    };
  });
}

function writeJson(fileName, data) {
  fs.writeFileSync(
    path.join(outputDir, fileName),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

ensureDir(outputDir);
writeJson("demo_users.json", makeUsers(150));
writeJson("demo_products.json", makeProducts(150));
writeJson("demo_orders.json", makeOrders(150));

console.log("Sample JSON data generated in local-data/ (450 total objects).");
