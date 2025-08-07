import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { menuItems } from '@/data/menuItems';

export async function GET() {
  try {
    // Get all menu items and their inventory status
    const { data: inventoryItems, error } = await supabase
      .from('menu_items')
      .select('*');
    
    if (error) throw error;
    
    // Create a map for quick lookup
    const inventoryMap = new Map(inventoryItems?.map(item => [item.id, item]) || []);
    
    // Combine with static menu data
    const menuWithInventory = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      popular: item.popular || false,
      isAvailable: inventoryMap.get(item.id)?.is_available ?? true,
      isOutOfStock: inventoryMap.get(item.id)?.is_out_of_stock ?? false,
      lastUpdated: inventoryMap.get(item.id)?.last_updated || null
    }));

    return NextResponse.json({ items: menuWithInventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { itemId, isAvailable, isOutOfStock } = await request.json();

    if (!itemId || typeof isAvailable !== 'boolean' || typeof isOutOfStock !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid parameters. itemId, isAvailable, and isOutOfStock are required.' },
        { status: 400 }
      );
    }

    // Update or create inventory item
    const { error } = await supabase
      .from('menu_items')
      .upsert({
        id: itemId,
        is_available: isAvailable,
        is_out_of_stock: isOutOfStock,
        last_updated: new Date().toISOString()
      });
      
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}