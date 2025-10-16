import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Gizlilik Politikası</h1>
          
          <p className="text-muted-foreground">Son Güncelleme: 16 Ekim 2025</p>

          <h2>1. Toplanan Bilgiler</h2>
          <p>ShipShack olarak aşağıdaki bilgileri topluyoruz:</p>
          <ul>
            <li><strong>Hesap Bilgileri:</strong> E-posta adresi, ad, soyad</li>
            <li><strong>Ödeme Bilgileri:</strong> Kredi kartı bilgileri (güvenli ödeme sağlayıcıları üzerinden)</li>
            <li><strong>Kullanım Verileri:</strong> IP adresi, tarayıcı bilgileri, kullanım istatistikleri</li>
            <li><strong>İçerik:</strong> Yüklediğiniz ürün görselleri ve oluşturulan görseller</li>
          </ul>

          <h2>2. Bilgilerin Kullanımı</h2>
          <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
          <ul>
            <li>Hizmetlerimizi sunmak ve geliştirmek</li>
            <li>Müşteri desteği sağlamak</li>
            <li>Ödeme işlemlerini gerçekleştirmek</li>
            <li>Hizmet kalitesini iyileştirmek için analiz yapmak</li>
            <li>Yasal yükümlülüklerimizi yerine getirmek</li>
          </ul>

          <h2>3. Bilgi Paylaşımı</h2>
          <p>
            Kişisel bilgilerinizi üçüncü taraflarla paylaşmayız. Ancak aşağıdaki durumlar istisnadır:
          </p>
          <ul>
            <li>Ödeme işlemleri için güvenilir ödeme sağlayıcıları</li>
            <li>Yasal zorunluluklar gereği resmi makamlar</li>
            <li>Hizmet sağlayıcılar (sunucu barındırma, e-posta servisleri vb.)</li>
          </ul>

          <h2>4. Veri Güvenliği</h2>
          <p>
            Verilerinizin güvenliği bizim için önceliklidir. SSL şifreleme, güvenli sunucular ve düzenli 
            güvenlik güncellemeleri ile verilerinizi koruyoruz.
          </p>

          <h2>5. Çerezler</h2>
          <p>
            Web sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz. Çerez kullanımı hakkında 
            daha fazla bilgi için{" "}
            <a href="/cookies" className="text-primary hover:underline">Çerez Politikamızı</a>{" "}
            inceleyebilirsiniz.
          </p>

          <h2>6. Kullanıcı Hakları</h2>
          <p>KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul>
            <li>Kişisel verilerinize erişim hakkı</li>
            <li>Verilerin düzeltilmesini talep etme hakkı</li>
            <li>Verilerin silinmesini talep etme hakkı</li>
            <li>Veri işlemeye itiraz etme hakkı</li>
            <li>Veri taşınabilirliği hakkı</li>
          </ul>

          <h2>7. Veri Saklama</h2>
          <p>
            Kişisel verileriniz, yasal yükümlülüklerimiz veya hizmet gereksinimlerimiz doğrultusunda 
            gerekli olduğu sürece saklanır. Hesabınızı sildiğinizde, verileriniz güvenli bir şekilde silinir.
          </p>

          <h2>8. Çocukların Gizliliği</h2>
          <p>
            Hizmetlerimiz 18 yaş altındaki bireyler için tasarlanmamıştır. Bilerek 18 yaş altındaki 
            bireylerden kişisel bilgi toplamayız.
          </p>

          <h2>9. Politika Değişiklikleri</h2>
          <p>
            Bu gizlilik politikasını güncelleyebiliriz. Önemli değişiklikler olduğunda e-posta yoluyla 
            bilgilendirileceksiniz.
          </p>

          <h2>10. İletişim</h2>
          <p>
            Gizlilik politikamız hakkında sorularınız için:{" "}
            <a href="mailto:destek@shipshack.com">destek@shipshack.com</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;