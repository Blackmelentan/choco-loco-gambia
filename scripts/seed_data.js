/**
 * Kaabu Technologies - Choco Loco Seed Script
 * Populates realistic production-grade data for Choco Loco Patisserie & Lounge:
 * - Enterprise Staff & Profiles with hashed credentials
 * - Authentic Menu Categories, Items & Dynamic Customization Groups
 * - Active Shifts & Shift Swaps
 * - Audited Time Clock Entries with GPS coordinates in Pipeline, The Gambia
 * - Active & Recent Customer Orders with Wave Mobile Money transactions
 * - Store Expenses and Financial Records
 */

const bcrypt = require('bcryptjs');
const db = require('../backend/src/services/database');

async function seed() {
  console.log('--- STARTING CHOCO LOCO ENTERPRISE DATA SEEDING ---');

  // Clear existing tables
  for (const tbl of Object.keys(db.tables)) {
    db.tables[tbl] = [];
  }

  const defaultPassword = 'ChocoLoco2026!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. USERS & STAFF
  console.log('[1/6] Seeding Staff & Administrative Users...');
  const usersToSeed = [
    {
      id: 'usr_admin_01',
      email: 'admin@chocoloco.gm',
      password_hash: hashedPassword,
      full_name: 'Aisha Touray',
      phone: '+2203114455',
      role: 'admin',
      is_active: true
    },
    {
      id: 'usr_mgr_01',
      email: 'manager@chocoloco.gm',
      password_hash: hashedPassword,
      full_name: 'Lamin Ceesay',
      phone: '+2207881234',
      role: 'shift_manager',
      is_active: true
    },
    {
      id: 'usr_cashier_01',
      email: 'cashier@chocoloco.gm',
      password_hash: hashedPassword,
      full_name: 'Fatoumatta Bah',
      phone: '+2209007711',
      role: 'pos_cashier',
      is_active: true
    },
    {
      id: 'usr_chef_01',
      email: 'pastry@chocoloco.gm',
      password_hash: hashedPassword,
      full_name: 'Modou Jallow',
      phone: '+2202449988',
      role: 'floor_staff',
      is_active: true
    },
    {
      id: 'usr_barista_01',
      email: 'barista@chocoloco.gm',
      password_hash: hashedPassword,
      full_name: 'Mariama Sarr',
      phone: '+2205553322',
      role: 'floor_staff',
      is_active: true
    }
  ];

  for (const u of usersToSeed) {
    db.insert('users', u);
  }

  // 2. STAFF PROFILES (Wave Mobile Money Accounts, Hourly Rates in GMD)
  console.log('[2/6] Seeding Staff Profiles & Wave Mobile Payout Details...');
  const profilesToSeed = [
    {
      id: 'prof_admin_01',
      user_id: 'usr_admin_01',
      employee_code: 'CL-EXEC-01',
      position_title: 'Operations Director',
      hourly_rate_gmd: 350.00,
      wave_mobile_number: '+2203114455',
      emergency_contact: 'Mustapha Touray (+2209990011)',
      hired_date: '2023-01-15',
      notes: 'Executive administrator and financial signatory'
    },
    {
      id: 'prof_mgr_01',
      user_id: 'usr_mgr_01',
      employee_code: 'CL-MGR-02',
      position_title: 'Senior Floor & Shift Manager',
      hourly_rate_gmd: 220.00,
      wave_mobile_number: '+2207881234',
      emergency_contact: 'Kaddy Ceesay (+2207772211)',
      hired_date: '2023-06-01',
      notes: 'Oversees evening lounge operations and staff dispatch'
    },
    {
      id: 'prof_cashier_01',
      user_id: 'usr_cashier_01',
      employee_code: 'CL-POS-03',
      position_title: 'Lead POS Cashier & Hostess',
      hourly_rate_gmd: 140.00,
      wave_mobile_number: '+2209007711',
      emergency_contact: 'Alagie Bah (+2203338899)',
      hired_date: '2024-02-10',
      notes: 'Responsible for drawer balancing and Wave checkout validation'
    },
    {
      id: 'prof_chef_01',
      user_id: 'usr_chef_01',
      employee_code: 'CL-PAS-04',
      position_title: 'Head Pastry & Chocolatier Chef',
      hourly_rate_gmd: 185.00,
      wave_mobile_number: '+2202449988',
      emergency_contact: 'Haddy Jallow (+2206661122)',
      hired_date: '2023-09-20',
      notes: 'Specialist in Belgian tempering and bubble waffle batter'
    },
    {
      id: 'prof_barista_01',
      user_id: 'usr_barista_01',
      employee_code: 'CL-BAR-05',
      position_title: 'Artisan Barista & Shake Specialist',
      hourly_rate_gmd: 135.00,
      wave_mobile_number: '+2205553322',
      emergency_contact: 'Pa Sarr (+2202224455)',
      hired_date: '2024-05-04',
      notes: 'Latte art maestro and freakshake stylist'
    }
  ];

  for (const p of profilesToSeed) {
    db.insert('staff_profiles', p);
  }

  // 3. MENU CATEGORIES & ITEMS
  console.log('[3/6] Seeding Choco Loco Menu Architecture & Dynamic Toppings...');
  const categories = [
    {
      id: 'cat_waffles',
      name: 'Belgian Bubble Waffles',
      slug: 'waffles',
      description: 'Crisp, golden bubble waffles baked fresh to order and smothered in luxury toppings',
      display_order: 1
    },
    {
      id: 'cat_crepes',
      name: 'Gourmet Crepes & Rolls',
      slug: 'crepes',
      description: 'Ultra-thin French-style crepes, signature chocolate sushi rolls, and folded delicacies',
      display_order: 2
    },
    {
      id: 'cat_cheesecakes',
      name: 'Artisanal Cheesecakes & Cakes',
      slug: 'cheesecakes',
      description: 'Handcrafted signature patisserie, velvety cheesecakes, and molten lava fondants',
      display_order: 3
    },
    {
      id: 'cat_beverages',
      name: 'Freakshakes & Artisan Coffees',
      slug: 'beverages',
      description: 'Decadent chocolate freakshakes, single-origin espresso roasts, and iced frappes',
      display_order: 4
    },
    {
      id: 'cat_savory',
      name: 'Savory Croissants & Baguettes',
      slug: 'savory',
      description: 'Freshly baked buttery croissants, toasted paninis, and gourmet savory bites',
      display_order: 5
    }
  ];

  for (const c of categories) {
    db.insert('menu_categories', c);
  }

  const menuItems = [
    {
      id: 'item_waffle_signature',
      category_id: 'cat_waffles',
      name: 'The Choco Loco Signature Bubble Waffle',
      description: 'Golden bubble waffle drenched in warm Belgian milk chocolate, fresh ripe strawberries, Lotus Biscoff biscuit crunch, and artisanal vanilla gelato.',
      price_gmd: 420.00,
      image_url: '/assets/signature_waffle.jpg',
      is_signature: true,
      preparation_time_minutes: 10
    },
    {
      id: 'item_waffle_triple_choco',
      category_id: 'cat_waffles',
      name: 'Triple Chocolate Indulgence Waffle',
      description: 'Layered with white chocolate drizzle, dark Belgian ganache, milk chocolate pearls, and chocolate fudge brownie chunks.',
      price_gmd: 450.00,
      image_url: '/assets/signature_waffle.jpg',
      is_signature: false,
      preparation_time_minutes: 12
    },
    {
      id: 'item_crepe_pistachio_sushi',
      category_id: 'cat_crepes',
      name: 'Pistachio White Chocolate Sushi Crepe',
      description: 'Delicately rolled chocolate crepe filled with rich cream, sliced into sushi maki pieces, drizzled with Sicilian pistachio butter and roasted pistachios.',
      price_gmd: 480.00,
      image_url: '/assets/pistachio_crepe.jpg',
      is_signature: true,
      preparation_time_minutes: 14
    },
    {
      id: 'item_crepe_fettuccine',
      category_id: 'cat_crepes',
      name: 'Fettuccine Chocolate Crepe',
      description: 'Finely sliced crepe ribbons styled like pasta, bathed in melted Belgian chocolate fondue, served with fresh raspberry compote and vanilla gelato.',
      price_gmd: 430.00,
      image_url: '/assets/pistachio_crepe.jpg',
      is_signature: false,
      preparation_time_minutes: 12
    },
    {
      id: 'item_cake_biscoff_cheesecake',
      category_id: 'cat_cheesecakes',
      name: 'Lotus Biscoff Crown Cheesecake',
      description: 'Silky, dense Philadelphia cream cheese infused with speculoos, topped with warm Lotus spread glaze, whole Biscoff cookie, and spun caramel crown.',
      price_gmd: 380.00,
      image_url: '/assets/biscoff_cheesecake.jpg',
      is_signature: true,
      preparation_time_minutes: 5
    },
    {
      id: 'item_cake_molten_lava',
      category_id: 'cat_cheesecakes',
      name: 'Belgian Molten Lava Fondant',
      description: 'Warm dark chocolate sponge bursting with an oozing liquid chocolate center, served with Madagascan vanilla ice cream and gold leaf flakes.',
      price_gmd: 390.00,
      image_url: '/assets/biscoff_cheesecake.jpg',
      is_signature: false,
      preparation_time_minutes: 15
    },
    {
      id: 'item_bev_chocolate_freakshake',
      category_id: 'cat_beverages',
      name: 'Choco Loco Monster Freakshake',
      description: 'Gigantic milkshake blended with Belgian chocolate gelato, topped with a brownie square, whipped cream mountain, chocolate pretzel, and chocolate drizzle.',
      price_gmd: 360.00,
      image_url: '/assets/signature_waffle.jpg',
      is_signature: true,
      preparation_time_minutes: 8
    },
    {
      id: 'item_bev_spanish_latte',
      category_id: 'cat_beverages',
      name: 'Iced Dulce de Leche Spanish Latte',
      description: 'Double espresso pulled over condensed sweet milk, fresh whole milk, chilled over crystal ice, dusted with Ceylon cinnamon.',
      price_gmd: 220.00,
      image_url: '/assets/signature_waffle.jpg',
      is_signature: false,
      preparation_time_minutes: 4
    },
    {
      id: 'item_savory_croissant',
      category_id: 'cat_savory',
      name: 'Smoked Turkey & Truffle Melt Croissant',
      description: 'All-butter flaky French croissant toasted with smoked turkey breast, melted Emmental cheese, baby arugula, and a gentle truffle aioli.',
      price_gmd: 340.00,
      image_url: '/assets/signature_waffle.jpg',
      is_signature: false,
      preparation_time_minutes: 8
    }
  ];

  for (const m of menuItems) {
    db.insert('menu_items', m);

    // Add customization groups for dessert items
    if (m.category_id === 'cat_waffles' || m.category_id === 'cat_crepes') {
      const gGlaze = db.insert('item_customization_groups', {
        menu_item_id: m.id,
        group_name: 'Chocolate Glaze Selection',
        is_required: true,
        max_selections: 2
      });

      db.insert('item_customization_options', { group_id: gGlaze.id, option_name: 'Warm Belgian Milk Chocolate', additional_price_gmd: 0.00 });
      db.insert('item_customization_options', { group_id: gGlaze.id, option_name: 'Rich 70% Dark Chocolate Ganache', additional_price_gmd: 20.00 });
      db.insert('item_customization_options', { group_id: gGlaze.id, option_name: 'Creamy White Chocolate Velvet', additional_price_gmd: 20.00 });
      db.insert('item_customization_options', { group_id: gGlaze.id, option_name: 'Warm Lotus Biscoff Drizzle', additional_price_gmd: 40.00 });

      const gToppings = db.insert('item_customization_groups', {
        menu_item_id: m.id,
        group_name: 'Artisanal Extras & Toppings',
        is_required: false,
        max_selections: 3
      });

      db.insert('item_customization_options', { group_id: gToppings.id, option_name: 'Extra Fresh Strawberries', additional_price_gmd: 50.00 });
      db.insert('item_customization_options', { group_id: gToppings.id, option_name: 'Crushed Lotus Biscoff Crumbs', additional_price_gmd: 35.00 });
      db.insert('item_customization_options', { group_id: gToppings.id, option_name: 'Roasted Sicilian Pistachio Flakes', additional_price_gmd: 60.00 });
      db.insert('item_customization_options', { group_id: gToppings.id, option_name: 'Scoop of Madagascar Vanilla Gelato', additional_price_gmd: 70.00 });
    }
  }

  // 4. ACTIVE SHIFTS & CLOCK ENTRIES (Pipeline Store Geofence coordinates)
  console.log('[4/6] Seeding Active Shifts & Geofenced Time Clock Records...');
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const shifts = [
    {
      id: 'shf_01',
      staff_profile_id: 'prof_mgr_01',
      shift_title: 'Full Day Lounge Operations',
      start_time: `${todayStr}T08:00:00Z`,
      end_time: `${todayStr}T17:00:00Z`,
      scheduled_hours: 9.0,
      status: 'scheduled'
    },
    {
      id: 'shf_02',
      staff_profile_id: 'prof_cashier_01',
      shift_title: 'Morning POS & Checkout Shift',
      start_time: `${todayStr}T08:30:00Z`,
      end_time: `${todayStr}T16:30:00Z`,
      scheduled_hours: 8.0,
      status: 'scheduled'
    },
    {
      id: 'shf_03',
      staff_profile_id: 'prof_chef_01',
      shift_title: 'Artisan Pastry & Waffle Prep',
      start_time: `${todayStr}T07:00:00Z`,
      end_time: `${todayStr}T15:30:00Z`,
      scheduled_hours: 8.5,
      status: 'scheduled'
    },
    {
      id: 'shf_04',
      staff_profile_id: 'prof_barista_01',
      shift_title: 'Espresso Bar & Afternoon Rush',
      start_time: `${todayStr}T11:00:00Z`,
      end_time: `${todayStr}T20:00:00Z`,
      scheduled_hours: 9.0,
      status: 'scheduled'
    }
  ];

  for (const s of shifts) {
    db.insert('store_shifts', s);
  }

  // Seed active clock-ins for current staff on duty
  db.insert('time_clock_entries', {
    id: 'clk_01',
    staff_profile_id: 'prof_mgr_01',
    shift_id: 'shf_01',
    clock_in_time: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(), // 3.5 hrs ago
    clock_out_time: null,
    clock_in_latitude: 13.44755,
    clock_in_longitude: -16.67818,
    clock_in_ip: '197.234.221.4',
    clock_in_within_geofence: true,
    status: 'active'
  });

  db.insert('time_clock_entries', {
    id: 'clk_02',
    staff_profile_id: 'prof_cashier_01',
    shift_id: 'shf_02',
    clock_in_time: new Date(Date.now() - 3.0 * 3600 * 1000).toISOString(), // 3 hrs ago
    clock_out_time: null,
    clock_in_latitude: 13.44749,
    clock_in_longitude: -16.67822,
    clock_in_ip: '197.234.221.4',
    clock_in_within_geofence: true,
    status: 'active'
  });

  db.insert('time_clock_entries', {
    id: 'clk_03',
    staff_profile_id: 'prof_chef_01',
    shift_id: 'shf_03',
    clock_in_time: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
    clock_out_time: null,
    clock_in_latitude: 13.44752,
    clock_in_longitude: -16.67815,
    clock_in_ip: '197.234.221.4',
    clock_in_within_geofence: true,
    status: 'active'
  });

  // 5. LIVE ORDERS & HISTORICAL SALES
  console.log('[5/6] Seeding Customer Orders, Wave Mobile Transactions & Kitchen Pipeline...');
  const orders = [
    {
      id: 'ord_101',
      order_number: 'CL-8841',
      customer_name: 'Haddy Touray',
      customer_phone: '+2207119900',
      order_type: 'dine_in',
      table_number: 'T-04 (VIP Lounge)',
      status: 'plating',
      subtotal_gmd: 840.00,
      total_gmd: 840.00,
      payment_status: 'paid',
      payment_method: 'wave_money',
      notes: 'Extra warm chocolate glaze on the side please'
    },
    {
      id: 'ord_102',
      order_number: 'CL-8842',
      customer_name: 'Ebrima Sowe',
      customer_phone: '+2203221144',
      order_type: 'dine_in',
      table_number: 'T-02 (Terrace)',
      status: 'preparing',
      subtotal_gmd: 700.00,
      total_gmd: 700.00,
      payment_status: 'paid',
      payment_method: 'wave_money',
      notes: 'Gluten sensitive preparation'
    },
    {
      id: 'ord_103',
      order_number: 'CL-8843',
      customer_name: 'Dr. Bakary Camara',
      customer_phone: '+2209988776',
      order_type: 'takeaway',
      table_number: 'Takeaway Counter',
      status: 'received',
      subtotal_gmd: 1140.00,
      total_gmd: 1140.00,
      payment_status: 'pending',
      payment_method: 'cash',
      notes: 'Packaging for birthday gift presentation'
    },
    {
      id: 'ord_104',
      order_number: 'CL-8839',
      customer_name: 'Fatou Sanneh',
      customer_phone: '+2202004455',
      order_type: 'dine_in',
      table_number: 'T-01',
      status: 'completed',
      subtotal_gmd: 640.00,
      total_gmd: 640.00,
      payment_status: 'paid',
      payment_method: 'card',
      notes: 'Completed'
    },
    {
      id: 'ord_105',
      order_number: 'CL-8835',
      customer_name: 'Amadou Jobe',
      customer_phone: '+2206112233',
      order_type: 'dine_in',
      table_number: 'T-07',
      status: 'completed',
      subtotal_gmd: 1280.00,
      total_gmd: 1280.00,
      payment_status: 'paid',
      payment_method: 'wave_money',
      notes: 'Family dessert gathering'
    }
  ];

  for (const o of orders) {
    db.insert('orders', o);
  }

  // Seed order items for ord_101
  db.insert('order_items', {
    order_id: 'ord_101',
    menu_item_id: 'item_waffle_signature',
    item_name: 'The Choco Loco Signature Bubble Waffle',
    unit_price_gmd: 420.00,
    quantity: 2,
    customizations_json: JSON.stringify(['Warm Belgian Milk Chocolate', 'Lotus Biscoff Crumbs']),
    subtotal_gmd: 840.00
  });

  // Seed order items for ord_102
  db.insert('order_items', {
    order_id: 'ord_102',
    menu_item_id: 'item_crepe_pistachio_sushi',
    item_name: 'Pistachio White Chocolate Sushi Crepe',
    unit_price_gmd: 480.00,
    quantity: 1,
    customizations_json: JSON.stringify(['Sicilian Pistachio Butter', 'Vanilla Gelato']),
    subtotal_gmd: 480.00
  });
  db.insert('order_items', {
    order_id: 'ord_102',
    menu_item_id: 'item_bev_spanish_latte',
    item_name: 'Iced Dulce de Leche Spanish Latte',
    unit_price_gmd: 220.00,
    quantity: 1,
    customizations_json: JSON.stringify([]),
    subtotal_gmd: 220.00
  });

  // 6. STORE EXPENSES & RESERVATIONS
  console.log('[6/6] Seeding Financial Expenses & VIP Table Reservations...');
  const expenses = [
    {
      title: 'Belgian Callebaut Couverture Chocolate Import (50kg)',
      category: 'dairy_cocoa',
      amount_gmd: 28500.00,
      payment_method: 'wave_money',
      vendor_name: 'Euro-Afro Gourmet Logistics',
      receipt_reference: 'INV-BE-9912',
      logged_by_user_id: 'usr_admin_01',
      expense_date: todayStr
    },
    {
      title: 'Fresh Organic Strawberries & Berries (Bakau Farms)',
      category: 'raw_ingredients',
      amount_gmd: 4200.00,
      payment_method: 'cash',
      vendor_name: 'Bakau Fresh Produce Cooperative',
      receipt_reference: 'RCP-BK-0081',
      logged_by_user_id: 'usr_mgr_01',
      expense_date: todayStr
    },
    {
      title: 'Pipeline Store High-Speed Fiber Internet & Backup Power Diesel',
      category: 'utilities',
      amount_gmd: 6800.00,
      payment_method: 'wave_money',
      vendor_name: 'Africell & Pipeline Energy Supplies',
      receipt_reference: 'UTIL-0291',
      logged_by_user_id: 'usr_admin_01',
      expense_date: todayStr
    }
  ];

  for (const exp of expenses) {
    db.insert('store_expenses', exp);
  }

  // Seed Table Reservations
  db.insert('table_reservations', {
    guest_name: 'Hon. Fatoumatta Jallow',
    guest_phone: '+2203334411',
    guest_count: 4,
    reservation_date: todayStr,
    reservation_time: '19:30',
    table_preference: 'vip_lounge',
    status: 'confirmed',
    special_requests: 'Anniversary celebration. Please prepare chocolate fondue platter upon arrival.'
  });

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
  console.log('Login credentials for testing:');
  console.log('  Admin:   admin@chocoloco.gm    / ChocoLoco2026!');
  console.log('  Manager: manager@chocoloco.gm  / ChocoLoco2026!');
  console.log('  Cashier: cashier@chocoloco.gm  / ChocoLoco2026!');
}

seed().catch(err => {
  console.error('Seed script error:', err);
  process.exit(1);
});
