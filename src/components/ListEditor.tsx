import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Check, ShoppingCart } from "lucide-react";

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

interface ListEditorProps {
  list: GroceryList;
  onUpdate: (list: GroceryList) => void;
  onBack: () => void;
}

export function ListEditor({ list, onUpdate, onBack }: ListEditorProps) {
  const [title, setTitle] = useState(list.title);
  const [newItemText, setNewItemText] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(!list.title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const newItemInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    onUpdate({ ...list, title: title.trim() || "Untitled List" });
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: ListItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
      };
      onUpdate({
        ...list,
        items: [...list.items, newItem],
      });
      setNewItemText("");
      newItemInputRef.current?.focus();
    }
  };

  const handleDeleteItem = (itemId: string) => {
    onUpdate({
      ...list,
      items: list.items.filter(item => item.id !== itemId),
    });
  };

  const handleToggleItem = (itemId: string) => {
    onUpdate({
      ...list,
      items: list.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {isEditingTitle ? (
              <div className="flex-1 flex gap-2">
                <Input
                  ref={titleInputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter list title..."
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                  onBlur={handleTitleSave}
                  className="text-2xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0"
                />
                <Button size="sm" onClick={handleTitleSave}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <h1
                className="text-2xl font-bold text-grocery-text cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {title || "Untitled List"}
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Add New Item */}
          <Card className="p-4 bg-grocery-card border border-border">
            <div className="flex gap-2">
              <Input
                ref={newItemInputRef}
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add item to your grocery list..."
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                className="flex-1"
              />
              <Button
                onClick={handleAddItem}
                disabled={!newItemText.trim()}
                className="rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Items List */}
          <div className="space-y-3">
            {list.items.length > 0 ? (
              list.items.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 bg-grocery-card border border-border hover:shadow-card transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleItem(item.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.completed
                          ? "bg-primary border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {item.completed && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </button>
                    
                    <span
                      className={`flex-1 transition-all duration-200 ${
                        item.completed
                          ? "text-grocery-text-light line-through"
                          : "text-grocery-text"
                      }`}
                    >
                      {item.text}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 bg-grocery-card border border-dashed border-border text-center">
                <div className="text-grocery-text-light">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Your grocery list is empty</p>
                  <p className="text-sm">Start adding items to get organized!</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}