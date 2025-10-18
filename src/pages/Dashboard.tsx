import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, Image as ImageIcon, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  product_image_url: string;
  created_at: string;
  status: string;
  generated_images: Array<{ image_url: string }>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch credits
      const { data: creditsData, error: creditsError } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user?.id)
        .single();

      if (creditsError) throw creditsError;
      setCredits(creditsData?.balance || 0);

      // Fetch projects with generated images
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          generated_images (
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Veriler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Bu projeyi silmek istediğinizden emin misiniz?")) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast({
        title: "Başarılı",
        description: "Proje silindi"
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Proje silinirken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Az önce";
    if (hours < 24) return `${hours} saat önce`;
    if (days === 1) return "Dün";
    if (days < 7) return `${days} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          Yükleniyor...
        </div>
      </div>
    );
  }

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
            
            <Button size="lg" asChild>
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
            <Button asChild>
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
                  {project.generated_images && project.generated_images.length > 0 ? (
                    <img 
                      src={project.generated_images[0].image_url} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <img 
                      src={project.product_image_url} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {project.generated_images && project.generated_images.length > 0 && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a href={project.generated_images[0].image_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="secondary">
                          Görüntüle
                        </Button>
                      </a>
                      <a href={project.generated_images[0].image_url} download>
                        <Button size="sm" variant="secondary">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteProject(project.id);
                        }}
                      >
                        Sil
                      </Button>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate mb-1">{project.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{project.generated_images?.length || 0} görsel</span>
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                  {project.status === 'pending' && (
                    <div className="mt-2 text-xs text-amber-500">İşleniyor...</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;