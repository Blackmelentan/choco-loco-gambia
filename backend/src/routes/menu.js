/**
 * Kaabu Technologies - Choco Loco Menu & Customization Routes
 * /api/menu
 */

const express = require('express');
const router = express.Router();
const db = require('../services/database');

// GET /api/menu - Get entire structured menu with categories and dynamic customization groups
router.get('/', (req, res) => {
  try {
    const categories = db.findAll('menu_categories', c => c.is_active !== false);
    categories.sort((a, b) => a.display_order - b.display_order);

    const fullMenu = categories.map(cat => {
      const items = db.findAll('menu_items', i => i.category_id === cat.id && i.is_available !== false);

      const itemsWithCustomizations = items.map(item => {
        const groups = db.findAll('item_customization_groups', g => g.menu_item_id === item.id);
        const customizationGroups = groups.map(grp => {
          const options = db.findAll('item_customization_options', o => o.group_id === grp.id);
          return {
            id: grp.id,
            groupName: grp.group_name,
            isRequired: grp.is_required,
            maxSelections: grp.max_selections,
            options: options.map(opt => ({
              id: opt.id,
              name: opt.option_name,
              additionalPriceGmd: opt.additional_price_gmd
            }))
          };
        });

        return {
          id: item.id,
          name: item.name,
          description: item.description,
          priceGmd: item.price_gmd,
          imageUrl: item.image_url,
          isSignature: item.is_signature,
          isAvailable: item.is_available,
          prepTimeMinutes: item.preparation_time_minutes,
          customizationGroups
        };
      });

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        items: itemsWithCustomizations
      };
    });

    res.json(fullMenu);
  } catch (err) {
    console.error('[MENU ERROR]', err);
    res.status(500).json({ error: 'Failed to retrieve menu structure' });
  }
});

// GET /api/menu/items/:id - Get single item with customizations
router.get('/items/:id', (req, res) => {
  const item = db.findById('menu_items', req.params.id);
  if (!item) return res.status(404).json({ error: 'Menu item not found' });

  const groups = db.findAll('item_customization_groups', g => g.menu_item_id === item.id);
  const customizationGroups = groups.map(grp => {
    const options = db.findAll('item_customization_options', o => o.group_id === grp.id);
    return {
      id: grp.id,
      groupName: grp.group_name,
      isRequired: grp.is_required,
      maxSelections: grp.max_selections,
      options: options.map(opt => ({
        id: opt.id,
        name: opt.option_name,
        additionalPriceGmd: opt.additional_price_gmd
      }))
    };
  });

  res.json({
    ...item,
    customizationGroups
  });
});

module.exports = router;
