import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Import model images
import maleFullbody from "@/assets/models/male-fullbody-1.jpg";
import femaleFullbody from "@/assets/models/female-fullbody-1.jpg";
import maleUpper from "@/assets/models/male-upper-1.jpg";
import femaleUpper from "@/assets/models/female-upper-1.jpg";
import femaleJewelry from "@/assets/models/female-jewelry-1.jpg";
import handsJewelry from "@/assets/models/hands-jewelry-1.jpg";
import maleTech from "@/assets/models/male-tech-1.jpg";
import femaleBeauty from "@/assets/models/female-beauty-1.jpg";

type Category = "clothing" | "jewelry" | "tech" | "beauty";

interface ModelOption {
  id: string;
  name: string;
  image: string;
  description: string;
}

const categories = [
  { id: "clothing", name: "Giyim / Kıyafet", icon: "👕", description: "Tişört, elbise, pantolon ve tüm giyim ürünleri" },
  { id: "jewelry", name: "Takı / Aksesuar", icon: "💍", description: "Yüzük, kolye, küpe ve tüm takı ürünleri" },
  { id: "tech", name: "Teknoloji", icon: "📱", description: "Telefon, tablet ve elektronik cihazlar" },
  { id: "beauty", name: "Güzellik / Kozmetik", icon: "💄", description: "Makyaj, cilt bakımı ve güzellik ürünleri" },
];

const modelsByCategory: Record<Category, ModelOption[]> = {
  clothing: [
    { id: "male-fullbody", name: "Erkek Tam Boy", image: maleFullbody, description: "Tam boy kıyafet gösterimi" },
    { id: "female-fullbody", name: "Kadın Tam Boy", image: femaleFullbody, description: "Tam boy kıyafet gösterimi" },
    { id: "male-upper", name: "Erkek Üst Beden", image: maleUpper, description: "Üst giyim ürünleri" },
    { id: "female-upper", name: "Kadın Üst Beden", image: femaleUpper, description: "Üst giyim ürünleri" },
  ],
  jewelry: [
    { id: "female-jewelry", name: "Kadın Yüz", image: femaleJewelry, description: "Küpe ve kolye için ideal" },
    { id: "hands-jewelry", name: "El Gösterimi", image: handsJewelry, description: "Yüzük ve bileklik için ideal" },
  ],
  tech: [
    { id: "male-tech", name: "Erkek Teknoloji", image: maleTech, description: "Cihaz kullanımı gösterimi" },
  ],
  beauty: [
    { id: "female-beauty", name: "Kadın Yüz", image: femaleBeauty, description: "Makyaj ve cilt bakımı ürünleri" },
  ],
};

const Create = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getGarmentType = (category: Category): 'dress' | 'upper' | 'lower' => {
    if (category === 'clothing') {
      if (selectedModel?.includes('fullbody')) return 'dress';
      if (selectedModel?.includes('upper')) return 'upper';
      return 'dress';
    }
    return 'upper';
  };

  const handleGenerate = async () => {
    if (!category || !selectedModel || !productImage || !projectName.trim()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    if (!user) {
      toast.error("Lütfen önce giriş yapın");
      navigate("/auth");
      return;
    }

    try {
      setIsGenerating(true);
      toast.info("Görsel oluşturuluyor, bu 1-2 dakika sürebilir...");

      const { data: creditsData, error: creditsError } = await supabase
        .from("credits")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (creditsError) throw creditsError;

      if (creditsData.balance < 1) {
        toast.error("Yetersiz kredi. Lütfen paket satın alın.");
        navigate("/pricing");
        return;
      }

      const productFileName = `${user.id}/${Date.now()}-product-${productImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(productFileName, productImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl: productUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(productFileName);

      const modelImageMap: Record<string, string> = {
        "male-fullbody": maleFullbody,
        "female-fullbody": femaleFullbody,
        "male-upper": maleUpper,
        "female-upper": femaleUpper,
        "female-jewelry": femaleJewelry,
        "hands-jewelry": handsJewelry,
        "male-tech": maleTech,
        "female-beauty": femaleBeauty,
      };

      const modelImagePath = modelImageMap[selectedModel];
      const modelBlob = await fetch(modelImagePath).then(r => r.blob());
      const modelFileName = `models/${selectedModel}.jpg`;

      const { data: existingModel } = await supabase.storage
        .from("product-images")
        .list("models");

      const modelExists = existingModel?.some(f => f.name === `${selectedModel}.jpg`);

      if (!modelExists) {
        await supabase.storage
          .from("product-images")
          .upload(modelFileName, modelBlob);
      }

      const { data: { publicUrl: modelUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(modelFileName);

      const garmentType = getGarmentType(category);

      const { data: klingData, error: klingError } = await supabase.functions.invoke('kling-try-on', {
        body: {
          modelImageUrl: modelUrl,
          productImageUrl: productUrl,
          garmentType: garmentType,
          batchSize: 1
        }
      });

      if (klingError) throw klingError;
      if (!klingData?.success || !klingData?.imageUrls || klingData.imageUrls.length === 0) {
        throw new Error("Görsel oluşturulamadı");
      }

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName,
          product_image_url: productUrl,
          model_id: selectedModel,
          style_id: category,
          prompt: `Generated with ${category} category and ${selectedModel} model using Kling AI`,
        })
        .select()
        .single();

      if (projectData) {
        await supabase
          .from("generated_images")
          .insert({
            project_id: projectData.id,
            image_url: klingData.imageUrls[0],
          });
      }

      if (projectError) throw projectError;

      await supabase
        .from("credits")
        .update({ balance: creditsData.balance - 1 })
        .eq("user_id", user.id);

      toast.success("Görsel başarıyla oluşturuldu!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Yeni Görsel Oluştur</h1>
            <p className="text-lg text-muted-foreground">
              3 adımda profesyonel ürün görseli oluşturun
            </p>
          </div>

          {/* Step 1: Category Selection */}
          {!category && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center">Adım 1: Kategori Seçin</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <Card
                    key={cat.id}
                    className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary group"
                    onClick={() => setCategory(cat.id as Category)}
                  >
                    <div className="text-6xl mb-4 text-center">{cat.icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-center group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-muted-foreground text-center">{cat.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Model Selection */}
          {category && !selectedModel && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Adım 2: Model Seçin</h2>
                <Button variant="ghost" onClick={() => setCategory(null)}>
                  Kategoriyi Değiştir
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modelsByCategory[category].map((model) => (
                  <Card
                    key={model.id}
                    className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary group"
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={model.image}
                        alt={model.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {model.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Upload and Generate */}
          {category && selectedModel && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Adım 3: Ürün Fotoğrafı Yükleyin</h2>
                <Button variant="ghost" onClick={() => setSelectedModel(null)}>
                  Modeli Değiştir
                </Button>
              </div>
              
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      Seçilen Model
                    </h3>
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={modelsByCategory[category].find(m => m.id === selectedModel)?.image}
                        alt="Selected model"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="projectName">Proje Adı</Label>
                      <Input
                        id="projectName"
                        placeholder="Örn: Yaz Koleksiyonu Tişört"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="productImage">Ürün Fotoğrafı</Label>
                      <div className="mt-2">
                        {productImagePreview ? (
                          <div className="relative">
                            <img
                              src={productImagePreview}
                              alt="Product preview"
                              className="w-full h-64 object-contain rounded-lg border"
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setProductImage(null);
                                setProductImagePreview(null);
                              }}
                            >
                              Değiştir
                            </Button>
                          </div>
                        ) : (
                          <label
                            htmlFor="productImage"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                          >
                            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground">
                              Ürün fotoğrafını yükleyin
                            </p>
                            <Input
                              id="productImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProductImageChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleGenerate}
                      disabled={isGenerating || !productImage || !projectName.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Oluşturuluyor...
                        </>
                      ) : (
                        "Görseli Oluştur (1 Kredi)"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Create;
