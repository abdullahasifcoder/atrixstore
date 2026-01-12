'use strict';

/**
 * Expanded Products Seeder
 * Creates realistic products across all categories with multiple images per product
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Clear existing products first
    await queryInterface.bulkDelete('products', null, {});
    
    const now = new Date();
    let productId = 1;

    // Helper function to generate SKU
    const generateSKU = (category, name) => {
      const catCode = category.substring(0, 3).toUpperCase();
      const nameCode = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
      return `${catCode}-${nameCode}-${String(productId).padStart(4, '0')}`;
    };

    // Helper function to generate slug
    const generateSlug = (name) => {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };

    // Helper to convert array to PostgreSQL array literal format
    const toPgArray = (arr) => {
      if (!arr || arr.length === 0) return '{}';
      return '{' + arr.map(item => `"${item.replace(/"/g, '\\"')}"`).join(',') + '}';
    };

    // Helper to create product array with multiple images
    const createProduct = (data) => {
      const product = {
        id: productId++,
        name: data.name,
        slug: generateSlug(data.name) + '-' + productId,
        sku: generateSKU(data.category, data.name),
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        comparePrice: data.comparePrice || null,
        costPrice: data.costPrice || Math.round(data.price * 0.6 * 100) / 100,
        stock: data.stock || Math.floor(Math.random() * 100) + 20,
        lowStockThreshold: 10,
        categoryId: data.categoryId,
        imageUrl: data.images[0],
        images: toPgArray(data.images),
        tags: toPgArray(data.tags || []),
        isFeatured: data.isFeatured || false,
        isActive: true,
        salesCount: data.salesCount || Math.floor(Math.random() * 500),
        viewCount: Math.floor(Math.random() * 2000),
        rating: data.rating || (3.5 + Math.random() * 1.5).toFixed(2),
        reviewCount: Math.floor(Math.random() * 200),
        semantic_keywords: toPgArray(data.tags || []),
        createdAt: now,
        updatedAt: now
      };
      return product;
    };

    const products = [];

    // =====================================================
    // ELECTRONICS - SMARTPHONES (Category 101)
    // =====================================================
    products.push(createProduct({
      name: 'iPhone 15 Pro Max 256GB',
      description: 'Experience the ultimate iPhone with the A17 Pro chip, titanium design, and an advanced camera system with 5x optical zoom. Features a stunning 6.7-inch Super Retina XDR display with ProMotion technology.',
      shortDescription: 'Apple\'s flagship with A17 Pro chip and titanium design',
      price: 1199.99,
      comparePrice: 1299.99,
      categoryId: 101,
      category: 'smartphones',
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
        'https://images.unsplash.com/photo-1696446702183-ff8e095d7e38?w=800&q=80',
        'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80',
        'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&q=80'
      ],
      tags: ['iphone', 'apple', 'smartphone', 'pro', '5g', 'camera', 'titanium'],
      isFeatured: true,
      salesCount: 1247
    }));

    products.push(createProduct({
      name: 'Samsung Galaxy S24 Ultra',
      description: 'The Galaxy S24 Ultra features a 200MP camera, S Pen support, and the powerful Snapdragon 8 Gen 3 processor. Galaxy AI brings intelligent features to your fingertips.',
      shortDescription: 'Samsung flagship with 200MP camera and Galaxy AI',
      price: 1299.99,
      comparePrice: 1399.99,
      categoryId: 101,
      category: 'smartphones',
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
        'https://images.unsplash.com/photo-1678911820864-e5c67e784ae0?w=800&q=80',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'
      ],
      tags: ['samsung', 'galaxy', 'android', 's pen', '5g', 'ai', 'camera'],
      isFeatured: true,
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Google Pixel 8 Pro',
      description: 'Powered by Google Tensor G3, the Pixel 8 Pro delivers incredible AI-powered photography, 7 years of software updates, and the purest Android experience.',
      shortDescription: 'Google\'s AI powerhouse with Tensor G3',
      price: 999.99,
      categoryId: 101,
      category: 'smartphones',
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'
      ],
      tags: ['google', 'pixel', 'android', 'ai', 'camera', 'pure android'],
      isFeatured: true,
      salesCount: 654
    }));

    products.push(createProduct({
      name: 'OnePlus 12 5G',
      description: 'OnePlus 12 features the Snapdragon 8 Gen 3, Hasselblad camera system, and 100W SUPERVOOC charging. Experience flagship performance at a competitive price.',
      shortDescription: 'Flagship killer with 100W charging',
      price: 799.99,
      categoryId: 101,
      category: 'smartphones',
      images: [
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'
      ],
      tags: ['oneplus', 'android', 'fast charging', 'hasselblad', '5g'],
      salesCount: 423
    }));

    products.push(createProduct({
      name: 'iPhone 14 128GB',
      description: 'A powerful iPhone with the A15 Bionic chip, excellent camera system, and beautiful design. Perfect balance of performance and value.',
      shortDescription: 'Reliable iPhone with A15 Bionic',
      price: 699.99,
      comparePrice: 799.99,
      categoryId: 101,
      category: 'smartphones',
      images: [
        'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&q=80',
        'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'
      ],
      tags: ['iphone', 'apple', 'smartphone', '5g', 'camera'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Samsung Galaxy A54 5G',
      description: 'Premium mid-range smartphone with excellent camera, water resistance, and long software support. Great value for everyday use.',
      shortDescription: 'Best value mid-range Android phone',
      price: 449.99,
      categoryId: 101,
      category: 'smartphones',
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'
      ],
      tags: ['samsung', 'galaxy', 'android', 'budget', '5g', 'value'],
      salesCount: 2134
    }));

    // =====================================================
    // ELECTRONICS - LAPTOPS (Category 102)
    // =====================================================
    products.push(createProduct({
      name: 'MacBook Pro 16" M3 Max',
      description: 'The most powerful MacBook Pro ever with M3 Max chip, up to 128GB unified memory, stunning Liquid Retina XDR display, and exceptional battery life for professional workflows.',
      shortDescription: 'Apple\'s most powerful laptop with M3 Max',
      price: 3499.99,
      categoryId: 102,
      category: 'laptops',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b92e2e?w=800&q=80',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80'
      ],
      tags: ['macbook', 'apple', 'laptop', 'pro', 'm3', 'professional'],
      isFeatured: true,
      salesCount: 456
    }));

    products.push(createProduct({
      name: 'MacBook Air 15" M3',
      description: 'Incredibly thin and light with the powerful M3 chip. Features a stunning 15.3-inch Liquid Retina display, all-day battery life, and fanless silent operation.',
      shortDescription: 'Thin and light with M3 power',
      price: 1299.99,
      categoryId: 102,
      category: 'laptops',
      images: [
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b92e2e?w=800&q=80',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80'
      ],
      tags: ['macbook', 'apple', 'laptop', 'air', 'm3', 'ultrabook'],
      isFeatured: true,
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'Dell XPS 15 OLED',
      description: 'Premium Windows laptop with stunning 3.5K OLED display, 13th Gen Intel Core i7, NVIDIA graphics, and CNC machined aluminum chassis.',
      shortDescription: 'Premium Windows laptop with OLED display',
      price: 1899.99,
      categoryId: 102,
      category: 'laptops',
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b92e2e?w=800&q=80',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80'
      ],
      tags: ['dell', 'xps', 'laptop', 'oled', 'windows', 'ultrabook'],
      salesCount: 567
    }));

    products.push(createProduct({
      name: 'ASUS ROG Zephyrus G16',
      description: 'Ultimate gaming laptop with Intel Core Ultra 9, NVIDIA RTX 4090 Laptop GPU, 240Hz OLED display, and advanced cooling system.',
      shortDescription: 'Gaming powerhouse with RTX 4090',
      price: 2999.99,
      categoryId: 102,
      category: 'laptops',
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b92e2e?w=800&q=80',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80'
      ],
      tags: ['asus', 'rog', 'gaming', 'laptop', 'rtx 4090', 'oled'],
      isFeatured: true,
      salesCount: 234
    }));

    products.push(createProduct({
      name: 'Lenovo ThinkPad X1 Carbon Gen 11',
      description: 'Business ultrabook with 13th Gen Intel vPro, carbon fiber chassis, military-grade durability, and legendary ThinkPad keyboard.',
      shortDescription: 'Business-class ultrabook for professionals',
      price: 1649.99,
      categoryId: 102,
      category: 'laptops',
      images: [
        'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b92e2e?w=800&q=80',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80'
      ],
      tags: ['lenovo', 'thinkpad', 'business', 'laptop', 'ultrabook'],
      salesCount: 432
    }));

    products.push(createProduct({
      name: 'HP Spectre x360 14',
      description: '2-in-1 convertible laptop with OLED touchscreen, Intel Core Ultra, 360-degree hinge, and gem-cut design. Perfect for creative professionals.',
      shortDescription: 'Premium 2-in-1 convertible laptop',
      price: 1499.99,
      categoryId: 102,
      category: 'laptops',
      images: [
        'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b92e2e?w=800&q=80',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80'
      ],
      tags: ['hp', 'spectre', '2-in-1', 'convertible', 'oled', 'touchscreen'],
      salesCount: 345
    }));

    // =====================================================
    // ELECTRONICS - AUDIO (Category 103)
    // =====================================================
    products.push(createProduct({
      name: 'Sony WH-1000XM5',
      description: 'Industry-leading noise cancellation with 8 microphones, exceptional sound quality, 30-hour battery, and ultra-comfortable design.',
      shortDescription: 'Best-in-class ANC headphones',
      price: 399.99,
      comparePrice: 449.99,
      categoryId: 103,
      category: 'audio',
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
      ],
      tags: ['sony', 'headphones', 'noise cancellation', 'wireless', 'bluetooth'],
      isFeatured: true,
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Apple AirPods Pro 2nd Gen',
      description: 'Rebuilt from the ground up with H2 chip, 2x more noise cancellation, Adaptive Audio, and precision finding with U1 chip.',
      shortDescription: 'Apple\'s premium wireless earbuds',
      price: 249.99,
      categoryId: 103,
      category: 'audio',
      images: [
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
        'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80',
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80'
      ],
      tags: ['apple', 'airpods', 'earbuds', 'wireless', 'noise cancellation'],
      isFeatured: true,
      salesCount: 5678
    }));

    products.push(createProduct({
      name: 'Bose QuietComfort Ultra Headphones',
      description: 'Immersive sound with Bose Immersive Audio, world-class noise cancellation, and premium comfort for all-day wear.',
      shortDescription: 'Premium comfort with immersive audio',
      price: 429.99,
      categoryId: 103,
      category: 'audio',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
      ],
      tags: ['bose', 'headphones', 'noise cancellation', 'premium', 'comfort'],
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'JBL Flip 6 Portable Speaker',
      description: 'Powerful portable Bluetooth speaker with bold sound, IP67 waterproof rating, and 12-hour battery life. Perfect for outdoor adventures.',
      shortDescription: 'Portable waterproof Bluetooth speaker',
      price: 129.99,
      categoryId: 103,
      category: 'audio',
      images: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
        'https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'
      ],
      tags: ['jbl', 'speaker', 'bluetooth', 'portable', 'waterproof'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Sennheiser HD 660S2',
      description: 'Open-back audiophile headphones with detailed sound signature, replaceable cable, and exceptional comfort for long listening sessions.',
      shortDescription: 'Audiophile open-back headphones',
      price: 549.99,
      categoryId: 103,
      category: 'audio',
      images: [
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
      ],
      tags: ['sennheiser', 'headphones', 'audiophile', 'open-back', 'hifi'],
      salesCount: 432
    }));

    products.push(createProduct({
      name: 'Sonos Era 300 Smart Speaker',
      description: 'Next-generation smart speaker with spatial audio, voice control, and room-filling sound. Works with all major streaming services.',
      shortDescription: 'Premium spatial audio smart speaker',
      price: 449.99,
      categoryId: 103,
      category: 'audio',
      images: [
        'https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=800&q=80',
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
      ],
      tags: ['sonos', 'smart speaker', 'spatial audio', 'wifi', 'streaming'],
      salesCount: 876
    }));

    // =====================================================
    // ELECTRONICS - CAMERAS (Category 104)
    // =====================================================
    products.push(createProduct({
      name: 'Canon EOS R5 Mirrorless Camera',
      description: 'Professional 45MP full-frame mirrorless camera with 8K video recording, IBIS, and blazing-fast AF. Perfect for serious photographers and videographers.',
      shortDescription: 'Professional 45MP 8K mirrorless camera',
      price: 3899.99,
      categoryId: 104,
      category: 'cameras',
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
        'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
      ],
      tags: ['canon', 'mirrorless', 'camera', 'professional', '8k', 'photography'],
      isFeatured: true,
      salesCount: 234
    }));

    products.push(createProduct({
      name: 'Sony A7 IV Full Frame Camera',
      description: 'Versatile 33MP full-frame hybrid camera with advanced AF, 4K 60p video, and excellent battery life. Perfect balance for photo and video.',
      shortDescription: 'Versatile 33MP hybrid camera',
      price: 2499.99,
      categoryId: 104,
      category: 'cameras',
      images: [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
        'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
      ],
      tags: ['sony', 'mirrorless', 'camera', 'hybrid', '4k', 'full frame'],
      isFeatured: true,
      salesCount: 567
    }));

    products.push(createProduct({
      name: 'Fujifilm X-T5 APS-C Camera',
      description: 'Retro-styled 40MP APS-C camera with film simulations, in-body stabilization, and exceptional image quality in a compact body.',
      shortDescription: 'Retro 40MP APS-C mirrorless camera',
      price: 1699.99,
      categoryId: 104,
      category: 'cameras',
      images: [
        'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
      ],
      tags: ['fujifilm', 'mirrorless', 'camera', 'retro', 'film simulation', 'aps-c'],
      salesCount: 432
    }));

    products.push(createProduct({
      name: 'GoPro HERO 12 Black',
      description: 'Ultimate action camera with 5.3K60 video, HyperSmooth 6.0 stabilization, and waterproof design. Perfect for adventure and sports.',
      shortDescription: 'Professional action camera 5.3K',
      price: 399.99,
      categoryId: 104,
      category: 'cameras',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1551410224-699683e15636?w=800&q=80',
        'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
      ],
      tags: ['gopro', 'action camera', 'waterproof', 'sports', '5k', 'stabilization'],
      isFeatured: true,
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'DJI Mini 4 Pro Drone',
      description: 'Compact foldable drone with 4K/60fps HDR video, 34-minute flight time, omnidirectional obstacle sensing, and intelligent flight modes.',
      shortDescription: 'Compact 4K drone with obstacle sensing',
      price: 759.99,
      categoryId: 104,
      category: 'cameras',
      images: [
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80',
        'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80',
        'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
        'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80'
      ],
      tags: ['dji', 'drone', 'camera', '4k', 'aerial', 'foldable'],
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Canon RF 24-70mm f/2.8L Lens',
      description: 'Professional standard zoom lens with fast f/2.8 aperture, weather sealing, and exceptional optical quality for Canon RF mount.',
      shortDescription: 'Professional f/2.8 zoom lens',
      price: 2299.99,
      categoryId: 104,
      category: 'cameras',
      images: [
        'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
      ],
      tags: ['canon', 'lens', 'zoom', 'professional', 'photography', 'rf mount'],
      salesCount: 345
    }));

    products.push(createProduct({
      name: 'Manfrotto Carbon Fiber Tripod',
      description: 'Professional carbon fiber tripod with fluid video head, quick release plate, and excellent stability. Supports up to 17.6 lbs.',
      shortDescription: 'Professional carbon fiber tripod',
      price: 549.99,
      categoryId: 104,
      category: 'cameras',
      images: [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
        'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
      ],
      tags: ['manfrotto', 'tripod', 'carbon fiber', 'professional', 'photography', 'video'],
      salesCount: 654
    }));

    // =====================================================
    // ELECTRONICS - WEARABLES (Category 105)
    // =====================================================
    products.push(createProduct({
      name: 'Apple Watch Ultra 2',
      description: 'The most capable Apple Watch ever with precision dual-frequency GPS, 36-hour battery, titanium case, and advanced features for athletes and adventurers.',
      shortDescription: 'Apple\'s most rugged smartwatch',
      price: 799.99,
      categoryId: 105,
      category: 'wearables',
      images: [
        'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'
      ],
      tags: ['apple', 'watch', 'smartwatch', 'fitness', 'gps', 'ultra'],
      isFeatured: true,
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Samsung Galaxy Watch 6 Classic',
      description: 'Premium smartwatch with rotating bezel, advanced health monitoring, sleep tracking, and seamless Galaxy ecosystem integration.',
      shortDescription: 'Classic design with rotating bezel',
      price: 429.99,
      categoryId: 105,
      category: 'wearables',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
        'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80'
      ],
      tags: ['samsung', 'galaxy', 'watch', 'smartwatch', 'health', 'fitness'],
      salesCount: 654
    }));

    products.push(createProduct({
      name: 'Fitbit Charge 6',
      description: 'Advanced fitness tracker with built-in GPS, heart rate monitoring, stress management, and 7-day battery life.',
      shortDescription: 'Advanced fitness and health tracker',
      price: 159.99,
      categoryId: 105,
      category: 'wearables',
      images: [
        'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&q=80',
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
        'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800&q=80',
        'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&q=80'
      ],
      tags: ['fitbit', 'fitness', 'tracker', 'health', 'gps', 'heart rate'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Garmin Forerunner 965',
      description: 'Premium running smartwatch with AMOLED display, multi-band GPS, training metrics, and up to 23-day battery life.',
      shortDescription: 'Premium running watch with AMOLED',
      price: 599.99,
      categoryId: 105,
      category: 'wearables',
      images: [
        'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&q=80',
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80'
      ],
      tags: ['garmin', 'running', 'smartwatch', 'gps', 'fitness', 'sports'],
      salesCount: 765
    }));

    products.push(createProduct({
      name: 'Oura Ring Gen 3',
      description: 'Smart ring for sleep tracking, readiness score, heart rate, and temperature monitoring. Stylish and discreet health tracker.',
      shortDescription: 'Smart ring for health tracking',
      price: 299.99,
      categoryId: 105,
      category: 'wearables',
      images: [
        'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
        'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80',
        'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&q=80'
      ],
      tags: ['oura', 'smart ring', 'health', 'sleep tracking', 'fitness', 'wearable'],
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'WHOOP 4.0 Fitness Band',
      description: 'Screenless fitness tracker focused on recovery, strain, and sleep. Used by professional athletes and fitness enthusiasts.',
      shortDescription: 'Professional fitness recovery tracker',
      price: 239.99,
      categoryId: 105,
      category: 'wearables',
      images: [
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
        'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&q=80',
        'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800&q=80',
        'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&q=80'
      ],
      tags: ['whoop', 'fitness', 'recovery', 'sleep', 'professional', 'health'],
      salesCount: 543
    }));

    // =====================================================
    // ELECTRONICS - GAMING (Category 106)
    // =====================================================
    products.push(createProduct({
      name: 'PlayStation 5 Console',
      description: 'Next-gen gaming console with ultra-high speed SSD, ray tracing, 4K gaming, and immersive DualSense controller with haptic feedback.',
      shortDescription: 'Next-gen gaming console with SSD',
      price: 499.99,
      categoryId: 106,
      category: 'gaming',
      images: [
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
        'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
        'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&q=80',
        'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80'
      ],
      tags: ['playstation', 'ps5', 'gaming', 'console', 'sony', '4k'],
      isFeatured: true,
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Xbox Series X',
      description: 'Most powerful Xbox ever with 12 teraflops GPU, 4K 120fps gaming, quick resume, and massive game library via Game Pass.',
      shortDescription: 'Most powerful Xbox console',
      price: 499.99,
      categoryId: 106,
      category: 'gaming',
      images: [
        'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
        'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
        'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&q=80',
        'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800&q=80'
      ],
      tags: ['xbox', 'series x', 'gaming', 'console', 'microsoft', '4k'],
      isFeatured: true,
      salesCount: 2987
    }));

    products.push(createProduct({
      name: 'Nintendo Switch OLED',
      description: 'Hybrid gaming console with vibrant 7-inch OLED screen, enhanced audio, and versatile play modes - handheld, tabletop, or TV.',
      shortDescription: 'Hybrid console with OLED screen',
      price: 349.99,
      categoryId: 106,
      category: 'gaming',
      images: [
        'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
        'https://images.unsplash.com/photo-1585857175116-1e0f62e3ba52?w=800&q=80',
        'https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?w=800&q=80',
        'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80'
      ],
      tags: ['nintendo', 'switch', 'gaming', 'console', 'oled', 'portable'],
      isFeatured: true,
      salesCount: 4123
    }));

    products.push(createProduct({
      name: 'Razer BlackWidow V4 Pro',
      description: 'Premium mechanical gaming keyboard with hot-swappable switches, RGB lighting, programmable macro keys, and dedicated media controls.',
      shortDescription: 'Premium mechanical gaming keyboard',
      price: 229.99,
      categoryId: 106,
      category: 'gaming',
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
        'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&q=80',
        'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80',
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'
      ],
      tags: ['razer', 'keyboard', 'gaming', 'mechanical', 'rgb', 'peripheral'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Logitech G Pro X Superlight 2',
      description: 'Ultra-lightweight wireless gaming mouse at 60g with HERO 2 sensor, 95-hour battery, and professional-grade performance.',
      shortDescription: 'Ultra-lightweight pro gaming mouse',
      price: 159.99,
      categoryId: 106,
      category: 'gaming',
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
        'https://images.unsplash.com/photo-1586920740099-e7f2e4f2f27b?w=800&q=80',
        'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800&q=80'
      ],
      tags: ['logitech', 'mouse', 'gaming', 'wireless', 'lightweight', 'esports'],
      salesCount: 2543
    }));

    products.push(createProduct({
      name: 'SteelSeries Arctis Nova Pro',
      description: 'Premium gaming headset with Hi-Res audio, active noise cancellation, hot-swappable batteries, and simultaneous wireless connectivity.',
      shortDescription: 'Premium wireless gaming headset',
      price: 349.99,
      categoryId: 106,
      category: 'gaming',
      images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=800&q=80',
        'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
      ],
      tags: ['steelseries', 'headset', 'gaming', 'wireless', 'audio', 'anc'],
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Elgato Stream Deck +',
      description: 'Content creation controller with 8 LCD keys, 4 touch strips, and dial for streamers, creators, and productivity enthusiasts.',
      shortDescription: 'Stream control with LCD keys',
      price: 199.99,
      categoryId: 106,
      category: 'gaming',
      images: [
        'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80',
        'https://images.unsplash.com/photo-1625757211878-bc8c0e89161e?w=800&q=80',
        'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
      ],
      tags: ['elgato', 'stream deck', 'streaming', 'content creation', 'controller'],
      salesCount: 1234
    }));

    // =====================================================
    // ELECTRONICS - TV & HOME ENTERTAINMENT (Category 107)
    // =====================================================
    products.push(createProduct({
      name: 'LG C3 OLED 65" 4K TV',
      description: 'Premium OLED TV with self-lit pixels, infinite contrast, AI-powered processor, and Dolby Vision IQ. Perfect for movies and gaming.',
      shortDescription: 'Premium 65" OLED 4K smart TV',
      price: 1799.99,
      comparePrice: 2199.99,
      categoryId: 107,
      category: 'tv',
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
        'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
      ],
      tags: ['lg', 'oled', 'tv', '4k', 'smart tv', 'dolby vision'],
      isFeatured: true,
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Samsung QN90C Neo QLED 55"',
      description: 'Quantum Mini LED TV with ultra-bright display, quantum HDR, anti-glare screen, and gaming hub with 144Hz support.',
      shortDescription: 'Mini LED 55" QLED smart TV',
      price: 1399.99,
      categoryId: 107,
      category: 'tv',
      images: [
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
        'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
      ],
      tags: ['samsung', 'qled', 'tv', '4k', 'smart tv', 'gaming', 'neo qled'],
      isFeatured: true,
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'Sony Bravia XR A80L OLED 55"',
      description: 'Cognitive intelligence OLED TV with XR processor, perfect for PlayStation 5, acoustic surface audio, and Google TV.',
      shortDescription: 'XR OLED 55" with cognitive AI',
      price: 1599.99,
      categoryId: 107,
      category: 'tv',
      images: [
        'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&q=80',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
      ],
      tags: ['sony', 'oled', 'tv', '4k', 'smart tv', 'bravia', 'ps5'],
      salesCount: 654
    }));

    products.push(createProduct({
      name: 'TCL 6-Series 65" Mini-LED 4K',
      description: 'Affordable Mini-LED TV with QLED technology, Dolby Vision, THX certified, and excellent gaming performance at great value.',
      shortDescription: 'Value 65" Mini-LED 4K TV',
      price: 899.99,
      categoryId: 107,
      category: 'tv',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
        'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&q=80'
      ],
      tags: ['tcl', 'mini-led', 'tv', '4k', 'smart tv', 'value', 'gaming'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Sonos Arc Soundbar',
      description: 'Premium Dolby Atmos soundbar with 11 drivers, voice control, and room calibration. Exceptional sound for movies and music.',
      shortDescription: 'Premium Dolby Atmos soundbar',
      price: 899.99,
      categoryId: 107,
      category: 'tv',
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
        'https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
      ],
      tags: ['sonos', 'soundbar', 'dolby atmos', 'home theater', 'audio'],
      isFeatured: true,
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Bose Smart Soundbar 900',
      description: 'Immersive soundbar with Dolby Atmos, spatial audio, voice control, and elegant design. Works with Bose Bass Module.',
      shortDescription: 'Immersive Atmos soundbar',
      price: 849.99,
      categoryId: 107,
      category: 'tv',
      images: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
        'https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
      ],
      tags: ['bose', 'soundbar', 'dolby atmos', 'home theater', 'smart'],
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Roku Ultra Streaming Device',
      description: 'Premium 4K HDR streaming player with Dolby Vision, voice remote, private listening, and access to 500+ channels.',
      shortDescription: '4K HDR streaming player',
      price: 99.99,
      categoryId: 107,
      category: 'tv',
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
        'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&q=80'
      ],
      tags: ['roku', 'streaming', '4k', 'hdr', 'dolby vision', 'media player'],
      salesCount: 3456
    }));

    // =====================================================
    // ELECTRONICS - TABLETS & E-READERS (Category 108)
    // =====================================================
    products.push(createProduct({
      name: 'iPad Pro 12.9" M2',
      description: 'Ultimate iPad with M2 chip, stunning Liquid Retina XDR display, Face ID, and support for Apple Pencil and Magic Keyboard.',
      shortDescription: 'Pro tablet with M2 and XDR display',
      price: 1099.99,
      categoryId: 108,
      category: 'tablets',
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80'
      ],
      tags: ['ipad', 'apple', 'tablet', 'pro', 'm2', 'xdr'],
      isFeatured: true,
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'iPad Air 10.9" M1',
      description: 'Versatile iPad with M1 chip, beautiful Liquid Retina display, and support for Apple Pencil 2 and Magic Keyboard.',
      shortDescription: 'Versatile M1 iPad with accessories',
      price: 599.99,
      categoryId: 108,
      category: 'tablets',
      images: [
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80'
      ],
      tags: ['ipad', 'apple', 'tablet', 'air', 'm1'],
      isFeatured: true,
      salesCount: 2567
    }));

    products.push(createProduct({
      name: 'Samsung Galaxy Tab S9 Ultra',
      description: 'Massive 14.6" AMOLED tablet with S Pen, Snapdragon 8 Gen 2, DeX mode, and IP68 water resistance. Perfect for productivity.',
      shortDescription: '14.6" AMOLED Android tablet',
      price: 1199.99,
      categoryId: 108,
      category: 'tablets',
      images: [
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80'
      ],
      tags: ['samsung', 'galaxy', 'tablet', 'android', 's pen', 'ultra'],
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Microsoft Surface Pro 9',
      description: 'Versatile 2-in-1 laptop-tablet with Intel Core i7, detachable keyboard, Surface Pen support, and all-day battery.',
      shortDescription: '2-in-1 Windows tablet laptop',
      price: 1299.99,
      categoryId: 108,
      category: 'tablets',
      images: [
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80'
      ],
      tags: ['microsoft', 'surface', 'tablet', 'windows', '2-in-1', 'pro'],
      salesCount: 1432
    }));

    products.push(createProduct({
      name: 'Amazon Kindle Paperwhite',
      description: 'Best-selling e-reader with 6.8" glare-free display, adjustable warm light, waterproof design, and weeks of battery life.',
      shortDescription: 'Waterproof e-reader with warm light',
      price: 139.99,
      categoryId: 108,
      category: 'tablets',
      images: [
        'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800&q=80',
        'https://images.unsplash.com/photo-1526398977052-654221a252d1?w=800&q=80',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
        'https://images.unsplash.com/photo-1603575448878-868a20723f5d?w=800&q=80'
      ],
      tags: ['kindle', 'amazon', 'e-reader', 'books', 'waterproof', 'paperwhite'],
      isFeatured: true,
      salesCount: 5432
    }));

    products.push(createProduct({
      name: 'Kindle Scribe Digital Notebook',
      description: 'First Kindle for reading and writing with 10.2" display, Premium Pen included, handwriting to text conversion.',
      shortDescription: 'E-reader with digital note-taking',
      price: 339.99,
      categoryId: 108,
      category: 'tablets',
      images: [
        'https://images.unsplash.com/photo-1526398977052-654221a252d1?w=800&q=80',
        'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800&q=80',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
        'https://images.unsplash.com/photo-1603575448878-868a20723f5d?w=800&q=80'
      ],
      tags: ['kindle', 'amazon', 'e-reader', 'note-taking', 'digital', 'scribe'],
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Lenovo Tab P12 Pro',
      description: 'Premium Android tablet with 12.6" AMOLED display, Snapdragon processor, JBL speakers, and productivity pen support.',
      shortDescription: '12.6" AMOLED productivity tablet',
      price: 699.99,
      categoryId: 108,
      category: 'tablets',
      images: [
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80'
      ],
      tags: ['lenovo', 'tablet', 'android', 'amoled', 'productivity', 'pen'],
      salesCount: 543
    }));

    // =====================================================
    // FASHION - MEN'S (Category 201)
    // =====================================================
    products.push(createProduct({
      name: 'Premium Leather Jacket',
      description: 'Genuine leather jacket with quilted lining, multiple pockets, and classic biker styling. Timeless piece that gets better with age.',
      shortDescription: 'Classic genuine leather biker jacket',
      price: 299.99,
      comparePrice: 399.99,
      categoryId: 201,
      category: 'mens-fashion',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
        'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=800&q=80',
        'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
      ],
      tags: ['leather', 'jacket', 'mens', 'outerwear', 'biker', 'fashion'],
      isFeatured: true,
      salesCount: 432
    }));

    products.push(createProduct({
      name: 'Slim Fit Cotton Chinos',
      description: 'Comfortable stretch cotton chinos with modern slim fit. Perfect for both office and casual wear. Available in multiple colors.',
      shortDescription: 'Versatile slim fit cotton chinos',
      price: 59.99,
      categoryId: 201,
      category: 'mens-fashion',
      images: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80'
      ],
      tags: ['chinos', 'pants', 'mens', 'casual', 'cotton', 'slim fit'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Oxford Button-Down Shirt',
      description: 'Classic Oxford cotton shirt with button-down collar. Versatile wardrobe essential that works for business or casual occasions.',
      shortDescription: 'Classic Oxford cotton dress shirt',
      price: 69.99,
      categoryId: 201,
      category: 'mens-fashion',
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80'
      ],
      tags: ['shirt', 'oxford', 'mens', 'formal', 'cotton', 'business'],
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Classic Wool Blazer',
      description: 'Tailored wool blend blazer with notched lapels and two-button closure. Perfect for business meetings or evening events.',
      shortDescription: 'Tailored wool blend blazer',
      price: 199.99,
      categoryId: 201,
      category: 'mens-fashion',
      images: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80',
        'https://images.unsplash.com/photo-1592878849122-facb97520f9e?w=800&q=80'
      ],
      tags: ['blazer', 'mens', 'formal', 'wool', 'business', 'jacket'],
      salesCount: 567
    }));

    // =====================================================
    // FASHION - WOMEN'S (Category 202)
    // =====================================================
    products.push(createProduct({
      name: 'Floral Maxi Dress',
      description: 'Elegant flowing maxi dress with beautiful floral print. Features adjustable straps, empire waist, and flattering silhouette.',
      shortDescription: 'Elegant floral print maxi dress',
      price: 89.99,
      comparePrice: 119.99,
      categoryId: 202,
      category: 'womens-fashion',
      images: [
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80'
      ],
      tags: ['dress', 'maxi', 'womens', 'floral', 'summer', 'elegant'],
      isFeatured: true,
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'High-Waisted Skinny Jeans',
      description: 'Flattering high-waisted jeans with stretch denim for comfort. Classic skinny fit that pairs with everything.',
      shortDescription: 'Classic high-waisted skinny jeans',
      price: 79.99,
      categoryId: 202,
      category: 'womens-fashion',
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
        'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80',
        'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80'
      ],
      tags: ['jeans', 'denim', 'womens', 'skinny', 'high-waisted', 'casual'],
      salesCount: 2567
    }));

    products.push(createProduct({
      name: 'Silk Blouse',
      description: 'Luxurious silk blouse with elegant drape and subtle sheen. Perfect for office wear or special occasions.',
      shortDescription: 'Elegant pure silk blouse',
      price: 129.99,
      categoryId: 202,
      category: 'womens-fashion',
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
        'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800&q=80',
        'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80',
        'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=800&q=80'
      ],
      tags: ['blouse', 'silk', 'womens', 'elegant', 'formal', 'office'],
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Designer Leather Handbag',
      description: 'Premium leather handbag with gold-tone hardware, multiple compartments, and detachable shoulder strap. Timeless elegance for any occasion.',
      shortDescription: 'Premium designer leather handbag',
      price: 249.99,
      comparePrice: 349.99,
      categoryId: 202,
      category: 'womens-fashion',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
        'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80'
      ],
      tags: ['handbag', 'leather', 'womens', 'designer', 'luxury', 'bag'],
      isFeatured: true,
      salesCount: 654
    }));

    // =====================================================
    // FASHION - FOOTWEAR (Category 204)
    // =====================================================
    products.push(createProduct({
      name: 'Nike Air Max 90',
      description: 'Iconic sneaker with visible Air cushioning, premium materials, and timeless design. The shoe that defined a generation.',
      shortDescription: 'Iconic Nike Air Max sneakers',
      price: 149.99,
      categoryId: 204,
      category: 'footwear',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        'https://images.unsplash.com/photo-1514989940723-e8e51d675571?w=800&q=80',
        'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80'
      ],
      tags: ['nike', 'sneakers', 'air max', 'footwear', 'running', 'casual'],
      isFeatured: true,
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Adidas Ultraboost 23',
      description: 'Premium running shoe with responsive BOOST cushioning, Primeknit upper, and Continental rubber outsole for superior traction.',
      shortDescription: 'Premium running shoes with BOOST',
      price: 189.99,
      categoryId: 204,
      category: 'footwear',
      images: [
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80',
        'https://images.unsplash.com/photo-1514989940723-e8e51d675571?w=800&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80'
      ],
      tags: ['adidas', 'ultraboost', 'running', 'sneakers', 'footwear', 'sports'],
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Chelsea Leather Boots',
      description: 'Classic Chelsea boots in genuine leather with elastic side panels and pull tab. Timeless style for any occasion.',
      shortDescription: 'Classic leather Chelsea boots',
      price: 179.99,
      categoryId: 204,
      category: 'footwear',
      images: [
        'https://images.unsplash.com/photo-1542840843-3349799cded6?w=800&q=80',
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'
      ],
      tags: ['boots', 'chelsea', 'leather', 'footwear', 'mens', 'fashion'],
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Allbirds Tree Runners',
      description: 'Sustainable running shoes made from eucalyptus tree fiber. Lightweight, breathable, and machine washable.',
      shortDescription: 'Sustainable eucalyptus fiber shoes',
      price: 98.99,
      categoryId: 204,
      category: 'footwear',
      images: [
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        'https://images.unsplash.com/photo-1514989940723-e8e51d675571?w=800&q=80',
        'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80'
      ],
      tags: ['allbirds', 'running', 'sustainable', 'eco-friendly', 'footwear'],
      salesCount: 1654
    }));

    products.push(createProduct({
      name: 'Converse Chuck Taylor All Star',
      description: 'Iconic canvas sneakers with timeless design. Available in multiple colors, perfect for casual everyday wear.',
      shortDescription: 'Iconic canvas sneakers',
      price: 65.99,
      categoryId: 204,
      category: 'footwear',
      images: [
        'https://images.unsplash.com/photo-1514989940723-e8e51d675571?w=800&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
        'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80'
      ],
      tags: ['converse', 'chuck taylor', 'sneakers', 'canvas', 'classic', 'casual'],
      salesCount: 4321
    }));

    // =====================================================
    // FASHION - KIDS' FASHION (Category 203)
    // =====================================================
    products.push(createProduct({
      name: 'Kids Dinosaur Graphic T-Shirt Set',
      description: '3-pack cotton t-shirts with fun dinosaur prints. Soft, durable, and perfect for active kids. Available in sizes 2T-8Y.',
      shortDescription: '3-pack cotton kids t-shirts',
      price: 29.99,
      categoryId: 203,
      category: 'kids-fashion',
      images: [
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80',
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80',
        'https://images.unsplash.com/photo-1555662287-1029de7c9221?w=800&q=80'
      ],
      tags: ['kids', 'children', 't-shirt', 'cotton', 'clothing', 'dinosaur'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Girls Tutu Dress Princess Style',
      description: 'Beautiful tulle dress perfect for parties and special occasions. Sparkly bodice and layered tutu skirt. Sizes 3-10Y.',
      shortDescription: 'Princess tutu party dress',
      price: 39.99,
      categoryId: 203,
      category: 'kids-fashion',
      images: [
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80',
        'https://images.unsplash.com/photo-1566993359840-7fc22451b5e8?w=800&q=80',
        'https://images.unsplash.com/photo-1596550809413-4b66a18cd2e2?w=800&q=80',
        'https://images.unsplash.com/photo-1594638535832-ff4c71ca0b63?w=800&q=80'
      ],
      tags: ['girls', 'dress', 'princess', 'party', 'tutu', 'kids'],
      isFeatured: true,
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Boys Denim Jeans Adjustable Waist',
      description: 'Durable stretch denim jeans with adjustable waist and reinforced knees. Perfect for active boys. Sizes 4-14.',
      shortDescription: 'Durable stretch denim jeans',
      price: 34.99,
      categoryId: 203,
      category: 'kids-fashion',
      images: [
        'https://images.unsplash.com/photo-1624378441864-6eda7eac51cb?w=800&q=80',
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80',
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80',
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80'
      ],
      tags: ['boys', 'jeans', 'denim', 'kids', 'clothing', 'durable'],
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Kids Winter Puffer Jacket',
      description: 'Warm and lightweight puffer jacket with hood. Water-resistant outer shell and cozy insulation. Available in multiple colors.',
      shortDescription: 'Warm water-resistant puffer jacket',
      price: 59.99,
      categoryId: 203,
      category: 'kids-fashion',
      images: [
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80',
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80',
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
        'https://images.unsplash.com/photo-1555662287-1029de7c9221?w=800&q=80'
      ],
      tags: ['kids', 'jacket', 'winter', 'puffer', 'outerwear', 'warm'],
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Toddler Sneaker Light-Up Shoes',
      description: 'Fun light-up sneakers with LED lights in heel. Easy velcro closure and comfortable fit for toddlers. Sizes 5-10.',
      shortDescription: 'LED light-up sneakers for toddlers',
      price: 44.99,
      categoryId: 203,
      category: 'kids-fashion',
      images: [
        'https://images.unsplash.com/photo-1514989940723-e8e51d675571?w=800&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80'
      ],
      tags: ['toddler', 'sneakers', 'light-up', 'led', 'kids', 'shoes'],
      isFeatured: true,
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Baby Organic Cotton Onesie 5-Pack',
      description: 'Soft organic cotton bodysuits perfect for sensitive baby skin. Easy snap closure. Various cute prints. Sizes 0-24M.',
      shortDescription: 'Organic cotton baby onesies',
      price: 24.99,
      categoryId: 203,
      category: 'kids-fashion',
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
        'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=800&q=80',
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80'
      ],
      tags: ['baby', 'onesie', 'organic', 'cotton', 'infant', 'bodysuit'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Kids Superhero Costume Set',
      description: 'Complete superhero costume with cape, mask, and accessories. Perfect for dress-up and imaginative play. Sizes 3-8Y.',
      shortDescription: 'Complete superhero costume',
      price: 34.99,
      categoryId: 203,
      category: 'kids-fashion',
      images: [
        'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80',
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80',
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80',
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80'
      ],
      tags: ['kids', 'costume', 'superhero', 'dress-up', 'play', 'cape'],
      salesCount: 1234
    }));

    // =====================================================
    // FASHION - BAGS & LUGGAGE (Category 205)
    // =====================================================
    products.push(createProduct({
      name: 'Samsonite Hardside Spinner Luggage',
      description: 'Durable polycarbonate hardside luggage with 360° spinner wheels, TSA lock, and organized interior. 28-inch checked size.',
      shortDescription: 'Durable hardside spinner luggage',
      price: 249.99,
      comparePrice: 299.99,
      categoryId: 205,
      category: 'bags',
      images: [
        'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
        'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80'
      ],
      tags: ['samsonite', 'luggage', 'hardside', 'spinner', 'travel', 'suitcase'],
      isFeatured: true,
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Tumi Alpha Carry-On Bag',
      description: 'Premium ballistic nylon carry-on with expandable design, USB port, and lifetime warranty. Perfect for business travel.',
      shortDescription: 'Premium business carry-on',
      price: 595.99,
      categoryId: 205,
      category: 'bags',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
        'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80'
      ],
      tags: ['tumi', 'carry-on', 'luggage', 'business', 'travel', 'premium'],
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'North Face Recon Backpack',
      description: '30L durable backpack with laptop sleeve, FlexVent suspension, and multiple compartments. Perfect for school or hiking.',
      shortDescription: '30L versatile laptop backpack',
      price: 99.99,
      categoryId: 205,
      category: 'bags',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800&q=80',
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80',
        'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&q=80'
      ],
      tags: ['north face', 'backpack', 'laptop', 'hiking', 'school', 'outdoor'],
      isFeatured: true,
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Coach Gallery Tote Bag',
      description: 'Elegant leather tote with spacious interior, zip closure, and signature Coach detailing. Perfect everyday luxury bag.',
      shortDescription: 'Elegant leather tote bag',
      price: 395.99,
      categoryId: 205,
      category: 'bags',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
        'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80'
      ],
      tags: ['coach', 'tote', 'leather', 'luxury', 'handbag', 'designer'],
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Herschel Little America Backpack',
      description: 'Classic mountaineering style backpack with laptop sleeve, magnetic strap closures, and signature stripe lining.',
      shortDescription: 'Classic style laptop backpack',
      price: 119.99,
      categoryId: 205,
      category: 'bags',
      images: [
        'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80',
        'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&q=80'
      ],
      tags: ['herschel', 'backpack', 'laptop', 'classic', 'casual', 'style'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Away Bigger Carry-On Flex',
      description: 'Expandable polycarbonate carry-on with compression system, TSA-approved lock, and interior organization. 22.7" size.',
      shortDescription: 'Expandable carry-on luggage',
      price: 345.99,
      categoryId: 205,
      category: 'bags',
      images: [
        'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
        'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80'
      ],
      tags: ['away', 'luggage', 'carry-on', 'expandable', 'travel', 'hardside'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Longchamp Le Pliage Tote',
      description: 'Iconic foldable nylon tote with leather trim. Lightweight, durable, and perfect for travel or everyday use.',
      shortDescription: 'Iconic foldable nylon tote',
      price: 155.99,
      categoryId: 205,
      category: 'bags',
      images: [
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
        'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80'
      ],
      tags: ['longchamp', 'tote', 'nylon', 'foldable', 'travel', 'classic'],
      salesCount: 2765
    }));

    // =====================================================
    // FASHION - WATCHES & JEWELRY (Category 206)
    // =====================================================
    products.push(createProduct({
      name: 'Rolex Submariner Homage Watch',
      description: 'Premium automatic watch with sapphire crystal, 200m water resistance, and classic dive watch styling. Japanese movement.',
      shortDescription: 'Automatic dive watch 200m',
      price: 349.99,
      categoryId: 206,
      category: 'watches',
      images: [
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
        'https://images.unsplash.com/photo-1509941943102-10c232535736?w=800&q=80',
        'https://images.unsplash.com/photo-1587836374133-f8c579d22f3c?w=800&q=80'
      ],
      tags: ['watch', 'automatic', 'dive watch', 'waterproof', 'luxury', 'mens'],
      isFeatured: true,
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Citizen Eco-Drive Chronograph',
      description: 'Solar-powered chronograph watch with date display, stainless steel case, and never needs battery replacement.',
      shortDescription: 'Solar-powered chronograph',
      price: 295.99,
      categoryId: 206,
      category: 'watches',
      images: [
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
        'https://images.unsplash.com/photo-1509941943102-10c232535736?w=800&q=80',
        'https://images.unsplash.com/photo-1587836374133-f8c579d22f3c?w=800&q=80'
      ],
      tags: ['citizen', 'watch', 'eco-drive', 'solar', 'chronograph', 'mens'],
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'Seiko 5 Automatic Watch',
      description: 'Affordable automatic watch with day-date display, exhibition caseback, and reliable 7S26 movement. Perfect entry-level automatic.',
      shortDescription: 'Affordable automatic watch',
      price: 199.99,
      categoryId: 206,
      category: 'watches',
      images: [
        'https://images.unsplash.com/photo-1509941943102-10c232535736?w=800&q=80',
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
        'https://images.unsplash.com/photo-1587836374133-f8c579d22f3c?w=800&q=80'
      ],
      tags: ['seiko', 'watch', 'automatic', 'mechanical', 'affordable', 'classic'],
      isFeatured: true,
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Pandora Moments Bracelet',
      description: 'Sterling silver charm bracelet with barrel clasp. Perfect base for creating your personalized charm collection.',
      shortDescription: 'Sterling silver charm bracelet',
      price: 79.99,
      categoryId: 206,
      category: 'jewelry',
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
      ],
      tags: ['pandora', 'bracelet', 'jewelry', 'silver', 'charm', 'womens'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Swarovski Crystal Necklace',
      description: 'Elegant necklace featuring clear Swarovski crystals in rhodium plating. Timeless design perfect for any occasion.',
      shortDescription: 'Crystal pendant necklace',
      price: 119.99,
      categoryId: 206,
      category: 'jewelry',
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
      ],
      tags: ['swarovski', 'necklace', 'crystal', 'jewelry', 'elegant', 'womens'],
      isFeatured: true,
      salesCount: 2134
    }));

    products.push(createProduct({
      name: '14K Gold Hoop Earrings',
      description: 'Classic 14K yellow gold hoop earrings with secure snap closure. Timeless design that goes with everything.',
      shortDescription: '14K gold classic hoops',
      price: 249.99,
      categoryId: 206,
      category: 'jewelry',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
      ],
      tags: ['gold', 'earrings', 'hoops', 'jewelry', 'classic', 'womens'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Fossil Minimalist Watch',
      description: 'Clean minimalist design with leather strap, quartz movement, and slim profile. Perfect for everyday wear.',
      shortDescription: 'Minimalist leather watch',
      price: 129.99,
      categoryId: 206,
      category: 'watches',
      images: [
        'https://images.unsplash.com/photo-1587836374133-f8c579d22f3c?w=800&q=80',
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
        'https://images.unsplash.com/photo-1509941943102-10c232535736?w=800&q=80'
      ],
      tags: ['fossil', 'watch', 'minimalist', 'leather', 'casual', 'quartz'],
      salesCount: 2543
    }));

    // =====================================================
    // FASHION - SUNGLASSES & EYEWEAR (Category 207)
    // =====================================================
    products.push(createProduct({
      name: 'Ray-Ban Original Wayfarer',
      description: 'Iconic sunglasses with G-15 lenses, acetate frame, and timeless design. UV protection and legendary style.',
      shortDescription: 'Iconic Wayfarer sunglasses',
      price: 169.99,
      categoryId: 207,
      category: 'sunglasses',
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80'
      ],
      tags: ['ray-ban', 'sunglasses', 'wayfarer', 'classic', 'uv protection', 'iconic'],
      isFeatured: true,
      salesCount: 4567
    }));

    products.push(createProduct({
      name: 'Oakley Holbrook Polarized',
      description: 'Sport-style sunglasses with polarized lenses, lightweight O Matter frame, and excellent impact resistance.',
      shortDescription: 'Polarized sport sunglasses',
      price: 189.99,
      categoryId: 207,
      category: 'sunglasses',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80'
      ],
      tags: ['oakley', 'sunglasses', 'polarized', 'sport', 'active', 'mens'],
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Persol PO3019S Sunglasses',
      description: 'Italian crafted sunglasses with crystal lenses, flexible hinges, and sophisticated design. Handmade acetate frame.',
      shortDescription: 'Italian luxury sunglasses',
      price: 329.99,
      categoryId: 207,
      category: 'sunglasses',
      images: [
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80'
      ],
      tags: ['persol', 'sunglasses', 'italian', 'luxury', 'designer', 'handmade'],
      salesCount: 765
    }));

    products.push(createProduct({
      name: 'Maui Jim Cliff House Polarized',
      description: 'Premium polarized sunglasses with PolarizedPlus2 technology, eliminating glare and enhancing colors. Perfect for outdoor activities.',
      shortDescription: 'Premium polarized sunglasses',
      price: 299.99,
      categoryId: 207,
      category: 'sunglasses',
      images: [
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80',
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'
      ],
      tags: ['maui jim', 'sunglasses', 'polarized', 'premium', 'outdoor', 'beach'],
      isFeatured: true,
      salesCount: 1432
    }));

    products.push(createProduct({
      name: 'Warby Parker Blue Light Glasses',
      description: 'Stylish eyeglasses with blue light filtering lenses. Reduces eye strain from screens. Includes case and cleaning cloth.',
      shortDescription: 'Blue light filtering glasses',
      price: 95.99,
      categoryId: 207,
      category: 'eyewear',
      images: [
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
        'https://images.unsplash.com/photo-1608427992680-7cfcc1f5a564?w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80'
      ],
      tags: ['warby parker', 'glasses', 'blue light', 'eyewear', 'computer', 'optical'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Gucci GG Logo Sunglasses',
      description: 'Designer sunglasses featuring iconic GG logo, acetate frame, and gradient lenses. Luxury Italian eyewear.',
      shortDescription: 'Designer logo sunglasses',
      price: 395.99,
      categoryId: 207,
      category: 'sunglasses',
      images: [
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80'
      ],
      tags: ['gucci', 'sunglasses', 'designer', 'luxury', 'fashion', 'womens'],
      isFeatured: true,
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Zenni Prescription Glasses',
      description: 'Affordable prescription eyeglasses with anti-reflective coating. Lightweight frame and comfortable fit. Custom prescription.',
      shortDescription: 'Affordable prescription eyeglasses',
      price: 49.99,
      categoryId: 207,
      category: 'eyewear',
      images: [
        'https://images.unsplash.com/photo-1608427992680-7cfcc1f5a564?w=800&q=80',
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80'
      ],
      tags: ['zenni', 'glasses', 'prescription', 'eyewear', 'optical', 'affordable'],
      salesCount: 5678
    }));

    // =====================================================
    // HOME & LIVING - FURNITURE (Category 301)
    // =====================================================
    products.push(createProduct({
      name: 'Modern Sectional Sofa',
      description: 'Contemporary L-shaped sectional sofa with plush cushions, sturdy hardwood frame, and premium upholstery. Perfect for large living spaces.',
      shortDescription: 'Contemporary L-shaped sectional sofa',
      price: 1499.99,
      comparePrice: 1999.99,
      categoryId: 301,
      category: 'furniture',
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80'
      ],
      tags: ['sofa', 'sectional', 'furniture', 'living room', 'modern', 'home'],
      isFeatured: true,
      salesCount: 234
    }));

    products.push(createProduct({
      name: 'Scandinavian Dining Table',
      description: 'Elegant oak dining table with clean Scandinavian design. Seats 6-8 people comfortably. Made from sustainable solid oak.',
      shortDescription: 'Solid oak Scandinavian dining table',
      price: 899.99,
      categoryId: 301,
      category: 'furniture',
      images: [
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
        'https://images.unsplash.com/photo-1551298370-9d3d53bc59e5?w=800&q=80',
        'https://images.unsplash.com/photo-1565791380713-1756b9a05343?w=800&q=80',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'
      ],
      tags: ['dining', 'table', 'scandinavian', 'oak', 'furniture', 'home'],
      salesCount: 345
    }));

    products.push(createProduct({
      name: 'Ergonomic Office Chair',
      description: 'Premium ergonomic chair with adjustable lumbar support, breathable mesh back, 4D armrests, and smooth-rolling casters.',
      shortDescription: 'Premium ergonomic office chair',
      price: 549.99,
      categoryId: 301,
      category: 'furniture',
      images: [
        'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
        'https://images.unsplash.com/photo-1505797149-35641c8c2a20?w=800&q=80',
        'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&q=80',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'
      ],
      tags: ['chair', 'office', 'ergonomic', 'furniture', 'work', 'desk'],
      isFeatured: true,
      salesCount: 567
    }));

    // =====================================================
    // HOME & LIVING - BEDDING (Category 302)
    // =====================================================
    products.push(createProduct({
      name: 'Luxury Egyptian Cotton Sheet Set',
      description: '1000 thread count Egyptian cotton sheet set including fitted sheet, flat sheet, and 2 pillowcases. Incredibly soft and breathable.',
      shortDescription: '1000 TC Egyptian cotton sheets',
      price: 199.99,
      categoryId: 302,
      category: 'bedding',
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
        'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'
      ],
      tags: ['bedding', 'sheets', 'egyptian cotton', 'luxury', 'bedroom', 'home'],
      isFeatured: true,
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Memory Foam Mattress Queen',
      description: 'Premium memory foam mattress with cooling gel technology, pressure relief, and motion isolation. 10-year warranty included.',
      shortDescription: 'Cooling gel memory foam mattress',
      price: 699.99,
      comparePrice: 999.99,
      categoryId: 302,
      category: 'bedding',
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
        'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'
      ],
      tags: ['mattress', 'memory foam', 'queen', 'bedroom', 'sleep', 'cooling'],
      salesCount: 432
    }));

    products.push(createProduct({
      name: 'Down Alternative Comforter',
      description: 'Hypoallergenic down alternative comforter with box stitch construction. Soft, fluffy, and machine washable.',
      shortDescription: 'Hypoallergenic comforter',
      price: 79.99,
      categoryId: 302,
      category: 'bedding',
      images: [
        'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'
      ],
      tags: ['comforter', 'bedding', 'down alternative', 'hypoallergenic', 'bedroom'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Bamboo Pillow Set of 2',
      description: 'Adjustable shredded memory foam pillows with bamboo cover. Cooling, breathable, and perfect for all sleep positions.',
      shortDescription: 'Cooling bamboo memory foam pillows',
      price: 59.99,
      categoryId: 302,
      category: 'bedding',
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
        'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80'
      ],
      tags: ['pillows', 'bamboo', 'memory foam', 'bedding', 'cooling', 'sleep'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Weighted Blanket 15 lbs',
      description: 'Therapeutic weighted blanket with glass beads for better sleep and reduced anxiety. Available in multiple weights.',
      shortDescription: 'Therapeutic weighted blanket',
      price: 89.99,
      categoryId: 302,
      category: 'bedding',
      images: [
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80',
        'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80'
      ],
      tags: ['weighted blanket', 'therapy', 'sleep', 'anxiety', 'bedding', 'wellness'],
      salesCount: 1654
    }));

    // =====================================================
    // HOME & LIVING - KITCHEN & DINING (Category 303)
    // =====================================================
    products.push(createProduct({
      name: 'Ninja Foodi Dual Zone Air Fryer',
      description: '8-quart dual basket air fryer with independent zones. Cook two foods, two ways, both ready at the same time.',
      shortDescription: 'Dual zone 8-qt air fryer',
      price: 229.99,
      categoryId: 303,
      category: 'kitchen',
      images: [
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
        'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80'
      ],
      tags: ['ninja', 'air fryer', 'kitchen', 'appliance', 'cooking', 'healthy'],
      isFeatured: true,
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'KitchenAid Stand Mixer 5-Quart',
      description: 'Iconic tilt-head stand mixer with 10 speeds, stainless steel bowl, and multiple attachment options. Available in many colors.',
      shortDescription: 'Iconic 5-qt stand mixer',
      price: 449.99,
      categoryId: 303,
      category: 'kitchen',
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
        'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80',
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80'
      ],
      tags: ['kitchenaid', 'mixer', 'stand mixer', 'baking', 'kitchen', 'appliance'],
      isFeatured: true,
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Le Creuset Cast Iron Dutch Oven',
      description: '5.5-quart enameled cast iron Dutch oven perfect for braising, baking, and slow cooking. Lifetime warranty.',
      shortDescription: '5.5-qt cast iron Dutch oven',
      price: 379.99,
      categoryId: 303,
      category: 'kitchen',
      images: [
        'https://images.unsplash.com/photo-1584990347449-39b6362f7326?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
        'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80'
      ],
      tags: ['le creuset', 'dutch oven', 'cast iron', 'cookware', 'kitchen', 'cooking'],
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Cuisinart 12-Piece Knife Set',
      description: 'Professional knife set with high-carbon stainless steel blades, ergonomic handles, and wooden block storage.',
      shortDescription: 'Professional 12-pc knife set',
      price: 199.99,
      categoryId: 303,
      category: 'kitchen',
      images: [
        'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
        'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80'
      ],
      tags: ['cuisinart', 'knives', 'knife set', 'cutlery', 'kitchen', 'cooking'],
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Instant Pot Pro 8-Quart',
      description: 'Advanced pressure cooker with 10 programs, sous vide, and smart programming. Cook meals faster with perfect results.',
      shortDescription: 'Multi-function pressure cooker',
      price: 149.99,
      categoryId: 303,
      category: 'kitchen',
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
        'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80'
      ],
      tags: ['instant pot', 'pressure cooker', 'kitchen', 'appliance', 'cooking', 'multi-cooker'],
      isFeatured: true,
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Nespresso Vertuo Next',
      description: 'Single-serve coffee maker with barcode scanning technology. Brews 5 cup sizes from espresso to carafe.',
      shortDescription: 'Barcode coffee maker',
      price: 179.99,
      categoryId: 303,
      category: 'kitchen',
      images: [
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80'
      ],
      tags: ['nespresso', 'coffee', 'espresso', 'kitchen', 'appliance', 'beverage'],
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Pyrex Glass Food Storage Set',
      description: '18-piece glass food storage set with snap lids. Microwave, oven, freezer, and dishwasher safe.',
      shortDescription: '18-pc glass storage containers',
      price: 44.99,
      categoryId: 303,
      category: 'kitchen',
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&q=80',
        'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80',
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80'
      ],
      tags: ['pyrex', 'storage', 'containers', 'glass', 'kitchen', 'organization'],
      salesCount: 2987
    }));

    // =====================================================
    // HOME & LIVING - HOME DECOR (Category 304)
    // =====================================================
    products.push(createProduct({
      name: 'Bohemian Macrame Wall Hanging',
      description: 'Handwoven macrame wall art in neutral tones. Adds texture and bohemian charm to any space. 36" length.',
      shortDescription: 'Handwoven macrame wall art',
      price: 49.99,
      categoryId: 304,
      category: 'decor',
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=800&q=80'
      ],
      tags: ['macrame', 'wall hanging', 'decor', 'bohemian', 'home', 'handmade'],
      isFeatured: true,
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Faux Fiddle Leaf Fig Tree 6ft',
      description: 'Realistic artificial fiddle leaf fig plant with weighted base. No maintenance required, looks natural year-round.',
      shortDescription: 'Realistic artificial plant 6ft',
      price: 149.99,
      categoryId: 304,
      category: 'decor',
      images: [
        'https://images.unsplash.com/photo-1521334884684-d80222895322?w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=800&q=80'
      ],
      tags: ['plant', 'artificial', 'fiddle leaf fig', 'decor', 'home', 'faux'],
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'Moroccan Area Rug 8x10',
      description: 'Hand-tufted wool area rug with geometric Moroccan pattern. Soft, durable, and adds warmth to any room.',
      shortDescription: 'Hand-tufted Moroccan wool rug',
      price: 399.99,
      comparePrice: 599.99,
      categoryId: 304,
      category: 'decor',
      images: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=800&q=80'
      ],
      tags: ['rug', 'area rug', 'moroccan', 'wool', 'decor', 'home'],
      isFeatured: true,
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Gallery Wall Frame Set 9-Piece',
      description: 'Curated set of picture frames in various sizes with mat boards. Create a professional gallery wall easily.',
      shortDescription: '9-piece gallery wall frames',
      price: 79.99,
      categoryId: 304,
      category: 'decor',
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=800&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
      ],
      tags: ['frames', 'picture frames', 'gallery wall', 'decor', 'home', 'wall art'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Scented Candle Gift Set 4-Pack',
      description: 'Luxury soy wax candles in seasonal scents. Long-lasting burn time and elegant glass containers.',
      shortDescription: 'Luxury scented candle set',
      price: 59.99,
      categoryId: 304,
      category: 'decor',
      images: [
        'https://images.unsplash.com/photo-1602874801006-2e4a9d6366a7?w=800&q=80',
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
        'https://images.unsplash.com/photo-1598454146165-e6b2b32aee0a?w=800&q=80',
        'https://images.unsplash.com/photo-1609709825779-785e5b4ae2b6?w=800&q=80'
      ],
      tags: ['candles', 'scented', 'gift set', 'decor', 'home', 'aromatherapy'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Modern Ceramic Vase Set',
      description: 'Set of 3 minimalist ceramic vases in different sizes. Perfect for dried flowers or as standalone decor.',
      shortDescription: 'Modern ceramic vase trio',
      price: 44.99,
      categoryId: 304,
      category: 'decor',
      images: [
        'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=800&q=80'
      ],
      tags: ['vase', 'ceramic', 'modern', 'decor', 'home', 'minimalist'],
      salesCount: 1654
    }));

    products.push(createProduct({
      name: 'Velvet Throw Pillows Set of 2',
      description: 'Luxurious velvet throw pillows with hidden zipper and plush insert. Available in rich jewel tones. 20x20 inches.',
      shortDescription: 'Luxe velvet throw pillows',
      price: 39.99,
      categoryId: 304,
      category: 'decor',
      images: [
        'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1592928302636-c83cf1e1c887?w=800&q=80'
      ],
      tags: ['pillows', 'throw pillows', 'velvet', 'decor', 'home', 'luxury'],
      salesCount: 2876
    }));

    // =====================================================
    // HOME & LIVING - LIGHTING (Category 305)
    // =====================================================
    products.push(createProduct({
      name: 'Philips Hue Smart Bulb Starter Kit',
      description: '4-pack color smart bulbs with bridge. Control lights with voice or app. 16 million colors and warm/cool white.',
      shortDescription: 'Color smart bulb starter kit',
      price: 199.99,
      categoryId: 305,
      category: 'lighting',
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
        'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&q=80',
        'https://images.unsplash.com/photo-1565084888279-aca607ecce2c?w=800&q=80'
      ],
      tags: ['philips hue', 'smart bulb', 'lighting', 'smart home', 'led', 'color'],
      isFeatured: true,
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Industrial Floor Lamp Tripod',
      description: 'Adjustable tripod floor lamp with Edison bulb. Industrial style perfect for modern and loft interiors.',
      shortDescription: 'Industrial tripod floor lamp',
      price: 129.99,
      categoryId: 305,
      category: 'lighting',
      images: [
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&q=80',
        'https://images.unsplash.com/photo-1565084888279-aca607ecce2c?w=800&q=80'
      ],
      tags: ['floor lamp', 'tripod', 'industrial', 'lighting', 'home', 'edison'],
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Modern Crystal Chandelier',
      description: 'Elegant 6-light crystal chandelier with chrome finish. Creates beautiful light patterns and adds elegance.',
      shortDescription: '6-light crystal chandelier',
      price: 299.99,
      categoryId: 305,
      category: 'lighting',
      images: [
        'https://images.unsplash.com/photo-1565084888279-aca607ecce2c?w=800&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&q=80'
      ],
      tags: ['chandelier', 'crystal', 'lighting', 'elegant', 'home', 'fixture'],
      isFeatured: true,
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'LED Strip Lights 32ft',
      description: 'RGB LED strip lights with remote control. 16 million colors, music sync, and easy installation with adhesive backing.',
      shortDescription: 'RGB LED strip lights 32ft',
      price: 29.99,
      categoryId: 305,
      category: 'lighting',
      images: [
        'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
        'https://images.unsplash.com/photo-1565084888279-aca607ecce2c?w=800&q=80'
      ],
      tags: ['led strips', 'rgb', 'lighting', 'smart home', 'mood lighting', 'home'],
      salesCount: 4567
    }));

    products.push(createProduct({
      name: 'Himalayan Salt Lamp Large',
      description: 'Natural Himalayan pink salt lamp with dimmer. Creates warm ambient glow and believed to purify air.',
      shortDescription: 'Natural salt lamp with dimmer',
      price: 39.99,
      categoryId: 305,
      category: 'lighting',
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
        'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&q=80',
        'https://images.unsplash.com/photo-1565084888279-aca607ecce2c?w=800&q=80'
      ],
      tags: ['salt lamp', 'himalayan', 'lighting', 'wellness', 'ambient', 'natural'],
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Architect Desk Lamp Adjustable',
      description: 'Professional desk lamp with adjustable arm, LED bulb, and clamp base. Perfect for work and reading.',
      shortDescription: 'Adjustable architect desk lamp',
      price: 69.99,
      categoryId: 305,
      category: 'lighting',
      images: [
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&q=80',
        'https://images.unsplash.com/photo-1565084888279-aca607ecce2c?w=800&q=80'
      ],
      tags: ['desk lamp', 'architect lamp', 'adjustable', 'lighting', 'office', 'led'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'String Lights Fairy Lights 100ft',
      description: 'Warm white LED fairy lights with 8 lighting modes. Perfect for bedroom, patio, or party decorations.',
      shortDescription: 'Warm LED fairy string lights',
      price: 24.99,
      categoryId: 305,
      category: 'lighting',
      images: [
        'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
        'https://images.unsplash.com/photo-1565084888279-aca607ecce2c?w=800&q=80'
      ],
      tags: ['string lights', 'fairy lights', 'led', 'lighting', 'decor', 'party'],
      salesCount: 3765
    }));

    // =====================================================
    // HOME & LIVING - BATH & TOWELS (Category 306)
    // =====================================================
    products.push(createProduct({
      name: 'Turkish Cotton Towel Set 6-Piece',
      description: 'Luxury Turkish cotton towel set with 2 bath, 2 hand, and 2 wash towels. Ultra-absorbent and quick-drying.',
      shortDescription: 'Luxury Turkish cotton towels',
      price: 89.99,
      categoryId: 306,
      category: 'bath',
      images: [
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
        'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80',
        'https://images.unsplash.com/photo-1564182379166-8fcfdda80151?w=800&q=80'
      ],
      tags: ['towels', 'turkish cotton', 'bath', 'luxury', 'home', 'bathroom'],
      isFeatured: true,
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Rainfall Shower Head 12-Inch',
      description: 'Large 12-inch rainfall shower head with high-pressure design. Provides spa-like shower experience at home.',
      shortDescription: 'Luxury 12" rainfall shower head',
      price: 69.99,
      categoryId: 306,
      category: 'bath',
      images: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
        'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80'
      ],
      tags: ['shower head', 'rainfall', 'bath', 'bathroom', 'home', 'luxury'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Bamboo Bath Mat Non-Slip',
      description: 'Eco-friendly bamboo bath mat with non-slip rubber feet. Water-resistant and naturally antibacterial.',
      shortDescription: 'Eco bamboo non-slip bath mat',
      price: 34.99,
      categoryId: 306,
      category: 'bath',
      images: [
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80',
        'https://images.unsplash.com/photo-1564182379166-8fcfdda80151?w=800&q=80'
      ],
      tags: ['bath mat', 'bamboo', 'eco-friendly', 'bathroom', 'home', 'non-slip'],
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Waffle Weave Bathrobe Luxury',
      description: 'Spa-quality waffle weave bathrobe in cotton. Lightweight, absorbent, and features pockets and belt.',
      shortDescription: 'Spa-quality waffle bathrobe',
      price: 59.99,
      categoryId: 306,
      category: 'bath',
      images: [
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
        'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80',
        'https://images.unsplash.com/photo-1564182379166-8fcfdda80151?w=800&q=80'
      ],
      tags: ['bathrobe', 'waffle weave', 'bath', 'spa', 'luxury', 'cotton'],
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Bathroom Organizer Set 4-Piece',
      description: 'Modern bathroom accessories set includes soap dispenser, toothbrush holder, tumbler, and soap dish.',
      shortDescription: 'Modern bathroom accessory set',
      price: 44.99,
      categoryId: 306,
      category: 'bath',
      images: [
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80',
        'https://images.unsplash.com/photo-1564182379166-8fcfdda80151?w=800&q=80'
      ],
      tags: ['bathroom', 'organizer', 'accessories', 'bath', 'home', 'modern'],
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Luxury Bath Pillow Spa',
      description: 'Ergonomic bath pillow with 7 suction cups. Provides neck and head support for relaxing bath experience.',
      shortDescription: 'Ergonomic spa bath pillow',
      price: 24.99,
      categoryId: 306,
      category: 'bath',
      images: [
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
        'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80',
        'https://images.unsplash.com/photo-1564182379166-8fcfdda80151?w=800&q=80'
      ],
      tags: ['bath pillow', 'spa', 'bath', 'relaxation', 'home', 'comfort'],
      salesCount: 1654
    }));

    products.push(createProduct({
      name: 'Shower Curtain with Hooks Set',
      description: 'Water-repellent fabric shower curtain with modern pattern. Includes 12 rustproof hooks. Machine washable.',
      shortDescription: 'Modern fabric shower curtain',
      price: 29.99,
      categoryId: 306,
      category: 'bath',
      images: [
        'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80',
        'https://images.unsplash.com/photo-1564182379166-8fcfdda80151?w=800&q=80'
      ],
      tags: ['shower curtain', 'bathroom', 'bath', 'home', 'decor', 'waterproof'],
      salesCount: 2876
    }));

    // =====================================================
    // HOME & LIVING - STORAGE & ORGANIZATION (Category 307)
    // =====================================================
    products.push(createProduct({
      name: 'Stackable Storage Bins 6-Pack',
      description: 'Clear plastic storage bins with lids. Stackable design saves space. Perfect for closet, pantry, or garage.',
      shortDescription: 'Clear stackable storage bins',
      price: 39.99,
      categoryId: 307,
      category: 'storage',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
        'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
      ],
      tags: ['storage bins', 'organization', 'stackable', 'plastic', 'home', 'closet'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Hanging Closet Organizer 6-Shelf',
      description: 'Fabric hanging closet organizer with 6 shelves. Easy installation and perfect for clothes, shoes, or accessories.',
      shortDescription: '6-shelf hanging organizer',
      price: 24.99,
      categoryId: 307,
      category: 'storage',
      images: [
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
      ],
      tags: ['closet organizer', 'hanging', 'storage', 'organization', 'fabric', 'home'],
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Under Bed Storage Bags 4-Pack',
      description: 'Large under-bed storage bags with clear window and zipper. Protects seasonal clothes from dust and moisture.',
      shortDescription: 'Under-bed storage bags',
      price: 29.99,
      categoryId: 307,
      category: 'storage',
      images: [
        'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
      ],
      tags: ['storage bags', 'under bed', 'organization', 'home', 'seasonal', 'space saving'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Bamboo Drawer Dividers Adjustable',
      description: 'Expandable bamboo drawer dividers. Organize kitchen utensils, office supplies, or bathroom items.',
      shortDescription: 'Adjustable bamboo dividers',
      price: 19.99,
      categoryId: 307,
      category: 'storage',
      images: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
        'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80'
      ],
      tags: ['drawer dividers', 'bamboo', 'organization', 'adjustable', 'home', 'kitchen'],
      salesCount: 2654
    }));

    products.push(createProduct({
      name: 'Modular Cube Storage System',
      description: '9-cube storage organizer with metal frame. Use with or without fabric bins. Perfect for any room.',
      shortDescription: '9-cube modular storage system',
      price: 79.99,
      categoryId: 307,
      category: 'storage',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
        'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
      ],
      tags: ['cube storage', 'modular', 'organization', 'storage', 'home', 'furniture'],
      isFeatured: true,
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Over-the-Door Shoe Organizer',
      description: '24-pocket over-door shoe organizer with clear pockets. Holds up to 12 pairs of shoes. No tools required.',
      shortDescription: '24-pocket shoe organizer',
      price: 14.99,
      categoryId: 307,
      category: 'storage',
      images: [
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
      ],
      tags: ['shoe organizer', 'over-door', 'storage', 'organization', 'home', 'closet'],
      salesCount: 4321
    }));

    products.push(createProduct({
      name: 'Vacuum Storage Bags 10-Pack',
      description: 'Space-saving vacuum storage bags in multiple sizes. Compresses clothes, bedding, and reduces volume by 80%.',
      shortDescription: 'Space-saving vacuum bags',
      price: 34.99,
      categoryId: 307,
      category: 'storage',
      images: [
        'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'
      ],
      tags: ['vacuum bags', 'storage', 'space saving', 'compression', 'home', 'travel'],
      salesCount: 2987
    }));

    // =====================================================
    // BEAUTY - SKINCARE (Category 401)
    // =====================================================
    products.push(createProduct({
      name: 'Vitamin C Brightening Serum',
      description: 'Potent 20% Vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, reduces dark spots, and boosts collagen production.',
      shortDescription: '20% Vitamin C brightening serum',
      price: 49.99,
      categoryId: 401,
      category: 'skincare',
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
        'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=800&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80'
      ],
      tags: ['skincare', 'serum', 'vitamin c', 'brightening', 'anti-aging', 'beauty'],
      isFeatured: true,
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Retinol Night Cream',
      description: 'Advanced retinol formula with peptides and niacinamide. Reduces fine lines, improves skin texture, and promotes cell renewal.',
      shortDescription: 'Anti-aging retinol night cream',
      price: 59.99,
      categoryId: 401,
      category: 'skincare',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
        'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=800&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80'
      ],
      tags: ['skincare', 'retinol', 'night cream', 'anti-aging', 'beauty', 'moisturizer'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Hyaluronic Acid Moisturizer',
      description: 'Lightweight gel-cream moisturizer with triple-weight hyaluronic acid for deep hydration without clogging pores.',
      shortDescription: 'Deep hydration gel moisturizer',
      price: 39.99,
      categoryId: 401,
      category: 'skincare',
      images: [
        'https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=800&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80'
      ],
      tags: ['skincare', 'moisturizer', 'hyaluronic acid', 'hydration', 'beauty', 'gel'],
      salesCount: 3456
    }));

    // =====================================================
    // BEAUTY - MAKEUP (Category 402)
    // =====================================================
    products.push(createProduct({
      name: 'Full Coverage Foundation',
      description: 'Long-wearing full coverage foundation with buildable formula. Matte finish that lasts up to 24 hours. Available in 40 shades.',
      shortDescription: '24-hour full coverage foundation',
      price: 44.99,
      categoryId: 402,
      category: 'makeup',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80'
      ],
      tags: ['makeup', 'foundation', 'full coverage', 'matte', 'beauty', 'cosmetics'],
      isFeatured: true,
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Luxury Lipstick Set',
      description: 'Set of 6 premium matte lipsticks in universally flattering shades. Long-lasting formula with moisturizing ingredients.',
      shortDescription: '6-piece luxury matte lipstick set',
      price: 79.99,
      categoryId: 402,
      category: 'makeup',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80'
      ],
      tags: ['makeup', 'lipstick', 'matte', 'set', 'beauty', 'cosmetics'],
      salesCount: 1567
    }));

    products.push(createProduct({
      name: 'Eyeshadow Palette 40-Color',
      description: 'Professional eyeshadow palette with 40 highly pigmented shades. Includes matte, shimmer, and glitter finishes.',
      shortDescription: '40-color pro eyeshadow palette',
      price: 34.99,
      categoryId: 402,
      category: 'makeup',
      images: [
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80'
      ],
      tags: ['makeup', 'eyeshadow', 'palette', 'beauty', 'cosmetics', 'pigmented'],
      isFeatured: true,
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Makeup Brush Set 32-Piece',
      description: 'Professional makeup brush set with synthetic bristles, ergonomic handles, and leather case. All brushes you need.',
      shortDescription: '32-piece pro brush set',
      price: 49.99,
      categoryId: 402,
      category: 'makeup',
      images: [
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80'
      ],
      tags: ['makeup brushes', 'beauty', 'cosmetics', 'professional', 'set', 'tools'],
      salesCount: 1987
    }));

    products.push(createProduct({
      name: 'Setting Spray Long-Lasting',
      description: 'Makeup setting spray that locks makeup in place for up to 16 hours. Waterproof and transfer-resistant formula.',
      shortDescription: '16-hour setting spray',
      price: 29.99,
      categoryId: 402,
      category: 'makeup',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80'
      ],
      tags: ['setting spray', 'makeup', 'long-lasting', 'beauty', 'waterproof', 'cosmetics'],
      salesCount: 2345
    }));

    // =====================================================
    // BEAUTY - HAIRCARE (Category 403)
    // =====================================================
    products.push(createProduct({
      name: 'Olaplex Bond Repair Treatment',
      description: 'Professional bond-building treatment that repairs damaged hair from chemical treatments, heat styling, and coloring.',
      shortDescription: 'Bond repair hair treatment',
      price: 28.99,
      categoryId: 403,
      category: 'haircare',
      images: [
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
        'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80'
      ],
      tags: ['olaplex', 'hair treatment', 'bond repair', 'haircare', 'beauty', 'professional'],
      isFeatured: true,
      salesCount: 4567
    }));

    products.push(createProduct({
      name: 'Moroccan Oil Hair Treatment',
      description: 'Argan oil-infused treatment that nourishes, detangles, and adds shine to all hair types. UV protection included.',
      shortDescription: 'Argan oil hair treatment',
      price: 44.99,
      categoryId: 403,
      category: 'haircare',
      images: [
        'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80'
      ],
      tags: ['moroccan oil', 'argan oil', 'hair treatment', 'haircare', 'beauty', 'shine'],
      isFeatured: true,
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Dyson Supersonic Hair Dryer',
      description: 'Intelligent heat control prevents extreme heat damage. Fast drying with multiple attachments for various styles.',
      shortDescription: 'Intelligent fast hair dryer',
      price: 429.99,
      categoryId: 403,
      category: 'haircare',
      images: [
        'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80'
      ],
      tags: ['dyson', 'hair dryer', 'haircare', 'professional', 'beauty', 'fast'],
      isFeatured: true,
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Revlon One-Step Hair Dryer Brush',
      description: 'Oval brush design for smoothing and volumizing in one step. Ionic technology reduces frizz and static.',
      shortDescription: 'One-step dryer volumizer',
      price: 59.99,
      categoryId: 403,
      category: 'haircare',
      images: [
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
        'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80'
      ],
      tags: ['revlon', 'hair dryer brush', 'volumizer', 'haircare', 'beauty', 'styling'],
      salesCount: 5678
    }));

    products.push(createProduct({
      name: 'Sulfate-Free Shampoo & Conditioner Set',
      description: 'Gentle sulfate-free formula for color-treated hair. Moisturizes and protects with natural ingredients.',
      shortDescription: 'Sulfate-free hair care duo',
      price: 39.99,
      categoryId: 403,
      category: 'haircare',
      images: [
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
        'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80'
      ],
      tags: ['shampoo', 'conditioner', 'sulfate-free', 'haircare', 'natural', 'color-safe'],
      salesCount: 2987
    }));

    products.push(createProduct({
      name: 'Keratin Hair Mask Deep Conditioner',
      description: 'Intensive keratin treatment mask that repairs dry, damaged hair. Restores softness, shine, and manageability.',
      shortDescription: 'Keratin deep conditioning mask',
      price: 24.99,
      categoryId: 403,
      category: 'haircare',
      images: [
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
        'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80'
      ],
      tags: ['hair mask', 'keratin', 'deep conditioner', 'haircare', 'treatment', 'repair'],
      salesCount: 3234
    }));

    products.push(createProduct({
      name: 'GHD Platinum+ Hair Straightener',
      description: 'Professional hair straightener with ultra-zone technology. Predicts hair needs for personalized styling at 365°F.',
      shortDescription: 'Pro smart hair straightener',
      price: 279.99,
      categoryId: 403,
      category: 'haircare',
      images: [
        'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
        'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
        'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80'
      ],
      tags: ['ghd', 'straightener', 'flat iron', 'haircare', 'professional', 'styling'],
      salesCount: 1234
    }));

    // =====================================================
    // BEAUTY - FRAGRANCES (Category 404)
    // =====================================================
    products.push(createProduct({
      name: 'Chanel No. 5 Eau de Parfum',
      description: 'Iconic timeless fragrance with floral aldehyde composition. Sophisticated and elegant for any occasion.',
      shortDescription: 'Iconic timeless fragrance',
      price: 138.99,
      categoryId: 404,
      category: 'fragrances',
      images: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59bd0?w=800&q=80'
      ],
      tags: ['chanel', 'perfume', 'fragrance', 'luxury', 'womens', 'classic'],
      isFeatured: true,
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Dior Sauvage Eau de Toilette',
      description: 'Fresh and woody fragrance with Calabrian bergamot and amberwood. Modern masculine scent.',
      shortDescription: 'Fresh woody mens fragrance',
      price: 129.99,
      categoryId: 404,
      category: 'fragrances',
      images: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59bd0?w=800&q=80'
      ],
      tags: ['dior', 'cologne', 'fragrance', 'mens', 'woody', 'fresh'],
      isFeatured: true,
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Yves Saint Laurent Black Opium',
      description: 'Addictive gourmand fragrance with coffee, vanilla, and white flowers. Bold and seductive for evening wear.',
      shortDescription: 'Gourmand coffee fragrance',
      price: 119.99,
      categoryId: 404,
      category: 'fragrances',
      images: [
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59bd0?w=800&q=80'
      ],
      tags: ['ysl', 'perfume', 'fragrance', 'womens', 'gourmand', 'evening'],
      salesCount: 2234
    }));

    products.push(createProduct({
      name: 'Tom Ford Oud Wood Eau de Parfum',
      description: 'Rare oud wood with exotic spices and sensual woods. Sophisticated unisex luxury fragrance.',
      shortDescription: 'Luxury oud wood fragrance',
      price: 245.99,
      categoryId: 404,
      category: 'fragrances',
      images: [
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59bd0?w=800&q=80',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80'
      ],
      tags: ['tom ford', 'oud', 'fragrance', 'luxury', 'unisex', 'woody'],
      isFeatured: true,
      salesCount: 765
    }));

    products.push(createProduct({
      name: 'Jo Malone English Pear & Freesia',
      description: 'Fresh fruity fragrance with ripe pear, freesia, and patchouli. Light and elegant for everyday wear.',
      shortDescription: 'Fresh pear and freesia scent',
      price: 142.99,
      categoryId: 404,
      category: 'fragrances',
      images: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59bd0?w=800&q=80'
      ],
      tags: ['jo malone', 'perfume', 'fragrance', 'fruity', 'fresh', 'elegant'],
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Versace Eros Flame',
      description: 'Passionate mens fragrance with citrus, pepper, and tonka bean. Fiery and masculine scent.',
      shortDescription: 'Passionate citrus mens scent',
      price: 94.99,
      categoryId: 404,
      category: 'fragrances',
      images: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59bd0?w=800&q=80',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80'
      ],
      tags: ['versace', 'cologne', 'fragrance', 'mens', 'citrus', 'spicy'],
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Body Mist Gift Set 5-Pack',
      description: 'Collection of light body mists in floral and fruity scents. Perfect for layering or everyday freshness.',
      shortDescription: 'Light body mist collection',
      price: 29.99,
      categoryId: 404,
      category: 'fragrances',
      images: [
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59bd0?w=800&q=80'
      ],
      tags: ['body mist', 'fragrance', 'gift set', 'fresh', 'light', 'collection'],
      salesCount: 4321
    }));

    // =====================================================
    // BEAUTY - MEN'S GROOMING (Category 405)
    // =====================================================
    products.push(createProduct({
      name: 'Braun Series 9 Electric Shaver',
      description: 'Premium electric shaver with 5 synchronized shaving elements. Captures more hair in one stroke for efficiency.',
      shortDescription: 'Premium 5-blade electric shaver',
      price: 349.99,
      categoryId: 405,
      category: 'grooming',
      images: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80',
        'https://images.unsplash.com/photo-1532710093143-c4ec83b1bb7c?w=800&q=80'
      ],
      tags: ['braun', 'electric shaver', 'grooming', 'mens', 'shaving', 'premium'],
      isFeatured: true,
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'Beard Growth Oil with Biotin',
      description: 'All-natural beard oil promotes growth, softness, and shine. Biotin, argan, and jojoba oil blend.',
      shortDescription: 'Natural beard growth oil',
      price: 24.99,
      categoryId: 405,
      category: 'grooming',
      images: [
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80',
        'https://images.unsplash.com/photo-1532710093143-c4ec83b1bb7c?w=800&q=80'
      ],
      tags: ['beard oil', 'grooming', 'mens', 'natural', 'biotin', 'growth'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Mens Grooming Kit 11-Piece',
      description: 'Complete grooming set with trimmer, razor, scissors, comb, and leather case. Everything for perfect grooming.',
      shortDescription: 'Complete 11-pc grooming kit',
      price: 79.99,
      categoryId: 405,
      category: 'grooming',
      images: [
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
        'https://images.unsplash.com/photo-1532710093143-c4ec83b1bb7c?w=800&q=80'
      ],
      tags: ['grooming kit', 'mens', 'set', 'trimmer', 'grooming', 'gift'],
      isFeatured: true,
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Shaving Cream Luxury Set',
      description: 'Rich lather shaving cream with brush and bowl. Traditional wet shave experience with modern formula.',
      shortDescription: 'Traditional wet shave set',
      price: 44.99,
      categoryId: 405,
      category: 'grooming',
      images: [
        'https://images.unsplash.com/photo-1532710093143-c4ec83b1bb7c?w=800&q=80',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80'
      ],
      tags: ['shaving cream', 'wet shave', 'grooming', 'mens', 'luxury', 'traditional'],
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Aftershave Balm Soothing',
      description: 'Alcohol-free aftershave balm that soothes, moisturizes, and protects skin after shaving. Non-greasy formula.',
      shortDescription: 'Soothing aftershave balm',
      price: 19.99,
      categoryId: 405,
      category: 'grooming',
      images: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80',
        'https://images.unsplash.com/photo-1532710093143-c4ec83b1bb7c?w=800&q=80'
      ],
      tags: ['aftershave', 'balm', 'grooming', 'mens', 'soothing', 'skincare'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Philips OneBlade Face & Body',
      description: 'Hybrid electric trimmer and shaver. Trims, edges, and shaves any length of hair. Waterproof for wet/dry use.',
      shortDescription: 'Hybrid trimmer and shaver',
      price: 49.99,
      categoryId: 405,
      category: 'grooming',
      images: [
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80',
        'https://images.unsplash.com/photo-1532710093143-c4ec83b1bb7c?w=800&q=80'
      ],
      tags: ['philips', 'oneblade', 'trimmer', 'shaver', 'grooming', 'waterproof'],
      salesCount: 4567
    }));

    products.push(createProduct({
      name: 'Mens Face Moisturizer SPF 30',
      description: 'Daily face moisturizer with SPF 30 protection. Hydrates, reduces shine, and protects from UV damage.',
      shortDescription: 'Daily moisturizer with SPF 30',
      price: 29.99,
      categoryId: 405,
      category: 'grooming',
      images: [
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
        'https://images.unsplash.com/photo-1532710093143-c4ec83b1bb7c?w=800&q=80'
      ],
      tags: ['moisturizer', 'spf', 'skincare', 'mens', 'grooming', 'sunscreen'],
      salesCount: 2654
    }));

    // =====================================================
    // BEAUTY - WELLNESS & HEALTH (Category 406)
    // =====================================================
    products.push(createProduct({
      name: 'Multivitamin Gummies for Adults',
      description: 'Complete daily multivitamin with essential vitamins and minerals. Delicious fruit flavors, no artificial colors.',
      shortDescription: 'Daily multivitamin gummies',
      price: 19.99,
      categoryId: 406,
      category: 'wellness',
      images: [
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
        'https://images.unsplash.com/photo-1550572017-edd951aa8dae?w=800&q=80',
        'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80'
      ],
      tags: ['multivitamin', 'gummies', 'wellness', 'supplements', 'health', 'vitamins'],
      isFeatured: true,
      salesCount: 5678
    }));

    products.push(createProduct({
      name: 'Collagen Peptides Powder',
      description: 'Grass-fed collagen powder for skin, hair, nails, and joints. Unflavored and easily dissolves in any beverage.',
      shortDescription: 'Grass-fed collagen powder',
      price: 44.99,
      categoryId: 406,
      category: 'wellness',
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
        'https://images.unsplash.com/photo-1550572017-edd951aa8dae?w=800&q=80',
        'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80'
      ],
      tags: ['collagen', 'peptides', 'wellness', 'supplements', 'beauty', 'health'],
      isFeatured: true,
      salesCount: 3987
    }));

    products.push(createProduct({
      name: 'Omega-3 Fish Oil 2000mg',
      description: 'Triple strength fish oil with EPA and DHA for heart, brain, and joint health. Molecularly distilled for purity.',
      shortDescription: 'Triple strength omega-3',
      price: 34.99,
      categoryId: 406,
      category: 'wellness',
      images: [
        'https://images.unsplash.com/photo-1550572017-edd951aa8dae?w=800&q=80',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
        'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80'
      ],
      tags: ['omega-3', 'fish oil', 'wellness', 'supplements', 'heart health', 'epa dha'],
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Probiotics 50 Billion CFU',
      description: 'High-potency probiotic with 10 strains for digestive and immune health. Delayed-release capsules.',
      shortDescription: 'High-potency probiotic 50B',
      price: 29.99,
      categoryId: 406,
      category: 'wellness',
      images: [
        'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
        'https://images.unsplash.com/photo-1550572017-edd951aa8dae?w=800&q=80'
      ],
      tags: ['probiotics', 'digestive health', 'wellness', 'supplements', 'immune', 'gut health'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Vitamin D3 5000 IU',
      description: 'High-potency vitamin D3 for bone health, immune support, and mood. Easy-to-swallow softgels.',
      shortDescription: 'High-potency vitamin D3',
      price: 14.99,
      categoryId: 406,
      category: 'wellness',
      images: [
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
        'https://images.unsplash.com/photo-1550572017-edd951aa8dae?w=800&q=80',
        'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80'
      ],
      tags: ['vitamin d', 'd3', 'wellness', 'supplements', 'immune', 'bone health'],
      salesCount: 4321
    }));

    products.push(createProduct({
      name: 'Ashwagandha 1300mg',
      description: 'Organic ashwagandha root extract for stress relief, energy, and mood support. Adaptogenic herb supplement.',
      shortDescription: 'Organic stress relief supplement',
      price: 19.99,
      categoryId: 406,
      category: 'wellness',
      images: [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
        'https://images.unsplash.com/photo-1550572017-edd951aa8dae?w=800&q=80',
        'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80'
      ],
      tags: ['ashwagandha', 'adaptogen', 'stress relief', 'wellness', 'supplements', 'herbal'],
      salesCount: 2765
    }));

    products.push(createProduct({
      name: 'Melatonin Sleep Support 10mg',
      description: 'Natural sleep aid with melatonin, L-theanine, and chamomile. Non-habit forming for restful sleep.',
      shortDescription: 'Natural sleep aid supplement',
      price: 16.99,
      categoryId: 406,
      category: 'wellness',
      images: [
        'https://images.unsplash.com/photo-1550572017-edd951aa8dae?w=800&q=80',
        'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80'
      ],
      tags: ['melatonin', 'sleep aid', 'wellness', 'supplements', 'natural', 'sleep'],
      salesCount: 4987
    }));

    // =====================================================
    // SPORTS - EXERCISE (Category 501)
    // =====================================================
    products.push(createProduct({
      name: 'Adjustable Dumbbell Set',
      description: 'Space-saving adjustable dumbbells ranging from 5-52.5 lbs. Quick-change weight system for efficient home workouts.',
      shortDescription: 'Adjustable 5-52.5 lb dumbbells',
      price: 349.99,
      categoryId: 501,
      category: 'fitness',
      images: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80'
      ],
      tags: ['dumbbells', 'fitness', 'weights', 'home gym', 'exercise', 'adjustable'],
      isFeatured: true,
      salesCount: 765
    }));

    products.push(createProduct({
      name: 'Premium Yoga Mat',
      description: 'Extra thick 6mm yoga mat with non-slip surface and alignment lines. Eco-friendly TPE material that\'s easy to clean.',
      shortDescription: 'Eco-friendly non-slip yoga mat',
      price: 49.99,
      categoryId: 501,
      category: 'fitness',
      images: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'
      ],
      tags: ['yoga', 'mat', 'fitness', 'exercise', 'eco-friendly', 'workout'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Smart Fitness Treadmill',
      description: 'Folding treadmill with 10" HD touchscreen, live classes, and automatic incline. Compact design perfect for home gyms.',
      shortDescription: 'Smart folding treadmill with HD screen',
      price: 1299.99,
      categoryId: 501,
      category: 'fitness',
      images: [
        'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
      ],
      tags: ['treadmill', 'fitness', 'cardio', 'home gym', 'smart', 'folding'],
      salesCount: 234
    }));

    products.push(createProduct({
      name: 'Resistance Bands Set of 5',
      description: 'Premium resistance bands with varying resistance levels. Includes door anchor, handles, and carrying bag.',
      shortDescription: '5-level resistance band set',
      price: 29.99,
      categoryId: 501,
      category: 'fitness',
      images: [
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80'
      ],
      tags: ['resistance bands', 'fitness', 'home workout', 'portable', 'strength', 'exercise'],
      salesCount: 4567
    }));

    products.push(createProduct({
      name: 'Ab Roller Wheel with Knee Pad',
      description: 'Sturdy ab roller with thick knee pad and non-slip handles. Perfect for core strengthening exercises.',
      shortDescription: 'Ab roller for core training',
      price: 24.99,
      categoryId: 501,
      category: 'fitness',
      images: [
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80'
      ],
      tags: ['ab roller', 'core', 'fitness', 'abs', 'exercise', 'home workout'],
      salesCount: 3234
    }));

    // =====================================================
    // SPORTS - OUTDOOR SPORTS (Category 502)
    // =====================================================
    products.push(createProduct({
      name: 'North Face Backpacking Tent 2-Person',
      description: 'Lightweight 2-person tent with rainfly, aluminum poles, and waterproof floor. Perfect for backpacking and camping.',
      shortDescription: 'Lightweight 2-person camping tent',
      price: 249.99,
      categoryId: 502,
      category: 'outdoor',
      images: [
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
        'https://images.unsplash.com/photo-1537565732541-c5678c6d3e28?w=800&q=80',
        'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80'
      ],
      tags: ['tent', 'camping', 'outdoor', 'backpacking', 'north face', 'waterproof'],
      isFeatured: true,
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'Hydro Flask Water Bottle 32oz',
      description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours, hot for 12. Wide mouth for easy cleaning.',
      shortDescription: 'Insulated 32oz water bottle',
      price: 44.99,
      categoryId: 502,
      category: 'outdoor',
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
        'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80',
        'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80',
        'https://images.unsplash.com/photo-1588624697563-c4f29c3f850c?w=800&q=80'
      ],
      tags: ['hydro flask', 'water bottle', 'insulated', 'outdoor', 'hiking', 'camping'],
      isFeatured: true,
      salesCount: 5678
    }));

    products.push(createProduct({
      name: 'Coleman Camping Chair Portable',
      description: 'Folding camping chair with cup holder and cooler pocket. Supports up to 300 lbs and packs into carry bag.',
      shortDescription: 'Folding camping chair',
      price: 39.99,
      categoryId: 502,
      category: 'outdoor',
      images: [
        'https://images.unsplash.com/photo-1603383219156-00c0b0afae44?w=800&q=80',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
        'https://images.unsplash.com/photo-1537565732541-c5678c6d3e28?w=800&q=80'
      ],
      tags: ['camping chair', 'portable', 'outdoor', 'coleman', 'folding', 'camping'],
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Osprey Hiking Backpack 50L',
      description: 'Ventilated hiking backpack with adjustable suspension, hydration compatible, and multiple compartments.',
      shortDescription: '50L ventilated hiking backpack',
      price: 189.99,
      categoryId: 502,
      category: 'outdoor',
      images: [
        'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800&q=80',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
        'https://images.unsplash.com/photo-1537565732541-c5678c6d3e28?w=800&q=80'
      ],
      tags: ['osprey', 'backpack', 'hiking', 'outdoor', 'camping', 'trekking'],
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Sleeping Bag 15°F Mummy Style',
      description: 'Lightweight mummy sleeping bag rated to 15°F. Includes compression sack and water-resistant shell.',
      shortDescription: '15°F mummy sleeping bag',
      price: 89.99,
      categoryId: 502,
      category: 'outdoor',
      images: [
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
        'https://images.unsplash.com/photo-1537565732541-c5678c6d3e28?w=800&q=80',
        'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80'
      ],
      tags: ['sleeping bag', 'camping', 'outdoor', 'mummy', 'backpacking', 'hiking'],
      salesCount: 1987
    }));

    products.push(createProduct({
      name: 'Portable Camping Stove',
      description: 'Compact camping stove with windscreen and carrying case. Compatible with standard fuel canisters.',
      shortDescription: 'Compact portable camp stove',
      price: 34.99,
      categoryId: 502,
      category: 'outdoor',
      images: [
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
        'https://images.unsplash.com/photo-1537565732541-c5678c6d3e28?w=800&q=80',
        'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80'
      ],
      tags: ['camp stove', 'camping', 'outdoor', 'portable', 'cooking', 'backpacking'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Trekking Poles Carbon Fiber Pair',
      description: 'Ultra-light carbon fiber trekking poles with adjustable length, cork grips, and tungsten carbide tips.',
      shortDescription: 'Carbon fiber trekking poles',
      price: 79.99,
      categoryId: 502,
      category: 'outdoor',
      images: [
        'https://images.unsplash.com/photo-1537565732541-c5678c6d3e28?w=800&q=80',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
        'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80'
      ],
      tags: ['trekking poles', 'hiking', 'carbon fiber', 'outdoor', 'walking sticks', 'lightweight'],
      salesCount: 1654
    }));

    // =====================================================
    // SPORTS - SPORTSWEAR (Category 503)
    // =====================================================
    products.push(createProduct({
      name: 'Nike Dri-FIT Running Shirt',
      description: 'Moisture-wicking running shirt with breathable fabric and reflective details. Lightweight and comfortable.',
      shortDescription: 'Moisture-wicking running shirt',
      price: 34.99,
      categoryId: 503,
      category: 'sportswear',
      images: [
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1622260614927-d4e21c69a2de?w=800&q=80',
        'https://images.unsplash.com/photo-1578342976795-062a1b744f37?w=800&q=80'
      ],
      tags: ['nike', 'running shirt', 'sportswear', 'dri-fit', 'athletic', 'workout'],
      isFeatured: true,
      salesCount: 4321
    }));

    products.push(createProduct({
      name: 'Lululemon Align Leggings',
      description: 'Buttery-soft yoga leggings with 4-way stretch and hidden pocket. Perfect for yoga and everyday wear.',
      shortDescription: 'Buttery-soft yoga leggings',
      price: 98.99,
      categoryId: 503,
      category: 'sportswear',
      images: [
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
        'https://images.unsplash.com/photo-1622260614927-d4e21c69a2de?w=800&q=80',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
      ],
      tags: ['lululemon', 'leggings', 'yoga pants', 'sportswear', 'athletic', 'activewear'],
      isFeatured: true,
      salesCount: 5432
    }));

    products.push(createProduct({
      name: 'Under Armour Sports Bra',
      description: 'High-impact sports bra with removable pads, adjustable straps, and moisture-wicking fabric.',
      shortDescription: 'High-impact sports bra',
      price: 44.99,
      categoryId: 503,
      category: 'sportswear',
      images: [
        'https://images.unsplash.com/photo-1622260614927-d4e21c69a2de?w=800&q=80',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1578342976795-062a1b744f37?w=800&q=80'
      ],
      tags: ['under armour', 'sports bra', 'sportswear', 'high-impact', 'athletic', 'workout'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Adidas Tiro Training Pants',
      description: 'Tapered training pants with zip pockets and breathable fabric. Perfect for soccer practice or casual wear.',
      shortDescription: 'Tapered soccer training pants',
      price: 49.99,
      categoryId: 503,
      category: 'sportswear',
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1622260614927-d4e21c69a2de?w=800&q=80',
        'https://images.unsplash.com/photo-1578342976795-062a1b744f37?w=800&q=80'
      ],
      tags: ['adidas', 'training pants', 'soccer', 'sportswear', 'athletic', 'tiro'],
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Gym Shorts with Pockets',
      description: 'Athletic shorts with deep pockets, elastic waistband, and quick-dry fabric. Perfect for gym or running.',
      shortDescription: 'Quick-dry athletic shorts',
      price: 29.99,
      categoryId: 503,
      category: 'sportswear',
      images: [
        'https://images.unsplash.com/photo-1578342976795-062a1b744f37?w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1622260614927-d4e21c69a2de?w=800&q=80'
      ],
      tags: ['gym shorts', 'athletic', 'sportswear', 'quick-dry', 'workout', 'pockets'],
      salesCount: 3765
    }));

    products.push(createProduct({
      name: 'Compression Tank Top',
      description: 'Tight-fit compression tank with moisture management and anti-odor technology. Enhances muscle support.',
      shortDescription: 'Compression athletic tank',
      price: 39.99,
      categoryId: 503,
      category: 'sportswear',
      images: [
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1622260614927-d4e21c69a2de?w=800&q=80',
        'https://images.unsplash.com/photo-1578342976795-062a1b744f37?w=800&q=80'
      ],
      tags: ['compression', 'tank top', 'sportswear', 'athletic', 'fitness', 'workout'],
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Windbreaker Jacket Lightweight',
      description: 'Packable windbreaker with hood, zip pockets, and water-resistant coating. Perfect for outdoor activities.',
      shortDescription: 'Packable windbreaker jacket',
      price: 54.99,
      categoryId: 503,
      category: 'sportswear',
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1578342976795-062a1b744f37?w=800&q=80',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1622260614927-d4e21c69a2de?w=800&q=80'
      ],
      tags: ['windbreaker', 'jacket', 'sportswear', 'lightweight', 'outdoor', 'packable'],
      salesCount: 1987
    }));

    // =====================================================
    // SPORTS - CYCLING (Category 504)
    // =====================================================
    products.push(createProduct({
      name: 'Road Bike Carbon Frame 21-Speed',
      description: 'Lightweight carbon fiber road bike with Shimano gears, disc brakes, and aerodynamic design for speed.',
      shortDescription: 'Carbon fiber road bike',
      price: 1299.99,
      categoryId: 504,
      category: 'cycling',
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80',
        'https://images.unsplash.com/photo-1511994477422-b69e44bd4ea9?w=800&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80'
      ],
      tags: ['road bike', 'carbon fiber', 'cycling', 'bicycle', 'shimano', '21-speed'],
      isFeatured: true,
      salesCount: 543
    }));

    products.push(createProduct({
      name: 'Mountain Bike 29" Full Suspension',
      description: 'Full suspension MTB with 29" wheels, hydraulic disc brakes, and 24-speed drivetrain. Trail-ready.',
      shortDescription: 'Full suspension mountain bike',
      price: 899.99,
      categoryId: 504,
      category: 'cycling',
      images: [
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80',
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
        'https://images.unsplash.com/photo-1511994477422-b69e44bd4ea9?w=800&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80'
      ],
      tags: ['mountain bike', 'mtb', 'cycling', 'full suspension', '29 inch', 'trail'],
      isFeatured: true,
      salesCount: 876
    }));

    products.push(createProduct({
      name: 'Bike Helmet MIPS Technology',
      description: 'Safety-certified bike helmet with MIPS protection, adjustable fit, and excellent ventilation.',
      shortDescription: 'MIPS safety bike helmet',
      price: 79.99,
      categoryId: 504,
      category: 'cycling',
      images: [
        'https://images.unsplash.com/photo-1611506050301-a04c315ab17a?w=800&q=80',
        'https://images.unsplash.com/photo-1590766940554-45cf3c4173d5?w=800&q=80',
        'https://images.unsplash.com/photo-1561070292-82c67ce02691?w=800&q=80',
        'https://images.unsplash.com/photo-1513148378323-3e08e48f8c6c?w=800&q=80'
      ],
      tags: ['bike helmet', 'mips', 'cycling', 'safety', 'protection', 'helmet'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Cycling Shoes with Cleats',
      description: 'Road cycling shoes with stiff carbon sole, BOA closure system, and SPD-SL compatible cleats included.',
      shortDescription: 'Carbon sole cycling shoes',
      price: 149.99,
      categoryId: 504,
      category: 'cycling',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        'https://images.unsplash.com/photo-1514989940723-e8e51d675571?w=800&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
        'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80'
      ],
      tags: ['cycling shoes', 'cleats', 'cycling', 'road bike', 'carbon', 'spd'],
      salesCount: 1234
    }));

    products.push(createProduct({
      name: 'Bike Lights Front and Rear Set',
      description: 'Rechargeable LED bike lights with multiple modes. 1000 lumen front light and red rear flasher.',
      shortDescription: 'Rechargeable bike light set',
      price: 39.99,
      categoryId: 504,
      category: 'cycling',
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80',
        'https://images.unsplash.com/photo-1511994477422-b69e44bd4ea9?w=800&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80'
      ],
      tags: ['bike lights', 'cycling', 'led', 'rechargeable', 'safety', 'lights'],
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Bike Lock U-Lock Heavy Duty',
      description: 'High-security U-lock with 16mm hardened steel shackle. Includes mounting bracket and 2 keys.',
      shortDescription: 'Heavy duty U-lock',
      price: 54.99,
      categoryId: 504,
      category: 'cycling',
      images: [
        'https://images.unsplash.com/photo-1511994477422-b69e44bd4ea9?w=800&q=80',
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80'
      ],
      tags: ['bike lock', 'u-lock', 'cycling', 'security', 'heavy duty', 'theft protection'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Cycling Jersey and Shorts Set',
      description: 'Moisture-wicking cycling kit with padded shorts and breathable jersey. Rear pockets for storage.',
      shortDescription: 'Padded cycling kit',
      price: 79.99,
      categoryId: 504,
      category: 'cycling',
      images: [
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1622260614927-d4e21c69a2de?w=800&q=80',
        'https://images.unsplash.com/photo-1578342976795-062a1b744f37?w=800&q=80'
      ],
      tags: ['cycling jersey', 'cycling shorts', 'cycling', 'padded', 'kit', 'sportswear'],
      salesCount: 1987
    }));

    // =====================================================
    // SPORTS - YOGA & PILATES (Category 505)
    // =====================================================
    products.push(createProduct({
      name: 'Manduka Pro Yoga Mat',
      description: 'Professional-grade 6mm yoga mat with dense cushioning and lifetime guarantee. Non-slip and eco-friendly.',
      shortDescription: 'Professional 6mm yoga mat',
      price: 128.99,
      categoryId: 505,
      category: 'yoga',
      images: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'
      ],
      tags: ['manduka', 'yoga mat', 'yoga', 'pro', 'eco-friendly', 'non-slip'],
      isFeatured: true,
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Yoga Block Set of 2',
      description: 'High-density foam yoga blocks for support and alignment. Lightweight, durable, and easy to clean.',
      shortDescription: 'High-density foam yoga blocks',
      price: 19.99,
      categoryId: 505,
      category: 'yoga',
      images: [
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'
      ],
      tags: ['yoga blocks', 'yoga', 'props', 'foam', 'support', 'alignment'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Yoga Strap 10ft Cotton',
      description: 'Extra-long 10ft yoga strap with D-ring for stretching and flexibility. Durable cotton webbing.',
      shortDescription: '10ft stretching yoga strap',
      price: 14.99,
      categoryId: 505,
      category: 'yoga',
      images: [
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'
      ],
      tags: ['yoga strap', 'yoga', 'stretching', 'flexibility', 'cotton', 'props'],
      salesCount: 2765
    }));

    products.push(createProduct({
      name: 'Pilates Ring Exercise Circle',
      description: 'Resistance ring for Pilates with padded grip handles. Adds challenge to mat work and toning exercises.',
      shortDescription: 'Resistance Pilates ring',
      price: 24.99,
      categoryId: 505,
      category: 'yoga',
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80'
      ],
      tags: ['pilates ring', 'pilates', 'resistance', 'exercise', 'toning', 'circle'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Yoga Bolster Rectangular',
      description: 'Supportive rectangular yoga bolster filled with cotton batting. Perfect for restorative poses.',
      shortDescription: 'Rectangular yoga bolster',
      price: 59.99,
      categoryId: 505,
      category: 'yoga',
      images: [
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'
      ],
      tags: ['yoga bolster', 'yoga', 'bolster', 'restorative', 'props', 'support'],
      salesCount: 987
    }));

    products.push(createProduct({
      name: 'Meditation Cushion Zafu',
      description: 'Traditional meditation cushion filled with buckwheat hulls. Promotes proper posture for meditation.',
      shortDescription: 'Traditional meditation cushion',
      price: 44.99,
      categoryId: 505,
      category: 'yoga',
      images: [
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
      ],
      tags: ['meditation cushion', 'zafu', 'yoga', 'meditation', 'buckwheat', 'cushion'],
      salesCount: 1543
    }));

    products.push(createProduct({
      name: 'Foam Roller for Muscle Recovery',
      description: '36-inch high-density foam roller for muscle recovery, trigger point massage, and mobility work.',
      shortDescription: 'High-density foam roller 36"',
      price: 34.99,
      categoryId: 505,
      category: 'yoga',
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80'
      ],
      tags: ['foam roller', 'recovery', 'massage', 'yoga', 'fitness', 'mobility'],
      salesCount: 3234
    }));

    // =====================================================
    // SPORTS - TEAM SPORTS (Category 506)
    // =====================================================
    products.push(createProduct({
      name: 'Wilson NFL Official Football',
      description: 'Official size and weight NFL football with composite leather cover and deep pebble texture for grip.',
      shortDescription: 'Official NFL football',
      price: 29.99,
      categoryId: 506,
      category: 'team-sports',
      images: [
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
        'https://images.unsplash.com/photo-1577223625816-7546f9a96e4f?w=800&q=80',
        'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80',
        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80'
      ],
      tags: ['football', 'nfl', 'wilson', 'team sports', 'american football', 'ball'],
      isFeatured: true,
      salesCount: 4321
    }));

    products.push(createProduct({
      name: 'Spalding NBA Basketball Official Size',
      description: 'Official size 7 basketball with composite leather cover. Indoor/outdoor use with deep channel design.',
      shortDescription: 'Official NBA basketball',
      price: 39.99,
      categoryId: 506,
      category: 'team-sports',
      images: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
        'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800&q=80',
        'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80',
        'https://images.unsplash.com/photo-1627627256672-027a4613d028?w=800&q=80'
      ],
      tags: ['basketball', 'spalding', 'nba', 'team sports', 'official', 'ball'],
      isFeatured: true,
      salesCount: 5432
    }));

    products.push(createProduct({
      name: 'Adidas FIFA World Cup Soccer Ball',
      description: 'Official match ball with thermally bonded seamless surface. FIFA Quality Pro certified.',
      shortDescription: 'FIFA official soccer ball',
      price: 44.99,
      categoryId: 506,
      category: 'team-sports',
      images: [
        'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800&q=80',
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
        'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80'
      ],
      tags: ['soccer ball', 'football', 'adidas', 'fifa', 'team sports', 'official'],
      isFeatured: true,
      salesCount: 3987
    }));

    products.push(createProduct({
      name: 'Volleyball Official Size Indoor',
      description: 'Official size indoor volleyball with soft touch cover. FIVB approved for competitive play.',
      shortDescription: 'Official indoor volleyball',
      price: 34.99,
      categoryId: 506,
      category: 'team-sports',
      images: [
        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
        'https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&q=80',
        'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80',
        'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80'
      ],
      tags: ['volleyball', 'team sports', 'indoor', 'fivb', 'official', 'ball'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Baseball Glove Leather 11.5"',
      description: 'Premium leather baseball glove with deep pocket. Pre-oiled and game-ready. Perfect for infield.',
      shortDescription: 'Leather baseball glove 11.5"',
      price: 79.99,
      categoryId: 506,
      category: 'team-sports',
      images: [
        'https://images.unsplash.com/photo-1576923849853-63ac60b5d33e?w=800&q=80',
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
        'https://images.unsplash.com/photo-1577223625816-7546f9a96e4f?w=800&q=80',
        'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80'
      ],
      tags: ['baseball glove', 'baseball', 'leather', 'team sports', 'infield', 'mitt'],
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Aluminum Baseball Bat 32"',
      description: 'Lightweight aluminum bat with balanced swing weight. USSSA certified for youth and amateur leagues.',
      shortDescription: 'Aluminum baseball bat 32"',
      price: 69.99,
      categoryId: 506,
      category: 'team-sports',
      images: [
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
        'https://images.unsplash.com/photo-1576923849853-63ac60b5d33e?w=800&q=80',
        'https://images.unsplash.com/photo-1577223625816-7546f9a96e4f?w=800&q=80',
        'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80'
      ],
      tags: ['baseball bat', 'aluminum', 'baseball', 'team sports', 'usssa', 'bat'],
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Tennis Racket Carbon Fiber',
      description: 'Professional tennis racket with carbon fiber frame, 27-inch length, and comfortable grip. Pre-strung.',
      shortDescription: 'Carbon fiber tennis racket',
      price: 129.99,
      categoryId: 506,
      category: 'team-sports',
      images: [
        'https://images.unsplash.com/photo-1617083690859-6a04bb90d906?w=800&q=80',
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
        'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
        'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800&q=80'
      ],
      tags: ['tennis racket', 'tennis', 'carbon fiber', 'team sports', 'professional', 'racquet'],
      salesCount: 1543
    }));

    // =====================================================
    // BOOKS - FICTION (Category 601)
    // =====================================================
    products.push(createProduct({
      name: 'The Midnight Library',
      description: 'Bestselling novel by Matt Haig about a library between life and death where infinite possibilities exist. A heartwarming story about second chances.',
      shortDescription: 'Bestselling novel by Matt Haig',
      price: 16.99,
      categoryId: 601,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'fiction', 'novel', 'bestseller', 'literature'],
      isFeatured: true,
      salesCount: 4567
    }));

    products.push(createProduct({
      name: 'Atomic Habits',
      description: 'Groundbreaking guide by James Clear on building good habits and breaking bad ones. Transform your life with small, incremental changes.',
      shortDescription: 'Life-changing guide to building habits',
      price: 18.99,
      categoryId: 602,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'self-help', 'habits', 'productivity', 'bestseller'],
      isFeatured: true,
      salesCount: 6789
    }));

    // =====================================================
    // BOOKS - FICTION (Category 601) - Additional Products
    // =====================================================
    products.push(createProduct({
      name: 'Where the Crawdads Sing',
      description: 'Captivating novel by Delia Owens about a girl raised in the marshlands. A coming-of-age story meets murder mystery.',
      shortDescription: 'Bestselling marshland mystery',
      price: 17.99,
      categoryId: 601,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'fiction', 'mystery', 'novel', 'bestseller'],
      salesCount: 5432
    }));

    products.push(createProduct({
      name: 'The Seven Husbands of Evelyn Hugo',
      description: 'Taylor Jenkins Reid novel about an aging Hollywood starlet revealing her scandalous past. Compelling and emotional.',
      shortDescription: 'Hollywood icon tells her story',
      price: 16.99,
      categoryId: 601,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'fiction', 'hollywood', 'novel', 'drama'],
      salesCount: 4321
    }));

    products.push(createProduct({
      name: 'Project Hail Mary',
      description: 'Gripping sci-fi thriller by Andy Weir about a lone astronaut on a mission to save Earth. From the author of The Martian.',
      shortDescription: 'Sci-fi thriller about saving Earth',
      price: 19.99,
      categoryId: 601,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'fiction', 'sci-fi', 'thriller', 'space'],
      salesCount: 3987
    }));

    products.push(createProduct({
      name: 'It Ends With Us',
      description: 'Colleen Hoover novel exploring difficult choices in love and relationships. Emotional and thought-provoking.',
      shortDescription: 'Powerful romance about hard choices',
      price: 15.99,
      categoryId: 601,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'fiction', 'romance', 'novel', 'emotional'],
      salesCount: 5678
    }));

    products.push(createProduct({
      name: 'The Silent Patient',
      description: 'Psychological thriller by Alex Michaelides about a woman who stops speaking after shooting her husband. Shocking twist ending.',
      shortDescription: 'Psychological thriller with twist',
      price: 16.99,
      categoryId: 601,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80'
      ],
      tags: ['book', 'fiction', 'thriller', 'psychological', 'mystery'],
      salesCount: 4567
    }));

    products.push(createProduct({
      name: 'Circe',
      description: 'Madeline Miller retells Greek mythology from the witch Circe\'s perspective. Beautifully written feminist fantasy.',
      shortDescription: 'Greek mythology retold beautifully',
      price: 17.99,
      categoryId: 601,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'fiction', 'mythology', 'fantasy', 'literary'],
      salesCount: 3456
    }));

    // =====================================================
    // BOOKS - NON-FICTION (Category 602) - Additional Products
    // =====================================================
    products.push(createProduct({
      name: 'Sapiens: A Brief History of Humankind',
      description: 'Yuval Noah Harari explores human history from the Stone Age to modern times. Fascinating and thought-provoking.',
      shortDescription: 'Brief history of humankind',
      price: 21.99,
      categoryId: 602,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'non-fiction', 'history', 'anthropology', 'bestseller'],
      isFeatured: true,
      salesCount: 5432
    }));

    products.push(createProduct({
      name: 'Educated: A Memoir',
      description: 'Tara Westover memoir about growing up in Idaho mountains and earning a PhD from Cambridge. Inspiring journey.',
      shortDescription: 'Inspiring memoir about education',
      price: 19.99,
      categoryId: 602,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'non-fiction', 'memoir', 'education', 'inspiring'],
      isFeatured: true,
      salesCount: 4876
    }));

    products.push(createProduct({
      name: 'Thinking, Fast and Slow',
      description: 'Daniel Kahneman explores the two systems that drive our thinking. Nobel Prize winner insights on decision-making.',
      shortDescription: 'Psychology of decision-making',
      price: 20.99,
      categoryId: 602,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'non-fiction', 'psychology', 'economics', 'decision-making'],
      salesCount: 3987
    }));

    products.push(createProduct({
      name: 'The Body Keeps the Score',
      description: 'Bessel van der Kolk explores trauma and healing. Groundbreaking insights into brain, mind, and body connection.',
      shortDescription: 'Understanding trauma and healing',
      price: 22.99,
      categoryId: 602,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'non-fiction', 'psychology', 'trauma', 'health'],
      salesCount: 4321
    }));

    products.push(createProduct({
      name: 'Can\'t Hurt Me',
      description: 'David Goggins memoir about self-discipline and mental toughness. From Navy SEAL to ultra-endurance athlete.',
      shortDescription: 'Self-discipline and mental toughness',
      price: 18.99,
      categoryId: 602,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
      ],
      tags: ['book', 'non-fiction', 'memoir', 'motivation', 'self-help'],
      salesCount: 5678
    }));

    products.push(createProduct({
      name: 'The Immortal Life of Henrietta Lacks',
      description: 'Rebecca Skloot tells the story of HeLa cells and the woman behind them. Medical ethics and racial justice.',
      shortDescription: 'True story of medical ethics',
      price: 17.99,
      categoryId: 602,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'non-fiction', 'science', 'biography', 'ethics'],
      salesCount: 3456
    }));

    // =====================================================
    // BOOKS - CHILDREN'S BOOKS (Category 603)
    // =====================================================
    products.push(createProduct({
      name: 'The Very Hungry Caterpillar',
      description: 'Classic children\'s book by Eric Carle about a caterpillar\'s transformation. Beautiful illustrations and simple story.',
      shortDescription: 'Classic children\'s picture book',
      price: 10.99,
      categoryId: 603,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'children', 'picture book', 'classic', 'education'],
      isFeatured: true,
      salesCount: 6789
    }));

    products.push(createProduct({
      name: 'Where the Wild Things Are',
      description: 'Maurice Sendak classic about Max and the wild things. Imaginative adventure that captivates generations.',
      shortDescription: 'Classic imaginative adventure',
      price: 11.99,
      categoryId: 603,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'children', 'picture book', 'classic', 'adventure'],
      salesCount: 5432
    }));

    products.push(createProduct({
      name: 'Charlotte\'s Web',
      description: 'E.B. White story about friendship between a spider and a pig. Timeless tale that teaches about love and loss.',
      shortDescription: 'Classic friendship story',
      price: 9.99,
      categoryId: 603,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'children', 'chapter book', 'classic', 'friendship'],
      salesCount: 4876
    }));

    products.push(createProduct({
      name: 'Harry Potter and the Sorcerer\'s Stone',
      description: 'J.K. Rowling\'s magical beginning to the Harry Potter series. Perfect introduction to chapter books for young readers.',
      shortDescription: 'Magical Harry Potter beginning',
      price: 14.99,
      categoryId: 603,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'children', 'fantasy', 'harry potter', 'bestseller'],
      isFeatured: true,
      salesCount: 8765
    }));

    products.push(createProduct({
      name: 'The Giving Tree',
      description: 'Shel Silverstein classic about unconditional love. Simple yet profound story that resonates with all ages.',
      shortDescription: 'Story about unconditional love',
      price: 10.99,
      categoryId: 603,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'children', 'picture book', 'classic', 'love'],
      salesCount: 5678
    }));

    products.push(createProduct({
      name: 'Goodnight Moon',
      description: 'Margaret Wise Brown bedtime classic. Soothing rhythm perfect for bedtime routines with little ones.',
      shortDescription: 'Classic bedtime story',
      price: 8.99,
      categoryId: 603,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'children', 'picture book', 'bedtime', 'classic'],
      salesCount: 6543
    }));

    products.push(createProduct({
      name: 'Diary of a Wimpy Kid',
      description: 'Jeff Kinney hilarious series about middle school adventures. Perfect for reluctant readers.',
      shortDescription: 'Hilarious middle school diary',
      price: 12.99,
      categoryId: 603,
      category: 'books',
      images: [
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80'
      ],
      tags: ['book', 'children', 'humor', 'graphic novel', 'series'],
      salesCount: 5432
    }));

    // =====================================================
    // BOOKS - OFFICE SUPPLIES (Category 604)
    // =====================================================
    products.push(createProduct({
      name: 'Moleskine Classic Notebook Hardcover',
      description: 'Premium hardcover notebook with acid-free paper, elastic closure, and ribbon bookmark. Perfect for journaling.',
      shortDescription: 'Premium hardcover notebook',
      price: 19.99,
      categoryId: 604,
      category: 'stationery',
      images: [
        'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
        'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
        'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80'
      ],
      tags: ['notebook', 'moleskine', 'stationery', 'journal', 'office'],
      isFeatured: true,
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Pilot G2 Gel Pens Set of 12',
      description: 'Premium gel ink pens with comfortable grip. Smooth writing in assorted colors. Perfect for office or school.',
      shortDescription: 'Premium gel ink pens 12-pack',
      price: 14.99,
      categoryId: 604,
      category: 'stationery',
      images: [
        'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
        'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
        'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80'
      ],
      tags: ['pens', 'pilot', 'stationery', 'gel pens', 'office'],
      salesCount: 5432
    }));

    products.push(createProduct({
      name: 'Post-it Notes Super Sticky 24-Pack',
      description: 'Classic Post-it notes in assorted sizes and colors. Super sticky adhesive holds notes securely.',
      shortDescription: 'Super sticky notes 24-pack',
      price: 21.99,
      categoryId: 604,
      category: 'stationery',
      images: [
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
        'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
        'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
        'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80'
      ],
      tags: ['post-it', 'sticky notes', 'stationery', 'office', 'organization'],
      salesCount: 6789
    }));

    products.push(createProduct({
      name: 'Stapler Heavy Duty Desktop',
      description: 'All-metal heavy duty stapler holds 200 sheets. Adjustable depth settings and includes staples.',
      shortDescription: 'Heavy duty desktop stapler',
      price: 29.99,
      categoryId: 604,
      category: 'stationery',
      images: [
        'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
        'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
        'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80'
      ],
      tags: ['stapler', 'office', 'stationery', 'heavy duty', 'desk'],
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Scotch Transparent Tape 6-Pack',
      description: 'Original transparent tape with clear finish. Includes 6 rolls with desktop dispenser.',
      shortDescription: 'Transparent tape 6-pack',
      price: 12.99,
      categoryId: 604,
      category: 'stationery',
      images: [
        'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
        'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
        'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80'
      ],
      tags: ['tape', 'scotch', 'stationery', 'office', 'transparent'],
      salesCount: 4321
    }));

    products.push(createProduct({
      name: 'File Folders Letter Size 100-Pack',
      description: 'Manila file folders with reinforced tabs. Standard letter size for organizing documents.',
      shortDescription: 'Manila file folders 100-pack',
      price: 18.99,
      categoryId: 604,
      category: 'stationery',
      images: [
        'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
        'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
        'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80'
      ],
      tags: ['file folders', 'office', 'stationery', 'organization', 'filing'],
      salesCount: 3234
    }));

    products.push(createProduct({
      name: 'Desk Organizer 5-Compartment',
      description: 'Metal mesh desk organizer with 5 compartments for pens, paper clips, and office supplies.',
      shortDescription: 'Metal mesh desk organizer',
      price: 24.99,
      categoryId: 604,
      category: 'stationery',
      images: [
        'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80',
        'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
        'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'
      ],
      tags: ['desk organizer', 'office', 'stationery', 'organization', 'storage'],
      salesCount: 2345
    }));

    // =====================================================
    // BOOKS - ART SUPPLIES (Category 605)
    // =====================================================
    products.push(createProduct({
      name: 'Prismacolor Premier Colored Pencils 72-Set',
      description: 'Professional quality colored pencils with soft, thick cores. Rich, vibrant colors perfect for artists.',
      shortDescription: 'Professional colored pencils 72-set',
      price: 64.99,
      categoryId: 605,
      category: 'art',
      images: [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80',
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&q=80'
      ],
      tags: ['colored pencils', 'prismacolor', 'art supplies', 'drawing', 'professional'],
      isFeatured: true,
      salesCount: 2134
    }));

    products.push(createProduct({
      name: 'Winsor & Newton Watercolor Paint Set',
      description: 'Professional watercolor paint set with 24 vibrant colors. Artist quality pigments in tubes.',
      shortDescription: 'Professional watercolor paint 24-set',
      price: 79.99,
      categoryId: 605,
      category: 'art',
      images: [
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80',
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&q=80'
      ],
      tags: ['watercolor', 'paint', 'art supplies', 'winsor newton', 'professional'],
      isFeatured: true,
      salesCount: 1876
    }));

    products.push(createProduct({
      name: 'Strathmore Sketch Pad 100 Sheets',
      description: 'Premium sketch pad with 100 sheets of acid-free paper. Perfect for pencil, charcoal, and pen drawings.',
      shortDescription: 'Premium sketch pad 100 sheets',
      price: 16.99,
      categoryId: 605,
      category: 'art',
      images: [
        'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&q=80'
      ],
      tags: ['sketch pad', 'strathmore', 'art supplies', 'paper', 'drawing'],
      salesCount: 3456
    }));

    products.push(createProduct({
      name: 'Acrylic Paint Set 24 Colors',
      description: 'Vibrant acrylic paint set with 24 colors in tubes. Non-toxic and perfect for canvas painting.',
      shortDescription: 'Acrylic paint set 24 colors',
      price: 29.99,
      categoryId: 605,
      category: 'art',
      images: [
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&q=80',
        'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80'
      ],
      tags: ['acrylic paint', 'paint', 'art supplies', 'canvas', 'colors'],
      salesCount: 2876
    }));

    products.push(createProduct({
      name: 'Artist Paint Brush Set 15-Piece',
      description: 'Professional paint brush set with synthetic and natural bristles. Various sizes for different techniques.',
      shortDescription: 'Professional paint brush set 15-piece',
      price: 34.99,
      categoryId: 605,
      category: 'art',
      images: [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80'
      ],
      tags: ['paint brushes', 'brushes', 'art supplies', 'painting', 'professional'],
      salesCount: 2345
    }));

    products.push(createProduct({
      name: 'Canvas Panels 9x12 Inch 12-Pack',
      description: 'Pre-primed canvas panels perfect for acrylic and oil painting. Professional quality surface.',
      shortDescription: 'Canvas panels 9x12 inch 12-pack',
      price: 24.99,
      categoryId: 605,
      category: 'art',
      images: [
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80'
      ],
      tags: ['canvas', 'canvas panels', 'art supplies', 'painting', 'primed'],
      salesCount: 1987
    }));

    products.push(createProduct({
      name: 'Copic Marker Set 36 Colors',
      description: 'Professional alcohol-based markers with dual tips. Refillable and perfect for illustration and design.',
      shortDescription: 'Professional marker set 36 colors',
      price: 149.99,
      categoryId: 605,
      category: 'art',
      images: [
        'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&q=80'
      ],
      tags: ['copic markers', 'markers', 'art supplies', 'illustration', 'professional'],
      salesCount: 1543
    }));

    // =====================================================
    // TOYS - BUILDING (Category 702)
    // =====================================================
    products.push(createProduct({
      name: 'LEGO Star Wars Millennium Falcon',
      description: 'Ultimate Collector Series Millennium Falcon with 7,541 pieces. Incredible detail and display-worthy design for adult builders.',
      shortDescription: 'Ultimate Collector Millennium Falcon',
      price: 849.99,
      categoryId: 702,
      category: 'toys',
      images: [
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80',
        'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80',
        'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80',
        'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=800&q=80'
      ],
      tags: ['lego', 'star wars', 'building', 'collectible', 'toys', 'falcon'],
      isFeatured: true,
      salesCount: 345
    }));

    products.push(createProduct({
      name: 'Building Blocks Mega Set',
      description: '1000-piece building blocks set compatible with major brands. Includes various shapes and colors for endless creativity.',
      shortDescription: '1000-piece creative building set',
      price: 49.99,
      categoryId: 702,
      category: 'toys',
      images: [
        'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=800&q=80',
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80',
        'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80',
        'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80'
      ],
      tags: ['building blocks', 'toys', 'creative', 'kids', 'educational'],
      salesCount: 2345
    }));

    // Insert all products
    await queryInterface.bulkInsert('products', products);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
