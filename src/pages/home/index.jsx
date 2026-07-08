import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/component/seo';
import { AuthContext } from '@/context/AuthProvider';
import { logout } from '@/services/user-methods';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaArrowRight,
  FaClock,
  FaMoneyBillWave,
  FaSearch,
  FaPhone,
  FaWeight,
  FaHammer,
  FaBuilding,
  FaTools
} from 'react-icons/fa';

import PriceTicker from '@/component/price-ticker';
import QuickCalculator from '@/component/quick-calculator';
import { getPosts } from '@/services/blog-methods';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const posts = await getPosts();
        // Get last 3 posts
        setLatestPosts(posts.slice(0, 3));
      } catch (error) {
        console.error("Blog yazıları yüklenemedi", error);
      }
    };
    fetchLatestPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <SEO />
      <PriceTicker />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 px-6 overflow-hidden">

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Left Column: Content */}
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                İstanbul Hurdacı ve <br className="hidden md:block" />
                <span className="text-blue-300">Güncel Hurda Fiyatları</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto md:mx-0">
                Türkiye'nin her yerinden tonaj fark etmeksizin hurdalarınızı değerinde, yerinde ve nakit alıyoruz.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button
                onClick={() => navigate('/hurda-demir-fiyatlari')}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Fiyatları Gör <FaArrowRight />
              </button>
              <button
                onClick={() => navigate('/iletisim')}
                className="px-8 py-4 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white font-semibold rounded-xl transition-all backdrop-blur-sm"
              >
                Hemen Arayın
              </button>
            </motion.div>

            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-blue-200 text-sm"
              >
                Hoş geldiniz, <span className="font-semibold text-white">{user.email}</span>
                <button onClick={handleLogout} className="ml-3 underline hover:text-white">Çıkış Yap</button>
              </motion.div>
            )}
          </div>

          {/* Right Column: Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-md mx-auto w-full"
          >
            <QuickCalculator />
          </motion.div>

        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-blue-600 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500/30">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">8+</div>
            <div className="text-blue-100 text-sm font-medium">Yıllık Tecrübe</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
            <div className="text-blue-100 text-sm font-medium">Mutlu Müşteri</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">1000+</div>
            <div className="text-blue-100 text-sm font-medium">Ton Hurda Alımı</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">7/24</div>
            <div className="text-blue-100 text-sm font-medium">Hizmet</div>
          </div>
        </div>
      </div>

      {/* Features Section (Neden Biz?) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Neden Biz?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              2016'dan beri sektörde güven ve şeffaflıkla hizmet veriyoruz. Bizi farklı kılan özelliklerimiz.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Yüksek Fiyat</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Borsa verilerini anlık takip eder, hurdalarınız için her zaman en iyi ve adil fiyat garantisi sunarız.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <FaClock />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">7/24 Hizmet</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                İşiniz aksamasın diye, tatil demeden 7 gün 24 saat operasyon gücümüzle yanınızdayız.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <FaMoneyBillWave />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Nakit Ödeme</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tartım ve yükleme biter bitmez ödemeniz hazır. Güvenli ve şeffaf ticaretin rahatlığını yaşayın.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                <FaSearch />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Ücretsiz Keşif</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Uzman ekibimiz adresinize gelerek hurdalarınızın tespiti ve değerlemesi için ücretsiz keşif hizmeti sunar.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section (3 Adımda) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">3 Adımda Hurdanız Berekete Dönüşsün</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sizin için tüm karmaşık prosedürleri ortadan kaldırdık. Süreç basit, hızlı ve tamamen şeffaf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>

            {/* Step 1 */}
            <div className="text-center relative bg-white p-4">
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg border-4 border-white">
                <FaPhone />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">1. Bize Ulaşın</h3>
              <p className="text-gray-600">
                Bir telefonla veya WhatsApp mesajıyla hurdalarınız hakkında bilgi verin.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative bg-white p-4">
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg border-4 border-white">
                <FaWeight />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">2. Yerinde Tartalım</h3>
              <p className="text-gray-600">
                Kendi araçlarımız ve hassas dijital kantarlarımızla adresinize geliyoruz.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative bg-white p-4">
              <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg border-4 border-white">
                <FaMoneyBillWave />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">3. Anında Ödeyelim</h3>
              <p className="text-gray-600">
                Yükleme tamamlanır tamamlanmaz ödemenizi nakit veya havale ile yapıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Temel Hizmetlerimiz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Her çeşit metal hurdasını değerlendiriyoruz. İhtiyacınıza yönelik sunduğumuz başlıca hizmetler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-3xl shrink-0">
                <FaTools />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Hurda Kablo Alımı</h3>
                <p className="text-gray-600 text-sm">
                  TTR, antigron, yer altı ve tüm sanayi tipi kablo hurdalarınızı en yüksek değerden alıyoruz.
                </p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-6">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-3xl shrink-0">
                <FaHammer />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Hurda Bakır Alımı</h3>
                <p className="text-gray-600 text-sm">
                  Soyma, lama, kırkambar ve diğer tüm bakır çeşitlerini borsa verileriyle değerlendiriyoruz.
                </p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-6">
              <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center text-3xl shrink-0">
                <FaBuilding />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Hurda Alüminyum Alımı</h3>
                <p className="text-gray-600 text-sm">
                  Profil, levha, tel, jant ve tüm alaşımlı alüminyum hurdalarınız için en iyi fiyat teklifi.
                </p>
              </div>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-3xl shrink-0">
                <FaBuilding />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Bina Yıkımı</h3>
                <p className="text-gray-600 text-sm">
                  Eski fabrika, depo ve binalarınızın yıkımını, içinden çıkan hurdalar karşılığında yapıyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {latestPosts.length > 0 && (
        <section className="py-20 px-6 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sektörden Haberler</h2>
                <p className="text-gray-600 max-w-xl">
                  Hurda piyasası, fiyat analizleri ve geri dönüşüm dünyasından güncel bilgiler.
                </p>
              </div>
              <button
                onClick={() => navigate('/blog')}
                className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Tümünü Gör <FaArrowRight />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-48 mb-6 overflow-hidden relative flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-500">
                    <div className="text-gray-300 group-hover:text-blue-500 transition-colors transform group-hover:scale-110 duration-500">
                      <FaChartLine size={48} />
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                      Blog
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 line-clamp-3 text-sm">
                    {post.excerpt || "İçeriği okumak için tıklayın..."}
                  </p>
                  <div className="mt-4 flex items-center text-blue-500 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Devamını Oku <FaArrowRight className="ml-2 text-xs" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <button
                onClick={() => navigate('/blog')}
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Tümünü Gör <FaArrowRight />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Teklif Almaya Hazır mısınız?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Fabrika, otel, endüstriyel tesis veya bireysel hurdalarınız... Miktar ne olursa olsun, en iyi hizmet için bir telefon uzağınızdayız.
          </p>
          <button
            onClick={() => navigate('/iletisim')}
            className="px-10 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            Şimdi Arayın: 0537 664 68 37
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
