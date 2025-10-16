import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Check, Sparkles } from "lucide-react";
const Pricing = () => {
  const plans = [{
    name: "Başlangıç",
    credits: 50,
    price: 199,
    popular: false,
    features: ["50 görsel kredisi", "Tüm modellere erişim", "Yüksek çözünürlük indirme", "7/24 destek"]
  }, {
    name: "Profesyonel",
    credits: 200,
    price: 699,
    popular: true,
    features: ["200 görsel kredisi", "Tüm modellere erişim", "Yüksek çözünürlük indirme", "Öncelikli işleme", "Toplu görsel oluşturma", "7/24 öncelikli destek"]
  }, {
    name: "İşletme",
    credits: 500,
    price: 1599,
    popular: false,
    features: ["500 görsel kredisi", "Tüm modellere erişim", "Yüksek çözünürlük indirme", "Öncelikli işleme", "Toplu görsel oluşturma", "API erişimi", "Özel model eğitimi", "Özel destek yöneticisi"]
  }];
  return <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Basit ve Şeffaf Fiyatlandırma
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Size Uygun Planı Seçin
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">İhtiyacınıza göre kredi paketi seçin ve sihri başlatın...</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map(plan => <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    En Popüler
                  </span>
                </div>}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.credits} görsel kredisi</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₺{plan.price}</span>
                  <span className="text-muted-foreground"> / paket</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>)}
                </ul>
                
                <Button variant={plan.popular ? "hero" : "outline"} className="w-full" size="lg" asChild>
                  <Link to="/auth">
                    Başla
                  </Link>
                </Button>
              </CardContent>
            </Card>)}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-secondary to-background">
            <h3 className="text-2xl font-bold mb-3">İlk 5 Görsel Ücretsiz!</h3>
            <p className="text-muted-foreground mb-6">
              Hesap oluşturduğunuzda platformu test etmeniz için 5 ücretsiz kredi kazanırsınız.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/auth">
                Ücretsiz Başla
              </Link>
            </Button>
          </Card>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Sıkça Sorulan Sorular</h3>
          <div className="space-y-4">
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Krediler nasıl çalışır?</h4>
              <p className="text-sm text-muted-foreground">
                Her görsel oluşturma işlemi 5 kredi harcar. Satın aldığınız krediler hesabınızda kalır ve dilediğiniz zaman kullanabilirsiniz.
              </p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Kredilerin son kullanma tarihi var mı?</h4>
              <p className="text-sm text-muted-foreground">
                Hayır, satın aldığınız krediler süresiz geçerlidir ve dilediğiniz zaman kullanabilirsiniz.
              </p>
            </Card>
            
            <Card className="p-6">
              <h4 className="font-semibold mb-2">İptal ve iade politikanız nedir?</h4>
              <p className="text-sm text-muted-foreground">
                Kullanılmamış kredi paketleri için 14 gün içinde iade talep edebilirsiniz.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default Pricing;