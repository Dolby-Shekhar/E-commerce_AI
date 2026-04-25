const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Electronics', description: 'Gadgets and electronic devices', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400' },
  { name: 'Fashion', description: 'Clothing and accessories', image: 'https://images.unsplash.com/photo-1445205170230-053830a000a5?w=400' },
  { name: 'Home & Kitchen', description: 'Home appliances and kitchen items', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400' },
  { name: 'Books', description: 'Books and educational materials', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
  { name: 'Sports & Fitness', description: 'Sports equipment and fitness gear', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400' }
];

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    price: 2499,
    originalPrice: 3999,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    brand: 'SoundMax',
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    tags: ['electronics', 'headphones', 'wireless', 'bluetooth'],
    features: ['Noise Cancellation', '30hr Battery', 'Wireless'],
    specifications: { driver: '40mm', impedance: '32 Ohm', battery: '500mAh' },
    discount: 37
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor and GPS.',
    price: 3999,
    originalPrice: 5999,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    brand: 'TechFit',
    stock: 30,
    rating: 4.3,
    numReviews: 85,
    tags: ['electronics', 'smartwatch', 'fitness', 'wearable'],
    features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
    specifications: { display: '1.4 inch AMOLED', battery: '7 days', waterResistance: '5ATM' },
    discount: 33
  },
  {
    name: "Men's Casual Shirt",
    description: 'Comfortable cotton casual shirt perfect for everyday wear.',
    price: 799,
    originalPrice: 1299,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'],
    brand: 'UrbanWear',
    stock: 100,
    rating: 4.2,
    numReviews: 64,
    tags: ['fashion', 'shirt', 'men', 'casual'],
    features: ['100% Cotton', 'Breathable', 'Regular Fit'],
    specifications: { material: 'Cotton', fit: 'Regular', sleeve: 'Full Sleeve' },
    discount: 38
  },
  {
    name: 'Stainless Steel Cookware Set',
    description: 'Complete 5-piece stainless steel cookware set for your kitchen.',
    price: 1899,
    originalPrice: 2999,
    images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400'],
    brand: 'KitchenPro',
    stock: 25,
    rating: 4.6,
    numReviews: 42,
    tags: ['kitchen', 'cookware', 'stainless steel', 'cooking'],
    features: ['Induction Friendly', 'Dishwasher Safe', '5 Pieces'],
    specifications: { pieces: '5', material: 'Stainless Steel', compatible: 'Gas, Induction' },
    discount: 36
  },
  {
    name: 'Programming Book Bundle',
    description: 'Collection of essential programming books for beginners and professionals.',
    price: 1299,
    originalPrice: 1999,
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'],
    brand: 'TechBooks',
    stock: 40,
    rating: 4.7,
    numReviews: 156,
    tags: ['books', 'programming', 'education', 'coding'],
    features: ['Beginner Friendly', 'Includes Projects', 'Latest Edition'],
    specifications: { pages: '1200+', language: 'English', format: 'Paperback' },
    discount: 35
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick non-slip yoga mat for home and studio practice.',
    price: 899,
    originalPrice: 1499,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'],
    brand: 'FitLife',
    stock: 60,
    rating: 4.4,
    numReviews: 98,
    tags: ['sports', 'fitness', 'yoga', 'mat'],
    features: ['Non-slip', 'Extra Thick', 'Eco-friendly'],
    specifications: { thickness: '8mm', material: 'TPE', dimensions: '183 x 61 cm' },
    discount: 40
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
    price: 599,
    originalPrice: 999,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'],
    brand: 'TechGear',
    stock: 75,
    rating: 4.1,
    numReviews: 203,
    tags: ['electronics', 'mouse', 'wireless', 'computer'],
    features: ['Ergonomic', '2.4GHz Wireless', '1600 DPI'],
    specifications: { dpi: '1600', battery: '12 months', connection: 'USB Receiver' },
    discount: 40
  },
  {
    name: "Women's Running Shoes",
    description: 'Lightweight running shoes with cushioned sole for maximum comfort.',
    price: 1599,
    originalPrice: 2499,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    brand: 'RunFast',
    stock: 45,
    rating: 4.3,
    numReviews: 72,
    tags: ['fashion', 'shoes', 'women', 'running'],
    features: ['Cushioned Sole', 'Breathable Mesh', 'Lightweight'],
    specifications: { upper: 'Mesh', sole: 'Rubber', weight: '250g' },
    discount: 36
  },
  {
    name: 'Coffee Maker Machine',
    description: 'Automatic drip coffee maker with programmable timer and thermal carafe.',
    price: 3299,
    originalPrice: 4999,
    images: ['https://images.unsplash.com/photo-1517080319-aaf63e76c88d?w=400'],
    brand: 'BrewMaster',
    stock: 20,
    rating: 4.5,
    numReviews: 55,
    tags: ['kitchen', 'coffee', 'appliance', 'home'],
    features: ['Programmable', 'Thermal Carafe', '12 Cup Capacity'],
    specifications: { capacity: '1.5L', power: '900W', warranty: '2 Years' },
    discount: 34
  },
  {
    name: 'Gaming Laptop',
    description: 'High-performance gaming laptop with RTX graphics and 144Hz display.',
    price: 74999,
    originalPrice: 89999,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400'],
    brand: 'GamePro',
    stock: 15,
    rating: 4.6,
    numReviews: 34,
    tags: ['electronics', 'laptop', 'gaming', 'computer'],
    features: ['RTX 4060', '144Hz Display', 'RGB Keyboard'],
    specifications: { processor: 'Intel i7', ram: '16GB', storage: '512GB SSD' },
    discount: 16
  },
  {
    name: 'Backpack',
    description: 'Water-resistant laptop backpack with multiple compartments.',
    price: 999,
    originalPrice: 1599,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    brand: 'TravelMate',
    stock: 80,
    rating: 4.0,
    numReviews: 112,
    tags: ['fashion', 'backpack', 'travel', 'accessories'],
    features: ['Water Resistant', 'Laptop Compartment', 'USB Port'],
    specifications: { capacity: '25L', material: 'Polyester', laptopSize: '15.6 inch' },
    discount: 37
  },
  {
    name: 'Novel Collection',
    description: 'Set of 5 bestselling fiction novels from award-winning authors.',
    price: 899,
    originalPrice: 1499,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'],
    brand: 'ClassicReads',
    stock: 35,
    rating: 4.5,
    numReviews: 89,
    tags: ['books', 'novel', 'fiction', 'reading'],
    features: ['Bestsellers', 'Award Winning', 'Paperback'],
    specifications: { books: '5', pages: '1500+', language: 'English' },
    discount: 40
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Latest flagship smartphone with titanium design, A17 Pro chip, and 48MP camera system.',
    price: 159999,
    originalPrice: 179999,
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400'],
    brand: 'Apple',
    stock: 20,
    rating: 4.8,
    numReviews: 342,
    tags: ['electronics', 'mobile', 'phone', 'smartphone'],
    features: ['A17 Pro Chip', '48MP Camera', 'Titanium Design'],
    specifications: { display: '6.7 inch OLED', storage: '256GB', battery: '4422mAh' },
    discount: 11
  },
  {
    name: 'Samsung 55" 4K Smart TV',
    description: 'Crystal UHD 4K Smart TV with HDR10+ and built-in Alexa voice control.',
    price: 45999,
    originalPrice: 64999,
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400'],
    brand: 'Samsung',
    stock: 12,
    rating: 4.4,
    numReviews: 89,
    tags: ['electronics', 'tv', 'television', 'smart tv'],
    features: ['4K UHD', 'HDR10+', 'Built-in Alexa'],
    specifications: { screen: '55 inch', resolution: '3840x2160', refreshRate: '60Hz' },
    discount: 29
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with 8 microphones.',
    price: 29990,
    originalPrice: 34990,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'],
    brand: 'Sony',
    stock: 18,
    rating: 4.7,
    numReviews: 267,
    tags: ['electronics', 'headphones', 'noise cancelling', 'wireless'],
    features: ['8 Mics', '30hr Battery', 'LDAC Support'],
    specifications: { driver: '30mm', weight: '250g', connectivity: 'Bluetooth 5.2' },
    discount: 14
  },
  {
    name: "Men's Slim Fit Jeans",
    description: 'Classic slim fit denim jeans with stretch comfort and modern wash.',
    price: 1299,
    originalPrice: 2199,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
    brand: 'LeviStyle',
    stock: 85,
    rating: 4.1,
    numReviews: 156,
    tags: ['fashion', 'jeans', 'men', 'denim'],
    features: ['Stretch Comfort', 'Slim Fit', 'Modern Wash'],
    specifications: { material: '98% Cotton, 2% Elastane', fit: 'Slim', rise: 'Mid' },
    discount: 40
  },
  {
    name: "Women's Handbag Leather",
    description: 'Genuine leather handbag with multiple compartments and gold-tone hardware.',
    price: 2499,
    originalPrice: 4499,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],
    brand: 'LuxeBag',
    stock: 40,
    rating: 4.3,
    numReviews: 78,
    tags: ['fashion', 'handbag', 'women', 'accessories'],
    features: ['Genuine Leather', 'Multiple Pockets', 'Gold Hardware'],
    specifications: { material: 'Genuine Leather', size: 'Medium', strap: 'Adjustable' },
    discount: 44
  },
  {
    name: 'NutriBlender Pro',
    description: 'High-speed blender for smoothies, shakes, and food processing with 1200W motor.',
    price: 3499,
    originalPrice: 5499,
    images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400'],
    brand: 'NutriChef',
    stock: 30,
    rating: 4.5,
    numReviews: 134,
    tags: ['kitchen', 'blender', 'appliance', 'mixer'],
    features: ['1200W Motor', 'BPA Free', 'Pulse Function'],
    specifications: { power: '1200W', speed: '24000 RPM', jars: '2' },
    discount: 36
  },
  {
    name: 'Air Fryer 5L',
    description: 'Digital air fryer with rapid air technology for healthy frying with little to no oil.',
    price: 4999,
    originalPrice: 7999,
    images: ['https://images.unsplash.com/photo-1626147116986-4601771470a6?w=400'],
    brand: 'HealthCook',
    stock: 22,
    rating: 4.6,
    numReviews: 198,
    tags: ['kitchen', 'air fryer', 'appliance', 'healthy'],
    features: ['5L Capacity', 'Digital Touch', 'Rapid Air'],
    specifications: { capacity: '5 Litres', power: '1500W', temperature: '80-200C' },
    discount: 37
  },
  {
    name: 'Science Encyclopedia',
    description: 'Comprehensive illustrated science encyclopedia covering Physics, Chemistry, Biology, and Astronomy.',
    price: 1599,
    originalPrice: 2499,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
    brand: 'EduWorld',
    stock: 50,
    rating: 4.8,
    numReviews: 112,
    tags: ['books', 'science', 'education', 'reference'],
    features: ['Illustrated', 'Comprehensive', 'Hardcover'],
    specifications: { pages: '800', format: 'Hardcover', age: '10+' },
    discount: 36
  },
  {
    name: 'Dumbbell Set 10kg',
    description: 'Adjustable dumbbell set with non-slip grip for home gym workouts.',
    price: 1299,
    originalPrice: 1999,
    images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400'],
    brand: 'PowerLift',
    stock: 60,
    rating: 4.2,
    numReviews: 87,
    tags: ['sports', 'fitness', 'dumbbell', 'gym'],
    features: ['Adjustable', 'Non-slip Grip', 'Home Gym'],
    specifications: { weight: '10kg', material: 'Cast Iron', grip: 'Neoprene' },
    discount: 35
  },
  {
    name: 'Treadmill Foldable',
    description: 'Electric folding treadmill with LCD display and 12 preset workout programs.',
    price: 24999,
    originalPrice: 39999,
    images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400'],
    brand: 'RunMaster',
    stock: 8,
    rating: 4.4,
    numReviews: 45,
    tags: ['sports', 'fitness', 'treadmill', 'cardio'],
    features: ['Foldable', '12 Programs', 'LCD Display'],
    specifications: { motor: '2HP', speed: '1-14 km/h', weightCapacity: '100kg' },
    discount: 37
  },
  {
    name: 'iPad Air 5',
    description: '10.9-inch iPad Air with M1 chip, Liquid Retina display, and Apple Pencil support.',
    price: 54900,
    originalPrice: 59900,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
    brand: 'Apple',
    stock: 14,
    rating: 4.7,
    numReviews: 189,
    tags: ['electronics', 'tablet', 'ipad', 'mobile'],
    features: ['M1 Chip', 'Liquid Retina', 'Apple Pencil'],
    specifications: { display: '10.9 inch', chip: 'M1', storage: '64GB' },
    discount: 8
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Gaming mechanical keyboard with hot-swappable switches and per-key RGB lighting.',
    price: 3499,
    originalPrice: 4999,
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=400'],
    brand: 'KeyChron',
    stock: 28,
    rating: 4.5,
    numReviews: 156,
    tags: ['electronics', 'keyboard', 'gaming', 'mechanical'],
    features: ['Hot-swappable', 'Per-key RGB', 'USB-C'],
    specifications: { switches: 'Red', layout: '87 Key', connection: 'Wired/USB-C' },
    discount: 30
  },
  {
    name: "Women's Silk Saree",
    description: 'Pure Banarasi silk saree with intricate zari work and rich pallu design.',
    price: 3499,
    originalPrice: 6999,
    images: ['https://images.unsplash.com/photo-1610030469983-98e66df39c39?w=400'],
    brand: 'EthnicElegance',
    stock: 25,
    rating: 4.6,
    numReviews: 92,
    tags: ['fashion', 'saree', 'women', 'ethnic'],
    features: ['Pure Silk', 'Zari Work', 'Banarasi'],
    specifications: { material: 'Banarasi Silk', length: '6.3m', blouse: 'Included' },
    discount: 50
  },
  {
    name: 'Microwave Oven 25L',
    description: 'Convection microwave oven with auto-cook menus and child lock safety.',
    price: 8999,
    originalPrice: 12999,
    images: ['https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400'],
    brand: 'MicroChef',
    stock: 16,
    rating: 4.3,
    numReviews: 67,
    tags: ['kitchen', 'microwave', 'appliance', 'cooking'],
    features: ['Convection', 'Auto Cook', 'Child Lock'],
    specifications: { capacity: '25L', power: '900W', type: 'Convection' },
    discount: 30
  },
  {
    name: 'Cricket Bat English Willow',
    description: 'Grade 1 English willow cricket bat with premium grip and full profile.',
    price: 4999,
    originalPrice: 7999,
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400'],
    brand: 'WillowPro',
    stock: 20,
    rating: 4.5,
    numReviews: 56,
    tags: ['sports', 'cricket', 'bat', 'fitness'],
    features: ['English Willow', 'Grade 1', 'Full Profile'],
    specifications: { willow: 'English Grade 1', weight: '1150-1250g', handle: 'Short' },
    discount: 37
  },
  {
    name: 'Psychology Today Magazine',
    description: 'Annual subscription to Psychology Today with insightful articles on mental health and behavior.',
    price: 1499,
    originalPrice: 2499,
    images: ['https://images.unsplash.com/photo-1555252333-9f8e92e65df4?w=400'],
    brand: 'MindMedia',
    stock: 100,
    rating: 4.2,
    numReviews: 34,
    tags: ['books', 'magazine', 'psychology', 'subscription'],
    features: ['12 Issues', 'Digital Access', 'Expert Articles'],
    specifications: { issues: '12/year', format: 'Print + Digital', language: 'English' },
    discount: 40
  },
  {
    name: "Men's Formal Blazer",
    description: 'Slim fit formal blazer perfect for office and special occasions.',
    price: 2999,
    originalPrice: 4999,
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400'],
    brand: 'SuitUp',
    stock: 35,
    rating: 4.0,
    numReviews: 45,
    tags: ['fashion', 'blazer', 'men', 'formal'],
    features: ['Slim Fit', 'Breathable', 'Premium Stitching'],
    specifications: { material: 'Poly-Viscose', fit: 'Slim', pockets: '3' },
    discount: 40
  },
  {
    name: 'Router WiFi 6',
    description: 'Dual-band WiFi 6 router with 3000Mbps speed and MU-MIMO technology.',
    price: 3499,
    originalPrice: 5499,
    images: ['https://images.unsplash.com/photo-1544210158-2798051c944c?w=400'],
    brand: 'NetSpeed',
    stock: 40,
    rating: 4.3,
    numReviews: 123,
    tags: ['electronics', 'router', 'wifi', 'networking'],
    features: ['WiFi 6', '3000Mbps', 'MU-MIMO'],
    specifications: { bands: 'Dual', speed: '3000Mbps', ports: '4 Gigabit' },
    discount: 36
  },
  {
    name: 'Resistance Bands Set',
    description: 'Set of 5 resistance bands with different strengths for full body workouts.',
    price: 699,
    originalPrice: 1299,
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400'],
    brand: 'FlexFit',
    stock: 90,
    rating: 4.4,
    numReviews: 210,
    tags: ['sports', 'fitness', 'bands', 'workout'],
    features: ['5 Strength Levels', 'Latex Free', 'Door Anchor'],
    specifications: { levels: '5', material: 'TPE', maxResistance: '50kg' },
    discount: 46
  },
  {
    name: "Children's Storybook Collection",
    description: 'Illustrated storybook set for kids with moral tales and colorful artwork.',
    price: 599,
    originalPrice: 999,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'],
    brand: 'LittleReaders',
    stock: 55,
    rating: 4.6,
    numReviews: 78,
    tags: ['books', 'children', 'stories', 'illustrated'],
    features: ['Illustrated', 'Moral Tales', 'Colorful'],
    specifications: { books: '10', pages: '32 each', age: '3-8 years' },
    discount: 40
  },
  {
    name: 'Electric Kettle 1.8L',
    description: 'Stainless steel electric kettle with auto shut-off and boil-dry protection.',
    price: 899,
    originalPrice: 1499,
    images: ['https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400'],
    brand: 'QuickBoil',
    stock: 70,
    rating: 4.2,
    numReviews: 145,
    tags: ['kitchen', 'kettle', 'appliance', 'electric'],
    features: ['Auto Shut-off', 'Boil-dry Protection', '360 Base'],
    specifications: { capacity: '1.8L', power: '1500W', material: 'Stainless Steel' },
    discount: 40
  }
];

router.get('/', async (req, res) => {
  try {
    const secretKey = req.query.key;
    const expectedKey = process.env.SEED_SECRET || 'eshop-seed-2024';
    
    if (secretKey !== expectedKey) {
      return res.status(401).json({ message: 'Invalid or missing seed key' });
    }

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    // Create admin user from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@eshop.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    // Create categories
    const createdCategories = await Category.insertMany(categories);

    // Create products with category references
    const sampleProducts = products.map((product, index) => ({
      ...product,
      category: createdCategories[index % createdCategories.length]._id,
      seller: adminUser._id
    }));

    await Product.insertMany(sampleProducts);

    res.json({
      message: 'Database seeded successfully!',
      admin: { email: adminEmail, password: adminPassword },
      productsCount: sampleProducts.length,
      categoriesCount: createdCategories.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

