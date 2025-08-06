import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface AnalyticsData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    todaysOrders: number;
    todaysRevenue: number;
    pendingOrders: number;
    readyOrders: number;
  };
  recentTrends: {
    dailyStats: Array<{
      date: string;
      orders: number;
      revenue: number;
    }>;
    popularItems: Array<{
      name: string;
      quantity: number;
      revenue: number;
    }>;
    hourlyDistribution: Array<{
      hour: number;
      orders: number;
    }>;
  };
  orderStatuses: {
    pending: number;
    preparing: number;
    ready: number;
    completed: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get all orders within the specified period
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate summary statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const todaysOrders = orders.filter(order => 
      order.createdAt >= today
    ).length;
    
    const todaysRevenue = orders
      .filter(order => order.createdAt >= today)
      .reduce((sum, order) => sum + order.total, 0);

    // Order status counts
    const orderStatuses = {
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
    };

    // Daily statistics for the chart
    const dailyStats: { [key: string]: { orders: number; revenue: number } } = {};
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      dailyStats[dateKey] = { orders: 0, revenue: 0 };
    }

    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      if (dailyStats[dateKey]) {
        dailyStats[dateKey].orders += 1;
        dailyStats[dateKey].revenue += order.total;
      }
    });

    // Popular items analysis
    const itemCounts: { [key: string]: { quantity: number; revenue: number } } = {};
    
    orders.forEach(order => {
      try {
        const items = JSON.parse(order.items);
        items.forEach((item: any) => {
          if (!itemCounts[item.name]) {
            itemCounts[item.name] = { quantity: 0, revenue: 0 };
          }
          itemCounts[item.name].quantity += item.quantity;
          itemCounts[item.name].revenue += item.price * item.quantity;
        });
      } catch (error) {
        console.error('Error parsing order items:', error);
      }
    });

    const popularItems = Object.entries(itemCounts)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Hourly distribution
    const hourlyDistribution: { [key: number]: number } = {};
    for (let i = 0; i < 24; i++) {
      hourlyDistribution[i] = 0;
    }

    orders.forEach(order => {
      const hour = order.createdAt.getHours();
      hourlyDistribution[hour] += 1;
    });

    const analytics: AnalyticsData = {
      summary: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        todaysOrders,
        todaysRevenue: Math.round(todaysRevenue * 100) / 100,
        pendingOrders: orderStatuses.pending,
        readyOrders: orderStatuses.ready,
      },
      recentTrends: {
        dailyStats: Object.entries(dailyStats).map(([date, stats]) => ({
          date,
          orders: stats.orders,
          revenue: Math.round(stats.revenue * 100) / 100,
        })),
        popularItems,
        hourlyDistribution: Object.entries(hourlyDistribution).map(([hour, orders]) => ({
          hour: parseInt(hour),
          orders,
        })),
      },
      orderStatuses,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}