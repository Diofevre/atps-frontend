import { 
  BookOpen, 
  Book, 
  HelpCircle, 
  BarChart, 
  FileText, 
  Home,
  User
} from "lucide-react";
import { IoIosBookmarks } from "react-icons/io";
import { MdPreview } from "react-icons/md";

export const routes = [
  {
    label: "Adminitrateur",
    icon: Home,
    href: "/administrateur"
  },
  {
    label: 'Users',
    icon: User,
    href: '/administrateur/users'
  },
  {
    label: "Topics",
    icon: BookOpen,
    href: "/administrateur/topics",
  },
  {
    label: "Modules",
    icon: Book,
    href: "/administrateur/chapters",
  },
  {
    label: "Questions",
    icon: HelpCircle,
    href: "/administrateur/questions",
  },
  {
    label: "Reports",
    icon: BarChart,
    href: "/administrateur/reports",
  },
  {
    label: "Articles",
    icon: FileText,
    href: "/administrateur/articles",
  },
  {
    label: "Dictionary",
    icon: IoIosBookmarks,
    href: "/administrateur/dictionary",
  },
  {
    label: "Reviews",
    icon: MdPreview,
    href: "/administrateur/reviews",
  },
];
