import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ListCard } from "@/components/ListCard";
import { ListEditor } from "@/components/ListEditor";
import { SearchResults } from "@/components/SearchResults";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Sparkles } from "lucide-react";

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

// Sample data for demonstration
const createSampleLists = (): GroceryList[] => [
  {
    id: "1",
    title: "Weekly Grocery Run",
    items: [
      { id: "1", text: "Organic bananas", completed: false },
      { id: "2", text: "Whole grain bread", completed: false },
      { id: "3", text: "Greek yogurt", completed: true },
      { id: "4", text: "Free-range eggs", completed: false },
      { id: "5", text: "Fresh spinach", completed: false },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Party Supplies",
    items: [
      { id: "6", text: "Chips and dips", completed: false },
      { id: "7", text: "Soft drinks", completed: false },
      { id: "8", text: "Ice cream", completed: false },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Healthy Meal Prep",
    items: [
      { id: "9", text: "Quinoa", completed: true },
      { id: "10", text: "Salmon fillets", completed: false },
      { id: "11", text: "Avocados", completed: false },
      { id: "12", text: "Bell peppers", completed: false },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Baking Essentials",
    items: [
      { id: "13", text: "All-purpose flour", completed: false },
      { id: "14", text: "Vanilla extract", completed: false },
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Quick Snacks",
    items: [
      { id: "15", text: "Mixed nuts", completed: false },
      { id: "16", text: "Protein bars", completed: false },
      { id: "17", text: "Fresh fruit", completed: false },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

const Index = () => {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<"home" | "editor">("home");
  const [currentList, setCurrentList] = useState<GroceryList | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    setLists(createSampleLists());
  }, []);

  // Get recent lists (5 most recent)
  const recentLists = lists
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Filter lists based on search query
  const searchResults = lists.filter(list =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateList = () => {
    const newList: GroceryList = {
      id: Date.now().toString(),
      title: "",
      items: [],
      createdAt: new Date(),
    };
    setLists(prev => [newList, ...prev]);
    setCurrentList(newList);
    setCurrentView("editor");
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleViewList = (list: GroceryList) => {
    setCurrentList(list);
    setCurrentView("editor");
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleUpdateList = (updatedList: GroceryList) => {
    setLists(prev =>
      prev.map(list => (list.id === updatedList.id ? updatedList : list))
    );
    setCurrentList(updatedList);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setCurrentList(null);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.trim().length > 0);
  };

  const handleSearchResultSelect = (list: GroceryList) => {
    handleViewList(list);
  };

  // Render current view
  if (currentView === "editor" && currentList) {
    return (
      <ListEditor
        list={currentList}
        onUpdate={handleUpdateList}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Search */}
      <div className="relative">
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onCreateList={handleCreateList}
        />
        
        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute inset-x-0 top-full z-50">
            <div className="container mx-auto px-4">
              <div className="max-w-md mx-auto relative">
                <SearchResults
                  query={searchQuery}
                  results={searchResults}
                  onSelectList={handleSearchResultSelect}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-grocery-text mb-4">
              Your Recent Grocery Lists
            </h2>
            <p className="text-grocery-text-light">
              Keep track of your shopping with organized, searchable lists
            </p>
          </div>

          {/* Recent Lists Grid */}
          {recentLists.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentLists.map((list) => (
                <ListCard
                  key={list.id}
                  list={list}
                  onView={handleViewList}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="p-12 text-center bg-grocery-card border border-dashed border-border">
              <div className="max-w-sm mx-auto">
                <div className="relative mb-6">
                  <ShoppingCart className="h-16 w-16 text-primary/30 mx-auto" />
                  <Sparkles className="h-6 w-6 text-grocery-accent absolute -top-2 -right-2" />
                </div>
                <h3 className="text-xl font-semibold text-grocery-text mb-2">
                  Start Your First Grocery List!
                </h3>
                <p className="text-grocery-text-light mb-6">
                  Get organized and never forget an item again. Create your first list to get started.
                </p>
                <button
                  onClick={handleCreateList}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-md"
                >
                  Create Your First List
                </button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
