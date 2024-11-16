import { UtensilsCrossed } from "lucide-react";

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footerContainer}>
      <div style={styles.contentContainer}>
        <div style={styles.section}>
        <h1 className="text-2xl font-medium flex justify-center items-center gap-2 mb-4">
                        Better
                        <UtensilsCrossed size={32} color="green" />
                        Eats
                    </h1>
          <p style={styles.description}>
            Your One-Stop Solution To All Your Regular Needs, Right At Your Fingertips.
          </p>
          <div style={styles.subscribeContainer}>
            <input
              type="email"
              placeholder="Enter Your Email"
              style={styles.input}
            />
            <button style={styles.button}>Subscribe</button>
          </div>
        </div>
        <div style={styles.section}>
          <h3 style={styles.heading}>Contact</h3>
          <p>Help/FAQ</p>
          <p>Press</p>
          <p>Affiliates</p>
          <p>Partners</p>
        </div>
        <div style={styles.section}>
          <h3 style={styles.heading}>Social Media</h3>
          <p>Facebook</p>
          <p>Twitter</p>
          <p>Instagram</p>
          <p>Youtube</p>
        </div>
      </div>
      <div style={styles.copyright}>
        © Copyright powered by <a href="https://wpdeveloper.net">WPDeveloper</a>
      </div>
    </footer>
  );
};

const styles = {
  footerContainer: {
    backgroundColor: '#f4f4f8',
    padding: '40px',
    textAlign: 'center' as const,
    color: '#444',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    flex: '1 1 200px',
    padding: '20px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#5a34fa',
  },
  description: {
    marginTop: '10px',
    marginBottom: '20px',
  },
  subscribeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px 0 0 5px',
    outline: 'none' as const,
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#5a34fa',
    color: '#fff',
    border: 'none',
    borderRadius: '0 5px 5px 0',
    cursor: 'pointer',
  },
  heading: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#222',
    marginBottom: '10px',
  },
  copyright: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#888',
  },
};

export default Footer;
