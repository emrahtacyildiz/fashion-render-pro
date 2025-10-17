import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "E-Ticarette Ürün Fotoğraflarının Satışa Etkisi",
    excerpt: "Profesyonel ürün görselleri, e-ticaret dönüşüm oranlarınızı %200'e kadar artırabilir. Kaliteli görsellerin satışlarınıza nasıl etki ettiğini keşfedin.",
    author: "ShipShack Ekibi",
    date: "15 Mart 2025",
    category: "E-Ticaret İpuçları",
    readTime: "5 dk okuma",
    content: [
      "E-ticarette görsel her şeydir. Müşteriler ürünü ellerine alamadıkları için, görselleriniz satış temsilciniz olur.",
      "Araştırmalar gösteriyor ki profesyonel ürün fotoğrafları olan e-ticaret siteleri, amatör görsellere sahip olanlara göre %200 daha fazla dönüşüm sağlıyor.",
      "Kaliteli ürün görselleri müşteri güvenini artırır, iade oranlarını düşürür ve marka algısını güçlendirir."
    ]
  },
  {
    id: 2,
    title: "Model Seçimi: Doğru Model Nasıl Seçilir?",
    excerpt: "Hedef kitlenize uygun model seçimi, ürününüzün algısını doğrudan etkiler. Doğru model seçimi için ipuçları.",
    author: "ShipShack Ekibi",
    date: "12 Mart 2025",
    category: "Ürün Fotoğrafçılığı",
    readTime: "4 dk okuma",
    content: [
      "Model seçimi, ürününüzün hikayesini anlatmanın kritik bir parçasıdır. Hedef kitlenizi yansıtan modeller seçmek, müşterilerinizle duygusal bağ kurmanıza yardımcı olur.",
      "Giyim kategorisinde tam boy modeller, takı için yüz ve el çekimleri, teknoloji ürünleri için kullanım senaryolarını gösteren modeller tercih edilmelidir.",
      "ShipShack'ın geniş model kütüphanesi sayesinde her ürün kategorisi için en uygun modeli saniyeler içinde bulabilir ve deneyebilirsiniz."
    ]
  },
  {
    id: 3,
    title: "Yapay Zeka ile Ürün Fotoğrafçılığında Devrim",
    excerpt: "AI teknolojisi, ürün fotoğrafçılığını nasıl dönüştürüyor? Maliyetleri %90 azaltarak profesyonel sonuçlar elde edin.",
    author: "ShipShack Ekibi",
    date: "8 Mart 2025",
    category: "Teknoloji",
    readTime: "6 dk okuma",
    content: [
      "Geleneksel ürün fotoğraf çekimleri binlerce lira maliyete ve günlerce çalışmaya mal olabilir. AI teknolojisi bu süreci tamamen değiştiriyor.",
      "ShipShack'ın AI destekli platformu, birkaç saniye içinde profesyonel model fotoğrafları oluşturarak hem zamandan hem de maliyetten tasarruf sağlar.",
      "Model kiralama, stüdyo, fotoğrafçı ve post-prodüksiyon maliyetlerini ortadan kaldırarak küçük işletmelerin de profesyonel görsellere erişmesini sağlıyoruz."
    ]
  },
  {
    id: 4,
    title: "E-Ticarette Farklılaşmanın Önemi",
    excerpt: "Rekabetçi e-ticaret pazarında öne çıkmak için profesyonel görselleme stratejileri ve uygulama yöntemleri.",
    author: "ShipShack Ekibi",
    date: "5 Mart 2025",
    category: "E-Ticaret İpuçları",
    readTime: "5 dk okuma",
    content: [
      "E-ticaret pazarı her geçen gün daha rekabetçi hale geliyor. Farklılaşmak için ürünlerinizi en iyi şekilde sunmanız gerekiyor.",
      "Müşteriler aynı ürünü sunan onlarca satıcı arasından sizin ürününüzü seçecek. Bu seçimde görsellerin rolü kritiktir.",
      "Profesyonel model görselleri, ürünlerinize premium bir görünüm kazandırarak müşterilerin sizin mağazanızı tercih etmesini sağlar."
    ]
  },
  {
    id: 5,
    title: "Çok Kanallı Satışta Görsel Tutarlılığı",
    excerpt: "Farklı platformlarda marka tutarlılığı sağlamanın yolları ve görsel stratejiler.",
    author: "ShipShack Ekibi",
    date: "1 Mart 2025",
    category: "Marka Yönetimi",
    readTime: "4 dk okuma",
    content: [
      "Kendi siteniz, pazaryerleri, sosyal medya - tüm kanallarda tutarlı bir görsel kimlik oluşturmak marka güvenilirliğinizi artırır.",
      "ShipShack ile oluşturduğunuz görselleri tüm satış kanallarınızda kullanarak tek bir marka imajı yaratabilirsiniz.",
      "Tutarlı görseller, müşterilerin markanızı tanımasını ve hatırlamasını kolaylaştırır, bu da tekrar satın alma oranını artırır."
    ]
  },
  {
    id: 6,
    title: "Ürün Görseli Optimizasyonu: SEO ve Dönüşüm",
    excerpt: "Ürün görsellerinizi hem SEO hem de dönüşüm için optimize etmenin püf noktaları.",
    author: "ShipShack Ekibi",
    date: "25 Şubat 2025",
    category: "SEO & Optimizasyon",
    readTime: "5 dk okuma",
    content: [
      "Görsel optimizasyonu sadece görünüm değil, aynı zamanda performans meselesidir. Hızlı yüklenen, kaliteli görseller hem kullanıcı deneyimini hem de SEO'yu iyileştirir.",
      "ShipShack ile oluşturduğunuz görseller otomatik olarak web için optimize edilir, bu sayede sayfa hızınızdan ödün vermeden kaliteli görseller kullanabilirsiniz.",
      "Doğru alt text, dosya isimlendirmesi ve görsel boyutlandırması ile arama motorlarında üst sıralarda yer alabilirsiniz."
    ]
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in">
              E-Ticaret Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Ürün fotoğrafçılığı, e-ticaret stratejileri ve dijital pazarlama hakkında uzman içerikler
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-primary/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{post.author}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-6 group/btn"
                    asChild
                  >
                    <Link to={`/blog/${post.id}`}>
                      Devamını Oku
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-hover">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              ShipShack ile Hemen Başlayın
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Profesyonel ürün görselleri oluşturmak için bugün ücretsiz deneyin
            </p>
            <Button size="xl" variant="secondary" asChild>
              <Link to="/auth?mode=signup">
                Ücretsiz Deneyin
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;

export { blogPosts };
