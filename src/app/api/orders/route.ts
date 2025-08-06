import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    // Save order to database
    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || null,
        items: JSON.stringify(body.items),
        total: calculatedTotal,
        estimatedReady,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      estimatedReady: order.estimatedReady,
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

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse items JSON for each order
    const ordersWithParsedItems = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items),
    }));

    return NextResponse.json(ordersWithParsedItems);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}