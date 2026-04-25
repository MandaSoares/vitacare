import { useState } from "react"; 
  
import { zodResolver } from "@hookform/resolvers/zod"; 
import { Activity, ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, 
ShieldCheck, User } from "lucide-react"; 
import { Link } from "react-router-dom"; 
import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
  
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
  
type LoginSuccessResponse = { 
  status: 200; 
  message: string; 
}; 
  
type LoginErrorResponse = { 
  status: 400 | 401 | 500; 
  message: string; 
}; 
  
const dualRoleEmails = new Set(["nutri.paciente@vitacare.com", "dual@vitacare.com"]); 
  
const simulateLoginApi = async (email: string, password: string): 
Promise<LoginSuccessResponse> => { 
  await new Promise((resolve) => setTimeout(resolve, 900)); 
  
  const normalizedEmail = email.trim().toLowerCase(); 
  
  if (normalizedEmail.includes("500")) { 
    throw { 
      status: 500, 
      message: "Servidor indisponível no momento.", 
    } satisfies LoginErrorResponse; 
  } 
  
  if (!password || password.length < 6) { 
    throw { 
      status: 400, 
      message: "Senha inválida. Use pelo menos 6 caracteres.", 
    } satisfies LoginErrorResponse; 
  } 
  
  if (password !== "123456") { 
    throw { 
      status: 401, 
      message: "E-mail ou senha incorretos.", 
    } satisfies LoginErrorResponse; 
  } 
  
  return { 
    status: 200, 
    message: "Login realizado com sucesso.", 
  }; 
}; 
  
const isLoginErrorResponse = (error: unknown): error is LoginErrorResponse => { 
  if (!error || typeof error !== "object") { 
    return false; 
  } 
  
  if (!("status" in error) || !("message" in error)) { 
    return false; 
  } 
  
  const status = (error as { status: unknown }).status; 
  const message = (error as { message: unknown }).message; 
  
  return typeof message === "string" && (status === 400 || status === 401 || status === 500); 
}; 
  
const Login = () => { 
  const [showPassword, setShowPassword] = useState(false); 
  const [accountChoiceOpen, setAccountChoiceOpen] = useState(false); 
  const [pendingEmail, setPendingEmail] = useState(""); 
  
  const { 
    register, 
    handleSubmit, 
    getValues, 
    setValue, 
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
    const password = getValues("password"); 
  
    try { 
      const response = await simulateLoginApi(email, password); 
  
      if (dualRoleEmails.has(email)) { 
        setPendingEmail(email); 
        setAccountChoiceOpen(true); 
        return; 
      } 
  
      toast.success(response.message, { 
        description: "Os dados informados estão prontos para autenticação.", 
      }); 
    } catch (error) { 
      if (isLoginErrorResponse(error)) { 
        toast.error("Falha no login", { 
          description: error.message, 
        }); 
      } else { 
        toast.error("Falha no login", { 
          description: "Não foi possível concluir a autenticação.", 
        }); 
      } 
  
      setValue("password", "", { shouldValidate: true }); 
    } 
  }; 
  
  const handleAccountChoice = (role: "patient" | "nutritionist") => { 
    const roleLabel = role === "patient" ? "paciente" : "nutricionista"; 
  
    toast.success(`Entrando como ${roleLabel}`, { 
      description: `Usando a conta vinculada a ${pendingEmail}.`, 
    }); 
  
    setAccountChoiceOpen(false); 
    setPendingEmail(""); 
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