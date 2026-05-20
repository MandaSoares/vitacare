import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getNutritionistInitials, getNutritionistProfile } from "@/lib/nutritionistProfileStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useMemo } from "react";

export const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const profile = useMemo(() => getNutritionistProfile(user), [user]);

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0 h-11 w-11">
          <Avatar className="h-11 w-11 cursor-pointer">
            {profile.profileImageUrl && (
              <AvatarImage src={profile.profileImageUrl} alt={profile.name} />
            )}
            <AvatarFallback className="bg-emerald-100 text-emerald-800 font-semibold">
              {getNutritionistInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-10 w-10">
            {profile.profileImageUrl && (
              <AvatarImage src={profile.profileImageUrl} alt={profile.name} />
            )}
            <AvatarFallback className="bg-emerald-100 text-emerald-800 font-semibold">
              {getNutritionistInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900"
        >
          <LogOut className="mr-2 h-4 w-4 text-slate-500" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
