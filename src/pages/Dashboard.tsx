import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Plus, Image as ImageIcon, Download } from "lucide-react";
import sampleProduct from "@/assets/sample-product-1.jpg";

const Dashboard = () => {
  // Mock data for demonstration
  const projects = [
    {
      id: 1,
      name: "Lacivert Kapşonlu Sweatshirt",
      image: sampleProduct,
      createdAt: "2 saat önce",
      variants: 4
    },
    // Add more mock projects as needed
  ];

  const credits = 47;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Projelerim</h1>
            <p className="text-muted-foreground">
              Tüm görsellerinizi buradan yönetin
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Card className="px-6 py-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{credits}</div>
                <div className="text-xs text-muted-foreground">Kalan Kredi</div>
              </div>
            </Card>
            
            <Button size="lg" variant="hero" asChild>
              <Link to="/create">
                <Plus className="mr-2 h-5 w-5" />
                Yeni Görsel Oluştur
              </Link>
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Henüz proje yok</h3>
            <p className="text-muted-foreground mb-6">
              İlk profesyonel görselinizi oluşturmaya başlayın
            </p>
            <Button variant="hero" asChild>
              <Link to="/create">
                <Plus className="mr-2 h-5 w-5" />
                İlk Görselimi Oluştur
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden bg-secondary">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary">
                      Görüntüle
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate mb-1">{project.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{project.variants} varyant</span>
                    <span>{project.createdAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
