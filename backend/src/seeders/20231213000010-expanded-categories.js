'use strict';

/**
 * Expanded Categories Seeder
 * Creates a comprehensive category hierarchy for a production-ready e-commerce platform
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, clear dependent tables in correct order (foreign key constraints)
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('cart_items', null, {});
    await queryInterface.bulkDelete('wishlists', null, {});
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    
    const now = new Date();
    
    // Parent Categories (Main categories)
    const parentCategories = [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics',
        description: 'Discover the latest electronics, gadgets, and tech accessories',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
        parentId: null,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing, footwear, and accessories for all',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
        parentId: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Everything you need to make your house a home',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
        parentId: null,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        name: 'Beauty & Personal Care',
        slug: 'beauty-personal-care',
        description: 'Skincare, makeup, haircare, and wellness products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        parentId: null,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Sports equipment, activewear, and fitness gear',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        parentId: null,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 6,
        name: 'Books & Stationery',
        slug: 'books-stationery',
        description: 'Books, office supplies, and creative materials',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
        parentId: null,
        isActive: true,
        sortOrder: 6,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 7,
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Fun toys, board games, and entertainment for all ages',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80',
        parentId: null,
        isActive: true,
        sortOrder: 7,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 8,
        name: 'Grocery & Gourmet',
        slug: 'grocery-gourmet',
        description: 'Fresh groceries, snacks, and gourmet food items',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        parentId: null,
        isActive: true,
        sortOrder: 8,
        createdAt: now,
        updatedAt: now
      }
    ];

    // Subcategories
    const subcategories = [
      // Electronics Subcategories (Parent ID: 1)
      {
        id: 101,
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones from top brands',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
        parentId: 1,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 102,
        name: 'Laptops & Computers',
        slug: 'laptops-computers',
        description: 'High-performance laptops and desktop computers',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
        parentId: 1,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 103,
        name: 'Audio & Headphones',
        slug: 'audio-headphones',
        description: 'Premium audio equipment and headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        parentId: 1,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 104,
        name: 'Cameras & Photography',
        slug: 'cameras-photography',
        description: 'Professional cameras and photography gear',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
        parentId: 1,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 105,
        name: 'Wearable Tech',
        slug: 'wearable-tech',
        description: 'Smartwatches, fitness trackers, and wearables',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        parentId: 1,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 106,
        name: 'Gaming',
        slug: 'gaming',
        description: 'Gaming consoles, accessories, and peripherals',
        image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
        parentId: 1,
        isActive: true,
        sortOrder: 6,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 107,
        name: 'TV & Home Entertainment',
        slug: 'tv-home-entertainment',
        description: 'Smart TVs, projectors, and home theater systems',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
        parentId: 1,
        isActive: true,
        sortOrder: 7,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 108,
        name: 'Tablets & E-Readers',
        slug: 'tablets-ereaders',
        description: 'Tablets and e-readers for work and entertainment',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        parentId: 1,
        isActive: true,
        sortOrder: 8,
        createdAt: now,
        updatedAt: now
      },

      // Fashion Subcategories (Parent ID: 2)
      {
        id: 201,
        name: "Men's Fashion",
        slug: 'mens-fashion',
        description: 'Stylish clothing and accessories for men',
        image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80',
        parentId: 2,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 202,
        name: "Women's Fashion",
        slug: 'womens-fashion',
        description: 'Trendy clothing and accessories for women',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
        parentId: 2,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 203,
        name: "Kids' Fashion",
        slug: 'kids-fashion',
        description: 'Adorable clothing for children',
        image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80',
        parentId: 2,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 204,
        name: 'Footwear',
        slug: 'footwear',
        description: 'Shoes, sneakers, and boots for all',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        parentId: 2,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 205,
        name: 'Bags & Luggage',
        slug: 'bags-luggage',
        description: 'Handbags, backpacks, and travel luggage',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        parentId: 2,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 206,
        name: 'Watches & Jewelry',
        slug: 'watches-jewelry',
        description: 'Elegant watches and fine jewelry',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
        parentId: 2,
        isActive: true,
        sortOrder: 6,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 207,
        name: 'Sunglasses & Eyewear',
        slug: 'sunglasses-eyewear',
        description: 'Designer sunglasses and optical frames',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
        parentId: 2,
        isActive: true,
        sortOrder: 7,
        createdAt: now,
        updatedAt: now
      },

      // Home & Living Subcategories (Parent ID: 3)
      {
        id: 301,
        name: 'Furniture',
        slug: 'furniture',
        description: 'Modern furniture for every room',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
        parentId: 3,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 302,
        name: 'Bedding & Mattresses',
        slug: 'bedding-mattresses',
        description: 'Quality bedding and comfortable mattresses',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
        parentId: 3,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 303,
        name: 'Kitchen & Dining',
        slug: 'kitchen-dining',
        description: 'Kitchenware, cookware, and dining essentials',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        parentId: 3,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 304,
        name: 'Home Decor',
        slug: 'home-decor',
        description: 'Decorative items to beautify your home',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
        parentId: 3,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 305,
        name: 'Lighting',
        slug: 'lighting',
        description: 'Lamps, fixtures, and smart lighting',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        parentId: 3,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 306,
        name: 'Bath & Towels',
        slug: 'bath-towels',
        description: 'Bathroom essentials and luxury towels',
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        parentId: 3,
        isActive: true,
        sortOrder: 6,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 307,
        name: 'Storage & Organization',
        slug: 'storage-organization',
        description: 'Organize your space with smart storage solutions',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        parentId: 3,
        isActive: true,
        sortOrder: 7,
        createdAt: now,
        updatedAt: now
      },

      // Beauty & Personal Care Subcategories (Parent ID: 4)
      {
        id: 401,
        name: 'Skincare',
        slug: 'skincare',
        description: 'Cleansers, moisturizers, and treatments',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
        parentId: 4,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 402,
        name: 'Makeup',
        slug: 'makeup',
        description: 'Foundations, lipsticks, and cosmetics',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        parentId: 4,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 403,
        name: 'Haircare',
        slug: 'haircare',
        description: 'Shampoos, conditioners, and styling products',
        image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80',
        parentId: 4,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 404,
        name: 'Fragrances',
        slug: 'fragrances',
        description: 'Perfumes, colognes, and body mists',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        parentId: 4,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 405,
        name: "Men's Grooming",
        slug: 'mens-grooming',
        description: 'Grooming essentials for men',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
        parentId: 4,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 406,
        name: 'Wellness & Health',
        slug: 'wellness-health',
        description: 'Vitamins, supplements, and wellness products',
        image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
        parentId: 4,
        isActive: true,
        sortOrder: 6,
        createdAt: now,
        updatedAt: now
      },

      // Sports & Fitness Subcategories (Parent ID: 5)
      {
        id: 501,
        name: 'Exercise & Fitness',
        slug: 'exercise-fitness',
        description: 'Home gym equipment and fitness accessories',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        parentId: 5,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 502,
        name: 'Outdoor Sports',
        slug: 'outdoor-sports',
        description: 'Camping, hiking, and outdoor gear',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
        parentId: 5,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 503,
        name: 'Sportswear',
        slug: 'sportswear',
        description: 'Athletic clothing and activewear',
        image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        parentId: 5,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 504,
        name: 'Cycling',
        slug: 'cycling',
        description: 'Bikes, helmets, and cycling accessories',
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
        parentId: 5,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 505,
        name: 'Yoga & Pilates',
        slug: 'yoga-pilates',
        description: 'Yoga mats, props, and accessories',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        parentId: 5,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 506,
        name: 'Team Sports',
        slug: 'team-sports',
        description: 'Equipment for football, basketball, and more',
        image: 'https://images.unsplash.com/photo-1461896836934- voices-a.jpg?w=800&q=80',
        parentId: 5,
        isActive: true,
        sortOrder: 6,
        createdAt: now,
        updatedAt: now
      },

      // Books & Stationery Subcategories (Parent ID: 6)
      {
        id: 601,
        name: 'Fiction',
        slug: 'fiction',
        description: 'Novels, thrillers, and literary fiction',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
        parentId: 6,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 602,
        name: 'Non-Fiction',
        slug: 'non-fiction',
        description: 'Biographies, self-help, and educational books',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
        parentId: 6,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 603,
        name: "Children's Books",
        slug: 'childrens-books',
        description: 'Picture books and young readers',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
        parentId: 6,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 604,
        name: 'Office Supplies',
        slug: 'office-supplies',
        description: 'Pens, notebooks, and desk accessories',
        image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80',
        parentId: 6,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 605,
        name: 'Art Supplies',
        slug: 'art-supplies',
        description: 'Paints, brushes, and creative materials',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        parentId: 6,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      },

      // Toys & Games Subcategories (Parent ID: 7)
      {
        id: 701,
        name: 'Action Figures & Collectibles',
        slug: 'action-figures-collectibles',
        description: 'Action figures, statues, and collectibles',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80',
        parentId: 7,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 702,
        name: 'Building Toys',
        slug: 'building-toys',
        description: 'LEGO, blocks, and construction sets',
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80',
        parentId: 7,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 703,
        name: 'Board Games & Puzzles',
        slug: 'board-games-puzzles',
        description: 'Classic board games and challenging puzzles',
        image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80',
        parentId: 7,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 704,
        name: 'Educational Toys',
        slug: 'educational-toys',
        description: 'STEM toys and learning kits',
        image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80',
        parentId: 7,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 705,
        name: 'Remote Control Toys',
        slug: 'remote-control-toys',
        description: 'RC cars, drones, and robots',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',
        parentId: 7,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      },

      // Grocery & Gourmet Subcategories (Parent ID: 8)
      {
        id: 801,
        name: 'Snacks & Chocolates',
        slug: 'snacks-chocolates',
        description: 'Delicious snacks and premium chocolates',
        image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80',
        parentId: 8,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 802,
        name: 'Beverages',
        slug: 'beverages',
        description: 'Coffee, tea, and refreshing drinks',
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
        parentId: 8,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 803,
        name: 'Breakfast & Cereals',
        slug: 'breakfast-cereals',
        description: 'Start your day with healthy breakfast options',
        image: 'https://images.unsplash.com/photo-1517093728432-a0440f8d45af?w=800&q=80',
        parentId: 8,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 804,
        name: 'Organic & Natural',
        slug: 'organic-natural',
        description: 'Organic and all-natural food products',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        parentId: 8,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 805,
        name: 'Cooking Essentials',
        slug: 'cooking-essentials',
        description: 'Spices, oils, and cooking ingredients',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        parentId: 8,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now
      }
    ];

    // Insert all categories
    await queryInterface.bulkInsert('categories', [...parentCategories, ...subcategories]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
