import React from 'react';

interface MenuCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export default function MenuCard({ title, icon, children, className = '' }: MenuCardProps) {
  return (
    <div className={`menu-card ${className}`}>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-2xl casual-font text-coastal">{title}</h3>
      </div>
      {children}
    </div>
  );
}