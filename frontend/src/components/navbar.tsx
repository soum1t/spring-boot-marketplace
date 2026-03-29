import {
  HeartIcon,
  SearchIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

import { useAuth } from "@/context/useAuth";
import ProfileIcon from "./profile-icon";

export default function NavBar({ className }: { className?: string }) {
  const { user } = useAuth();

  return (
    <nav
      className={`${className} m-auto flex p-4 items-center justify-between`}
    >
      <div className="flex gap-2 flex-1 justify-start">
        <ShoppingBagIcon strokeWidth={2.5} />
        <p className="text-xl font-bold">Marketplace</p>
      </div>
      <div className="flex-2">
        <InputGroup className="max-w-full">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-10">
          <div className="flex gap-2">
            <HeartIcon />
            <ShoppingCartIcon />
          </div>
          <div>
            <ProfileIcon user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
