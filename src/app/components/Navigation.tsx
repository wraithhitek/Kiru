import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { KiruLogo } from "./KiruLogo";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      const userData = localStorage.getItem('kiruUser');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name);
      }
    }
  }, [location]);
  
  const handleScrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('kiruUser');
    setIsAuthenticated(false);
    navigate('/');
  };
  
  const navItems = [
    { label: "Platform", path: "/", action: () => navigate('/') },
    ...(isAuthenticated ? [{ label: "My Dashboard", path: "/dashboard", action: () => navigate('/dashboard') }] : []),
    { label: "Features", path: "#features", action: () => handleScrollToSection('features') },
    { label: "Tools", path: "#tools", action: () => handleScrollToSection('tools') },
  ];
  
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-8 py-6 bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-50"
    >
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-10 h-10"
          >
            <KiruLogo className="w-full h-full" />
          </motion.div>
          <span className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
            Kiru
          </span>
        </Link>
        
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {item.label}
              {(location.pathname === item.path || (item.path === '/' && location.pathname === '/')) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-x-2 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-orange-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{userName}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Out
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/signin')}
              className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg shadow-blue-500/25"
            >
              Get Started
            </motion.button>
          </>
        )}
      </div>
    </motion.nav>
  );
}
