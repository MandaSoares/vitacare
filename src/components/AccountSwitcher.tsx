import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { findStoredAccountByEmail } from "@/lib/authAccountStore";

const AccountSwitcher: React.FC = () => {
  const { user, token, signIn } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.email) return null;

  const stored = findStoredAccountByEmail(user.email);
  if (!stored || !stored.roles || stored.roles.length <= 1) return null;

  const handleSwitch = (role: "patient" | "nutritionist") => {
    // Reuse current token and update user role
    const nextUser = { ...user, role } as NonNullable<typeof user>;
    signIn({ token: token ?? "", user: nextUser });
    if (role === "patient") {
      navigate("/patient/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">Trocar Conta</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} className="w-44">
        <DropdownMenuLabel>Entrar como</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {stored.roles.includes("nutritionist") && (
          <DropdownMenuItem onSelect={() => handleSwitch("nutritionist")}>Nutricionista</DropdownMenuItem>
        )}
        {stored.roles.includes("patient") && (
          <DropdownMenuItem onSelect={() => handleSwitch("patient")}>Paciente</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountSwitcher;
