import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id } = await params;
    
    // Validate status
    const validStatuses = ['pending', 'preparing', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, preparing, ready, completed' },
        { status: 400 }
      );
    }

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    // Get order with details
    const { data: orderDetails, error: detailsError } = await supabase
      .from('orders_with_details')
      .select('*')
      .eq('id', id)
      .single();

    if (detailsError) throw detailsError;

    // Transform the data to match the frontend Order interface
    const transformedOrder = {
      id: orderDetails.id,
      customerName: orderDetails.customer_name,
      customerPhone: orderDetails.customer_phone,
      customerEmail: orderDetails.customer_email,
      items: orderDetails.items,
      total: orderDetails.total,
      status: orderDetails.status,
      createdAt: orderDetails.created_at,
      estimatedReady: orderDetails.estimated_ready,
      completedAt: orderDetails.completed_at
    };

    return NextResponse.json({
      success: true,
      order: transformedOrder
    });

  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: order, error } = await supabase
      .from('orders_with_details')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the frontend Order interface
    const transformedOrder = {
      id: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      items: order.items,
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      estimatedReady: order.estimated_ready,
      completedAt: order.completed_at
    };

    return NextResponse.json(transformedOrder);

  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}