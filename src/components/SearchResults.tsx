import { Card } from "@/components/ui/card";
import { Search, ShoppingCart } from "lucide-react";

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

interface SearchResultsProps {
  query: string;
  results: GroceryList[];
  onSelectList: (list: GroceryList) => void;
}

export function SearchResults({ query, results, onSelectList }: SearchResultsProps) {
  if (!query) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {results.length > 0 ? (
        <div className="p-2">
          <div className="text-sm text-muted-foreground p-2 border-b">
            Found {results.length} list{results.length !== 1 ? 's' : ''}
          </div>
          {results.map((list) => (
            <Card
              key={list.id}
              className="p-3 m-1 cursor-pointer hover:bg-accent/50 transition-colors border-0 bg-transparent"
              onClick={() => onSelectList(list)}
            >
              <div className="flex items-start gap-3">
                <ShoppingCart className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {list.title || "Untitled List"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {list.items.length} item{list.items.length !== 1 ? 's' : ''} • {list.createdAt.toLocaleDateString()}
                  </p>
                  {list.items.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {list.items.slice(0, 3).map(item => item.text).join(', ')}
                      {list.items.length > 3 ? '...' : ''}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center">
          <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">No matching lists found</p>
          <p className="text-xs text-muted-foreground">Try a different search term</p>
        </div>
      )}
    </div>
  );
}