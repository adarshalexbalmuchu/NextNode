import { memo } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator,
  BreadcrumbEllipsis 
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  maxItems?: number;
}

const BreadcrumbNav = memo(({ 
  items, 
  className,
  showHome = true,
  maxItems = 5
}: BreadcrumbNavProps) => {
  // Always include home if showHome is true
  const allItems = showHome 
    ? [{ label: 'Home', href: '/', icon: Home }, ...items]
    : items;

  // Handle truncation for long breadcrumb trails
  const displayItems = allItems.length > maxItems
    ? [
        allItems[0],
        { label: '...', href: undefined },
        ...allItems.slice(-2)
      ]
    : allItems;

  if (allItems.length <= 1) {
    return null; // Don't show breadcrumb for single item
  }

  return (
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <BreadcrumbItem key={`${item.label}-${index}`}>
              {isEllipsis ? (
                <BreadcrumbEllipsis />
              ) : isLast ? (
                <BreadcrumbPage className="text-foreground font-medium flex items-center gap-1.5">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link 
                    to={item.href || '/'}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 py-0.5"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
              
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
});

BreadcrumbNav.displayName = "BreadcrumbNav";

export default BreadcrumbNav;
