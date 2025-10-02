const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Allegion Schlage Omnia Smart Lock",
    descriptions: "Premium smart lock with advanced security features and seamless integration with your smart home ecosystem.",
    version: "v2.1",
    features: ["WiFi Connectivity", "Mobile App Control", "Voice Assistant Compatible", "Auto-Lock", "Guest Access"],
    price: 299.99,
    image: "/src/images/AllegionShlageOmnia_SatinNickel_Front_DigitsOn_Final_02.png.thumb.1280.1280_394x.webp"
  },
  {
    name: "Ultra-Secure Smart Lock Pro",
    descriptions: "Military-grade security with biometric authentication and tamper-proof design for maximum protection.",
    version: "v3.0",
    features: ["Fingerprint Scanner", "Facial Recognition", "Anti-Tamper Alarm", "Backup Key", "Weather Resistant"],
    price: 449.99,
    image: "/src/images/Hd43ab953807844cf9cabc6346c167e89V.avif"
  },
  {
    name: "Modern Smart Lock Classic",
    descriptions: "Sleek and modern design with essential smart features for everyday convenience and security.",
    version: "v1.5",
    features: ["Bluetooth Control", "Keypad Entry", "Battery Backup", "Easy Installation", "LED Indicators"],
    price: 199.99,
    image: "/src/images/images22.jpeg"
  },
  {
    name: "Premium Smart Lock Elite",
    descriptions: "High-end smart lock with premium materials and advanced connectivity options for luxury homes.",
    version: "v2.5",
    features: ["Zigbee Protocol", "HomeKit Compatible", "Stainless Steel", "Customizable Codes", "Activity Log"],
    price: 399.99,
    image: "/src/images/imagesddwe.jpeg"
  },
  {
    name: "Compact Smart Lock Mini",
    descriptions: "Compact design perfect for apartments and small spaces without compromising on security features.",
    version: "v1.2",
    features: ["Compact Design", "Quick Setup", "Low Power Consumption", "Remote Monitoring", "Durable Build"],
    price: 149.99,
    image: "/src/images/s-l1200.jpg"
  },
  {
    name: "Smart Lock Web Series",
    descriptions: "Web-enabled smart lock with cloud connectivity and advanced remote management capabilities.",
    version: "v2.0",
    features: ["Cloud Storage", "Remote Updates", "Multi-User Management", "Geofencing", "Integration Hub"],
    price: 329.99,
    image: "/src/images/smart_lock_web1.jpg"
  },
  {
    name: "Designer Smart Lock Collection",
    descriptions: "Artistically designed smart lock that combines security with aesthetic appeal for modern homes.",
    version: "v1.8",
    features: ["Designer Finish", "Touch Interface", "Silent Operation", "Energy Efficient", "Warranty Included"],
    price: 279.99,
    image: "/src/images/Untitled-design-48-1.png"
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedProducts();
