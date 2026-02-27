import { CalendarDays, PenLine, LineChart, User } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import { ThemeToggle } from "./ThemeToggle";
import { useMoodStore } from "@/store/moodStore";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useMoodStore();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const navItems = [
    { name: "기록하기", path: "/", icon: <PenLine size={24} /> },
    { name: "히스토리", path: "/history", icon: <CalendarDays size={24} /> },
    { name: "인사이트", path: "/insights", icon: <LineChart size={24} /> },
  ];

  if (user) {
    navItems.push({ name: "MY", path: "/mypage", icon: <User size={24} /> });
  } else {
    navItems.push({ name: "로그인", path: "/login", icon: <User size={24} /> });
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${active ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          );
        })}
      </div >
    </nav >
  );
};

export default BottomNav;
