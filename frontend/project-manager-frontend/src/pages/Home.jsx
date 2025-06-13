import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './Home.css';
import RegisterModal from '../components/RegisterModal';
import React, { useState } from 'react';
import imgHomr from '../../img/img.homr.png';

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />
      <main className="container-fluid p-0">
        {/* Sezione principale con titolo e pulsanti */}
        <section className="hero-section text-center text-white">
          <div className="container d-flex flex-column align-items-center">
            {/* Blocco iniziale: Titolo + descrizione + bottoni */}
            <div className="hero-content mb-5">
              <h1 className="display-4 fw-bold mb-4">
                Benvenuto in Project Manager App
              </h1>
              <p className="lead mb-4">
                Organizza progetti, assegna task e collabora con il tuo team in un’unica piattaforma accessibile ovunque.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/login" className="btn btn-login-custom btn-lg px-4 py-2">
                  Accedi
                </Link>
                <div style={{ marginTop: '10px' }} ></div>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-register-custom btn-lg px-4 py-2"
                >
                  Crea un account gratuito
                </button>
              </div>
            </div>

            {/* Blocco descrittivo con immagine */}
            <div className="mt-7 mb-4" style={{ marginTop: '100px' }}> 
              <h2 className="fw-bold mb-3">
                Passa al livello successivo nella gestione dei progetti
              </h2>
              <p className="lead mb-4">
                Tieni tutto sotto controllo in un’unica piattaforma.<br />
                Informazioni aggiornate in tempo reale, sempre disponibili per il tuo team.
              </p>
            </div>

            <div>
              <img
                src={imgHomr}
                alt="Dashboard preview"
                className="img-fluid rounded shadow"
                style={{ maxWidth: '60%', height: 'auto' }}
              />
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
