import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "login";
  const [isLogin, setIsLogin] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const passwordRules = [
    { rule: "En az 8 karakter", valid: password.length >= 8 },
    { rule: "En az bir büyük harf", valid: /[A-Z]/.test(password) },
    { rule: "En az bir küçük harf", valid: /[a-z]/.test(password) },
    { rule: "En az bir rakam", valid: /[0-9]/.test(password) },
  ];

  const isPasswordValid = !isLogin && passwordRules.every(r => r.valid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && !isPasswordValid) {
      toast({
        title: "Hata",
        description: "Lütfen şifre kurallarına uygun bir şifre belirleyin.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({
          title: "Giriş başarılı!",
          description: "Dashboard'a yönlendiriliyorsunuz..."
        });
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({
          title: "Kayıt başarılı!",
          description: "Hesabınız oluşturuldu. Giriş yapabilirsiniz."
        });
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Google ile giriş başarısız oldu.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {isLogin ? "Giriş Yap" : "Hesap Oluştur"}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin 
                  ? "Hesabınıza giriş yapın" 
                  : "Ücretsiz hesabınızı oluşturun"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Ad Soyad</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Adınız Soyadınız"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground">Şifre Kuralları:</p>
                      <div className="space-y-1">
                        {passwordRules.map((rule, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {rule.valid ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <X className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span className={rule.valid ? "text-green-600" : "text-muted-foreground"}>
                              {rule.rule}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "İşleniyor..." : (isLogin ? "Giriş Yap" : "Hesap Oluştur")}
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  VEYA
                </span>
              </div>

              <Button variant="outline" className="w-full" size="lg" onClick={handleGoogleSignIn} disabled={loading}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google ile Devam Et
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin 
                    ? "Hesabınız yok mu? Kayıt olun" 
                    : "Zaten hesabınız var mı? Giriş yapın"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;