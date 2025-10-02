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
    image: "/images/productsImages/AllegionShlageOmnia_SatinNickel_Front_DigitsOn_Final_02.png.thumb.1280.1280_394x.webp"
  },
  {
    name: "Ultra-Secure Smart Lock Pro",
    descriptions: "Military-grade security with biometric authentication and tamper-proof design for maximum protection.",
    version: "v3.0",
    features: ["Fingerprint Scanner", "Facial Recognition", "Anti-Tamper Alarm", "Backup Key", "Weather Resistant"],
    price: 449.99,
    image: "/images/productsImages/imagesddwe-removebg-preview.png"
  },
  {
    name: "Modern Smart Lock Classic",
    descriptions: "Sleek and modern design with essential smart features for everyday convenience and security.",
    version: "v1.5",
    features: ["Bluetooth Control", "Keypad Entry", "Battery Backup", "Easy Installation", "LED Indicators"],
    price: 199.99,
    image: "/images/productsImages/images22-removebg-preview.png"
  },
  {
    name: "Premium Smart Lock Elite",
    descriptions: "High-end smart lock with premium materials and advanced connectivity options for luxury homes.",
    version: "v2.5",
    features: ["Zigbee Protocol", "HomeKit Compatible", "Stainless Steel", "Customizable Codes", "Activity Log"],
    price: 399.99,
    image: "/images/productsImages/imagesddwe-removebg-preview.png"
  },
  {
    name: "Compact Smart Lock Mini",
    descriptions: "Compact design perfect for apartments and small spaces without compromising on security features.",
    version: "v1.2",
    features: ["Compact Design", "Quick Setup", "Low Power Consumption", "Remote Monitoring", "Durable Build"],
    price: 149.99,
    image: "/images/productsImages/s-l1200-removebg-preview.png"
  },
  {
    name: "Smart Lock Web Series",
    descriptions: "Web-enabled smart lock with cloud connectivity and advanced remote management capabilities.",
    version: "v2.0",
    features: ["Cloud Storage", "Remote Updates", "Multi-User Management", "Geofencing", "Integration Hub"],
    price: 329.99,
    image: "/images/productsImages/smart_lock_web1-removebg-preview.png"
  },
  {
    name: "Designer Smart Lock Collection",
    descriptions: "Artistically designed smart lock that combines security with aesthetic appeal for modern homes.",
    version: "v1.8",
    features: ["Designer Finish", "Touch Interface", "Silent Operation", "Energy Efficient", "Warranty Included"],
    price: 279.99,
    image: "/images/productsImages/Untitled-design-48-1-removebg-preview.png"
  },
  {
    name: "Ruveno Slim Smart Lock",
    descriptions: "Ultra-slim smart lock with fingerprint technology and sleek design for modern homes.",
    version: "v2.3",
    features: ["Fingerprint Scanner", "Slim Design", "Bluetooth 5.0", "Long Battery Life", "Easy Installation"],
    price: 249.99,
    image: "/images/productsImages/Ruveno-Slim-Smart-Fingerprint-Door-Lock-eeb25cc-removebg-preview.png"
  },
  {
    name: "Smart Lock 64 Series",
    descriptions: "Advanced smart lock with multiple authentication methods and smart home integration.",
    version: "v1.9",
    features: ["Multi-Auth", "Smart Home Integration", "Weather Resistant", "Backup Power", "Mobile App"],
    price: 189.99,
    image: "/images/productsImages/64.png"
  },
  {
    name: "Smart Lock 65 Series",
    descriptions: "Professional-grade smart lock with enterprise features and advanced security protocols.",
    version: "v2.7",
    features: ["Enterprise Security", "Audit Trail", "Multi-User Management", "Cloud Sync", "API Integration"],
    price: 359.99,
    image: "/images/productsImages/65.png"
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
