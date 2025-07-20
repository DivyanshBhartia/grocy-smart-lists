import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

interface GroceryList {
  id: string;
  title: string;
  items: ListItem[];
  createdAt: Date;
}

interface ListCardProps {
  list: GroceryList;
  onView: (list: GroceryList) => void;
}

export function ListCard({ list, onView }: ListCardProps) {
  const previewItems = list.items.slice(0, 3);
  const hasMoreItems = list.items.length > 3;

  return (
    <Card className="p-6 bg-grocery-card border border-border hover:shadow-card-hover transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg text-grocery-text truncate">
              {list.title || "Untitled List"}
            </h3>
          </div>
          <span className="text-sm text-grocery-text-light">
            {list.createdAt.toLocaleDateString()}
          </span>
        </div>

        {/* Items Preview */}
        <div className="space-y-2">
          {previewItems.length > 0 ? (
            <>
              {previewItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary/20 rounded-full" />
                  <span className="text-grocery-text-light truncate">{item.text}</span>
                </div>
              ))}
              {hasMoreItems && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary/20 rounded-full" />
                  <span className="text-grocery-text-light">
                    ... and {list.items.length - 3} more items
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-grocery-text-light text-sm italic">No items yet</p>
          )}
        </div>

        {/* View Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onView(list);
          }}
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
        >
          <Eye className="h-4 w-4 mr-2" />
          View List
        </Button>
      </div>
    </Card>
  );
}