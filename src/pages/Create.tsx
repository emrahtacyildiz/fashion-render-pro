import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload, Check, Download, ArrowLeft } from "lucide-react";
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
type SubCategory = string;

interface ModelOption {
  id: string;
  name: string;
  image: string;
  description: string;
}

const categories = [
  { 
    id: "clothing", 
    name: "Giyim / Kıyafet", 
    icon: "👕", 
    description: "Tişört, elbise, pantolon ve tüm giyim ürünleri",
    subCategories: [
      { id: "dress", name: "Tam Boy Kıyafet" },
      { id: "upper", name: "Üst Giyim" },
      { id: "lower", name: "Alt Giyim" },
    ]
  },
  { 
    id: "jewelry", 
    name: "Takı / Aksesuar", 
    icon: "💍", 
    description: "Yüzük, kolye, küpe ve tüm takı ürünleri",
    subCategories: [
      { id: "necklace", name: "Kolye / Küpe" },
      { id: "ring", name: "Yüzük / Bileklik" },
    ]
  },
  { 
    id: "tech", 
    name: "Teknoloji", 
    icon: "📱", 
    description: "Telefon, tablet ve elektronik cihazlar",
    subCategories: [
      { id: "phone", name: "Telefon / Tablet" },
      { id: "accessories", name: "Elektronik Aksesuarlar" },
    ]
  },
  { 
    id: "beauty", 
    name: "Güzellik / Kozmetik", 
    icon: "💄", 
    description: "Makyaj, cilt bakımı ve güzellik ürünleri",
    subCategories: [
      { id: "makeup", name: "Makyaj Ürünleri" },
      { id: "skincare", name: "Cilt Bakımı" },
    ]
  },
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
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [modelType, setModelType] = useState<"ready" | "generate" | null>(null);
  const [generatedModels, setGeneratedModels] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingModels, setIsGeneratingModels] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [creditsUsed, setCreditsUsed] = useState(0);

  const handleCategorySelect = (catId: Category) => {
    setCategory(catId);
    setSubCategory(null);
    setStep(2);
  };

  const handleSubCategorySelect = (subCat: SubCategory) => {
    setSubCategory(subCat);
    setStep(3);
  };

  const handleModelTypeSelect = async (type: "ready" | "generate") => {
    setModelType(type);
    
    if (type === "generate") {
      // Generate AI models
      setIsGeneratingModels(true);
      try {
        // Simulate AI model generation - In production, call an AI API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For now, use existing models as placeholders
        const models = modelsByCategory[category!];
        setGeneratedModels(models);
        toast.success("Modeller oluşturuldu!");
      } catch (error) {
        toast.error("Model oluşturma hatası");
      } finally {
        setIsGeneratingModels(false);
      }
    }
    setStep(4);
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setStep(5);
  };

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

      // Calculate credits needed
      const creditsNeeded = modelType === "generate" ? 2 : 1;

      // Check credits
      const { data: creditsData, error: creditsError } = await supabase
        .from("credits")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (creditsError) throw creditsError;

      if (creditsData.balance < creditsNeeded) {
        toast.error("Yetersiz kredi. Lütfen paket satın alın.");
        navigate("/pricing");
        return;
      }

      // Upload product image
      const productFileName = `${user.id}/${Date.now()}-product-${productImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(productFileName, productImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl: productUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(productFileName);

      // Get model image URL
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

      // Convert model image to blob and upload to get public URL
      const modelImagePath = modelImageMap[selectedModel];
      const modelBlob = await fetch(modelImagePath).then(r => r.blob());
      const modelFileName = `models/${selectedModel}.jpg`;
      
      // Upload model image if not already uploaded
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

      // Call kling-tryon edge function
      const { data: mergeData, error: mergeError } = await supabase.functions.invoke('kling-tryon', {
        body: {
          productImageUrl: productUrl,
          modelImageUrl: modelUrl,
          category: category
        }
      });

      if (mergeError) throw mergeError;
      if (!mergeData?.imageUrl) throw new Error("Görsel oluşturulamadı");

      // Create project record
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName,
          product_image_url: productUrl,
          model_id: selectedModel,
          style_id: category,
          prompt: `Generated with ${category} category and ${selectedModel} model`,
        })
        .select()
        .single();
      
      // Store generated image
      if (projectData) {
        await supabase
          .from("generated_images")
          .insert({
            project_id: projectData.id,
            image_url: mergeData.imageUrl,
          });
      }

      if (projectError) throw projectError;

      // Deduct credits
      await supabase
        .from("credits")
        .update({ balance: creditsData.balance - creditsNeeded })
        .eq("user_id", user.id);

      setCreditsUsed(creditsNeeded);
      setGeneratedImageUrl(mergeData.imageUrl);
      setStep(6);
      toast.success("Görsel başarıyla oluşturuldu!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
      link.download = `${projectName}-generated.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Görsel indiriliyor");
    }
  };

  const handleReset = () => {
    setStep(1);
    setCategory(null);
    setSubCategory(null);
    setModelType(null);
    setGeneratedModels([]);
    setSelectedModel(null);
    setProductImage(null);
    setProductImagePreview(null);
    setProjectName("");
    setGeneratedImageUrl(null);
    setCreditsUsed(0);
  };

  const getAvailableModels = () => {
    if (modelType === "generate") {
      return generatedModels;
    }
    return modelsByCategory[category!] || [];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full mx-1 transition-colors ${
                    s <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Adım {step} / 6
            </p>
          </div>

          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Kategori Seçin</h1>
                <p className="text-muted-foreground">Ürününüzün kategorisini seçerek başlayın</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <Card
                    key={cat.id}
                    className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
                    onClick={() => handleCategorySelect(cat.id as Category)}
                  >
                    <div className="text-5xl mb-3 text-center">{cat.icon}</div>
                    <h3 className="text-lg font-bold mb-1 text-center group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">{cat.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Sub-category Selection */}
          {step === 2 && category && (
            <div className="animate-fade-in space-y-6">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri
              </Button>
              
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Alt Kategori Seçin</h1>
                <p className="text-muted-foreground">Ürününüzün spesifik tipini seçin</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {categories.find(c => c.id === category)?.subCategories.map((sub) => (
                  <Card
                    key={sub.id}
                    className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
                    onClick={() => handleSubCategorySelect(sub.id)}
                  >
                    <h3 className="text-lg font-bold text-center group-hover:text-primary transition-colors">
                      {sub.name}
                    </h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Model Type Selection */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri
              </Button>
              
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Model Türü Seçin</h1>
                <p className="text-muted-foreground">Hazır modellerle devam edin veya sizin için özel modeller oluşturalım</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  className="p-8 cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
                  onClick={() => handleModelTypeSelect("ready")}
                >
                  <div className="text-center space-y-4">
                    <div className="text-4xl">✅</div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      Hazır Modeller
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Seçilmiş profesyonel modeller arasından seçim yapın
                    </p>
                    <p className="text-primary font-bold">1 Kredi</p>
                  </div>
                </Card>

                <Card
                  className="p-8 cursor-pointer hover:shadow-lg transition-all hover:border-accent group"
                  onClick={() => handleModelTypeSelect("generate")}
                >
                  <div className="text-center space-y-4">
                    <div className="text-4xl">✨</div>
                    <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                      AI Model Oluştur
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Sizin için özel 4 model oluşturalım
                    </p>
                    <p className="text-accent font-bold">2 Kredi</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Model Selection */}
          {step === 4 && (
            <div className="animate-fade-in space-y-6">
              <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri
              </Button>
              
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Model Seçin</h1>
                <p className="text-muted-foreground">
                  {isGeneratingModels ? "Modeller oluşturuluyor..." : "Ürününüz için en uygun modeli seçin"}
                </p>
              </div>

              {isGeneratingModels ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {getAvailableModels().map((model) => (
                    <Card
                      key={model.id}
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
                      onClick={() => handleModelSelect(model.id)}
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold group-hover:text-primary transition-colors">
                          {model.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Upload and Generate */}
          {step === 5 && selectedModel && (
            <div className="animate-fade-in space-y-6">
              <Button variant="ghost" size="sm" onClick={() => setStep(4)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri
              </Button>
              
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Ürün Fotoğrafını Yükleyin</h1>
                <p className="text-muted-foreground">Son adım: Ürününüzün fotoğrafını yükleyin</p>
              </div>

              <Card className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      Seçilen Model
                    </h3>
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={getAvailableModels().find(m => m.id === selectedModel)?.image}
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
                        placeholder="Örn: Yaz Koleksiyonu"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Ürün Fotoğrafı</Label>
                      {productImagePreview ? (
                        <div className="relative mt-2">
                          <img
                            src={productImagePreview}
                            alt="Product preview"
                            className="w-full h-48 object-contain rounded-lg border"
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
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/5 transition-colors mt-2"
                        >
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Fotoğraf yüklemek için tıklayın</p>
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
                        `Görseli Oluştur (${modelType === "generate" ? 2 : 1} Kredi)`
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 6: Result */}
          {step === 6 && generatedImageUrl && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2 text-primary">Görseliniz Hazır!</h1>
                <p className="text-muted-foreground">{creditsUsed} kredi kullanıldı</p>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  <img
                    src={generatedImageUrl}
                    alt="Generated product"
                    className="w-full rounded-lg"
                  />

                  <div className="flex gap-4">
                    <Button size="lg" className="flex-1" onClick={handleDownload}>
                      <Download className="mr-2 h-5 w-5" />
                      İndir
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1" onClick={handleReset}>
                      Yeni Görsel Oluştur
                    </Button>
                  </div>

                  <Button variant="ghost" className="w-full" onClick={() => navigate("/dashboard")}>
                    Dashboard'a Dön
                  </Button>
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
