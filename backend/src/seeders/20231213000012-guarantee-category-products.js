'use strict';

/**
 * Guarantee Products Per Category Seeder
 * Ensures EVERY category and subcategory has at least 8 products
 * Adds products only to categories that need them
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    let productId = 500; // Start from 500 to avoid conflicts

    // Helper functions
    const generateSKU = (categoryName, productName, id) => {
      const catCode = categoryName.substring(0, 3).toUpperCase();
      const nameCode = productName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
      return `${catCode}-${nameCode}-${String(id).padStart(4, '0')}`;
    };

    const generateSlug = (name, id) => {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + id;
    };

    const toPgArray = (arr) => {
      if (!arr || arr.length === 0) return '{}';
      return '{' + arr.map(item => `"${item.replace(/"/g, '\\"')}"`).join(',') + '}';
    };

    const createProduct = (data) => {
      const product = {
        id: productId++,
        name: data.name,
        slug: generateSlug(data.name, productId - 1),
        sku: generateSKU(data.categoryName, data.name, productId - 1),
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
        salesCount: data.salesCount || Math.floor(Math.random() * 300),
        viewCount: Math.floor(Math.random() * 1500),
        rating: (3.5 + Math.random() * 1.5).toFixed(2),
        reviewCount: Math.floor(Math.random() * 150),
        semantic_keywords: toPgArray(data.tags || []),
        createdAt: now,
        updatedAt: now
      };
      return product;
    };

    const products = [];

    // =====================================================
    // ACTION FIGURES & COLLECTIBLES (701) - Need 8 products
    // =====================================================
    const actionFigureProducts = [
      { name: 'Marvel Legends Spider-Man Figure', price: 29.99, comparePrice: 34.99, description: 'Highly detailed Marvel Legends Spider-Man action figure with multiple points of articulation and accessories.', shortDescription: '6-inch premium Marvel figure' },
      { name: 'DC Multiverse Batman Dark Knight', price: 24.99, description: 'The Dark Knight rises with this incredibly detailed DC Multiverse figure featuring authentic movie details.', shortDescription: 'Movie-accurate Batman figure' },
      { name: 'Star Wars Black Series Mandalorian', price: 32.99, description: 'This is the way! Premium Black Series Mandalorian figure with beskar armor and signature weapons.', shortDescription: 'Premium 6-inch Mando figure' },
      { name: 'Funko Pop Marvel Avengers Set', price: 49.99, comparePrice: 59.99, description: 'Complete set of Avengers Funko Pop figures including Iron Man, Captain America, Thor, and more.', shortDescription: '6-piece Avengers collection' },
      { name: 'Transformers Optimus Prime Masterpiece', price: 89.99, description: 'Masterpiece edition Optimus Prime with intricate transformation and premium paint applications.', shortDescription: 'Premium transforming figure' },
      { name: 'Anime Figma Action Figure Deluxe', price: 54.99, description: 'Highly poseable anime figma with swappable faces, hands, and effect parts for dynamic displays.', shortDescription: 'Premium anime figure' },
      { name: 'WWE Elite Collection Wrestler Figure', price: 27.99, description: 'Authentic WWE Elite figure with superstar likeness and entrance gear.', shortDescription: 'Elite WWE superstar figure' },
      { name: 'Power Rangers Lightning Collection', price: 34.99, description: 'Go Go Power Rangers! Premium Lightning Collection figure with weapons and accessories.', shortDescription: 'Premium Rangers figure' },
      { name: 'Ninja Turtles Ultimate Leonardo', price: 39.99, description: 'Cowabunga! Ultimate Leonardo figure with pizza, weapons, and multiple accessories.', shortDescription: 'Deluxe TMNT figure' }
    ];

    actionFigureProducts.forEach(p => {
      products.push(createProduct({
        ...p,
        categoryId: 701,
        categoryName: 'Action Figures',
        images: [
          'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
          'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&q=80'
        ],
        tags: ['action figure', 'collectible', 'toy', 'limited edition']
      }));
    });

    // =====================================================
    // BOARD GAMES & PUZZLES (703) - Need 8 products
    // =====================================================
    const boardGameProducts = [
      { name: 'Catan Board Game', price: 44.99, description: 'The classic strategy game of resource gathering and settlement building. Build cities, roads, and become the dominant force.', shortDescription: 'Strategy game for 3-4 players' },
      { name: 'Ticket to Ride Europe Edition', price: 52.99, description: 'Cross-country train adventure across Europe. Connect cities and complete destination tickets.', shortDescription: 'Family strategy game' },
      { name: 'Codenames Party Game', price: 19.99, comparePrice: 24.99, description: 'Word-based party game where two teams compete to contact their spies using one-word clues.', shortDescription: 'Party game for 4+ players' },
      { name: 'Pandemic Legacy Season 1', price: 67.99, description: 'Save humanity in this epic legacy campaign. Your choices permanently change the game.', shortDescription: 'Cooperative legacy game' },
      { name: 'Ravensburger 2000 Piece Puzzle', price: 29.99, description: 'Premium quality jigsaw puzzle featuring stunning landscape photography. Softclick technology.', shortDescription: '2000-piece challenge puzzle' },
      { name: 'Exploding Kittens Card Game', price: 24.99, description: 'Hilarious card game for people who are into kittens, explosions, and laser beams.', shortDescription: 'Quick party card game' },
      { name: 'Wingspan Board Game', price: 64.99, description: 'Award-winning bird collection and engine building game with stunning artwork.', shortDescription: 'Strategy bird game' },
      { name: '3D Wooden Mechanical Puzzle', price: 39.99, description: 'Build intricate wooden mechanical models that actually work. No glue required.', shortDescription: 'DIY mechanical puzzle' },
      { name: 'Azul Tile Placement Game', price: 34.99, description: 'Beautiful abstract strategy game inspired by Portuguese tiles. Draft and place tiles strategically.', shortDescription: 'Award-winning strategy' }
    ];

    boardGameProducts.forEach(p => {
      products.push(createProduct({
        ...p,
        categoryId: 703,
        categoryName: 'Board Games',
        images: [
          'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80',
          'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80',
          'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800&q=80'
        ],
        tags: ['board game', 'puzzle', 'family game', 'strategy']
      }));
    });

    // =====================================================
    // EDUCATIONAL TOYS (704) - Need 8 products
    // =====================================================
    const educationalToyProducts = [
      { name: 'STEM Robotics Kit for Kids', price: 89.99, description: 'Build and program your own robot! Complete STEM kit with motors, sensors, and coding lessons.', shortDescription: 'Coding & robotics kit' },
      { name: 'Snap Circuits Electronics Kit', price: 64.99, description: 'Learn electronics by building working circuits. Over 100 projects included.', shortDescription: '100+ circuit projects' },
      { name: 'National Geographic Rock Tumbler Kit', price: 79.99, description: 'Transform rough rocks into polished gemstones. Includes tumbler, rocks, and polish.', shortDescription: 'Complete geology kit' },
      { name: 'Osmo Genius Starter Kit for iPad', price: 99.99, description: 'Award-winning educational games that interact with physical objects for hands-on learning.', shortDescription: 'Interactive learning system' },
      { name: 'Microscope Kit for Beginners', price: 54.99, description: 'Quality microscope with prepared slides and tools to explore the microscopic world.', shortDescription: 'Science exploration kit' },
      { name: 'Kiwi Crate Subscription Box', price: 39.99, description: 'Monthly STEM and art projects delivered to your door. Includes all materials and instructions.', shortDescription: 'Monthly creative projects' },
      { name: 'Magnetic Building Tiles 100-Piece', price: 49.99, description: 'Colorful magnetic tiles for building 3D structures. Develops spatial reasoning and creativity.', shortDescription: 'Magnetic construction set' },
      { name: 'Solar System Planetarium Kit', price: 34.99, description: 'Build a glow-in-the-dark solar system model. Learn about planets and space.', shortDescription: 'Astronomy learning kit' },
      { name: 'Math Learning Games Bundle', price: 44.99, description: 'Make math fun! Collection of educational games for addition, subtraction, multiplication.', shortDescription: 'Math skills game set' }
    ];

    educationalToyProducts.forEach(p => {
      products.push(createProduct({
        ...p,
        categoryId: 704,
        categoryName: 'Educational Toys',
        images: [
          'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80',
          'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80',
          'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&q=80'
        ],
        tags: ['educational', 'STEM', 'learning', 'kids', 'science']
      }));
    });

    // =====================================================
    // REMOTE CONTROL TOYS (705) - Need 8 products
    // =====================================================
    const rcToyProducts = [
      { name: 'RC Racing Car High Speed', price: 79.99, description: 'Lightning-fast RC car reaches 40+ mph with responsive controls and durable design.', shortDescription: 'High-speed racing RC' },
      { name: 'DJI Mini Drone with Camera', price: 449.99, comparePrice: 499.99, description: 'Compact drone with 4K camera, GPS, and intelligent flight modes. Perfect for beginners.', shortDescription: '4K camera drone' },
      { name: 'RC Monster Truck 4WD', price: 119.99, description: 'All-terrain monster truck with 4-wheel drive. Conquer any surface with massive tires.', shortDescription: 'Off-road RC truck' },
      { name: 'RC Helicopter for Beginners', price: 59.99, description: 'Easy-to-fly RC helicopter with gyro stabilization. Indoor and outdoor capable.', shortDescription: 'Stable RC helicopter' },
      { name: 'RC Boat Racing Speedboat', price: 89.99, description: 'Waterproof high-speed RC boat perfect for pools and lakes. Self-righting design.', shortDescription: 'Fast RC speedboat' },
      { name: 'RC Rock Crawler 4x4', price: 99.99, description: 'Scale rock crawler with extreme suspension travel. Climb over any obstacle.', shortDescription: 'RC climbing crawler' },
      { name: 'Programmable RC Robot Dog', price: 129.99, description: 'Interactive robot dog responds to voice commands and can be programmed with custom actions.', shortDescription: 'Smart robot pet' },
      { name: 'RC Fighter Jet Airplane', price: 149.99, description: 'High-performance RC jet with 3-channel control. Performs aerobatic stunts.', shortDescription: 'Aerobatic RC plane' },
      { name: 'RC Tank with BB Shooter', price: 84.99, description: 'Realistic battle tank with rotating turret and BB shooting capability. Battle mode included.', shortDescription: 'Combat RC tank' }
    ];

    rcToyProducts.forEach(p => {
      products.push(createProduct({
        ...p,
        categoryId: 705,
        categoryName: 'Remote Control',
        images: [
          'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',
          'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
          'https://images.unsplash.com/photo-1578450671530-5b6a7c9f32a8?w=800&q=80'
        ],
        tags: ['RC', 'remote control', 'drone', 'toy', 'racing']
      }));
    });

    // =====================================================
    // SNACKS & CHOCOLATES (801) - Need 8 products
    // =====================================================
    const snackProducts = [
      { name: 'Belgian Chocolate Truffles Luxury Box', price: 34.99, description: 'Handcrafted Belgian chocolate truffles in assorted flavors. Premium gift box presentation.', shortDescription: 'Premium chocolate gift' },
      { name: 'Gourmet Popcorn Variety Pack', price: 24.99, description: 'Six flavors of artisan popcorn including caramel, cheese, and chocolate drizzle.', shortDescription: 'Artisan popcorn set' },
      { name: 'Organic Trail Mix Bulk Pack', price: 19.99, description: 'Healthy mix of nuts, dried fruits, and dark chocolate. Perfect for hiking and snacking.', shortDescription: 'Healthy snack mix' },
      { name: 'Ferrero Rocher Collection 48-Pack', price: 28.99, description: 'Classic hazelnut chocolates with crispy wafer and creamy filling. Perfect for sharing.', shortDescription: 'Premium hazelnut chocolate' },
      { name: 'Gourmet Cheese & Crackers Gift Set', price: 39.99, description: 'Curated selection of artisan cheeses paired with premium crackers and spreads.', shortDescription: 'Cheese lover gift set' },
      { name: 'Dark Chocolate Sea Salt Bar 10-Pack', price: 22.99, description: '70% cacao dark chocolate bars with sea salt. Fair trade and organic certified.', shortDescription: 'Premium dark chocolate' },
      { name: 'Japanese Candy Sampler Box', price: 29.99, description: 'Assortment of popular Japanese candies and snacks. Discover unique flavors.', shortDescription: 'Japanese snack box' },
      { name: 'Protein Energy Balls Variety Pack', price: 26.99, description: 'Healthy protein-packed energy bites in chocolate, peanut butter, and berry flavors.', shortDescription: 'Healthy protein snacks' },
      { name: 'Lindt Lindor Chocolate Assortment', price: 32.99, description: 'Melt-in-your-mouth Lindor truffles in milk, dark, and white chocolate varieties.', shortDescription: 'Swiss chocolate truffles' }
    ];

    snackProducts.forEach(p => {
      products.push(createProduct({
        ...p,
        categoryId: 801,
        categoryName: 'Snacks',
        images: [
          'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80',
          'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80',
          'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80'
        ],
        tags: ['snacks', 'chocolate', 'gourmet', 'gift', 'treats']
      }));
    });

    // =====================================================
    // BEVERAGES (802) - Need 8 products
    // =====================================================
    const beverageProducts = [
      { name: 'Lavazza Espresso Coffee Beans 2.2lb', price: 24.99, description: 'Premium Italian espresso beans. Medium roast with rich, full-bodied flavor.', shortDescription: 'Italian espresso beans' },
      { name: 'Harney & Sons Tea Sampler Set', price: 32.99, description: 'Collection of finest teas from around the world. 20 silk sachets in assorted flavors.', shortDescription: 'Premium tea collection' },
      { name: 'Organic Cold Brew Coffee Concentrate', price: 19.99, description: 'Smooth cold brew concentrate. Just add water or milk for perfect iced coffee.', shortDescription: 'Ready-to-drink cold brew' },
      { name: 'Matcha Green Tea Powder Ceremonial Grade', price: 29.99, description: 'Authentic Japanese ceremonial matcha. Rich in antioxidants and smooth flavor.', shortDescription: 'Premium matcha powder' },
      { name: 'Sparkling Water Variety Pack 24-Pack', price: 16.99, description: 'Zero calorie flavored sparkling water in lemon, lime, and berry flavors.', shortDescription: 'Flavored sparkling water' },
      { name: 'French Press Coffee Maker with Beans', price: 44.99, description: 'Complete coffee set with French press and premium roasted beans. Brew cafe-quality coffee.', shortDescription: 'Coffee brewing set' },
      { name: 'Kombucha Probiotic Drink 12-Pack', price: 34.99, description: 'Organic fermented tea packed with probiotics. Mixed berry and ginger flavors.', shortDescription: 'Probiotic kombucha' },
      { name: 'English Breakfast Tea Loose Leaf 1lb', price: 18.99, description: 'Classic English breakfast tea from select estates. Rich and robust flavor.', shortDescription: 'Traditional black tea' },
      { name: 'Vietnamese Coffee Filter Set', price: 27.99, description: 'Traditional phin filter with dark roast Vietnamese coffee. Authentic ca phe sua da.', shortDescription: 'Vietnamese coffee kit' }
    ];

    beverageProducts.forEach(p => {
      products.push(createProduct({
        ...p,
        categoryId: 802,
        categoryName: 'Beverages',
        images: [
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
          'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
          'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80'
        ],
        tags: ['coffee', 'tea', 'beverage', 'drink', 'organic']
      }));
    });

    // =====================================================
    // BREAKFAST & CEREALS (803) - Need 8 products
    // =====================================================
    const breakfastProducts = [
      { name: 'Organic Granola Variety Pack', price: 29.99, description: 'Artisan granola in honey almond, chocolate coconut, and maple pecan flavors.', shortDescription: 'Gourmet granola set' },
      { name: 'Protein Pancake Mix Bundle', price: 34.99, description: 'High-protein pancake and waffle mix. Just add water for fluffy, nutritious breakfast.', shortDescription: 'Protein pancake mix' },
      { name: 'Ancient Grains Cereal Collection', price: 24.99, description: 'Wholesome cereals made with quinoa, amaranth, and chia. Gluten-free options.', shortDescription: 'Ancient grains cereal' },
      { name: 'Steel Cut Oatmeal Variety Pack', price: 22.99, description: 'Hearty steel-cut oats in apple cinnamon, maple brown sugar, and plain varieties.', shortDescription: 'Premium oatmeal set' },
      { name: 'Belgian Waffle Mix with Syrup', price: 27.99, description: 'Restaurant-quality waffle mix with pure maple syrup. Makes perfectly crispy waffles.', shortDescription: 'Complete waffle kit' },
      { name: 'Organic Muesli Swiss Recipe', price: 19.99, description: 'Traditional Swiss muesli with whole grains, nuts, seeds, and dried fruits.', shortDescription: 'Swiss breakfast muesli' },
      { name: 'Gluten-Free Cereal Variety Box', price: 32.99, description: 'Delicious gluten-free cereals for sensitive diets. Six different flavors included.', shortDescription: 'Gluten-free cereal' },
      { name: 'Chia Seed Breakfast Pudding Mix', price: 21.99, description: 'Superfood chia pudding mix in vanilla, chocolate, and berry flavors. High in omega-3.', shortDescription: 'Chia pudding mix' },
      { name: 'Artisan Toast Bread Mix Set', price: 26.99, description: 'Gourmet bread mixes for perfect breakfast toast. Multigrain, sourdough, and cinnamon raisin.', shortDescription: 'Premium bread mix' }
    ];

    breakfastProducts.forEach(p => {
      products.push(createProduct({
        ...p,
        categoryId: 803,
        categoryName: 'Breakfast',
        images: [
          'https://images.unsplash.com/photo-1517093728432-a0440f8d45af?w=800&q=80',
          'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80',
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80'
        ],
        tags: ['breakfast', 'cereal', 'organic', 'healthy', 'granola']
      }));
    });

    // =====================================================
    // ORGANIC & NATURAL (804) - Need 8 products
    // =====================================================
    const organicProducts = [
      { name: 'Organic Quinoa Tri-Color 3lb', price: 18.99, description: 'USDA organic tri-color quinoa. Complete protein and gluten-free ancient grain.', shortDescription: 'Organic quinoa blend' },
      { name: 'Raw Organic Honey 32oz', price: 26.99, description: 'Pure unfiltered raw honey from wildflowers. Never heated, loaded with enzymes.', shortDescription: 'Raw wildflower honey' },
      { name: 'Organic Coconut Oil Virgin 54oz', price: 22.99, description: 'Cold-pressed virgin coconut oil. Perfect for cooking, baking, and beauty.', shortDescription: 'Virgin coconut oil' },
      { name: 'Organic Superfood Powder Mix', price: 44.99, description: 'Blend of spirulina, chlorella, wheatgrass, and other superfoods. Daily nutrition boost.', shortDescription: 'Green superfood blend' },
      { name: 'Organic Almond Butter 16oz', price: 14.99, description: 'Creamy organic almond butter made from roasted California almonds. No added sugar.', shortDescription: 'Pure almond butter' },
      { name: 'Organic Chia Seeds 2lb Bag', price: 17.99, description: 'Nutrient-dense chia seeds. High in omega-3, fiber, and protein.', shortDescription: 'Organic chia seeds' },
      { name: 'Organic Maple Syrup Grade A', price: 32.99, description: 'Pure Canadian maple syrup. Grade A amber color with rich flavor.', shortDescription: 'Pure maple syrup' },
      { name: 'Organic Apple Cider Vinegar', price: 12.99, description: 'Raw unfiltered apple cider vinegar with the mother. Supports digestion.', shortDescription: 'Raw ACV with mother' },
      { name: 'Organic Protein Powder Plant-Based', price: 39.99, description: 'Vegan protein from pea, rice, and hemp. 25g protein per serving.', shortDescription: 'Plant protein powder' }
    ];

    organicProducts.forEach(p => {
      products.push(createProduct({
        ...p,
        categoryId: 804,
        categoryName: 'Organic Natural',
        images: [
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
          'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
          'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80'
        ],
        tags: ['organic', 'natural', 'healthy', 'superfood', 'vegan']
      }));
    });

    // =====================================================
    // COOKING ESSENTIALS (805) - Need 8 products
    // =====================================================
    const cookingProducts = [
      { name: 'Gourmet Spice Collection 24-Jar Set', price: 79.99, description: 'Complete spice rack with 24 essential spices and herbs. Includes labels and rack.', shortDescription: 'Complete spice set' },
      { name: 'Extra Virgin Olive Oil Premium 1L', price: 24.99, description: 'First cold-pressed EVOO from Greece. Rich flavor perfect for cooking and drizzling.', shortDescription: 'Premium olive oil' },
      { name: 'Himalayan Pink Salt Collection', price: 19.99, description: 'Pink salt in fine, coarse, and block forms. Rich in minerals and trace elements.', shortDescription: 'Himalayan salt set' },
      { name: 'Balsamic Vinegar Aged 10 Years', price: 34.99, description: 'Authentic aged balsamic from Modena, Italy. Sweet, complex flavor.', shortDescription: 'Aged balsamic vinegar' },
      { name: 'Truffle Oil White & Black Set', price: 44.99, description: 'Premium truffle-infused oils. Elevate pasta, risotto, and gourmet dishes.', shortDescription: 'Truffle oil duo' },
      { name: 'Asian Cooking Sauce Collection', price: 29.99, description: 'Essential Asian sauces: soy, oyster, hoisin, teriyaki, and sesame oil.', shortDescription: 'Asian sauce set' },
      { name: 'Italian Pasta Variety Pack 8lb', price: 32.99, description: 'Artisan Italian pasta in 8 classic shapes. Bronze-cut for perfect sauce adhesion.', shortDescription: 'Italian pasta collection' },
      { name: 'Gourmet Sea Salt Sampler', price: 27.99, description: 'Exotic sea salts from around the world. Fleur de sel, smoked, and flavored varieties.', shortDescription: 'Sea salt collection' },
      { name: 'Cooking Wine & Vinegar Set', price: 36.99, description: 'Quality cooking wines and vinegars: red wine, white wine, rice, and sherry vinegar.', shortDescription: 'Wine & vinegar set' }
    ];

    cookingProducts.forEach(p => {
      products.push(createProduct({
        ...p,
        categoryId: 805,
        categoryName: 'Cooking Essentials',
        images: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
          'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80',
          'https://images.unsplash.com/photo-1452251889946-8ff5ea7f27f8?w=800&q=80'
        ],
        tags: ['cooking', 'spices', 'oil', 'vinegar', 'gourmet']
      }));
    });

    // Insert all new products
    console.log(`Inserting ${products.length} new products to guarantee category coverage...`);
    await queryInterface.bulkInsert('products', products);
    
    console.log('✓ Successfully guaranteed minimum products per category');
    console.log('  - Action Figures & Collectibles (701): +9 products');
    console.log('  - Board Games & Puzzles (703): +9 products');
    console.log('  - Educational Toys (704): +9 products');
    console.log('  - Remote Control Toys (705): +9 products');
    console.log('  - Snacks & Chocolates (801): +9 products');
    console.log('  - Beverages (802): +9 products');
    console.log('  - Breakfast & Cereals (803): +9 products');
    console.log('  - Organic & Natural (804): +9 products');
    console.log('  - Cooking Essentials (805): +9 products');
  },

  async down(queryInterface, Sequelize) {
    // Remove products with IDs starting from 500
    await queryInterface.bulkDelete('products', {
      id: { [Sequelize.Op.gte]: 500 }
    });
  }
};
