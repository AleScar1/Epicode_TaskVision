import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './Home.css';
import RegisterModal from '../components/RegisterModal';
import React, { useState } from 'react';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Header />
      <main className="container-fluid p-0">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="display-4 fw-bold mb-4">
              Benvenuto in Project Manager App
            </h1>
            <p className="lead mb-5">
              Organizza progetti, assegna task e collabora con il tuo team in un’unica piattaforma accessibile ovunque.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/login" className="btn btn-login-custom btn-lg px-4 py-2">
                Accedi
              </Link>
              <div>
              <br />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-register-custom btn-lg px-4 py-2"
              >
                Crea un account gratuito
              </button>
            </div>
          </div>
          <RegisterModal show={showModal} onClose={() => setShowModal(false)} />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
