-- Fish & Chips Restaurant Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS business_hours CASCADE;
DROP TABLE IF EXISTS restaurant_status CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  estimated_ready TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  price DECIMAL(8,2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create business_hours table
CREATE TABLE business_hours (
  day_of_week INTEGER PRIMARY KEY CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  is_holiday BOOLEAN DEFAULT FALSE,
  holiday_name VARCHAR(255)
);

-- Create restaurant_status table (singleton pattern)
CREATE TABLE restaurant_status (
  id VARCHAR(20) DEFAULT 'singleton' PRIMARY KEY,
  is_temporarily_closed BOOLEAN DEFAULT FALSE,
  closure_reason TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE menu_items (
  id VARCHAR(100) PRIMARY KEY,
  is_available BOOLEAN DEFAULT TRUE,
  is_out_of_stock BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);

-- Insert default business hours
INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed, is_holiday, holiday_name) VALUES
(0, '16:00', '20:30', FALSE, FALSE, NULL), -- Sunday
(1, '11:30', '20:30', FALSE, FALSE, NULL), -- Monday
(2, '11:30', '20:30', FALSE, FALSE, NULL), -- Tuesday
(3, '11:30', '20:30', FALSE, FALSE, NULL), -- Wednesday
(4, '11:30', '20:30', FALSE, FALSE, NULL), -- Thursday
(5, '11:30', '20:30', FALSE, FALSE, NULL), -- Friday
(6, '11:30', '21:00', FALSE, FALSE, NULL); -- Saturday

-- Insert default restaurant status
INSERT INTO restaurant_status (id, is_temporarily_closed, closure_reason, last_updated) VALUES
('singleton', FALSE, NULL, NOW());

-- Create a function for analytics (replaces complex JavaScript logic)
CREATE OR REPLACE FUNCTION get_analytics_data(days_back INTEGER DEFAULT 7)
RETURNS JSON AS $$
DECLARE
  start_date TIMESTAMPTZ;
  today_start TIMESTAMPTZ;
  result JSON;
BEGIN
  -- Calculate date ranges
  start_date := (NOW() - INTERVAL '1 day' * days_back)::DATE;
  today_start := NOW()::DATE;
  
  -- Build analytics JSON
  SELECT json_build_object(
    'summary', json_build_object(
      'totalOrders', (SELECT COUNT(*) FROM orders WHERE created_at >= start_date),
      'totalRevenue', COALESCE((SELECT SUM(total) FROM orders WHERE created_at >= start_date), 0),
      'averageOrderValue', COALESCE((SELECT AVG(total) FROM orders WHERE created_at >= start_date), 0),
      'todaysOrders', (SELECT COUNT(*) FROM orders WHERE created_at >= today_start),
      'todaysRevenue', COALESCE((SELECT SUM(total) FROM orders WHERE created_at >= today_start), 0),
      'pendingOrders', (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
      'readyOrders', (SELECT COUNT(*) FROM orders WHERE status = 'ready')
    ),
    'recentTrends', json_build_object(
      'dailyStats', (
        SELECT json_agg(
          json_build_object(
            'date', date_part::DATE,
            'orders', COALESCE(order_count, 0),
            'revenue', COALESCE(total_revenue, 0)
          )
        )
        FROM (
          SELECT 
            generate_series(start_date, NOW()::DATE, INTERVAL '1 day')::DATE as date_part
        ) dates
        LEFT JOIN (
          SELECT 
            created_at::DATE as order_date,
            COUNT(*) as order_count,
            SUM(total) as total_revenue
          FROM orders
          WHERE created_at >= start_date
          GROUP BY created_at::DATE
        ) daily_orders ON dates.date_part = daily_orders.order_date
        ORDER BY date_part
      ),
      'popularItems', (
        SELECT json_agg(
          json_build_object(
            'name', item_name,
            'quantity', total_quantity,
            'revenue', total_revenue
          ) ORDER BY total_quantity DESC
        )
        FROM (
          SELECT 
            oi.item_name,
            SUM(oi.quantity) as total_quantity,
            SUM(oi.price * oi.quantity) as total_revenue
          FROM order_items oi
          JOIN orders o ON oi.order_id = o.id
          WHERE o.created_at >= start_date
          GROUP BY oi.item_name
          ORDER BY total_quantity DESC
          LIMIT 10
        ) popular
      ),
      'hourlyDistribution', (
        SELECT json_agg(
          json_build_object(
            'hour', hour_part,
            'orders', COALESCE(order_count, 0)
          ) ORDER BY hour_part
        )
        FROM (
          SELECT generate_series(0, 23) as hour_part
        ) hours
        LEFT JOIN (
          SELECT 
            EXTRACT(HOUR FROM created_at) as order_hour,
            COUNT(*) as order_count
          FROM orders
          WHERE created_at >= start_date
          GROUP BY EXTRACT(HOUR FROM created_at)
        ) hourly_orders ON hours.hour_part = hourly_orders.order_hour
      )
    ),
    'orderStatuses', json_build_object(
      'pending', (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
      'preparing', (SELECT COUNT(*) FROM orders WHERE status = 'preparing'),
      'ready', (SELECT COUNT(*) FROM orders WHERE status = 'ready'),
      'completed', (SELECT COUNT(*) FROM orders WHERE status = 'completed')
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) for data protection
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your auth requirements)
-- Note: You may want to restrict these policies based on your authentication needs

CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on business_hours" ON business_hours FOR ALL USING (true);
CREATE POLICY "Allow all operations on restaurant_status" ON restaurant_status FOR ALL USING (true);
CREATE POLICY "Allow all operations on menu_items" ON menu_items FOR ALL USING (true);

-- Create a view for orders with customer info and items (useful for admin panel)
CREATE OR REPLACE VIEW orders_with_details AS
SELECT 
  o.id,
  o.total,
  o.status,
  o.created_at,
  o.estimated_ready,
  o.completed_at,
  c.name as customer_name,
  c.phone as customer_phone,
  c.email as customer_email,
  json_agg(
    json_build_object(
      'name', oi.item_name,
      'price', oi.price,
      'quantity', oi.quantity
    )
  ) as items
FROM orders o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.total, o.status, o.created_at, o.estimated_ready, o.completed_at, c.name, c.phone, c.email
ORDER BY o.created_at DESC;