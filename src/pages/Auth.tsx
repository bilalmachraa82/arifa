import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { z } from "zod";
import { checkMFARequired } from "@/hooks/useMFA";
import MFAChallenge from "@/components/auth/MFAChallenge";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Palavras-passe não coincidem",
  path: ["confirmPassword"],
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  
  const { signIn, signUp, user, signOut } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !mfaRequired) {
      navigate("/");
    }
  }, [user, mfaRequired, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: t("auth.errorTitle"),
            description: error.message,
            variant: "destructive",
          });
        } else {
          // Check if MFA is required after login
          const mfaCheck = await checkMFARequired();
          if (mfaCheck.required && mfaCheck.factorId) {
            setMfaRequired(true);
            setMfaFactorId(mfaCheck.factorId);
          }
        }
      } else {
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          toast({
            title: t("auth.errorTitle"),
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: t("auth.successTitle"),
            description: t("auth.successMessage"),
          });
          setIsLogin(true);
          setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
        }
      }
    } catch {
      toast({
        title: t("auth.errorTitle"),
        description: "Algo correu mal. Tente novamente.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleMFASuccess = () => {
    setMfaRequired(false);
    setMfaFactorId(null);
    navigate("/");
  };

  const handleMFACancel = async () => {
    await signOut();
    setMfaRequired(false);
    setMfaFactorId(null);
  };

  // Show MFA Challenge screen
  if (mfaRequired && mfaFactorId) {
    return (
      <Layout>
        <section className="py-24 lg:py-32 bg-arifa-warm-white min-h-[calc(100vh-73px)] flex items-center">
          <div className="container-arifa">
            <MFAChallenge
              factorId={mfaFactorId}
              onSuccess={handleMFASuccess}
              onCancel={handleMFACancel}
            />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24 lg:py-32 bg-arifa-warm-white min-h-[calc(100vh-73px)]">
        <div className="container-arifa">
          <div className="max-w-md mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("auth.backToHome")}
            </Link>

            <div className="bg-card border border-border rounded-sm p-8 lg:p-10">
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl font-medium text-foreground mb-2">
                  {isLogin ? t("auth.loginTitle") : t("auth.signupTitle")}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin ? t("auth.loginDescription") : t("auth.signupDescription")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                      {t("auth.fullName")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full h-12 pl-11 pr-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                        placeholder="O seu nome"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                      placeholder="email@exemplo.pt"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      {t("auth.confirmPassword")}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full h-12 pl-11 pr-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading
                    ? (isLogin ? t("auth.loggingIn") : t("auth.signingUp"))
                    : (isLogin ? t("auth.loginButton") : t("auth.signupButton"))
                  }
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                    }}
                    className="text-arifa-teal hover:underline font-medium"
                  >
                    {isLogin ? t("auth.createAccount") : t("auth.loginHere")}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
