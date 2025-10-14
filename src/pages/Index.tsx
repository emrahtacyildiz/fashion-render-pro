import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { ArrowRight, Sparkles, Zap, Users, Check } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import modelsGallery from "@/assets/models-gallery.jpg";

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
                  <Link to="/auth">
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
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-30"></div>
              <img 
                src={heroImage} 
                alt="AI ile ürün görselleştirme örneği" 
                className="relative rounded-2xl shadow-2xl"
              />
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
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hızlı ve Kolay</h3>
              <p className="text-muted-foreground">
                Ürün fotoğrafınızı yükleyin, model seçin ve saniyeler içinde profesyonel görseller alın.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Çeşitli Modeller</h3>
              <p className="text-muted-foreground">
                Farklı etnik köken, cinsiyet ve stillerde modeller ile hedef kitlenize ulaşın.
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Profesyonel Kalite</h3>
              <p className="text-muted-foreground">
                Yapay zeka destekli teknoloji ile gerçekçi ve yüksek çözünürlüklü sonuçlar.
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
          
          <div className="max-w-4xl mx-auto">
            <img 
              src={modelsGallery} 
              alt="Çeşitli profesyonel modeller" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="hero" asChild>
              <Link to="/create">
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
              <Link to="/auth">
                Ücretsiz Hesap Oluşturun
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">ShipShack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ShipShack. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
