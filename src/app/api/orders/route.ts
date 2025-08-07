import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CreateOrderData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderData = await request.json();
    
    // Validate required fields
    if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerPhone, and items are required' },
        { status: 400 }
      );
    }

    // Calculate total from items
    const calculatedTotal = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create estimated ready time (15-25 minutes from now)
    const estimatedMinutes = Math.floor(Math.random() * 10) + 15; // 15-25 minutes
    const estimatedReady = new Date(Date.now() + estimatedMinutes * 60 * 1000);

    // First, create or get customer
    let customer;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', body.customerPhone)
      .single();

    if (existingCustomer) {
      customer = existingCustomer;
      // Update customer info if provided
      if (body.customerName || body.customerEmail) {
        await supabase
          .from('customers')
          .update({ 
            name: body.customerName,
            email: body.customerEmail || null 
          })
          .eq('id', existingCustomer.id);
      }
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: body.customerName,
          phone: body.customerPhone,
          email: body.customerEmail || null,
        })
        .select('id')
        .single();
      
      if (customerError) throw customerError;
      customer = newCustomer;
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        total: calculatedTotal,
        estimated_ready: estimatedReady.toISOString(),
      })
      .select('*')
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = body.items.map(item => ({
      order_id: order.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      estimatedReady: order.estimated_ready,
      message: `Order #${order.id.slice(-6)} submitted successfully! We'll call you when it's ready.`
    }, { status: 201 });

  } catch (error) {
    console.error('Order submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit order. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Use the orders_with_details view for better performance
    const { data: orders, error } = await supabase
      .from('orders_with_details')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Transform the data to match the frontend Order interface
    const transformedOrders = orders?.map(order => ({
      id: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone, 
      customerEmail: order.customer_email,
      items: order.items, // This is already a JSON array from the view
      total: order.total,
      status: order.status,
      createdAt: order.created_at, // Keep as string, Date parsing happens on frontend
      estimatedReady: order.estimated_ready,
      completedAt: order.completed_at
    })) || [];

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}