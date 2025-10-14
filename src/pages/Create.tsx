import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { Upload, Sparkles, ChevronRight } from "lucide-react";
import modelsGallery from "@/assets/models-gallery.jpg";

const Create = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("studio");
  const [prompt, setPrompt] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const models = [
    { id: "model-1", name: "Model 1", style: "Kadın, Casual" },
    { id: "model-2", name: "Model 2", style: "Erkek, Formal" },
    { id: "model-3", name: "Model 3", style: "Kadın, Sporty" },
    { id: "model-4", name: "Model 4", style: "Erkek, Street" },
  ];

  const styles = [
    { id: "studio", name: "Stüdyo Çekimi", description: "Profesyonel stüdyo ortamı" },
    { id: "street", name: "Sokak Stili", description: "Doğal sokak arka planı" },
    { id: "minimal", name: "Minimalist", description: "Sade, beyaz arka plan" },
  ];

  const handleGenerate = () => {
    // Generation logic will be added later
    console.log("Generate:", { selectedFile, selectedModel, selectedStyle, prompt });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Yeni Görsel Oluştur</h1>
            <p className="text-muted-foreground">
              Ürününüzü yükleyin, model ve stil seçin
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Upload & Settings */}
            <div className="space-y-6">
              {/* Upload Section */}
              <Card>
                <CardContent className="p-6">
                  <Label className="text-base font-semibold mb-3 block">
                    1. Ürün Fotoğrafını Yükleyin
                  </Label>
                  
                  {!previewUrl ? (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-lg p-12 hover:border-primary transition-colors bg-secondary/30">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="font-medium mb-1">
                            Tıklayın veya sürükle bırakın
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG (Maks. 10MB)
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
                    <div className="space-y-4">
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                        <img 
                          src={previewUrl} 
                          alt="Yüklenen ürün" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl("");
                        }}
                      >
                        Değiştir
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Model Selection */}
              <Card>
                <CardContent className="p-6">
                  <Label className="text-base font-semibold mb-3 block">
                    2. Model Seçin
                  </Label>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          selectedModel === model.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-xs text-muted-foreground">{model.style}</div>
                      </button>
                    ))}
                  </div>
                  
                  <img 
                    src={modelsGallery} 
                    alt="Model galerisi" 
                    className="rounded-lg w-full"
                  />
                </CardContent>
              </Card>

              {/* Style Selection */}
              <Card>
                <CardContent className="p-6">
                  <Label className="text-base font-semibold mb-3 block">
                    3. Stil Seçin
                  </Label>
                  
                  <div className="space-y-2">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedStyle === style.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium">{style.name}</div>
                        <div className="text-sm text-muted-foreground">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optional Prompt */}
              <Card>
                <CardContent className="p-6">
                  <Label className="text-base font-semibold mb-3 block">
                    4. Özelleştirin (Opsiyonel)
                  </Label>
                  
                  <Textarea
                    placeholder="Örn: Gülümseyen, gündüz ışığı, ahşap zemin..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview & Generate */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Özet</h3>
                  <p className="text-sm text-muted-foreground">
                    Seçimlerinizi kontrol edin ve oluşturmaya başlayın
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Ürün</span>
                    <span className="font-medium">
                      {selectedFile ? selectedFile.name : "Seçilmedi"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Model</span>
                    <span className="font-medium">
                      {selectedModel ? models.find(m => m.id === selectedModel)?.name : "Seçilmedi"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Stil</span>
                    <span className="font-medium">
                      {styles.find(s => s.id === selectedStyle)?.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-muted-foreground">Kredi Kullanımı</span>
                    <span className="font-semibold text-primary">-5 kredi</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  variant="hero" 
                  className="w-full"
                  disabled={!selectedFile || !selectedModel}
                  onClick={handleGenerate}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Görseli Oluştur
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Oluşturma yaklaşık 30-60 saniye sürer
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
