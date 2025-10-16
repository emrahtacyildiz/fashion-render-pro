import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { Upload, Sparkles, ChevronRight, ShoppingBag, Shirt, Gem, Smartphone, Palette } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Create = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("studio");
  const [prompt, setPrompt] = useState("");
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        setCredits(data.balance);
      }
    };
    
    fetchCredits();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!productName) {
        setProductName(file.name.split('.')[0]);
      }
    }
  };

  const categories = [
    { id: "ecommerce", name: "E-ticaret", description: "Genel ürün fotoğrafçılığı", icon: ShoppingBag },
    { id: "clothing", name: "Giyim", description: "Kıyafet ve aksesuar", icon: Shirt },
    { id: "jewelry", name: "Takı", description: "Yüzük, kolye ve aksesuarlar", icon: Gem },
    { id: "tech", name: "Teknoloji", description: "Elektronik aletler", icon: Smartphone },
    { id: "beauty", name: "Güzellik", description: "Kozmetik ve cilt bakımı", icon: Palette },
  ];

  const modelsByCategory: Record<string, Array<{ id: string; name: string; type: string; description: string }>> = {
    ecommerce: [
      { id: "ecom-female-full", name: "Kadın Model", type: "Tam Boy", description: "Genel ürünler için" },
      { id: "ecom-male-full", name: "Erkek Model", type: "Tam Boy", description: "Genel ürünler için" },
      { id: "ecom-female-upper", name: "Kadın Model", type: "Üst Beden", description: "Ürün odaklı" },
      { id: "ecom-male-upper", name: "Erkek Model", type: "Üst Beden", description: "Ürün odaklı" },
    ],
    clothing: [
      { id: "cloth-female-full", name: "Kadın Model", type: "Tam Boy", description: "Kıyafet gösterimi" },
      { id: "cloth-male-full", name: "Erkek Model", type: "Tam Boy", description: "Kıyafet gösterimi" },
      { id: "cloth-female-upper", name: "Kadın Model", type: "Üst Beden", description: "Üst giyim için" },
      { id: "cloth-male-upper", name: "Erkek Model", type: "Üst Beden", description: "Üst giyim için" },
    ],
    jewelry: [
      { id: "jewel-female-face", name: "Kadın Model", type: "Yüz", description: "Küpe ve kolye için" },
      { id: "jewel-male-face", name: "Erkek Model", type: "Yüz", description: "Küpe ve kolye için" },
      { id: "jewel-female-hand", name: "El Modeli", type: "Kadın", description: "Yüzük ve bilezik" },
      { id: "jewel-male-hand", name: "El Modeli", type: "Erkek", description: "Yüzük ve bilezik" },
    ],
    tech: [
      { id: "tech-female-hand", name: "El Modeli", type: "Kadın", description: "Akıllı saat ve telefon" },
      { id: "tech-male-hand", name: "El Modeli", type: "Erkek", description: "Akıllı saat ve telefon" },
      { id: "tech-female-upper", name: "Kadın Model", type: "Üst Beden", description: "Kulaklık ve gözlük" },
      { id: "tech-male-upper", name: "Erkek Model", type: "Üst Beden", description: "Kulaklık ve gözlük" },
    ],
    beauty: [
      { id: "beauty-female-face", name: "Kadın Model", type: "Yüz", description: "Makyaj ve cilt bakımı" },
      { id: "beauty-male-face", name: "Erkek Model", type: "Yüz", description: "Erkek bakım ürünleri" },
      { id: "beauty-female-hand", name: "El Modeli", type: "Kadın", description: "Oje ve el kremi" },
      { id: "beauty-male-hand", name: "El Modeli", type: "Erkek", description: "El bakım ürünleri" },
    ],
  };

  const styles = [
    { id: "studio", name: "Stüdyo Çekimi", description: "Profesyonel stüdyo ortamı" },
    { id: "street", name: "Sokak Stili", description: "Doğal sokak arka planı" },
    { id: "minimal", name: "Minimalist", description: "Sade, beyaz arka plan" },
  ];

  const handleGenerate = async () => {
    if (!selectedFile || !selectedCategory || !selectedModel || !user) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen kategori, model ve ürün görseli seçin.",
        variant: "destructive"
      });
      return;
    }

    if (credits < 1) {
      toast({
        title: "Yetersiz Kredi",
        description: "Görsel oluşturmak için en az 1 kredi gereklidir.",
        variant: "destructive"
      });
      navigate('/pricing');
      return;
    }

    setLoading(true);

    try {
      // Upload product image
      const fileName = `${user.id}/${Date.now()}_${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Create project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: productName || 'Yeni Proje',
          product_image_url: publicUrl,
          model_id: selectedModel,
          style_id: selectedStyle,
          prompt: prompt || null,
          status: 'pending'
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Call edge function to generate image
      const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-image', {
        body: {
          projectId: projectData.id,
          productImageUrl: publicUrl,
          modelId: selectedModel,
          styleId: selectedStyle,
          prompt: prompt
        }
      });

      if (functionError) throw functionError;

      toast({
        title: "Başarılı!",
        description: "Görseliniz oluşturuldu. Dashboard'a yönlendiriliyorsunuz..."
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Hata",
        description: error.message || "Görsel oluşturulurken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex justify-between items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Yeni Görsel Oluştur
              </h1>
              <p className="text-muted-foreground">
                Kategori seçin, model seçin ve ürününüzü yükleyin
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Kalan Krediniz</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {credits}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Upload & Settings */}
            <div className="space-y-6">
              {/* Category Selection */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                    Kategori Seçin
                  </Label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setSelectedModel("");
                          }}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                            selectedCategory === category.id
                              ? "border-primary bg-primary/10 shadow-lg"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className={`h-6 w-6 mb-2 ${selectedCategory === category.id ? "text-primary" : "text-muted-foreground"}`} />
                          <div className="font-semibold text-sm mb-1">{category.name}</div>
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Model Selection */}
              {selectedCategory && (
                <Card className="border-2 hover:border-accent/50 transition-all duration-300 animate-fade-in">
                  <CardContent className="p-6">
                    <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm">2</span>
                      Model Seçin
                    </Label>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {modelsByCategory[selectedCategory]?.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => setSelectedModel(model.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                            selectedModel === model.id
                              ? "border-accent bg-accent/10 shadow-lg"
                              : "border-border hover:border-accent/50"
                          }`}
                        >
                          <div className="font-semibold text-sm mb-1">{model.name}</div>
                          <div className="text-xs text-muted-foreground mb-1">{model.type}</div>
                          <div className="text-xs text-muted-foreground">{model.description}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upload Section */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm">3</span>
                    Ürün Fotoğrafını Yükleyin
                  </Label>
                  
                  {!previewUrl ? (
                    <label className="block cursor-pointer group">
                      <div className="border-2 border-dashed border-border rounded-xl p-12 hover:border-primary transition-all duration-300 bg-secondary/30 group-hover:bg-secondary/50 group-hover:scale-105">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <Upload className="h-8 w-8 text-primary" />
                          </div>
                          <p className="font-semibold mb-2 text-lg">
                            Ürün fotoğrafını yükleyin
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG, WEBP (Maks. 10MB)
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary shadow-lg">
                        <img 
                          src={previewUrl} 
                          alt="Yüklenen ürün" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productName">Ürün Adı</Label>
                        <Input
                          id="productName"
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="Ürün adını girin"
                          className="border-2"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-2"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl("");
                        }}
                      >
                        Farklı Görsel Yükle
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Style Selection */}
              <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm">4</span>
                    Stil Seçin
                  </Label>
                  
                  <div className="space-y-3">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                          selectedStyle === style.id
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold">{style.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optional Prompt */}
              <Card className="border-2 hover:border-accent/50 transition-all duration-300">
                <CardContent className="p-6">
                  <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm">5</span>
                    Özel İstekler (Opsiyonel)
                  </Label>
                  
                  <Textarea
                    placeholder="Örn: Gülümseyen model, doğal ışık, minimal arka plan, yüksek kontrast..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] border-2"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview & Generate */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Card className="p-6 border-2 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Sipariş Özeti
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Seçimlerinizi kontrol edin
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/50">
                    <span className="text-sm font-medium text-muted-foreground">Kategori</span>
                    <span className="font-semibold">
                      {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "Seçilmedi"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/50">
                    <span className="text-sm font-medium text-muted-foreground">Model</span>
                    <span className="font-semibold">
                      {selectedModel && selectedCategory 
                        ? modelsByCategory[selectedCategory]?.find(m => m.id === selectedModel)?.name + " - " + modelsByCategory[selectedCategory]?.find(m => m.id === selectedModel)?.type
                        : "Seçilmedi"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/50">
                    <span className="text-sm font-medium text-muted-foreground">Ürün</span>
                    <span className="font-semibold">
                      {selectedFile ? productName || selectedFile.name.slice(0, 20) : "Yüklenmedi"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/50">
                    <span className="text-sm font-medium text-muted-foreground">Stil</span>
                    <span className="font-semibold">
                      {styles.find(s => s.id === selectedStyle)?.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 px-4 rounded-lg bg-primary/10 border-2 border-primary/20">
                    <span className="text-sm font-semibold">Kredi Kullanımı</span>
                    <span className="font-bold text-lg text-primary">-1 kredi</span>
                  </div>

                  <div className="flex items-center justify-between py-4 px-4 rounded-lg bg-accent/10 border-2 border-accent/20">
                    <span className="text-sm font-semibold">Kalan Kredi</span>
                    <span className="font-bold text-lg text-accent">{credits > 0 ? credits - 1 : 0} kredi</span>
                  </div>
                </div>

                <Button 
                  size="xl" 
                  variant="hero"
                  className="w-full"
                  disabled={!selectedFile || !selectedCategory || !selectedModel || loading || credits < 1}
                  onClick={handleGenerate}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {loading ? "Oluşturuluyor..." : credits < 1 ? "Yetersiz Kredi" : "Görseli Oluştur"}
                  {!loading && <ChevronRight className="ml-2 h-5 w-5" />}
                </Button>

                {credits < 1 && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full mt-3 border-2"
                    onClick={() => navigate('/pricing')}
                  >
                    Kredi Satın Al
                  </Button>
                )}

                <p className="text-xs text-center text-muted-foreground mt-4">
                  ⚡ Görseliniz 30-60 saniyede hazır olacak
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;