import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Çerez Politikası</h1>
          
          <p className="text-muted-foreground">Son Güncelleme: 16 Ekim 2025</p>

          <h2>1. Çerez Nedir?</h2>
          <p>
            Çerezler, web sitelerini ziyaret ettiğinizde tarayıcınız tarafından saklanan küçük metin 
            dosyalarıdır. Bu dosyalar, web sitesinin daha verimli çalışmasını sağlar ve kullanıcı 
            deneyimini iyileştirir.
          </p>

          <h2>2. Çerez Türleri</h2>
          
          <h3>2.1. Zorunlu Çerezler</h3>
          <p>
            Bu çerezler web sitesinin temel işlevlerini yerine getirmesi için gereklidir ve kapatılamaz.
          </p>
          <ul>
            <li><strong>Oturum Çerezleri:</strong> Giriş durumunuzu korur</li>
            <li><strong>Güvenlik Çerezleri:</strong> Güvenlik önlemlerini etkinleştirir</li>
            <li><strong>Tercih Çerezleri:</strong> Dil ve tema ayarlarınızı hatırlar</li>
          </ul>

          <h3>2.2. Performans Çerezleri</h3>
          <p>
            Web sitesinin nasıl kullanıldığını anlamamıza yardımcı olan istatistiksel bilgiler toplar.
          </p>
          <ul>
            <li>Sayfa görüntüleme sayıları</li>
            <li>Ziyaret süreleri</li>
            <li>Kullanıcı davranışları</li>
          </ul>

          <h3>2.3. İşlevsellik Çerezleri</h3>
          <p>
            Gelişmiş özellikler ve kişiselleştirme sağlar.
          </p>
          <ul>
            <li>Kullanıcı tercihleri</li>
            <li>Bölgesel ayarlar</li>
            <li>Özelleştirilmiş içerik</li>
          </ul>

          <h2>3. Üçüncü Taraf Çerezleri</h2>
          <p>
            Bazı durumlarda güvenilir üçüncü taraf hizmetlerinin çerezlerini kullanırız:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> Web sitesi trafiğini analiz etmek için</li>
            <li><strong>Ödeme Sağlayıcıları:</strong> Güvenli ödeme işlemleri için</li>
          </ul>

          <h2>4. Çerezleri Yönetme</h2>
          <p>
            Tarayıcı ayarlarınızdan çerezleri kontrol edebilir, silebilir veya engelleyebilirsiniz:
          </p>
          <ul>
            <li><strong>Chrome:</strong> Ayarlar &gt; Gizlilik ve güvenlik &gt; Çerezler</li>
            <li><strong>Firefox:</strong> Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler</li>
            <li><strong>Safari:</strong> Tercihler &gt; Gizlilik &gt; Çerezler</li>
            <li><strong>Edge:</strong> Ayarlar &gt; Gizlilik, arama ve hizmetler &gt; Çerezler</li>
          </ul>

          <h2>5. Çerezlerin Etkisi</h2>
          <p>
            Çerezleri devre dışı bırakırsanız:
          </p>
          <ul>
            <li>Bazı özellikler düzgün çalışmayabilir</li>
            <li>Oturum açma durumunuz korunmayabilir</li>
            <li>Tercihleriniz hatırlanmayabilir</li>
          </ul>

          <h2>6. Çerez Onayı</h2>
          <p>
            Web sitemizi ilk ziyaretinizde çerez kullanımı hakkında bilgilendirilirsiniz ve onay 
            vermeniz istenir. Onay vermezseniz, yalnızca zorunlu çerezler kullanılır.
          </p>

          <h2>7. Politika Güncellemeleri</h2>
          <p>
            Bu çerez politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacaktır.
          </p>

          <h2>8. İletişim</h2>
          <p>
            Çerez politikamız hakkında sorularınız için:{" "}
            <a href="mailto:destek@shipshack.com">destek@shipshack.com</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies;