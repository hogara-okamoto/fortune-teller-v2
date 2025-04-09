'use client';

import { useState } from 'react';

const bloodTypes = ['A', 'B', 'O', 'AB'];
const birthMonths = Array.from({ length: 12 }, (_, i) => i + 1);
const languages = ['English', 'Spanish', 'Hindi', 'Japanese', 'Chinese'];

export default function Home() {
  const [input1, setInput1] = useState('A');
  const [input2, setInput2] = useState('1');
  const [language, setLanguage] = useState('English');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFortune = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        input_data_1: input1,
        input_data_2: input2,
        language,
      }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main style={{
      padding: '1.5rem',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>🔮 Blood & Birth Fortune Teller</h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
          maxWidth: '100%',
        }}
      >
        {/* Blood Type Selector */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontWeight: 'bold' }}>Blood Type:</span>
          <select
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '0.5rem',
              border: '2px solid #e0e0e0',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '100%',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
          >
            {bloodTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>

        {/* Birth Month Selector */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontWeight: 'bold' }}>Birth Month:</span>
          <select
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '0.5rem',
              border: '2px solid #e0e0e0',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '100%',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
          >
            {birthMonths.map((month) => (
              <option key={month}>{month}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Language Radio Buttons */}
      <fieldset style={{ marginBottom: '1.5rem' }}>
        <legend>Select Language:</legend>
        {languages.map((lang) => (
          <label key={lang} style={{ marginRight: '1rem' }}>
            <input
              type="radio"
              value={lang}
              checked={language === lang}
              onChange={(e) => setLanguage(e.target.value)}
            />
            {lang}
          </label>
        ))}
      </fieldset>

      {/* Submit Button */}
      <button
        onClick={fetchFortune}
        style={{
          fontWeight: 'bold',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '0.5rem',
          border: 'none',
          backgroundColor: '#6a4c93',
          color: 'white',
          cursor: 'pointer',
          display: 'block',
          margin: '0 auto 2rem',
        }}
      >
        Reveal Fortune
      </button>

      {/* Result Display */}
      <div
        style={{
          maxWidth: '100%',
          lineHeight: '1.6',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '0.5rem',
          wordWrap: 'break-word',
        }}
      >
        {loading && <p>Loading...</p>}
        {result && <p style={{ marginTop: '1rem' }}>{result}</p>}
      </div>
    </main>
  );
}
