import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"; 
import { Activity, ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, 
ShieldCheck, User } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
  
import { useAuth } from "@/contexts/AuthContext"; 
import { Button } from "@/components/ui/button"; 
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog"; 
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { toast } from "@/components/ui/sonner"; 
  
const loginSchema = z.object({ 
  email: z.string().trim().min(1, "Informe seu email.").email("Informe um email válido."), 
  password: z.string().min(1, "Informe sua senha."), 
}); 
  
type LoginFormValues = z.infer<typeof loginSchema>; 
  
const dualRoleEmails = new Set(["nutri.paciente@vitacare.com", 
"dual@vitacare.com"]); 
  
const Login = () => { 
  const navigate = useNavigate(); 
  const { signIn } = useAuth(); 
  
  const [showPassword, setShowPassword] = useState(false); 
  const [accountChoiceOpen, setAccountChoiceOpen] = useState(false); 
  const [pendingEmail, setPendingEmail] = useState(""); 
  
  const { 
    register, 
    handleSubmit, 
    getValues, 
    formState: { errors, isSubmitting }, 
  } = useForm<LoginFormValues>({ 
    resolver: zodResolver(loginSchema), 
    defaultValues: { 
      email: "", 
      password: "", 
    }, 
  }); 
  
  const onSubmit = async () => { 
    const email = getValues("email").trim().toLowerCase(); 
  
    if (dualRoleEmails.has(email)) { 
      setPendingEmail(email); 
      setAccountChoiceOpen(true); 
      return; 
    } 
  
    signIn({ 
      token: "mock-token", 
      user: { email, role: "patient" }, 
    }); 
  
    toast.success("Login realizado", { 
      description: "Redirecionando para o dashboard.", 
    }); 
  
    navigate("/dashboard", { replace: true }); 
  }; 
  
  const handleAccountChoice = (role: "patient" | "nutritionist") => { 
    const roleLabel = role === "patient" ? "paciente" : "nutricionista"; 
  
    signIn({ 
      token: "mock-token", 
      user: { email: pendingEmail, role }, 
    }); 
  
    toast.success(`Entrando como ${roleLabel}`, { 
      description: `Usando a conta vinculada a ${pendingEmail}.`, 
    }); 
  
    setAccountChoiceOpen(false); 
    setPendingEmail(""); 
    navigate("/dashboard", { replace: true }); 
  }; 
  
  return ( 
    <> 
      <Dialog open={accountChoiceOpen} onOpenChange={setAccountChoiceOpen}> 
        {/* ... dialog content ... */} 
      </Dialog> 
      {/* ... rest of JSX ... */} 
    </> 
  ); 
}; 
  
export default Login;