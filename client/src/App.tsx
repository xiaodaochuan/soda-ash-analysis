import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";

function Router({ isLoggedIn, onLogout }: { isLoggedIn: boolean; onLogout: () => void }) {
  return (
    <Switch>
      <Route path={"/login"} component={() => <Login onLogin={() => {}} />} />
      <Route path={"/"} component={isLoggedIn ? () => <Home onLogout={onLogout} /> : () => <Login onLogin={() => {}} />} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 检查登录状态
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <p className="text-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          {isLoggedIn ? (
            <div className="min-h-screen">
              <Home onLogout={handleLogout} />
            </div>
          ) : (
            <Login onLogin={handleLogin} />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
