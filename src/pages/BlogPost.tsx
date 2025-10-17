import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { blogPosts } from "./Blog";

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog yazısı bulunamadı</h1>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Blog'a Dön
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Blog'a Dön
              </Link>
            </Button>

            <div className="mb-8">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
                {post.category}
              </span>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            <Card className="p-8 md:p-12 mb-12">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-xl font-medium mb-8 text-primary">
                  {post.excerpt}
                </p>
                
                {post.content.map((paragraph, index) => (
                  <p key={index} className="mb-6 text-foreground/90 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                ShipShack ile Başlayın
              </h3>
              <p className="mb-6 opacity-90">
                İlk 5 görseliniz ücretsiz. Kredi kartı gerekmez.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth?mode=signup">
                  Ücretsiz Deneyin
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
