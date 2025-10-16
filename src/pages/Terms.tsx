import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Kullanım Koşulları</h1>
          
          <p className="text-muted-foreground">Son Güncelleme: 16 Ekim 2025</p>

          <h2>1. Hizmet Tanımı</h2>
          <p>
            ShipShack, yapay zeka teknolojisi kullanarak ürün görsellerini profesyonel modellere giydirme hizmeti sunar. 
            Bu hizmeti kullanarak, aşağıdaki kullanım koşullarını kabul etmiş olursunuz.
          </p>

          <h2>2. Kullanıcı Yükümlülükleri</h2>
          <p>Kullanıcılar olarak:</p>
          <ul>
            <li>Yüklediğiniz görseller üzerinde gerekli telif haklarına sahip olduğunuzu beyan edersiniz</li>
            <li>Hizmeti yasa dışı amaçlarla kullanmayacağınızı taahhüt edersiniz</li>
            <li>Başkalarının haklarını ihlal edecek içerik yüklemeyeceğinizi kabul edersiniz</li>
            <li>Hesap bilgilerinizin güvenliğinden sorumlu olduğunuzu kabul edersiniz</li>
          </ul>

          <h2>3. Fikri Mülkiyet Hakları</h2>
          <p>
            Oluşturulan görseller üzerindeki haklar kullanıcıya aittir. ShipShack, yüklenen orijinal içeriğin 
            telif haklarını talep etmez. Ancak, hizmetin geliştirilmesi ve iyileştirilmesi için anonim olarak 
            kullanılabilir.
          </p>

          <h2>4. Hizmet Kesintileri</h2>
          <p>
            ShipShack, hizmeti kesintisiz sunmak için çaba gösterir ancak bakım, güncellemeler veya teknik 
            sorunlar nedeniyle geçici kesintiler yaşanabilir. Bu durumlardan dolayı sorumluluk kabul edilmez.
          </p>

          <h2>5. Ücretlendirme</h2>
          <p>
            Ücretsiz kredi hakkından sonra, görsel oluşturma hizmeti ücretlidir. Ücretler, fiyatlandırma 
            sayfasında belirtilmiştir ve önceden bildirimde bulunularak değiştirilebilir.
          </p>

          <h2>6. Hesap İptali</h2>
          <p>
            ShipShack, kullanım koşullarını ihlal eden hesapları önceden bildirimde bulunmaksızın askıya 
            alma veya silme hakkını saklı tutar.
          </p>

          <h2>7. Sorumluluk Sınırlaması</h2>
          <p>
            ShipShack, hizmetin kullanımından kaynaklanan doğrudan veya dolaylı zararlardan sorumlu değildir. 
            Hizmet "olduğu gibi" sunulur.
          </p>

          <h2>8. Değişiklikler</h2>
          <p>
            ShipShack, bu kullanım koşullarını herhangi bir zamanda değiştirme hakkını saklı tutar. 
            Değişiklikler sitede yayınlandığı anda yürürlüğe girer.
          </p>

          <h2>9. İletişim</h2>
          <p>
            Sorularınız için: <a href="mailto:destek@shipshack.com">destek@shipshack.com</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;