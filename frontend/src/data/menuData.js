/**
 * Kaabu Technologies - Choco Loco Digital Transformation Ecosystem
 * File: src/data/menuData.js
 * Comprehensive authentic data for menu, categories, toppings, catering, and social feed.
 */

window.MENU_CATEGORIES = [
  { id: 'all', name: 'All Indulgences', icon: '✨' },
  { id: 'waffles', name: 'Waffles & Pancakes', icon: '🧇' },
  { id: 'crepes', name: 'Sweets & Crepes', icon: '🥞' },
  { id: 'cheesecakes', name: 'Artisanal Cheesecakes', icon: '🍰' },
  { id: 'drinks', name: 'Gourmet Shakes & Drinks', icon: '🥤' },
  { id: 'savory', name: 'Savory Bites', icon: '🥐' }
];

window.MENU_ITEMS = [
  // 1. Waffles & Pancakes
  {
    id: 'item_waffle_signature',
    name: 'The Choco Loco Signature Bubble Waffle',
    category: 'waffles',
    categoryLabel: 'Waffles & Pancakes',
    priceGmd: 420.00,
    description: 'Crisp golden egg bubble waffle drenched in warm Belgian milk chocolate, hand-sliced ripe strawberries, Lotus Biscoff biscuit crunch, and Madagascan vanilla gelato.',
    imageUrl: '/assets/signature_waffle.jpg',
    dietaryTags: ['Chef Signature', 'Vegetarian', 'Belgian Callebaut'],
    prepTime: '10 mins',
    isSignature: true,
    isPopular: true,
    customizations: [
      {
        groupName: 'Belgian Chocolate Glaze',
        isRequired: true,
        options: [
          { name: 'Warm Belgian Milk Chocolate', priceGmd: 0 },
          { name: 'Velvety White Chocolate', priceGmd: 20 },
          { name: 'Rich 70% Dark Chocolate Ganache', priceGmd: 20 },
          { name: 'Warm Speculoos Biscoff Spread', priceGmd: 35 }
        ]
      },
      {
        groupName: 'Gourmet Toppings & Crunch',
        isRequired: false,
        options: [
          { name: 'Crushed Lotus Biscoff Biscuit', priceGmd: 35 },
          { name: 'Extra Fresh Strawberries', priceGmd: 50 },
          { name: 'Roasted Sicilian Pistachio Flakes', priceGmd: 60 },
          { name: 'Artisan Gelato Scoop', priceGmd: 70 }
        ]
      }
    ]
  },
  {
    id: 'item_waffle_triple_choco',
    name: 'Triple Chocolate Avalanche Waffle',
    category: 'waffles',
    categoryLabel: 'Waffles & Pancakes',
    priceGmd: 450.00,
    description: 'Golden Belgian waffle layered with dark, milk, and white chocolate drizzles, fudge brownie cubes, and crunchy chocolate pearls.',
    imageUrl: '/assets/signature_waffle.jpg',
    dietaryTags: ['Chocolate Lover', 'Vegetarian'],
    prepTime: '12 mins',
    isSignature: false,
    isPopular: true,
    customizations: [
      {
        groupName: 'Glaze Drizzle',
        isRequired: true,
        options: [
          { name: 'Triple Chocolate Blend', priceGmd: 0 },
          { name: 'Extra Dark Ganache', priceGmd: 20 }
        ]
      }
    ]
  },
  {
    id: 'item_pancake_pyramid',
    name: 'Dutch Mini-Pancake Golden Pyramid',
    category: 'waffles',
    categoryLabel: 'Waffles & Pancakes',
    priceGmd: 390.00,
    description: '15 fluffy Dutch poffertjes stacked in a tiered pyramid, drenched with warm Nutella and melted Belgian white chocolate, dusted with powdered sugar.',
    imageUrl: '/assets/signature_waffle.jpg',
    dietaryTags: ['Popular', 'Vegetarian'],
    prepTime: '10 mins',
    isSignature: false,
    isPopular: true,
    customizations: [
      {
        groupName: 'Sauce Layer',
        isRequired: true,
        options: [
          { name: 'Nutella & White Chocolate Duo', priceGmd: 0 },
          { name: 'Salted Caramel & Dark Chocolate', priceGmd: 25 }
        ]
      }
    ]
  },

  // 2. Sweets & Crepes
  {
    id: 'item_crepe_pistachio_sushi',
    name: 'Pistachio White Chocolate Sushi Crepe',
    category: 'crepes',
    categoryLabel: 'Sweets & Crepes',
    priceGmd: 480.00,
    description: 'Delicately rolled chocolate crepe filled with vanilla diplomat cream, sliced into sushi maki rolls, drizzled with Sicilian pistachio cream and crushed roasted pistachios.',
    imageUrl: '/assets/pistachio_crepe.jpg',
    dietaryTags: ['Chef Signature', 'Vegetarian', 'Premium Nuts'],
    prepTime: '14 mins',
    isSignature: true,
    isPopular: true,
    customizations: [
      {
        groupName: 'Sauce Infusion',
        isRequired: true,
        options: [
          { name: 'Sicilian Pistachio Cream', priceGmd: 0 },
          { name: 'Double Pistachio + Belgian Dark Chocolate', priceGmd: 35 }
        ]
      },
      {
        groupName: 'Extras',
        isRequired: false,
        options: [
          { name: 'Gelato Scoop on Side', priceGmd: 70 },
          { name: 'Extra Crushed Pistachios', priceGmd: 50 }
        ]
      }
    ]
  },
  {
    id: 'item_crepe_fettuccine',
    name: 'Fettuccine Crepe Chocolatier',
    category: 'crepes',
    categoryLabel: 'Sweets & Crepes',
    priceGmd: 430.00,
    description: 'Fine ribbon-cut crepe noodles tossed with warm liquid Belgian milk and white chocolate fondue, garnished with seasonal fresh berries and vanilla gelato.',
    imageUrl: '/assets/pistachio_crepe.jpg',
    dietaryTags: ['Crowd Favorite', 'Vegetarian'],
    prepTime: '12 mins',
    isSignature: false,
    isPopular: false,
    customizations: [
      {
        groupName: 'Chocolate Base',
        isRequired: true,
        options: [
          { name: 'Milk & White Fondue Duo', priceGmd: 0 },
          { name: 'Dark 70% Single Origin', priceGmd: 20 }
        ]
      }
    ]
  },
  {
    id: 'item_crepe_lotus_pocket',
    name: 'Warm Speculoos Biscoff Pocket Crepe',
    category: 'crepes',
    categoryLabel: 'Sweets & Crepes',
    priceGmd: 410.00,
    description: 'Folded French crepe envelope bursting with warm melted Lotus spread and sliced bananas, topped with whole caramelized Biscoff biscuits.',
    imageUrl: '/assets/pistachio_crepe.jpg',
    dietaryTags: ['Vegetarian', 'Nut-Free'],
    prepTime: '10 mins',
    isSignature: false,
    isPopular: true,
    customizations: [
      {
        groupName: 'Filling Extra',
        isRequired: false,
        options: [
          { name: 'Add Fresh Strawberries', priceGmd: 45 },
          { name: 'Add Vanilla Gelato', priceGmd: 70 }
        ]
      }
    ]
  },

  // 3. Artisanal Cheesecakes
  {
    id: 'item_cake_biscoff_cheesecake',
    name: 'Lotus Biscoff Crown Cheesecake',
    category: 'cheesecakes',
    categoryLabel: 'Artisanal Cheesecakes',
    priceGmd: 380.00,
    description: 'Silky, dense Philadelphia cream cheese cake with a crushed speculoos crust, warm caramel dripping glaze, whole Biscoff biscuit crown, and spun sugar halo.',
    imageUrl: '/assets/biscoff_cheesecake.jpg',
    dietaryTags: ['Chef Signature', 'Vegetarian', 'Award Winning'],
    prepTime: '5 mins',
    isSignature: true,
    isPopular: true,
    customizations: [
      {
        groupName: 'Plate Garnish',
        isRequired: false,
        options: [
          { name: 'Extra Warm Caramel Sauce', priceGmd: 30 },
          { name: 'Fresh Whipped Chantilly Cream', priceGmd: 25 }
        ]
      }
    ]
  },
  {
    id: 'item_cake_molten_lava',
    name: 'Belgian Molten Chocolate Lava Cake',
    category: 'cheesecakes',
    categoryLabel: 'Artisanal Cheesecakes',
    priceGmd: 390.00,
    description: 'Decadent dark chocolate sponge with an oozing liquid center of molten Belgian chocolate, served warm with Madagascar vanilla gelato and 24K edible gold dust.',
    imageUrl: '/assets/biscoff_cheesecake.jpg',
    dietaryTags: ['Warm Baked', 'Vegetarian'],
    prepTime: '15 mins',
    isSignature: false,
    isPopular: true,
    customizations: []
  },
  {
    id: 'item_cake_pistachio_basque',
    name: 'San Sebastián Pistachio Burnt Cheesecake',
    category: 'cheesecakes',
    categoryLabel: 'Artisanal Cheesecakes',
    priceGmd: 410.00,
    description: 'Caramelized Basque burnt cheesecake with a gooey creamy center infused with natural pistachio paste, poured over with warm white chocolate ganache.',
    imageUrl: '/assets/biscoff_cheesecake.jpg',
    dietaryTags: ['Gluten-Friendly', 'Vegetarian'],
    prepTime: '5 mins',
    isSignature: true,
    isPopular: false,
    customizations: []
  },

  // 4. Gourmet Shakes & Drinks
  {
    id: 'item_bev_chocolate_freakshake',
    name: 'Choco Loco Monster Freakshake',
    category: 'drinks',
    categoryLabel: 'Gourmet Shakes & Drinks',
    priceGmd: 360.00,
    description: 'Creamy Belgian chocolate milkshake crowned with a fresh double-chocolate brownie, mountain of whipped cream, chocolate-covered pretzel, and cacao drip.',
    imageUrl: '/assets/signature_waffle.jpg',
    dietaryTags: ['Signature Drink', 'Extravagant'],
    prepTime: '8 mins',
    isSignature: true,
    isPopular: true,
    customizations: [
      {
        groupName: 'Milk Choice',
        isRequired: true,
        options: [
          { name: 'Fresh Whole Dairy Milk', priceGmd: 0 },
          { name: 'Oat Milk Alternative', priceGmd: 35 }
        ]
      }
    ]
  },
  {
    id: 'item_bev_spanish_latte',
    name: 'Iced Dulce de Leche Spanish Latte',
    category: 'drinks',
    categoryLabel: 'Gourmet Shakes & Drinks',
    priceGmd: 220.00,
    description: 'Artisanal double espresso pulled over sweetened condensed milk, whole milk, poured over crystal ice with Ceylon cinnamon dust.',
    imageUrl: '/assets/signature_waffle.jpg',
    dietaryTags: ['Coffee Specialist', 'Vegetarian'],
    prepTime: '4 mins',
    isSignature: false,
    isPopular: true,
    customizations: []
  },
  {
    id: 'item_bev_lotus_frappe',
    name: 'Caramelized Lotus Biscoff Frappe',
    category: 'drinks',
    categoryLabel: 'Gourmet Shakes & Drinks',
    priceGmd: 320.00,
    description: 'Blended icy frappe with real Biscoff spread, caramel sauce, whipped cream peak, and a whole crunchy cookie topper.',
    imageUrl: '/assets/signature_waffle.jpg',
    dietaryTags: ['Iced Blended', 'Vegetarian'],
    prepTime: '6 mins',
    isSignature: false,
    isPopular: true,
    customizations: []
  },

  // 5. Savory Bites
  {
    id: 'item_savory_croissant',
    name: 'Smoked Turkey & Truffle Melt Croissant',
    category: 'savory',
    categoryLabel: 'Savory Bites',
    priceGmd: 340.00,
    description: 'Freshly baked French all-butter flaky croissant toasted with smoked turkey breast, melted French Emmental cheese, wild baby arugula, and truffle aioli.',
    imageUrl: '/assets/signature_waffle.jpg',
    dietaryTags: ['Savory', 'Warm Toasted'],
    prepTime: '8 mins',
    isSignature: false,
    isPopular: true,
    customizations: []
  },
  {
    id: 'item_savory_halloumi_panini',
    name: 'Grilled Halloumi & Sun-Dried Tomato Panini',
    category: 'savory',
    categoryLabel: 'Savory Bites',
    priceGmd: 320.00,
    description: 'Artisan sourdough panini pressed with Cyprus halloumi, Mediterranean pesto, sun-dried tomatoes, and balsamic reduction drizzle.',
    imageUrl: '/assets/signature_waffle.jpg',
    dietaryTags: ['Vegetarian', 'Savory'],
    prepTime: '8 mins',
    isSignature: false,
    isPopular: false,
    customizations: []
  }
];

window.REVIEWS_DATA = [
  {
    id: 'rev_1',
    author: 'Fatoumatta Jallow',
    role: 'Dessert Connoisseur • Fajara',
    rating: 5,
    date: '2 days ago',
    comment: 'The Lotus Biscoff Crown Cheesecake is unlike anything in The Gambia. Pure perfection, dense cream cheese, and the ambience in the evening lounge is so cozy for a date.',
    favoriteItem: 'Lotus Biscoff Crown Cheesecake'
  },
  {
    id: 'rev_2',
    author: 'Alieu Ceesay',
    role: 'Food Blogger • Senegambia',
    rating: 5,
    date: '1 week ago',
    comment: 'Best Belgian bubble waffles in Banjul and Kairaba Avenue! You can actually taste real melted Belgian Callebaut chocolate instead of artificial syrup. 10/10 service.',
    favoriteItem: 'The Choco Loco Signature Bubble Waffle'
  },
  {
    id: 'rev_3',
    author: 'Dr. Mariama Touray',
    role: 'Regular Patron • Pipeline',
    rating: 5,
    date: '2 weeks ago',
    comment: 'The Pistachio Sushi Crepes are an absolute masterclass in presentation and flavor. Paying seamlessly with Wave Mobile Money makes the whole experience effortless.',
    favoriteItem: 'Pistachio White Chocolate Sushi Crepe'
  }
];

window.INSTAGRAM_POSTS = [
  {
    id: 'ig_1',
    imageUrl: '/assets/signature_waffle.jpg',
    handle: '@chocoloco.gm',
    likes: '1,420',
    caption: 'Fresh Belgian bubble waffles hot off the cast iron, dripping in warm milk chocolate. Your table is waiting in Pipeline! 🍓🍫 #ChocoLocoGambia'
  },
  {
    id: 'ig_2',
    imageUrl: '/assets/pistachio_crepe.jpg',
    handle: '@chocoloco.gm',
    likes: '2,180',
    caption: 'Sushi or dessert? Why not both. Our Pistachio White Chocolate Sushi Crepe sliced to perfection. 🥢✨ #DessertLounge'
  },
  {
    id: 'ig_3',
    imageUrl: '/assets/biscoff_cheesecake.jpg',
    handle: '@chocoloco.gm',
    likes: '1,890',
    caption: 'Crown worthy indulgence. The Lotus Biscoff Cheesecake drizzled with golden speculoos caramel. 👑🍮 #ChocoLocoCraft'
  },
  {
    id: 'ig_4',
    imageUrl: '/assets/lounge_interior.jpg',
    handle: '@chocoloco.gm',
    likes: '3,410',
    caption: 'Moody amber chandeliers, artisan coffee aromas, and dessert plates made to share. Welcome to the lounge. ☕🥂 #PipelineBanjul'
  }
];

window.CATERING_PACKAGES = [
  {
    id: 'pkg_fountain',
    title: 'The Royal Belgian Chocolate Fountain',
    subtitle: 'Weddings, Galas & High-Profile Celebrations',
    guestRange: '50 – 300+ Guests',
    priceTag: 'From 18,500 D (GMD)',
    highlight: 'Signature Showstopper',
    features: [
      'Multi-tiered commercial chocolate fountain (Callebaut Milk or Dark)',
      'Fresh fruit skewers (Bakau strawberries, pineapple, bananas)',
      'Marshmallows, French butter biscuits, and pretzel sticks',
      'Professional uniformed Choco Loco dessert attendant',
      'Luxury gold cutlery, napkins & presentation platters'
    ]
  },
  {
    id: 'pkg_waffle_station',
    title: 'Live Artisan Bubble Waffle Station',
    subtitle: 'Birthdays, Graduations & Corporate Mixers',
    guestRange: '30 – 150 Guests',
    priceTag: 'From 12,000 D (GMD)',
    highlight: 'Live Chef Experience',
    features: [
      'Live pastry chef baking customized bubble waffles on-site',
      'Full topping bar: Lotus Biscoff, Nutella, crushed Oreos, pistachios',
      'Artisanal gelato cart serving Madagascar vanilla & Belgian chocolate',
      'Custom branded waffle cones & luxury dessert trays',
      'Complete 3-hour live service window'
    ]
  },
  {
    id: 'pkg_patisserie_platter',
    title: 'Executive Corporate Patisserie Boxes',
    subtitle: 'Boardroom Meetings, VIP Hospitality & Gifting',
    guestRange: '10 – 100+ Boxes',
    priceTag: 'From 4,500 D (GMD)',
    highlight: 'Bespoke Packaging',
    features: [
      'Assorted mini Lotus cheesecakes, chocolate fondants & pistachio crepes',
      'Gourmet smoked turkey and truffle mini croissants',
      'Custom ribbon styling with personalized brand messaging',
      'Direct refrigerated delivery across Pipeline, Senegambia & Fajara'
    ]
  }
];

window.FAQ_ITEMS = [
  {
    q: 'Where exactly in Pipeline is Choco Loco located?',
    a: 'We are situated in Pipeline, opposite the Pipeline Mosque along the vibrant Kairaba Avenue corridor in The Gambia. Free private parking is available for all guests.'
  },
  {
    q: 'What are your operating hours?',
    a: 'We are open Monday through Sunday (except Wednesday) from 8:00 AM to 11:00 PM for breakfast, afternoon tea, and late-night dessert lounge service.'
  },
  {
    q: 'Do you accept Wave Mobile Money?',
    a: 'Yes! We proudly accept Wave Mobile Money for instant contactless checkout at the lounge, online orders, and catering bookings with zero extra transaction fees.'
  },
  {
    q: 'Can I customize my dessert toppings and sweetness level?',
    a: 'Absolutely. Every waffle, crepe, and pancake can be tailored with your choice of warm Belgian milk, dark, or white chocolate, along with fresh fruits, gelato, and artisanal crumbles.'
  },
  {
    q: 'How do I book a VIP Lounge table or event catering?',
    a: 'You can use our online reservation system on this website, send an inquiry via our Catering page, or contact our concierge directly via WhatsApp at +220 400 0060.'
  }
];
