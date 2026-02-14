import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/productModel'; 
import User from '../models/userModel';      

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sharedImages = [
    { url: "https://www.ryderwear.com/cdn/shop/products/advance-oversized-t-shirt-black-clothing-ryderwear-285430_1080x.jpg", public_alt: "Black T-Shirt Front" },
    { url: "http://placehold.co/300x300/FF5733/FFFFFF/png", public_alt: "Black T-Shirt Alt 1" },
    { url: "http://placehold.co/300x300/33FF57/FFFFFF/png", public_alt: "Black T-Shirt Alt 2" },
    { url: "http://placehold.co/300x300/3357FF/FFFFFF/png", public_alt: "Black T-Shirt Alt 3" }
];

const adjectives = ["Premium", "Essential", "Urban", "Vintage", "Classic", "Midnight", "Elite", "Street"];
const styles = ["Oversized", "Slim Fit", "Heavyweight", "Relaxed", "Boxy", "Signature"];
const descriptions = [
  "Crafted from premium organic cotton for a soft feel and durable finish.",
  "Designed with a modern silhouette, perfect for versatile street styling.",
  "Features reinforced stitching and a breathable fabric for all-day comfort.",
  "A minimalist staple for your wardrobe, engineered for longevity and style.",
  "This piece combines luxury aesthetics with everyday functionality."
];

// YOUR UPDATED CATEGORY LIST
const categories = ["t-shirt", "hoodie", "shirt", "gym", "short", "jeans"];

const seedProducts = Array.from({ length: 20 }).map((_, i) => {
  // Cycle through the 6 categories
  const category = categories[i % categories.length];
  
  const adj = adjectives[i % adjectives.length];
  const style = styles[i % styles.length];
  
  // Logical naming based on category
  let itemType = category;
  if (category === "t-shirt") itemType = "Tee";
  if (category === "gym") itemType = "Performance Gear";
  if (category === "jeans") itemType = "Denim";

  const name = i === 0 ? "Midnight Vibe Black Tee" : `${adj} ${style} ${itemType}`;

  const descBase = descriptions[i % descriptions.length];
  const description = `${descBase} This ${category} is ideal for those who value ${adj.toLowerCase()} comfort and a ${style.toLowerCase()} look.`;

  return {
    name,
    description,
    category,
    colors: ["#000000", "#36454F", "#808080"], 
    sizes: ["S", "M", "L", "XL"],
    price: Math.floor(Math.random() * (95 - 25) + 25), 
    images: sharedImages,
    instock_count: Math.floor(Math.random() * 30) + 2,
    is_new_arrival: i < 8,
    is_featured: i % 3 === 0,
    rating_count: Math.floor(Math.random() * 150),
  };
});

const importData = async () => {
    try {
        const DB = process.env.LOCAL_MONGO_URI || 'mongodb://db:27017/your_db_name';
        console.log('Connecting to DB...');
        await mongoose.connect(DB);

        await Product.deleteMany();
        console.log('🗑️ Existing products cleared.');
        
        const adminUser = await User.findOne();
        
        if (!adminUser) {
            console.error('❌ Error: No user found. Please register a user in your app first.');
            process.exit(1);
        }

        const productsWithUser = seedProducts.map(p => ({
            ...p,
            user: adminUser._id
        }));

        await Product.insertMany(productsWithUser);

        console.log(`✅ 20 Products seeded successfully across categories: ${categories.join(', ')}!`);
        process.exit();
    } catch (error) {
        console.error('❌ Error with data import:', error);
        process.exit(1);
    }
};

importData();