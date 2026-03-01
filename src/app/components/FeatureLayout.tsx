import { Navigation } from "./Navigation";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface FeatureLayoutProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  gradientClass: string;
  children: ReactNode;
}

export function FeatureLayout({ title, subtitle, icon, gradientClass, children }: FeatureLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
      <Navigation />
      
      <main className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${gradientClass} flex items-center justify-center shadow-lg`}>
              {icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                {title}
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {subtitle}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {children}
      </main>
    </div>
  );
}
