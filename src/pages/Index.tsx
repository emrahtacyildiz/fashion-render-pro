import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { ArrowRight, Sparkles, Zap, Users, Check } from "lucide-react";
import heroImage from "@/assets/hero-image-new.jpg";
import modelsGallery from "@/assets/models-gallery-new.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                AI Destekli Ürün Görselleştirme
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Ürünlerinizi Profesyonel Modellere
                <span className="text-primary"> Giydirin</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Model, stüdyo veya fotoğrafçı olmadan saniyeler içinde profesyonel ürün görselleri oluşturun. Yapay zeka teknolojisi ile e-ticaret işinizi bir üst seviyeye taşıyın.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" variant="hero" asChild>
                  <Link to="/auth?mode=signup">
                    Ücretsiz Deneyin
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link to="/pricing">Fiyatları Görün</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Kredi kartı gerekmez</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground">5 ücretsiz görsel</span>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="AI ile ürün görselleştirme - tişört görseli profesyonel modele giydiriliyor" 
                  className="relative w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Neden ShipShack?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Küçük işletmelerin profesyonel görünmesini sağlayan güçlü özellikler
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-2 hover:border-primary/50">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Saniyeler İçinde Hazır</h3>
              <p className="text-muted-foreground">
                Ürününüzü yükleyin, kategorinizi ve modelinizi seçin. AI teknolojimiz 30-60 saniyede profesyonel görseller oluşturur.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-2 hover:border-accent/50">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent to-accent-foreground flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Geniş Model Seçeneği</h3>
              <p className="text-muted-foreground">
                Erkek, kadın, tam boy, üst beden, yüz ve el modelleri. Her ürün kategorisi için özel olarak seçilmiş profesyonel modeller.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-2 hover:border-primary/50">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary via-accent to-primary-hover flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Stüdyo Kalitesi</h3>
              <p className="text-muted-foreground">
                Model, stüdyo veya fotoğrafçıya ihtiyaç yok. Yapay zeka ile fotoğraf çekimi maliyetini %90 azaltın, satışlarınızı artırın.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Model Gallery Preview */}
      <section className="py-20 sm:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Geniş Model Galerisi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Markanıza en uygun modeli seçin ve ürünlerinizi benzersiz bir şekilde sergileyin
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 blur-2xl opacity-50"></div>
              <img 
                src={modelsGallery} 
                alt="Profesyonel modeller - erkek, kadın, tam boy, üst beden, yüz ve el modelleri" 
                className="relative rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="hero" asChild>
              <Link to="/auth?mode=signup">
                Şimdi Deneyin
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Bugün Başlayın
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              İlk 5 görseliniz ücretsiz. Kredi kartı gerekmez.
            </p>
            <Button size="xl" variant="secondary" asChild>
              <Link to="/auth?mode=signup">
                Ücretsiz Hesap Oluşturun
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Index;
