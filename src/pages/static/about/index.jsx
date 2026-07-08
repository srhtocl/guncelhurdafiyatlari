import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Hakkımızda</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                    Hurda Fiyatları olarak, geri dönüşüm sektöründe şeffaf ve güncel fiyat bilgisi sunmayı amaçlıyoruz.
                    Sürdürülebilir bir gelecek için geri dönüşümün önemine inanıyor ve bu süreçte sizlere en iyi hizmeti vermeyi hedefliyoruz.
                </p>
                <p className="text-gray-600">
                    Tecrübeli ekibimiz ve geniş hizmet ağımızla, hurda alım satım süreçlerinizde güvenilir çözüm ortağınızız.
                </p>
            </div>
        </div>
    );
};

export default About;
