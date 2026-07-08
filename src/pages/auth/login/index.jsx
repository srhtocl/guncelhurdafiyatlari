import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // React Router v6 için
import { login } from '@/services/user-methods';
import { AuthContext } from '@/context/AuthProvider';
import { FaUser, FaLock } from 'react-icons/fa';
import styles from './Login.module.css';

import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Yönlendirme için

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Yükleniyor bildirimi
    const loadingToast = toast.loading('Giriş yapılıyor...');

    try {
      await login(email, password);
      toast.dismiss(loadingToast); // Yükleniyor bildirimini kapat
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/admin'), 1000); // Biraz bekle sonra yönlendir
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>
        <input
          className={styles.input}
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} type="submit">Giriş</button>
        {error && <p className={styles.error}>{error}</p>}

      </form>
    </div>
  );
}

export default Login;
