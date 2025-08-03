import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsNavigationProps {
  items: TabItem[];
  defaultValue: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({
  items,
  defaultValue,
  className,
  orientation = 'horizontal'
}) => {
  return (
    <Tabs 
      defaultValue={defaultValue} 
      className={cn('w-full', className)}
      orientation={orientation}
    >
      <TabsList className={cn(
        orientation === 'vertical' 
          ? 'flex-col h-auto w-fit'
          : `grid w-full grid-cols-${items.length}`
      )}>
        {items.map((item) => (
          <TabsTrigger 
            key={item.value} 
            value={item.value}
            disabled={item.disabled}
            className={cn(
              'flex items-center gap-2',
              orientation === 'vertical' && 'justify-start w-full'
            )}
          >
            {item.icon && item.icon}
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {items.map((item) => (
        <TabsContent 
          key={item.value} 
          value={item.value}
          className="mt-6"
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};