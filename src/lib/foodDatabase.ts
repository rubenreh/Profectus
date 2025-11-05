export type FoodSuggestion = {
  name: string;
  brand?: string;
  servingSize: string;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
};

export const FOOD_SUGGESTIONS: FoodSuggestion[] = [
  // Proteins
  { name: "Chicken Breast, cooked", servingSize: "100 g", calories: 165, proteinGrams: 31, carbGrams: 0, fatGrams: 3.6 },
  { name: "Chicken Thigh, cooked", servingSize: "100 g", calories: 209, proteinGrams: 26, carbGrams: 0, fatGrams: 10.9 },
  { name: "Chicken Wing, cooked", servingSize: "100 g", calories: 203, proteinGrams: 30, carbGrams: 0, fatGrams: 8.1 },
  { name: "Ground Turkey, 93/7", servingSize: "100 g", calories: 189, proteinGrams: 27, carbGrams: 0, fatGrams: 8 },
  { name: "Salmon, cooked", servingSize: "100 g", calories: 208, proteinGrams: 22, carbGrams: 0, fatGrams: 13 },
  { name: "Tuna, canned in water", servingSize: "100 g", calories: 116, proteinGrams: 26, carbGrams: 0, fatGrams: 0.8 },
  { name: "Cod, cooked", servingSize: "100 g", calories: 105, proteinGrams: 23, carbGrams: 0, fatGrams: 0.9 },
  { name: "Shrimp, cooked", servingSize: "100 g", calories: 99, proteinGrams: 24, carbGrams: 0.2, fatGrams: 0.3 },
  { name: "Ground Beef 90/10, cooked", servingSize: "100 g", calories: 217, proteinGrams: 26, carbGrams: 0, fatGrams: 12 },
  { name: "Ground Beef 80/20, cooked", servingSize: "100 g", calories: 254, proteinGrams: 25, carbGrams: 0, fatGrams: 17 },
  { name: "Steak, Ribeye, cooked", servingSize: "100 g", calories: 291, proteinGrams: 25, carbGrams: 0, fatGrams: 21 },
  { name: "Steak, Sirloin, cooked", servingSize: "100 g", calories: 206, proteinGrams: 28, carbGrams: 0, fatGrams: 9 },
  { name: "Steak, Filet Mignon, cooked", servingSize: "100 g", calories: 264, proteinGrams: 29, carbGrams: 0, fatGrams: 17 },
  { name: "Steak, New York Strip, cooked", servingSize: "100 g", calories: 259, proteinGrams: 26, carbGrams: 0, fatGrams: 18 },
  { name: "Pork Chop, cooked", servingSize: "100 g", calories: 231, proteinGrams: 27, carbGrams: 0, fatGrams: 13 },
  { name: "Pork Tenderloin, cooked", servingSize: "100 g", calories: 162, proteinGrams: 26, carbGrams: 0, fatGrams: 5.5 },
  { name: "Bacon, cooked", servingSize: "2 slices (16 g)", calories: 87, proteinGrams: 6, carbGrams: 0.2, fatGrams: 7 },
  { name: "Sausage, Italian, cooked", servingSize: "100 g", calories: 301, proteinGrams: 13, carbGrams: 2.5, fatGrams: 26 },
  { name: "Sausage, Breakfast, cooked", servingSize: "1 link (13 g)", calories: 43, proteinGrams: 2, carbGrams: 0.3, fatGrams: 3.8 },
  { name: "Sausage, Chorizo, cooked", servingSize: "100 g", calories: 455, proteinGrams: 24, carbGrams: 2, fatGrams: 38 },
  { name: "Egg (large)", servingSize: "1 egg (50 g)", calories: 72, proteinGrams: 6, carbGrams: 0.4, fatGrams: 4.8 },
  { name: "Egg Whites", servingSize: "100 g", calories: 52, proteinGrams: 11, carbGrams: 0.7, fatGrams: 0.2 },
  { name: "Tofu, firm", servingSize: "100 g", calories: 144, proteinGrams: 17, carbGrams: 3, fatGrams: 8 },
  { name: "Tempeh, cooked", servingSize: "100 g", calories: 193, proteinGrams: 19, carbGrams: 9, fatGrams: 11 },
  
  // Dairy
  { name: "Greek Yogurt, nonfat", servingSize: "170 g (6 oz)", calories: 100, proteinGrams: 17, carbGrams: 6, fatGrams: 0 },
  { name: "Greek Yogurt, full fat", servingSize: "170 g (6 oz)", calories: 200, proteinGrams: 15, carbGrams: 6, fatGrams: 12 },
  { name: "Cottage Cheese, low fat", servingSize: "100 g", calories: 72, proteinGrams: 12, carbGrams: 3, fatGrams: 1 },
  { name: "Cottage Cheese, full fat", servingSize: "100 g", calories: 98, proteinGrams: 11, carbGrams: 3, fatGrams: 4.3 },
  { name: "Milk, 2%", servingSize: "1 cup (244 g)", calories: 122, proteinGrams: 8, carbGrams: 12, fatGrams: 5 },
  { name: "Milk, whole", servingSize: "1 cup (244 g)", calories: 149, proteinGrams: 8, carbGrams: 12, fatGrams: 8 },
  { name: "Cheese, Cheddar", servingSize: "28 g (1 oz)", calories: 113, proteinGrams: 7, carbGrams: 0.4, fatGrams: 9 },
  { name: "Cheese, Mozzarella, part skim", servingSize: "28 g (1 oz)", calories: 72, proteinGrams: 7, carbGrams: 1, fatGrams: 5 },
  { name: "Cheese, Swiss", servingSize: "28 g (1 oz)", calories: 108, proteinGrams: 8, carbGrams: 1, fatGrams: 8 },
  
  // Protein Powders
  { name: "Whey Protein", brand: "Generic", servingSize: "1 scoop (30 g)", calories: 120, proteinGrams: 24, carbGrams: 3, fatGrams: 2 },
  { name: "Casein Protein", brand: "Generic", servingSize: "1 scoop (30 g)", calories: 110, proteinGrams: 24, carbGrams: 2, fatGrams: 1 },
  { name: "Plant Protein", brand: "Generic", servingSize: "1 scoop (30 g)", calories: 115, proteinGrams: 22, carbGrams: 4, fatGrams: 2 },
  
  // Grains & Carbs
  { name: "White Rice, cooked", servingSize: "100 g", calories: 130, proteinGrams: 2.4, carbGrams: 28, fatGrams: 0.3 },
  { name: "Brown Rice, cooked", servingSize: "100 g", calories: 123, proteinGrams: 2.7, carbGrams: 25.6, fatGrams: 1 },
  { name: "Jasmine Rice, cooked", servingSize: "100 g", calories: 130, proteinGrams: 2.7, carbGrams: 28, fatGrams: 0.3 },
  { name: "Basmati Rice, cooked", servingSize: "100 g", calories: 130, proteinGrams: 2.7, carbGrams: 28, fatGrams: 0.3 },
  { name: "Quinoa, cooked", servingSize: "100 g", calories: 120, proteinGrams: 4.4, carbGrams: 22, fatGrams: 1.9 },
  { name: "Oats, dry", servingSize: "40 g (1/2 cup)", calories: 150, proteinGrams: 5, carbGrams: 27, fatGrams: 3 },
  { name: "Oatmeal, cooked", servingSize: "100 g", calories: 68, proteinGrams: 2.4, carbGrams: 12, fatGrams: 1.4 },
  { name: "Pasta, cooked", servingSize: "100 g", calories: 131, proteinGrams: 5, carbGrams: 25, fatGrams: 1.1 },
  { name: "Whole Wheat Pasta, cooked", servingSize: "100 g", calories: 124, proteinGrams: 5, carbGrams: 25, fatGrams: 1.3 },
  { name: "Bread, white", servingSize: "1 slice (28 g)", calories: 75, proteinGrams: 2.4, carbGrams: 14, fatGrams: 1 },
  { name: "Bread, whole wheat", servingSize: "1 slice (28 g)", calories: 80, proteinGrams: 4, carbGrams: 14, fatGrams: 1 },
  { name: "Bagel, plain", servingSize: "1 bagel (105 g)", calories: 289, proteinGrams: 11, carbGrams: 56, fatGrams: 2 },
  { name: "Tortilla, flour", servingSize: "1 large (49 g)", calories: 146, proteinGrams: 4, carbGrams: 24, fatGrams: 3.7 },
  { name: "Tortilla, corn", servingSize: "1 medium (26 g)", calories: 62, proteinGrams: 1.6, carbGrams: 13, fatGrams: 0.7 },
  
  // Potatoes & Starches
  { name: "Potato, baked", servingSize: "100 g", calories: 93, proteinGrams: 2.5, carbGrams: 21, fatGrams: 0.1 },
  { name: "Potato, boiled", servingSize: "100 g", calories: 87, proteinGrams: 1.9, carbGrams: 20, fatGrams: 0.1 },
  { name: "Potato, mashed", servingSize: "100 g", calories: 106, proteinGrams: 1.8, carbGrams: 17, fatGrams: 4.2 },
  { name: "Sweet Potato, baked", servingSize: "100 g", calories: 90, proteinGrams: 2, carbGrams: 21, fatGrams: 0.2 },
  { name: "Sweet Potato, roasted", servingSize: "100 g", calories: 90, proteinGrams: 2, carbGrams: 21, fatGrams: 0.2 },
  { name: "French Fries, fast food", servingSize: "100 g", calories: 365, proteinGrams: 4, carbGrams: 63, fatGrams: 17 },
  { name: "Hash Browns", servingSize: "100 g", calories: 326, proteinGrams: 3, carbGrams: 35, fatGrams: 20 },
  
  // Vegetables
  { name: "Broccoli, cooked", servingSize: "100 g", calories: 55, proteinGrams: 3.7, carbGrams: 11, fatGrams: 0.6 },
  { name: "Broccoli, raw", servingSize: "100 g", calories: 34, proteinGrams: 2.8, carbGrams: 7, fatGrams: 0.4 },
  { name: "Spinach, cooked", servingSize: "100 g", calories: 23, proteinGrams: 3, carbGrams: 3.8, fatGrams: 0.3 },
  { name: "Spinach, raw", servingSize: "100 g", calories: 23, proteinGrams: 2.9, carbGrams: 3.6, fatGrams: 0.4 },
  { name: "Lettuce, Romaine", servingSize: "100 g", calories: 17, proteinGrams: 1.2, carbGrams: 3.3, fatGrams: 0.3 },
  { name: "Lettuce, Iceberg", servingSize: "100 g", calories: 14, proteinGrams: 0.9, carbGrams: 3, fatGrams: 0.1 },
  { name: "Tomato, raw", servingSize: "100 g", calories: 18, proteinGrams: 0.9, carbGrams: 3.9, fatGrams: 0.2 },
  { name: "Onion, raw", servingSize: "100 g", calories: 40, proteinGrams: 1.1, carbGrams: 9.3, fatGrams: 0.1 },
  { name: "Bell Pepper, raw", servingSize: "100 g", calories: 31, proteinGrams: 1, carbGrams: 7, fatGrams: 0.3 },
  { name: "Carrot, raw", servingSize: "100 g", calories: 41, proteinGrams: 0.9, carbGrams: 10, fatGrams: 0.2 },
  { name: "Cucumber, raw", servingSize: "100 g", calories: 16, proteinGrams: 0.7, carbGrams: 4, fatGrams: 0.1 },
  { name: "Zucchini, cooked", servingSize: "100 g", calories: 17, proteinGrams: 1.1, carbGrams: 3.3, fatGrams: 0.4 },
  { name: "Mushrooms, cooked", servingSize: "100 g", calories: 44, proteinGrams: 3.6, carbGrams: 6.8, fatGrams: 1.6 },
  { name: "Asparagus, cooked", servingSize: "100 g", calories: 22, proteinGrams: 2.4, carbGrams: 4, fatGrams: 0.2 },
  { name: "Green Beans, cooked", servingSize: "100 g", calories: 35, proteinGrams: 1.9, carbGrams: 8, fatGrams: 0.3 },
  { name: "Cauliflower, cooked", servingSize: "100 g", calories: 23, proteinGrams: 1.8, carbGrams: 4.1, fatGrams: 0.5 },
  { name: "Brussels Sprouts, cooked", servingSize: "100 g", calories: 36, proteinGrams: 2.6, carbGrams: 7, fatGrams: 0.5 },
  { name: "Cabbage, cooked", servingSize: "100 g", calories: 23, proteinGrams: 1.3, carbGrams: 5.5, fatGrams: 0.1 },
  { name: "Corn, cooked", servingSize: "100 g", calories: 96, proteinGrams: 3.4, carbGrams: 21, fatGrams: 1.2 },
  { name: "Peas, cooked", servingSize: "100 g", calories: 84, proteinGrams: 5.4, carbGrams: 15, fatGrams: 0.2 },
  
  // Fruits
  { name: "Banana", servingSize: "118 g (1 medium)", calories: 105, proteinGrams: 1.3, carbGrams: 27, fatGrams: 0.4 },
  { name: "Apple", servingSize: "182 g (1 medium)", calories: 95, proteinGrams: 0.5, carbGrams: 25, fatGrams: 0.3 },
  { name: "Orange", servingSize: "131 g (1 medium)", calories: 62, proteinGrams: 1.2, carbGrams: 15, fatGrams: 0.2 },
  { name: "Strawberries", servingSize: "100 g", calories: 32, proteinGrams: 0.7, carbGrams: 8, fatGrams: 0.3 },
  { name: "Blueberries", servingSize: "100 g", calories: 57, proteinGrams: 0.7, carbGrams: 14, fatGrams: 0.3 },
  { name: "Grapes", servingSize: "100 g", calories: 69, proteinGrams: 0.7, carbGrams: 18, fatGrams: 0.2 },
  { name: "Avocado", servingSize: "100 g", calories: 160, proteinGrams: 2, carbGrams: 9, fatGrams: 15 },
  
  // Fats & Oils
  { name: "Olive Oil", servingSize: "1 tbsp (14 g)", calories: 119, proteinGrams: 0, carbGrams: 0, fatGrams: 13.5 },
  { name: "Coconut Oil", servingSize: "1 tbsp (14 g)", calories: 121, proteinGrams: 0, carbGrams: 0, fatGrams: 14 },
  { name: "Butter", servingSize: "1 tbsp (14 g)", calories: 102, proteinGrams: 0.1, carbGrams: 0, fatGrams: 11.5 },
  { name: "Peanut Butter", servingSize: "32 g (2 tbsp)", calories: 190, proteinGrams: 8, carbGrams: 7, fatGrams: 16 },
  { name: "Almond Butter", servingSize: "32 g (2 tbsp)", calories: 196, proteinGrams: 7, carbGrams: 6, fatGrams: 18 },
  { name: "Almonds", servingSize: "28 g (1 oz)", calories: 164, proteinGrams: 6, carbGrams: 6, fatGrams: 14 },
  { name: "Walnuts", servingSize: "28 g (1 oz)", calories: 185, proteinGrams: 4, carbGrams: 4, fatGrams: 18 },
  
  // Fast Food & Restaurant Items
  { name: "McChicken", brand: "McDonald's", servingSize: "1 sandwich (147 g)", calories: 400, proteinGrams: 14, carbGrams: 39, fatGrams: 21 },
  { name: "Big Mac", brand: "McDonald's", servingSize: "1 sandwich (215 g)", calories: 550, proteinGrams: 25, carbGrams: 45, fatGrams: 33 },
  { name: "Quarter Pounder with Cheese", brand: "McDonald's", servingSize: "1 sandwich (194 g)", calories: 520, proteinGrams: 26, carbGrams: 42, fatGrams: 26 },
  { name: "Chicken McNuggets", brand: "McDonald's", servingSize: "6 pieces (96 g)", calories: 270, proteinGrams: 14, carbGrams: 17, fatGrams: 18 },
  { name: "McDouble", brand: "McDonald's", servingSize: "1 sandwich (151 g)", calories: 400, proteinGrams: 22, carbGrams: 33, fatGrams: 19 },
  { name: "Whopper", brand: "Burger King", servingSize: "1 sandwich (270 g)", calories: 660, proteinGrams: 28, carbGrams: 49, fatGrams: 40 },
  { name: "Chicken Whopper", brand: "Burger King", servingSize: "1 sandwich (282 g)", calories: 630, proteinGrams: 28, carbGrams: 52, fatGrams: 35 },
  { name: "Original Chicken Sandwich", brand: "Chick-fil-A", servingSize: "1 sandwich (185 g)", calories: 440, proteinGrams: 28, carbGrams: 40, fatGrams: 19 },
  { name: "Spicy Deluxe Sandwich", brand: "Chick-fil-A", servingSize: "1 sandwich (219 g)", calories: 550, proteinGrams: 28, carbGrams: 45, fatGrams: 28 },
  { name: "Grilled Chicken Sandwich", brand: "Chick-fil-A", servingSize: "1 sandwich (202 g)", calories: 320, proteinGrams: 28, carbGrams: 40, fatGrams: 6 },
  { name: "Classic Hamburger", brand: "In-N-Out", servingSize: "1 burger (116 g)", calories: 390, proteinGrams: 16, carbGrams: 39, fatGrams: 19 },
  { name: "Cheeseburger", brand: "In-N-Out", servingSize: "1 burger (125 g)", calories: 480, proteinGrams: 22, carbGrams: 39, fatGrams: 27 },
  { name: "Double-Double", brand: "In-N-Out", servingSize: "1 burger (170 g)", calories: 670, proteinGrams: 37, carbGrams: 39, fatGrams: 39 },
  
  // Breakfast Items
  { name: "Pancakes, plain", servingSize: "2 pancakes (100 g)", calories: 227, proteinGrams: 5.9, carbGrams: 36, fatGrams: 7.3 },
  { name: "Pancakes, with butter and syrup", servingSize: "2 pancakes (200 g)", calories: 520, proteinGrams: 8, carbGrams: 78, fatGrams: 16 },
  { name: "Waffles", servingSize: "1 waffle (75 g)", calories: 218, proteinGrams: 6.5, carbGrams: 31, fatGrams: 9 },
  { name: "French Toast", servingSize: "1 slice (65 g)", calories: 150, proteinGrams: 5, carbGrams: 20, fatGrams: 5 },
  { name: "Scrambled Eggs", servingSize: "2 eggs (100 g)", calories: 203, proteinGrams: 13, carbGrams: 1.5, fatGrams: 15 },
  { name: "Omelet, 3 eggs", servingSize: "1 omelet (150 g)", calories: 324, proteinGrams: 21, carbGrams: 2, fatGrams: 24 },
  { name: "Breakfast Burrito", servingSize: "1 burrito (200 g)", calories: 350, proteinGrams: 18, carbGrams: 35, fatGrams: 15 },
  { name: "Breakfast Sausage Patty", servingSize: "1 patty (25 g)", calories: 85, proteinGrams: 4, carbGrams: 0.5, fatGrams: 7 },
  
  // Nuts & Seeds
  { name: "Peanuts", servingSize: "28 g (1 oz)", calories: 161, proteinGrams: 7, carbGrams: 5, fatGrams: 14 },
  { name: "Cashews", servingSize: "28 g (1 oz)", calories: 157, proteinGrams: 5, carbGrams: 9, fatGrams: 12 },
  { name: "Pistachios", servingSize: "28 g (1 oz)", calories: 159, proteinGrams: 6, carbGrams: 8, fatGrams: 13 },
  { name: "Sunflower Seeds", servingSize: "28 g (1 oz)", calories: 164, proteinGrams: 5.5, carbGrams: 6, fatGrams: 14 },
  { name: "Chia Seeds", servingSize: "28 g (1 oz)", calories: 138, proteinGrams: 4.7, carbGrams: 12, fatGrams: 9 },
  { name: "Flax Seeds", servingSize: "28 g (1 oz)", calories: 150, proteinGrams: 5, carbGrams: 8, fatGrams: 12 },
  
  // Legumes
  { name: "Black Beans, cooked", servingSize: "100 g", calories: 132, proteinGrams: 8.9, carbGrams: 24, fatGrams: 0.5 },
  { name: "Kidney Beans, cooked", servingSize: "100 g", calories: 127, proteinGrams: 8.7, carbGrams: 23, fatGrams: 0.5 },
  { name: "Chickpeas, cooked", servingSize: "100 g", calories: 164, proteinGrams: 8.9, carbGrams: 27, fatGrams: 2.6 },
  { name: "Lentils, cooked", servingSize: "100 g", calories: 116, proteinGrams: 9, carbGrams: 20, fatGrams: 0.4 },
  
  // Other Common Foods
  { name: "Hummus", servingSize: "100 g", calories: 166, proteinGrams: 8, carbGrams: 14, fatGrams: 10 },
  { name: "Guacamole", servingSize: "100 g", calories: 157, proteinGrams: 2, carbGrams: 8, fatGrams: 15 },
  { name: "Salsa", servingSize: "100 g", calories: 36, proteinGrams: 1.5, carbGrams: 7, fatGrams: 0.2 },
];
