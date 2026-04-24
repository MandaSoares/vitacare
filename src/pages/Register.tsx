import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, ArrowLeft, Check, ImagePlus, Stethoscope, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm, type Path } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

const steps = ["", "", "", ""];

const expertiseOptions = [
  "Clínica",
  "Doenças crônicas",
  "Reeducação alimentar",
  "Nutrição funcional",
  "Esportiva",
  "Vegetariana e vegana",
  "Pediatria",
  "Outra",
];

const healthPlansOptions = ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Particular", "Outra"];

const patientGoalOptions = [
  "Perda de peso",
  "Ganho de massa",
  "Reeducação alimentar",
  "Melhorar disposição",
  "Controle de condição clínica",
];

const patientActivityOptions = [
  "Sedentário",
  "Levemente ativo",
  "Moderadamente ativo",
  "Muito ativo",
];

const stateOptions = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapa" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceara" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espirito Santo" },
  { code: "GO", name: "Goias" },
  { code: "MA", name: "Maranhao" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Para" },
  { code: "PB", name: "Paraiba" },
  { code: "PR", name: "Parana" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piaui" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondonia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "Sao Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

const availabilityOptions = [
  "Nao disponivel",
  ...Array.from({ length: 17 }, (_, index) => {
    const startHour = 6 + index;
    const endHour = startHour + 1;

    return `${startHour.toString().padStart(2, "0")}:00 - ${endHour.toString().padStart(2, "0")}:00`;
  }),
];

const weekDayFields = [
  { field: "mondayAvailability", label: "Segunda-feira" },
  { field: "tuesdayAvailability", label: "Terça-feira" },
  { field: "wednesdayAvailability", label: "Quarta-feira" },
  { field: "thursdayAvailability", label: "Quinta-feira" },
  { field: "fridayAvailability", label: "Sexta-feira" },
  { field: "saturdayAvailability", label: "Sábado" },
  { field: "sundayAvailability", label: "Domingo" },
] as const;

type WeekDayField = (typeof weekDayFields)[number]["field"];

const bannerPresets = [
  {
    id: "forest",
    name: "Verde clínico",
    className: "bg-gradient-to-r from-[#2f684b] via-[#2a7452] to-[#43795d]",
  },
  {
    id: "sunrise",
    name: "Manhã leve",
    className: "bg-gradient-to-r from-[#a76f2a] via-[#c38f41] to-[#d0ad5a]",
  },
  {
    id: "ocean",
    name: "Azul oceano",
    className: "bg-gradient-to-r from-[#255f79] via-[#2f7590] to-[#4c90a7]",
  },
];

const registerSchema = z
  .object({
    profileType: z.enum(["patient", "nutritionist"]).optional(),
    fullName: z.string().trim().min(3, "Informe seu nome completo."),
    email: z.string().trim().min(1, "Informe seu email.").email("Informe um email válido."),
    emailConfirmation: z.string().trim().min(1, "Confirme seu email."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    crn: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    specialty: z.string().trim().optional(),
    state: z.string().trim().optional(),
    city: z.string().trim().optional(),
    attendance: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    formationPrimary: z.string().trim().optional(),
    formationSecondary: z.string().trim().optional(),
    serviceFirst: z.string().trim().optional(),
    serviceReturn: z.string().trim().optional(),
    servicePlan: z.string().trim().optional(),
    serviceBioimpedance: z.string().trim().optional(),
    mondayAvailability: z.array(z.string()).optional(),
    tuesdayAvailability: z.array(z.string()).optional(),
    wednesdayAvailability: z.array(z.string()).optional(),
    thursdayAvailability: z.array(z.string()).optional(),
    fridayAvailability: z.array(z.string()).optional(),
    saturdayAvailability: z.array(z.string()).optional(),
    sundayAvailability: z.array(z.string()).optional(),
    expertise: z.array(z.string()).optional(),
    otherExpertise: z.string().trim().optional(),
    acceptedPlans: z.array(z.string()).optional(),
    otherPlan: z.string().trim().optional(),
    careForAdults: z.boolean().optional(),
    careForChildren: z.boolean().optional(),
    patientWeight: z.string().trim().optional(),
    patientHeight: z.string().trim().optional(),
    patientAge: z.string().trim().optional(),
    patientGoal: z.string().trim().optional(),
    patientActivityLevel: z.string().trim().optional(),
    patientAllergies: z.string().trim().optional(),
    patientMedicalConditions: z.string().trim().optional(),
    patientFoodRoutine: z.string().trim().optional(),
    profileImageName: z.string().trim().optional(),
    bannerPreset: z.string().trim().optional(),
    customBannerName: z.string().trim().optional(),
  })
  .superRefine((values, context) => {
    if (!values.profileType) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione um perfil para continuar.",
        path: ["profileType"],
      });

      return;
    }

    if (values.email.trim().toLowerCase() !== values.emailConfirmation.trim().toLowerCase()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A confirmação de email deve ser igual ao email informado.",
        path: ["emailConfirmation"],
      });
    }

    if (!values.profileImageName) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione uma foto de perfil.",
        path: ["profileImageName"],
      });
    }

    if (values.profileType === "nutritionist") {
      if (!values.crn || values.crn.length < 3) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe seu CRN.",
          path: ["crn"],
        });
      }

      if (!values.phone || values.phone.length < 8) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe um telefone válido.",
          path: ["phone"],
        });
      }

      if (!values.specialty || values.specialty.length < 2) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe sua especialidade principal.",
          path: ["specialty"],
        });
      }

      if (!values.state) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione o estado.",
          path: ["state"],
        });
      }

      if (!values.city) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione a cidade.",
          path: ["city"],
        });
      }

      if (!values.attendance) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione o formato de consulta.",
          path: ["attendance"],
        });
      }

      if (!values.bio || values.bio.length < 40) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Descreva sua abordagem profissional (mínimo 40 caracteres).",
          path: ["bio"],
        });
      }

      if (!values.formationPrimary || values.formationPrimary.length < 6) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe sua formação principal.",
          path: ["formationPrimary"],
        });
      }

      if (!values.serviceFirst) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o valor da primeira consulta.",
          path: ["serviceFirst"],
        });
      }

      if (!values.serviceReturn) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o valor do retorno nutricional.",
          path: ["serviceReturn"],
        });
      }

      if (!values.servicePlan) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o valor do plano alimentar personalizado.",
          path: ["servicePlan"],
        });
      }

      if (!values.serviceBioimpedance) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe se oferece bioimpedância.",
          path: ["serviceBioimpedance"],
        });
      }

      const availabilityByDay = [
        values.mondayAvailability,
        values.tuesdayAvailability,
        values.wednesdayAvailability,
        values.thursdayAvailability,
        values.fridayAvailability,
        values.saturdayAvailability,
        values.sundayAvailability,
      ];

      availabilityByDay.forEach((slots, index) => {
        if (!slots || slots.length === 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecione ao menos um horário.",
            path: [weekDayFields[index].field],
          });
        }
      });

      if (!values.expertise || values.expertise.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione ao menos uma área de atuação.",
          path: ["expertise"],
        });
      }

      if (values.expertise?.includes("Outra") && !values.otherExpertise) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe a outra área de atuação.",
          path: ["otherExpertise"],
        });
      }

      if (!values.acceptedPlans || values.acceptedPlans.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione ao menos um plano aceito.",
          path: ["acceptedPlans"],
        });
      }

      if (values.acceptedPlans?.includes("Outra") && !values.otherPlan) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o outro plano de saúde.",
          path: ["otherPlan"],
        });
      }

      if (!values.careForAdults && !values.careForChildren) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione ao menos um tipo de paciente atendido.",
          path: ["careForAdults"],
        });
      }

      if (!values.bannerPreset) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione ou envie um banner.",
          path: ["bannerPreset"],
        });
      }

      if (values.bannerPreset === "custom" && !values.customBannerName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Envie o banner próprio para continuar.",
          path: ["customBannerName"],
        });
      }
    }

    if (values.profileType === "patient") {
      if (!values.patientWeight) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe seu peso.",
          path: ["patientWeight"],
        });
      }

      if (!values.patientHeight) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe sua altura.",
          path: ["patientHeight"],
        });
      }

      if (!values.patientAge) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe sua idade.",
          path: ["patientAge"],
        });
      }

      if (!values.patientGoal) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione seu principal objetivo.",
          path: ["patientGoal"],
        });
      }

      if (!values.patientActivityLevel) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione seu nível de atividade.",
          path: ["patientActivityLevel"],
        });
      }

      if (!values.patientFoodRoutine || values.patientFoodRoutine.length < 20) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Descreva sua rotina alimentar (mínimo 20 caracteres).",
          path: ["patientFoodRoutine"],
        });
      }
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const profiles = [
  {
    icon: User,
    key: "patient",
    title: "Paciente",
    description: "Buscar nutricionistas e acompanhamento",
  },
  {
    icon: Stethoscope,
    key: "nutritionist",
    title: "Nutricionista",
    description: "Gerenciar pacientes e consultas",
  },
];

const Register = () => {
  const [selectedProfile, setSelectedProfile] = useState<"patient" | "nutritionist" | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [availabilityOpenDay, setAvailabilityOpenDay] = useState<WeekDayField | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [customBannerPreview, setCustomBannerPreview] = useState<string | null>(null);
  const [profileImageScale, setProfileImageScale] = useState([1]);
  const [bannerScale, setBannerScale] = useState([1]);
  const [profileImageScaleDraft, setProfileImageScaleDraft] = useState([1]);
  const [bannerScaleDraft, setBannerScaleDraft] = useState([1]);
  const [isProfileAdjusting, setIsProfileAdjusting] = useState(false);
  const [isBannerAdjusting, setIsBannerAdjusting] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      profileType: undefined,
      fullName: "",
      email: "",
      emailConfirmation: "",
      password: "",
      crn: "",
      phone: "",
      specialty: "",
      state: "",
      city: "",
      attendance: "",
      bio: "",
      formationPrimary: "",
      formationSecondary: "",
      serviceFirst: "",
      serviceReturn: "",
      servicePlan: "",
      serviceBioimpedance: "",
      mondayAvailability: [],
      tuesdayAvailability: [],
      wednesdayAvailability: [],
      thursdayAvailability: [],
      fridayAvailability: [],
      saturdayAvailability: [],
      sundayAvailability: [],
      expertise: [],
      otherExpertise: "",
      acceptedPlans: [],
      otherPlan: "",
      careForAdults: false,
      careForChildren: false,
      patientWeight: "",
      patientHeight: "",
      patientAge: "",
      patientGoal: "",
      patientActivityLevel: "",
      patientAllergies: "",
      patientMedicalConditions: "",
      patientFoodRoutine: "",
      profileImageName: "",
      bannerPreset: "",
      customBannerName: "",
    },
  });

  const canProceed = selectedProfile !== null;
  const isNutritionist = selectedProfile === "nutritionist";
  const isPatient = selectedProfile === "patient";

  const nutritionistBasicStepFields: Path<RegisterFormValues>[] = [
    "fullName",
    "email",
    "emailConfirmation",
    "password",
    "crn",
    "phone",
  ];

  const patientBasicStepFields: Path<RegisterFormValues>[] = [
    "fullName",
    "email",
    "emailConfirmation",
    "password",
  ];

  const nutritionistProfileStepFields: Path<RegisterFormValues>[] = [
    "specialty",
    "state",
    "city",
    "attendance",
    "bio",
    "formationPrimary",
    "serviceFirst",
    "serviceReturn",
    "servicePlan",
    "serviceBioimpedance",
    "mondayAvailability",
    "tuesdayAvailability",
    "wednesdayAvailability",
    "thursdayAvailability",
    "fridayAvailability",
    "saturdayAvailability",
    "sundayAvailability",
    "expertise",
    "otherExpertise",
    "acceptedPlans",
    "otherPlan",
    "careForAdults",
    "careForChildren",
  ];

  const patientPreAnalysisStepFields: Path<RegisterFormValues>[] = [
    "patientWeight",
    "patientHeight",
    "patientAge",
    "patientGoal",
    "patientActivityLevel",
    "patientFoodRoutine",
  ];

  const selectedExpertise = watch("expertise");
  const selectedPlans = watch("acceptedPlans");
  const selectedState = watch("state");
  const selectedBanner = watch("bannerPreset");
  const selectedBannerPreset = useMemo(
    () => bannerPresets.find((preset) => preset.id === selectedBanner) ?? null,
    [selectedBanner],
  );
  useEffect(() => {
    if (!selectedState) {
      setAvailableCities([]);
      return;
    }

    const controller = new AbortController();

    const loadCities = async () => {
      setIsLoadingCities(true);

      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar cidades.");
        }

        const data = (await response.json()) as Array<{ nome: string }>;
        setAvailableCities(data.map((item) => item.nome));
      } catch (error) {
        if (!controller.signal.aborted) {
          setAvailableCities([]);
          toast.error("Não foi possível carregar as cidades", {
            description: "Verifique sua conexão e tente novamente.",
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCities(false);
        }
      }
    };

    void loadCities();

    return () => {
      controller.abort();
    };
  }, [selectedState]);

  useEffect(() => {
    if (currentStep === 3) {
      clearErrors(["profileImageName", "bannerPreset", "customBannerName"]);
    }
  }, [clearErrors, currentStep]);

  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }

      if (customBannerPreview) {
        URL.revokeObjectURL(customBannerPreview);
      }
    };
  }, [customBannerPreview, profileImagePreview]);

  const toggleTagSelection = (field: "expertise" | "acceptedPlans", value: string) => {
    const currentValues = getValues(field);
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setValue(field, nextValues, { shouldValidate: true });
  };

  const toggleAvailabilitySlot = (dayField: WeekDayField, slot: string) => {
    const currentSlots = getValues(dayField);

    if (slot === "Nao disponivel") {
      const nextSlots = currentSlots.length === 1 && currentSlots[0] === slot ? [] : [slot];

      setValue(dayField, nextSlots, { shouldValidate: true });
      return;
    }

    const filteredSlots = currentSlots.filter((item) => item !== "Nao disponivel");
    const nextSlots = filteredSlots.includes(slot)
      ? filteredSlots.filter((item) => item !== slot)
      : [...filteredSlots, slot];

    setValue(dayField, nextSlots, { shouldValidate: true });
  };

  const renderFieldError = (field: Path<RegisterFormValues>) => {
    const message = errors[field]?.message;

    if (!message) {
      return null;
    }

    return <p className="text-xs font-medium text-destructive">{message}</p>;
  };

  const onSubmit = () => {
    toast.success("Cadastro concluido com sucesso");
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!canProceed) {
        return;
      }

      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      const isValidBasicStep = await trigger(
        isNutritionist ? nutritionistBasicStepFields : patientBasicStepFields,
      );

      if (!isValidBasicStep) {
        return;
      }

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const isValidProfileStep = await trigger(
        isNutritionist ? nutritionistProfileStepFields : patientPreAnalysisStepFields,
      );

      if (!isValidProfileStep) {
        return;
      }

      setCurrentStep(3);
      return;
    }
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
    setProfileImageScale([1]);
    setProfileImageScaleDraft([1]);
    setIsProfileAdjusting(true);
    setValue("profileImageName", file.name, { shouldValidate: true });
  };

  const handleCustomBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (customBannerPreview) {
      URL.revokeObjectURL(customBannerPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setCustomBannerPreview(previewUrl);
    setBannerScale([1]);
    setBannerScaleDraft([1]);
    setIsBannerAdjusting(true);
    setValue("customBannerName", file.name, { shouldValidate: true });
    setValue("bannerPreset", "custom", { shouldValidate: true });
  };

  const handlePresetBannerSelect = (presetId: string) => {
    if (customBannerPreview) {
      URL.revokeObjectURL(customBannerPreview);
      setCustomBannerPreview(null);
      setValue("customBannerName", "", { shouldValidate: true });
    }

    setBannerScale([1]);
    setBannerScaleDraft([1]);
    setIsBannerAdjusting(false);
    setValue("bannerPreset", presetId, { shouldValidate: true });
  };

  const handleBack = () => {
    if (currentStep === 0) {
      return;
    }

    setCurrentStep((step) => step - 1);
  };

  const currentBannerPreview = customBannerPreview || selectedBannerPreset;

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <aside className="relative hidden overflow-hidden bg-[#1d6946] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:self-start">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_80%_74%,rgba(255,255,255,0.12),transparent_24%)]" />

        <div className="relative flex h-full flex-col justify-between px-14 py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">VitaCare</p>
              <p className="text-sm text-white/75">Cadastro de cliente e nutricionista</p>
            </div>
          </div>

          <div className="max-w-md space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Crie sua conta</p>
            <h1 className="text-4xl font-semibold leading-tight text-balance">
              Comece agora seu cuidado nutricional com estrutura e praticidade.
            </h1>
            <p className="text-base leading-7 text-white/80">
              Cadastre-se para acessar planos personalizados, acompanhar sua evolucao e manter sua rotina alimentar organizada.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Conta", value: "Rapida" },
              { label: "Perfil", value: "Personalizado" },
              { label: "Jornada", value: "Guiada" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-10 lg:self-start">
        <div className="w-full max-w-md lg:max-w-[520px]">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>

          <div className="mb-8">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          <header className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-[#293530]">
              {currentStep === 0 && "Como deseja continuar?"}
              {currentStep === 1 && "Dados básicos"}
              {currentStep === 2 && (isNutritionist ? "Perfil profissional" : "Pré-análise nutricional")}
              {currentStep === 3 && "Fotos do perfil"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentStep === 0 && "Escolha seu perfil para prosseguir."}
              {currentStep === 1 && "Preencha as informações obrigatórias para iniciar o cadastro."}
              {currentStep === 2 &&
                (isNutritionist
                  ? "Informe os dados que aparecerão no seu perfil público."
                  : "Preencha os dados da pré-análise para apoiar a escolha do nutricionista ideal.")}
              {currentStep === 3 &&
                (isNutritionist ? "Envie sua foto e escolha um banner." : "Envie sua foto de perfil.")}
            </p>
          </header>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {currentStep === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {profiles.map(({ icon: Icon, key, title, description }) => {
                  const isSelected = selectedProfile === key;

                  return (
                    <button
                      key={title}
                      type="button"
                      onClick={() => {
                        setSelectedProfile(key as "patient" | "nutritionist");
                        setValue("profileType", key as "patient" | "nutritionist", { shouldValidate: true });
                      }}
                      aria-pressed={isSelected}
                      className={`group flex min-h-[116px] flex-col items-center justify-center rounded-2xl border px-5 py-6 text-center shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)] ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/25"
                          : "border-border/80 bg-background hover:border-primary/30"
                      }`}
                      data-selected={isSelected}
                    >
                      <span
                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {title}
                      </span>
                      <span className="mt-1 max-w-[150px] text-xs leading-5 text-muted-foreground">
                        {description}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    placeholder={isNutritionist ? "Ex: Dra. Ana Oliveira" : "Ex: Amanda Silva"}
                    {...register("fullName")}
                  />
                  {renderFieldError("fullName")}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={isNutritionist ? "profissional@email.com" : "paciente@email.com"}
                    {...register("email")}
                  />
                  {renderFieldError("email")}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="emailConfirmation">Confirmação de email</Label>
                  <Input
                    id="emailConfirmation"
                    type="email"
                    placeholder="Repita o email"
                    {...register("emailConfirmation")}
                  />
                  {renderFieldError("emailConfirmation")}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" placeholder="Mínimo 6 caracteres" {...register("password")} />
                  {renderFieldError("password")}
                </div>

                {isNutritionist ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="crn">CRN</Label>
                      <Input id="crn" placeholder="CRN-1 12345" {...register("crn")} />
                      {renderFieldError("crn")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="(11) 98765-4321" {...register("phone")} />
                      {renderFieldError("phone")}
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {currentStep === 2 && isNutritionist && (
              <div className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Dados do perfil</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Especialidade principal</Label>
                      <Input id="specialty" placeholder="Ex: Nutrição clínica" {...register("specialty")} />
                      {renderFieldError("specialty")}
                    </div>

                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Select
                        value={watch("state")}
                        onValueChange={(value) => {
                          setValue("state", value, { shouldValidate: true });
                          setValue("city", "", { shouldValidate: true });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {stateOptions.map((stateOption) => (
                            <SelectItem key={stateOption.code} value={stateOption.code}>
                              {stateOption.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {renderFieldError("state")}
                    </div>

                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Select
                        value={watch("city")}
                        onValueChange={(value) => setValue("city", value, { shouldValidate: true })}
                        disabled={!selectedState || isLoadingCities}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !selectedState
                                ? "Escolha o estado primeiro"
                                : isLoadingCities
                                  ? "Carregando cidades..."
                                  : "Selecione a cidade"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCities.map((cityOption) => (
                            <SelectItem key={cityOption} value={cityOption}>
                              {cityOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {renderFieldError("city")}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Formato de consulta</Label>
                      <Select
                        value={watch("attendance")}
                        onValueChange={(value) => setValue("attendance", value, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Presencial">Presencial</SelectItem>
                          <SelectItem value="Online e Presencial">Online e Presencial</SelectItem>
                        </SelectContent>
                      </Select>
                      {renderFieldError("attendance")}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="bio">Descrição profissional</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        placeholder="Explique sua abordagem e experiência para os pacientes."
                        {...register("bio")}
                      />
                      {renderFieldError("bio")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="formationPrimary">Formação principal</Label>
                      <Input id="formationPrimary" placeholder="Graduação em Nutrição - Universidade..." {...register("formationPrimary")} />
                      {renderFieldError("formationPrimary")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="formationSecondary">Pós-graduação / complementar</Label>
                      <Input id="formationSecondary" placeholder="Pós-graduação em Nutrição..." {...register("formationSecondary")} />
                      <p className="text-xs text-muted-foreground">Campo opcional.</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Serviços e preços</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="serviceFirst">Primeira consulta (R$)</Label>
                      <Input id="serviceFirst" type="number" placeholder="150" {...register("serviceFirst")} />
                      {renderFieldError("serviceFirst")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceReturn">Retorno nutricional (R$)</Label>
                      <Input id="serviceReturn" type="number" placeholder="90" {...register("serviceReturn")} />
                      {renderFieldError("serviceReturn")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="servicePlan">Plano alimentar personalizado (R$)</Label>
                      <Input id="servicePlan" type="number" placeholder="180" {...register("servicePlan")} />
                      {renderFieldError("servicePlan")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceBioimpedance">Bioimpedância</Label>
                      <Input id="serviceBioimpedance" placeholder="Ex: Incluso na consulta" {...register("serviceBioimpedance")} />
                      {renderFieldError("serviceBioimpedance")}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Áreas e atendimento</h3>
                  <div className="space-y-2">
                    <Label>Principais áreas de atuação</Label>
                    <div className="flex flex-wrap gap-2">
                      {expertiseOptions.map((option) => {
                        const isActive = selectedExpertise.includes(option);

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleTagSelection("expertise", option)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              isActive
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-primary/30"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {renderFieldError("expertise")}

                    {selectedExpertise.includes("Outra") ? (
                      <div className="space-y-2">
                        <Label htmlFor="otherExpertise">Outra área de atuação</Label>
                        <Input id="otherExpertise" placeholder="Descreva a área" {...register("otherExpertise")} />
                        {renderFieldError("otherExpertise")}
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label>Planos de saúde aceitos</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {healthPlansOptions.map((plan) => (
                        <label key={plan} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                          <Checkbox
                            checked={selectedPlans.includes(plan)}
                            onCheckedChange={() => toggleTagSelection("acceptedPlans", plan)}
                          />
                          {plan}
                        </label>
                      ))}
                    </div>
                    {renderFieldError("acceptedPlans")}

                    {selectedPlans.includes("Outra") ? (
                      <div className="space-y-2">
                        <Label htmlFor="otherPlan">Outro plano aceito</Label>
                        <Input id="otherPlan" placeholder="Digite o nome do plano" {...register("otherPlan")} />
                        {renderFieldError("otherPlan")}
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label>Pacientes que atendo</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                        <Checkbox
                          checked={watch("careForAdults")}
                          onCheckedChange={(checked) => setValue("careForAdults", checked === true, { shouldValidate: true })}
                        />
                        Adultos
                      </label>
                      <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                        <Checkbox
                          checked={watch("careForChildren")}
                          onCheckedChange={(checked) => setValue("careForChildren", checked === true, { shouldValidate: true })}
                        />
                        Crianças
                      </label>
                    </div>
                    {renderFieldError("careForAdults")}
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Disponibilidade no consultório</h3>
                  <div className="space-y-3">
                    {weekDayFields.map((day) => (
                      <div key={day.field} className="space-y-2">
                        <Label>{day.label}</Label>
                        <Popover
                          open={availabilityOpenDay === day.field}
                          onOpenChange={(open) => setAvailabilityOpenDay(open ? day.field : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button type="button" variant="outline" className="w-full justify-between rounded-xl">
                              <span className="truncate">
                                {watch(day.field).length > 0
                                  ? `${watch(day.field).length} horário(s) selecionado(s)`
                                  : "Selecionar horários"}
                              </span>
                              <span className="text-xs text-muted-foreground">{availabilityOpenDay === day.field ? "Fechar" : "Abrir"}</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-3" align="start">
                            <div className="space-y-2">
                              {availabilityOptions.map((option) => {
                                const selectedSlots = watch(day.field);
                                const isChecked = selectedSlots.includes(option);
                                const isUnavailable = option === "Nao disponivel";

                                return (
                                  <label
                                    key={option}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-secondary/60"
                                  >
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={() => toggleAvailabilitySlot(day.field, option)}
                                    />
                                    <span className={isUnavailable ? "font-medium" : ""}>{option}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>

                        {watch(day.field).length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {watch(day.field).map((slot) => (
                              <Badge key={`${day.field}-${slot}`} variant="secondary" className="gap-1.5 pr-1">
                                {slot}
                                <button
                                  type="button"
                                  onClick={() => toggleAvailabilitySlot(day.field, slot)}
                                  className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                                  aria-label={`Remover horário ${slot}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        ) : null}

                        {renderFieldError(day.field)}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {currentStep === 2 && isPatient && (
              <div className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Indicadores corporais</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="patientWeight">Peso (kg)</Label>
                      <Input id="patientWeight" type="number" placeholder="Ex: 68" {...register("patientWeight")} />
                      {renderFieldError("patientWeight")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientHeight">Altura (cm)</Label>
                      <Input id="patientHeight" type="number" placeholder="Ex: 172" {...register("patientHeight")} />
                      {renderFieldError("patientHeight")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientAge">Idade</Label>
                      <Input id="patientAge" type="number" placeholder="Ex: 29" {...register("patientAge")} />
                      {renderFieldError("patientAge")}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Objetivo e rotina</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Objetivo principal</Label>
                      <Select
                        value={watch("patientGoal")}
                        onValueChange={(value) => setValue("patientGoal", value, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {patientGoalOptions.map((goal) => (
                            <SelectItem key={goal} value={goal}>
                              {goal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {renderFieldError("patientGoal")}
                    </div>

                    <div className="space-y-2">
                      <Label>Nível de atividade física</Label>
                      <Select
                        value={watch("patientActivityLevel")}
                        onValueChange={(value) => setValue("patientActivityLevel", value, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          {patientActivityOptions.map((activity) => (
                            <SelectItem key={activity} value={activity}>
                              {activity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {renderFieldError("patientActivityLevel")}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="patientFoodRoutine">Rotina alimentar atual</Label>
                      <Textarea
                        id="patientFoodRoutine"
                        rows={4}
                        placeholder="Conte seus horários, frequência de refeições e principais dificuldades com alimentação."
                        {...register("patientFoodRoutine")}
                      />
                      {renderFieldError("patientFoodRoutine")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientAllergies">Alergias alimentares (opcional)</Label>
                      <Input id="patientAllergies" placeholder="Ex: lactose, castanhas" {...register("patientAllergies")} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientMedicalConditions">Condições clínicas (opcional)</Label>
                      <Input id="patientMedicalConditions" placeholder="Ex: hipertensão, diabetes" {...register("patientMedicalConditions")} />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {currentStep === 3 && isNutritionist && (
              <div className="space-y-6">
                <section className="space-y-3">
                  <Label htmlFor="profileImage">Foto de perfil</Label>
                  <label
                    htmlFor="profileImage"
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-5 transition-colors hover:border-primary/50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ImagePlus className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Selecionar imagem de perfil</p>
                      <p className="text-xs text-muted-foreground">JPG ou PNG</p>
                    </div>
                  </label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />

                  {profileImagePreview ? (
                    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
                      <div className="mx-auto flex h-44 w-full max-w-44 items-center justify-center rounded-full border border-border bg-muted/40 p-2 overflow-hidden">
                        <img
                          src={profileImagePreview}
                          alt="Pré-visualização da foto de perfil"
                          className="h-full w-full rounded-full object-cover"
                          style={{ transform: `scale(${isProfileAdjusting ? profileImageScaleDraft[0] : profileImageScale[0]})` }}
                        />
                      </div>

                      {isProfileAdjusting ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <span>Ajustar imagem</span>
                            <span>{Math.round(profileImageScaleDraft[0] * 100)}%</span>
                          </div>
                          <Slider
                            value={profileImageScaleDraft}
                            min={1}
                            max={2}
                            step={0.05}
                            onValueChange={setProfileImageScaleDraft}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProfileImageScale(profileImageScaleDraft);
                              setIsProfileAdjusting(false);
                            }}
                          >
                            Confirmar ajuste
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProfileImageScaleDraft(profileImageScale);
                              setIsProfileAdjusting(true);
                            }}
                          >
                            Ajustar imagem
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </section>

                <section className="space-y-3">
                  <Label>Banner do perfil</Label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {bannerPresets.map((preset) => {
                      const isSelected = selectedBanner === preset.id;

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handlePresetBannerSelect(preset.id)}
                          className={`h-24 rounded-xl border p-2 text-left transition-all ${
                            isSelected ? "border-primary ring-2 ring-primary/30" : "border-border"
                          }`}
                        >
                          <div className={`h-14 rounded-lg ${preset.className}`} />
                          <p className="mt-2 text-xs font-medium text-foreground">{preset.name}</p>
                        </button>
                      );
                    })}
                  </div>

                  <label
                    htmlFor="customBanner"
                    className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-4 transition-colors hover:border-primary/50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ImagePlus className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Enviar banner próprio</p>
                      <p className="text-xs text-muted-foreground">Substitui os banners prontos</p>
                    </div>
                  </label>

                  <Input
                    id="customBanner"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCustomBannerChange}
                  />

                  {currentBannerPreview ? (
                    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
                      <div className="overflow-hidden rounded-xl border border-border">
                        {customBannerPreview ? (
                          <img
                            src={customBannerPreview}
                            alt="Pré-visualização do banner"
                            className="h-32 w-full object-cover"
                            style={{
                              transform: `scale(${isBannerAdjusting ? bannerScaleDraft[0] : bannerScale[0]})`,
                              transformOrigin: "center",
                            }}
                          />
                        ) : (
                          <div className={`h-32 w-full ${selectedBannerPreset?.className ?? ""}`} />
                        )}
                      </div>

                      {customBannerPreview ? (
                        isBannerAdjusting ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                              <span>Ajustar banner</span>
                              <span>{Math.round(bannerScaleDraft[0] * 100)}%</span>
                            </div>
                            <Slider value={bannerScaleDraft} min={1} max={2} step={0.05} onValueChange={setBannerScaleDraft} />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setBannerScale(bannerScaleDraft);
                                setIsBannerAdjusting(false);
                              }}
                            >
                              Confirmar ajuste
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setBannerScaleDraft(bannerScale);
                                setIsBannerAdjusting(true);
                              }}
                            >
                              Ajustar banner
                            </Button>
                          </div>
                        )
                      ) : (
                        <p className="text-xs text-muted-foreground">Banner pronto selecionado.</p>
                      )}
                    </div>
                  ) : null}
                </section>
              </div>
            )}

            {currentStep === 3 && isPatient && (
              <div className="space-y-6">
                <section className="space-y-3">
                  <Label htmlFor="profileImage">Foto de perfil</Label>
                  <label
                    htmlFor="profileImage"
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-5 transition-colors hover:border-primary/50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ImagePlus className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Selecionar imagem de perfil</p>
                      <p className="text-xs text-muted-foreground">JPG ou PNG</p>
                    </div>
                  </label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />

                  {profileImagePreview ? (
                    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
                      <div className="mx-auto flex h-44 w-full max-w-44 items-center justify-center rounded-full border border-border bg-muted/40 p-2 overflow-hidden">
                        <img
                          src={profileImagePreview}
                          alt="Pré-visualização da foto de perfil"
                          className="h-full w-full rounded-full object-cover"
                          style={{ transform: `scale(${isProfileAdjusting ? profileImageScaleDraft[0] : profileImageScale[0]})` }}
                        />
                      </div>

                      {isProfileAdjusting ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <span>Ajustar imagem</span>
                            <span>{Math.round(profileImageScaleDraft[0] * 100)}%</span>
                          </div>
                          <Slider
                            value={profileImageScaleDraft}
                            min={1}
                            max={2}
                            step={0.05}
                            onValueChange={setProfileImageScaleDraft}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProfileImageScale(profileImageScaleDraft);
                              setIsProfileAdjusting(false);
                            }}
                          >
                            Confirmar ajuste
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProfileImageScaleDraft(profileImageScale);
                              setIsProfileAdjusting(true);
                            }}
                          >
                            Ajustar imagem
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </section>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="h-12 rounded-xl"
              >
                Voltar
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === 0 && !canProceed}
                  className="h-12 rounded-xl bg-[#1d6946] text-white shadow-none hover:bg-[#165637] disabled:cursor-not-allowed disabled:bg-[#7f9a8a]"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 rounded-xl bg-[#1d6946] text-white shadow-none hover:bg-[#165637]"
                >
                  Finalizar cadastro
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
