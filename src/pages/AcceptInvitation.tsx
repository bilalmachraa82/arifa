import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Invitation {
  id: string;
  email: string;
  name: string;
  status: string;
  expires_at: string;
}

const AcceptInvitation = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError("Token de convite inválido");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("client_invitations")
          .select("*")
          .eq("token", token)
          .single();

        if (fetchError || !data) {
          setError("Convite não encontrado");
          setLoading(false);
          return;
        }

        // Check if invitation is expired
        if (new Date(data.expires_at) < new Date()) {
          setError("Este convite expirou");
          setLoading(false);
          return;
        }

        // Check if invitation is already accepted
        if (data.status === "accepted") {
          setError("Este convite já foi utilizado");
          setLoading(false);
          return;
        }

        if (data.status === "cancelled") {
          setError("Este convite foi cancelado");
          setLoading(false);
          return;
        }

        setInvitation(data);
      } catch (err) {
        console.error("Error fetching invitation:", err);
        setError("Erro ao carregar convite");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitation) return;
    
    if (password.length < 6) {
      toast.error("A palavra-passe deve ter pelo menos 6 caracteres");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("As palavras-passe não coincidem");
      return;
    }

    setSubmitting(true);

    try {
      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: invitation.email,
        password,
        options: {
          data: {
            full_name: invitation.name,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Update invitation status
      await supabase
        .from("client_invitations")
        .update({ 
          status: "accepted",
          accepted_at: new Date().toISOString()
        })
        .eq("id", invitation.id);

      // Send welcome email using Lovable AI (non-blocking)
      supabase.functions.invoke('send-welcome-email', {
        body: { 
          name: invitation.name, 
          email: invitation.email 
        }
      }).then(({ error: emailError }) => {
        if (emailError) {
          console.error('Welcome email error:', emailError);
        } else {
          console.log('Welcome email sent successfully');
        }
      });

      setSuccess(true);
      toast.success("Conta criada com sucesso! Verifique o seu email.");
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/cliente");
      }, 2000);
    } catch (err: any) {
      console.error("Error creating account:", err);
      if (err.message?.includes("already registered")) {
        toast.error("Este email já está registado. Faça login em vez disso.");
      } else {
        toast.error(err.message || "Erro ao criar conta");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">A carregar convite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Convite Inválido</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate("/")} variant="outline">
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>Conta Criada!</CardTitle>
            <CardDescription>
              A sua conta foi criada com sucesso. A redirecionar para o portal...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>Bem-vindo à ARIFA Studio</CardTitle>
          <CardDescription>
            Olá {invitation?.name}, complete o seu registo para aceder ao Portal de Cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={invitation?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Palavra-passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a palavra-passe"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A criar conta...
                </>
              ) : (
                "Ativar Conta"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => navigate("/auth")}
              >
                Fazer login
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
