'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const products = [];

    const laptops = [
      { name: 'MacBook Pro 16"', price: 2499.99, stock: 25, categoryId: 2, sku: 'LAP-MBP-001', description: 'Powerful laptop with M2 Pro chip, 16GB RAM, and 512GB SSD', shortDescription: 'High-performance laptop for professionals', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', salesCount: 145, isFeatured: true },
      { name: 'Dell XPS 15', price: 1799.99, stock: 30, categoryId: 2, sku: 'LAP-DXP-002', description: 'Premium Windows laptop with 11th Gen Intel i7, 16GB RAM', shortDescription: 'Sleek and powerful Windows laptop', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', salesCount: 98, isFeatured: true },
      { name: 'HP Pavilion 14', price: 899.99, stock: 50, categoryId: 2, sku: 'LAP-HPP-003', description: 'Affordable laptop perfect for students and everyday use', shortDescription: 'Budget-friendly reliable laptop', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', salesCount: 167 },
      { name: 'Lenovo ThinkPad X1', price: 1599.99, stock: 20, categoryId: 2, sku: 'LAP-LTP-004', description: 'Business-class laptop with military-grade durability', shortDescription: 'Professional business laptop', imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500', salesCount: 76 },
      { name: 'ASUS ROG Zephyrus', price: 2199.99, stock: 15, categoryId: 2, sku: 'LAP-ASZ-005', description: 'Gaming laptop with RTX 4070, 32GB RAM, RGB keyboard', shortDescription: 'Ultimate gaming laptop', imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', salesCount: 54, isFeatured: true },
      { name: 'Microsoft Surface Laptop 5', price: 1299.99, stock: 35, categoryId: 2, sku: 'LAP-MSL-006', description: 'Elegant touchscreen laptop with Windows 11', shortDescription: 'Premium touchscreen laptop', imageUrl: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500', salesCount: 89 },
      { name: 'Acer Aspire 5', price: 649.99, stock: 60, categoryId: 2, sku: 'LAP-ACA-007', description: 'Entry-level laptop for basic computing needs', shortDescription: 'Affordable everyday laptop', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', salesCount: 134 },
      { name: 'MacBook Air M2', price: 1199.99, stock: 40, categoryId: 2, sku: 'LAP-MBA-008', description: 'Thin and light laptop with incredible battery life', shortDescription: 'Ultra-portable Apple laptop', imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500', salesCount: 201, isFeatured: true },
      { name: 'Razer Blade 15', price: 2499.99, stock: 12, categoryId: 2, sku: 'LAP-RBL-009', description: 'Sleek gaming laptop with RTX 4080', shortDescription: 'Premium gaming machine', imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', salesCount: 43 },
      { name: 'Samsung Galaxy Book3', price: 1099.99, stock: 28, categoryId: 2, sku: 'LAP-SGB-010', description: 'Versatile 2-in-1 laptop with S Pen', shortDescription: 'Convertible laptop tablet', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', salesCount: 67 },
      { name: 'LG Gram 17', price: 1799.99, stock: 18, categoryId: 2, sku: 'LAP-LGG-011', description: 'Incredibly lightweight 17-inch laptop', shortDescription: 'Ultralight large screen laptop', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', salesCount: 52 },
      { name: 'MSI Creator Z16', price: 2099.99, stock: 14, categoryId: 2, sku: 'LAP-MSC-012', description: 'Content creator laptop with 4K display', shortDescription: 'Professional creator laptop', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', salesCount: 38 }
    ];

    const smartphones = [
      { name: 'iPhone 15 Pro Max', price: 1199.99, stock: 45, categoryId: 3, sku: 'PHN-I15P-001', description: 'Latest iPhone with A17 Pro chip and titanium design', shortDescription: 'Flagship Apple smartphone', imageUrl: 'https://images.unsplash.com/photo-1592286927505-86c27a4cc53a?w=500', salesCount: 234, isFeatured: true },
      { name: 'Samsung Galaxy S24 Ultra', price: 1099.99, stock: 38, categoryId: 3, sku: 'PHN-SGS-002', description: 'Premium Android phone with S Pen and 200MP camera', shortDescription: 'Top-tier Samsung flagship', imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', salesCount: 187, isFeatured: true },
      { name: 'Google Pixel 8 Pro', price: 899.99, stock: 50, categoryId: 3, sku: 'PHN-GPX-003', description: 'Pure Android experience with incredible AI features', shortDescription: 'Google flagship phone', imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', salesCount: 156 },
      { name: 'OnePlus 12', price: 799.99, stock: 55, categoryId: 3, sku: 'PHN-OP1-004', description: 'Fast charging flagship with Snapdragon 8 Gen 3', shortDescription: 'Flagship killer smartphone', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', salesCount: 143 },
      { name: 'iPhone 14', price: 799.99, stock: 60, categoryId: 3, sku: 'PHN-I14-005', description: 'Reliable iPhone with excellent camera system', shortDescription: 'Popular iPhone model', imageUrl: 'https://images.unsplash.com/photo-1592286927505-86c27a4cc53a?w=500', salesCount: 298, isFeatured: true },
      { name: 'Samsung Galaxy A54', price: 449.99, stock: 80, categoryId: 3, sku: 'PHN-SGA-006', description: 'Mid-range phone with flagship features', shortDescription: 'Best value Samsung phone', imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', salesCount: 221 },
      { name: 'Xiaomi 13 Pro', price: 899.99, stock: 42, categoryId: 3, sku: 'PHN-XM1-007', description: 'Premium phone with Leica cameras', shortDescription: 'Photography-focused flagship', imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', salesCount: 112 },
      { name: 'Nothing Phone 2', price: 599.99, stock: 48, categoryId: 3, sku: 'PHN-NTH-008', description: 'Unique design with Glyph interface', shortDescription: 'Innovative transparent phone', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', salesCount: 98 },
      { name: 'OPPO Find X6 Pro', price: 949.99, stock: 35, categoryId: 3, sku: 'PHN-OPF-009', description: 'Camera-centric flagship with Hasselblad tuning', shortDescription: 'Premium camera phone', imageUrl: 'https://images.unsplash.com/photo-1592286927505-86c27a4cc53a?w=500', salesCount: 87 },
      { name: 'Motorola Edge 40 Pro', price: 699.99, stock: 52, categoryId: 3, sku: 'PHN-MTE-010', description: 'Curved display flagship with near-stock Android', shortDescription: 'Clean Android experience', imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', salesCount: 76 },
      { name: 'Sony Xperia 1 V', price: 1199.99, stock: 22, categoryId: 3, sku: 'PHN-SXP-011', description: 'Professional smartphone with 4K display', shortDescription: 'Content creator phone', imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', salesCount: 54 },
      { name: 'ASUS ROG Phone 7', price: 999.99, stock: 28, categoryId: 3, sku: 'PHN-ARG-012', description: 'Gaming smartphone with cooling system', shortDescription: 'Ultimate gaming phone', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', salesCount: 67 },
      { name: 'Realme GT 3', price: 549.99, stock: 65, categoryId: 3, sku: 'PHN-RGT-013', description: 'Budget flagship with 240W charging', shortDescription: 'Fast charging champion', imageUrl: 'https://images.unsplash.com/photo-1592286927505-86c27a4cc53a?w=500', salesCount: 134 },
      { name: 'Honor Magic 5 Pro', price: 849.99, stock: 40, categoryId: 3, sku: 'PHN-HM5-014', description: 'AI-powered flagship with curved display', shortDescription: 'Smart AI phone', imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', salesCount: 89 },
      { name: 'Vivo X90 Pro', price: 899.99, stock: 38, categoryId: 3, sku: 'PHN-VX9-015', description: 'Photography flagship with ZEISS optics', shortDescription: 'Pro camera smartphone', imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', salesCount: 72 }
    ];

    const mensClothing = [
      { name: 'Classic Denim Jacket', price: 79.99, stock: 100, categoryId: 5, sku: 'MCL-CDJ-001', description: 'Timeless denim jacket for all seasons', shortDescription: 'Versatile denim jacket', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', salesCount: 189 },
      { name: 'Leather Bomber Jacket', price: 199.99, stock: 45, categoryId: 5, sku: 'MCL-LBJ-002', description: 'Premium leather jacket with vintage styling', shortDescription: 'Classic leather jacket', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', salesCount: 87, isFeatured: true },
      { name: 'Slim Fit Chinos', price: 49.99, stock: 150, categoryId: 5, sku: 'MCL-SFC-003', description: 'Comfortable chinos perfect for business casual', shortDescription: 'Everyday chinos', imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', salesCount: 234 },
      { name: 'Wool Blend Coat', price: 159.99, stock: 60, categoryId: 5, sku: 'MCL-WBC-004', description: 'Elegant winter coat for formal occasions', shortDescription: 'Formal winter coat', imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500', salesCount: 76 },
      { name: 'Cotton Oxford Shirt', price: 39.99, stock: 200, categoryId: 5, sku: 'MCL-COS-005', description: 'Classic button-down shirt in various colors', shortDescription: 'Essential dress shirt', imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', salesCount: 312 },
      { name: 'Hooded Sweatshirt', price: 54.99, stock: 180, categoryId: 5, sku: 'MCL-HDS-006', description: 'Comfortable hoodie for casual wear', shortDescription: 'Cozy casual hoodie', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', salesCount: 267 },
      { name: 'Athletic Joggers', price: 44.99, stock: 140, categoryId: 5, sku: 'MCL-ATJ-007', description: 'Sporty joggers with moisture-wicking fabric', shortDescription: 'Comfortable joggers', imageUrl: 'https://images.unsplash.com/photo-1552084162-ec07b3f162dc?w=500', salesCount: 198 },
      { name: 'Formal Suit', price: 399.99, stock: 35, categoryId: 5, sku: 'MCL-FST-008', description: 'Two-piece suit perfect for business meetings', shortDescription: 'Professional business suit', imageUrl: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=500', salesCount: 54, isFeatured: true },
      { name: 'Cargo Shorts', price: 34.99, stock: 160, categoryId: 5, sku: 'MCL-CGS-009', description: 'Practical shorts with multiple pockets', shortDescription: 'Utility cargo shorts', imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500', salesCount: 223 },
      { name: 'Polo T-Shirt', price: 29.99, stock: 220, categoryId: 5, sku: 'MCL-PLT-010', description: 'Classic polo shirt in pique cotton', shortDescription: 'Casual polo shirt', imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500', salesCount: 345 }
    ];

    const womensClothing = [
      { name: 'Floral Summer Dress', price: 69.99, stock: 120, categoryId: 6, sku: 'WCL-FSD-001', description: 'Light and breezy dress perfect for summer', shortDescription: 'Elegant summer dress', imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', salesCount: 278, isFeatured: true },
      { name: 'Leather Handbag', price: 149.99, stock: 75, categoryId: 6, sku: 'WCL-LHB-002', description: 'Premium leather handbag with multiple compartments', shortDescription: 'Stylish leather bag', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', salesCount: 167, isFeatured: true },
      { name: 'High-Waisted Jeans', price: 59.99, stock: 160, categoryId: 6, sku: 'WCL-HWJ-003', description: 'Flattering high-waisted denim jeans', shortDescription: 'Trendy high-waist jeans', imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', salesCount: 298 },
      { name: 'Silk Blouse', price: 79.99, stock: 95, categoryId: 6, sku: 'WCL-SLB-004', description: 'Elegant silk blouse for office or evening', shortDescription: 'Premium silk blouse', imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', salesCount: 143 },
      { name: 'Yoga Leggings', price: 39.99, stock: 200, categoryId: 6, sku: 'WCL-YGL-005', description: 'Stretchy leggings perfect for workout or casual', shortDescription: 'Athletic leggings', imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500', salesCount: 387 },
      { name: 'Wool Cardigan', price: 89.99, stock: 85, categoryId: 6, sku: 'WCL-WCD-006', description: 'Cozy cardigan for layering in cooler weather', shortDescription: 'Warm knit cardigan', imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500', salesCount: 178 },
      { name: 'Maxi Skirt', price: 54.99, stock: 110, categoryId: 6, sku: 'WCL-MXS-007', description: 'Flowing maxi skirt in various prints', shortDescription: 'Bohemian maxi skirt', imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', salesCount: 201 },
      { name: 'Trench Coat', price: 179.99, stock: 50, categoryId: 6, sku: 'WCL-TRC-008', description: 'Classic trench coat with belt', shortDescription: 'Timeless trench coat', imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500', salesCount: 92, isFeatured: true },
      { name: 'Cocktail Dress', price: 129.99, stock: 65, categoryId: 6, sku: 'WCL-CTD-009', description: 'Elegant dress for special occasions', shortDescription: 'Party cocktail dress', imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', salesCount: 134 },
      { name: 'Cashmere Sweater', price: 149.99, stock: 55, categoryId: 6, sku: 'WCL-CSW-010', description: 'Luxurious cashmere sweater', shortDescription: 'Premium cashmere', imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500', salesCount: 98 }
    ];

    const books = [
      { name: 'The Midnight Library', price: 16.99, stock: 300, categoryId: 8, sku: 'BOK-TML-001', description: 'Bestselling novel by Matt Haig', shortDescription: 'Contemporary fiction', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', salesCount: 456 },
      { name: 'Atomic Habits', price: 18.99, stock: 250, categoryId: 8, sku: 'BOK-ATH-002', description: 'Life-changing book on building good habits', shortDescription: 'Self-help bestseller', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', salesCount: 523, isFeatured: true },
      { name: 'Dune', price: 14.99, stock: 180, categoryId: 8, sku: 'BOK-DUN-003', description: 'Classic science fiction epic by Frank Herbert', shortDescription: 'Sci-fi masterpiece', imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500', salesCount: 287 },
      { name: 'Educated', price: 15.99, stock: 220, categoryId: 8, sku: 'BOK-EDU-004', description: 'Memoir by Tara Westover', shortDescription: 'Inspiring memoir', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', salesCount: 398 },
      { name: 'The Psychology of Money', price: 17.99, stock: 200, categoryId: 8, sku: 'BOK-POM-005', description: 'Insights on wealth and happiness', shortDescription: 'Financial wisdom', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', salesCount: 412, isFeatured: true },
      { name: '1984', price: 12.99, stock: 350, categoryId: 8, sku: 'BOK-1984-006', description: 'George Orwell\'s dystopian classic', shortDescription: 'Classic literature', imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500', salesCount: 567 },
      { name: 'Sapiens', price: 19.99, stock: 190, categoryId: 8, sku: 'BOK-SAP-007', description: 'A brief history of humankind by Yuval Noah Harari', shortDescription: 'History bestseller', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', salesCount: 445 },
      { name: 'The Hobbit', price: 13.99, stock: 280, categoryId: 8, sku: 'BOK-HOB-008', description: 'Fantasy adventure by J.R.R. Tolkien', shortDescription: 'Fantasy classic', imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500', salesCount: 378 }
    ];

    const homeLiving = [
      { name: 'Memory Foam Pillow Set', price: 49.99, stock: 150, categoryId: 7, sku: 'HOM-MFP-001', description: 'Set of 2 ergonomic memory foam pillows', shortDescription: 'Comfortable pillows', imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500', salesCount: 234 },
      { name: 'Smart LED Bulbs 4-Pack', price: 39.99, stock: 200, categoryId: 7, sku: 'HOM-SLB-002', description: 'WiFi-enabled color-changing bulbs', shortDescription: 'Smart lighting', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', salesCount: 312, isFeatured: true },
      { name: 'Egyptian Cotton Sheets', price: 89.99, stock: 80, categoryId: 7, sku: 'HOM-ECS-003', description: 'Luxury 800-thread count sheet set', shortDescription: 'Premium bed sheets', imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500', salesCount: 167 },
      { name: 'Ceramic Dinnerware Set', price: 129.99, stock: 65, categoryId: 7, sku: 'HOM-CDS-004', description: '16-piece modern dinnerware set', shortDescription: 'Complete dish set', imageUrl: 'https://images.unsplash.com/photo-1584268427959-c0987dd1a66a?w=500', salesCount: 143 },
      { name: 'Throw Blanket', price: 34.99, stock: 180, categoryId: 7, sku: 'HOM-THB-005', description: 'Soft fleece blanket for couch or bed', shortDescription: 'Cozy throw blanket', imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500', salesCount: 289 }
    ];

    const sports = [
      { name: 'Yoga Mat Premium', price: 29.99, stock: 200, categoryId: 9, sku: 'SPT-YMP-001', description: 'Non-slip yoga mat with carrying strap', shortDescription: 'Exercise yoga mat', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', salesCount: 345 },
      { name: 'Adjustable Dumbbells', price: 249.99, stock: 45, categoryId: 9, sku: 'SPT-ADB-002', description: 'Space-saving adjustable weight set', shortDescription: 'Home gym weights', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', salesCount: 134, isFeatured: true },
      { name: 'Camping Tent 4-Person', price: 149.99, stock: 60, categoryId: 9, sku: 'SPT-CT4-003', description: 'Waterproof tent for family camping', shortDescription: 'Family camping tent', imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500', salesCount: 98 },
      { name: 'Running Shoes', price: 119.99, stock: 120, categoryId: 9, sku: 'SPT-RNS-004', description: 'Lightweight cushioned running shoes', shortDescription: 'Performance running shoes', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', salesCount: 267 },
      { name: 'Mountain Bike', price: 599.99, stock: 25, categoryId: 9, sku: 'SPT-MTB-005', description: '21-speed mountain bike with suspension', shortDescription: 'Off-road mountain bike', imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500', salesCount: 76, isFeatured: true }
    ];

    const toys = [
      { name: 'LEGO Star Wars Set', price: 89.99, stock: 100, categoryId: 10, sku: 'TOY-LSW-001', description: '500-piece Star Wars building set', shortDescription: 'LEGO building set', imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500', salesCount: 198, isFeatured: true },
      { name: 'Board Game Collection', price: 39.99, stock: 150, categoryId: 10, sku: 'TOY-BGC-002', description: 'Classic board games for family fun', shortDescription: 'Family board games', imageUrl: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=500', salesCount: 234 },
      { name: 'Remote Control Car', price: 79.99, stock: 80, categoryId: 10, sku: 'TOY-RCC-003', description: 'High-speed RC car with rechargeable battery', shortDescription: 'RC racing car', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', salesCount: 167 },
      { name: 'Educational Robot Kit', price: 129.99, stock: 55, categoryId: 10, sku: 'TOY-ERK-004', description: 'STEM learning robot for kids', shortDescription: 'Coding robot toy', imageUrl: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500', salesCount: 112 },
      { name: 'Puzzle Set 1000 Pieces', price: 24.99, stock: 200, categoryId: 10, sku: 'TOY-PS1-005', description: 'Beautiful landscape jigsaw puzzle', shortDescription: 'Jigsaw puzzle', imageUrl: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=500', salesCount: 278 }
    ];

    // Electronics parent category (id: 1) - general electronics accessories
    const electronics = [
      { name: 'Wireless Earbuds Pro', price: 149.99, stock: 120, categoryId: 1, sku: 'ELC-WEP-001', description: 'Premium true wireless earbuds with active noise cancellation and 30-hour battery life', shortDescription: 'ANC wireless earbuds', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', salesCount: 456, isFeatured: true },
      { name: 'Mechanical Gaming Keyboard', price: 129.99, stock: 85, categoryId: 1, sku: 'ELC-MGK-002', description: 'RGB mechanical keyboard with Cherry MX switches and programmable macros', shortDescription: 'RGB gaming keyboard', imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500', salesCount: 312 },
      { name: 'Portable Power Bank 20000mAh', price: 49.99, stock: 200, categoryId: 1, sku: 'ELC-PPB-003', description: 'High-capacity power bank with fast charging and dual USB ports', shortDescription: 'Fast charge power bank', imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', salesCount: 534 },
      { name: '4K Webcam with Microphone', price: 89.99, stock: 95, categoryId: 1, sku: 'ELC-4KW-004', description: 'Professional 4K webcam with built-in noise-canceling microphone for streaming', shortDescription: 'HD streaming webcam', imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', salesCount: 267, isFeatured: true },
      { name: 'Wireless Gaming Mouse', price: 79.99, stock: 150, categoryId: 1, sku: 'ELC-WGM-005', description: 'Lightweight wireless gaming mouse with 25K DPI sensor and RGB lighting', shortDescription: 'Pro gaming mouse', imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', salesCount: 389 }
    ];

    // Fashion parent category (id: 4) - unisex accessories
    const fashionAccessories = [
      { name: 'Classic Leather Watch', price: 199.99, stock: 60, categoryId: 4, sku: 'FAS-CLW-001', description: 'Elegant leather strap watch with Swiss movement and sapphire crystal', shortDescription: 'Premium leather watch', imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500', salesCount: 178, isFeatured: true },
      { name: 'Designer Sunglasses', price: 149.99, stock: 80, categoryId: 4, sku: 'FAS-DSG-002', description: 'UV400 polarized sunglasses with titanium frame and premium case', shortDescription: 'Polarized sunglasses', imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', salesCount: 234 },
      { name: 'Leather Belt Premium', price: 59.99, stock: 150, categoryId: 4, sku: 'FAS-LBP-003', description: 'Genuine full-grain leather belt with brushed nickel buckle', shortDescription: 'Premium leather belt', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', salesCount: 312 },
      { name: 'Cashmere Scarf', price: 89.99, stock: 70, categoryId: 4, sku: 'FAS-CSF-004', description: 'Luxuriously soft 100% cashmere scarf in classic patterns', shortDescription: 'Luxury cashmere scarf', imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500', salesCount: 145, isFeatured: true },
      { name: 'Canvas Backpack', price: 79.99, stock: 100, categoryId: 4, sku: 'FAS-CBP-005', description: 'Vintage-style canvas backpack with leather trim and laptop compartment', shortDescription: 'Stylish canvas backpack', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', salesCount: 267 }
    ];

    const allProducts = [
      ...laptops,
      ...smartphones,
      ...mensClothing,
      ...womensClothing,
      ...books,
      ...homeLiving,
      ...sports,
      ...toys,
      ...electronics,
      ...fashionAccessories
    ];

    allProducts.forEach((product, index) => {
      products.push({
        name: product.name,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        sku: product.sku,
        price: product.price,
        comparePrice: product.price * 1.3,
        costPrice: product.price * 0.6,
        stock: product.stock,
        lowStockThreshold: 10,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        images: `{${product.imageUrl}}`, 
        tags: '{}', 
        weight: null,
        dimensions: null,
        shortDescription: product.shortDescription,
        description: product.description,
        isFeatured: product.isFeatured || false,
        isActive: true,
        salesCount: product.salesCount || 0,
        viewCount: Math.floor(Math.random() * 1000),
        metaTitle: null,
        metaDescription: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    await queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
