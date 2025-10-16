import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <Card className="max-w-4xl mx-auto p-6 shadow-2xl border-2">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Çerez Kullanımı</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Web sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz. Sitemizi kullanmaya devam ederek çerez kullanımını kabul etmiş olursunuz. 
              Daha fazla bilgi için{" "}
              <Link to="/cookies" className="text-primary hover:underline">
                çerez politikamızı
              </Link>{" "}
              inceleyebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={acceptCookies} size="sm">
                Kabul Et
              </Button>
              <Button onClick={rejectCookies} variant="outline" size="sm">
                Reddet
              </Button>
            </div>
          </div>
          <button
            onClick={rejectCookies}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;