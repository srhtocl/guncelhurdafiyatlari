import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '@/services/user-methods';
import styles from "./SignUp.module.css";

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Kayıt Ol</h2>
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
        <button className={styles.button} type="submit">Kayıt Ol</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

export default SignUp;
