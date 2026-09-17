import React from 'react';
import { ShieldCheck, Lock, Eye, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../constants';
import BackToTop from './BackToTop';
import Reveal from './Reveal';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Header */}
      <div className="bg-teal-800 dark:bg-teal-950 text-white pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal direction="down">
            <div className="inline-flex p-3 bg-teal-700/50 rounded-full mb-4 ring-1 ring-teal-400/30">
              <Lock size={28} className="text-teal-300" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Politique de Confidentialité</h1>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto">
              Protection des données personnelles et confidentialité médicale au Centre de Santé de Zogbo.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800 space-y-10 leading-relaxed">
          
          {/* Engagement de Confidentialité */}
          <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-2">
            <div className="flex items-center gap-3 text-teal-800 dark:text-teal-300 font-bold text-lg">
              <ShieldCheck size={24} />
              <span>Secret Médical & Protection des Données</span>
            </div>
            <p className="text-sm text-teal-900 dark:text-teal-200 leading-relaxed">
              Le Centre de Santé de Zogbo accorde la plus haute importance à la confidentialité de vos informations personnelles et de vos données médicales. Les données collectées via ce site web ne sont jamais vendues, cédées ni partagées à des fins publicitaires.
            </p>
          </div>

          {/* Section 1 : Données collectées */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <Eye className="text-teal-600 dark:text-teal-400" size={24} />
              1. Données collectées et finalités
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Nous appliquons le principe de <strong>minimisation des données</strong> : seules les informations strictement indispensables à la prise en charge de votre demande sont recueillies.
            </p>
            <div className="space-y-3 text-sm">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Formulaire de demande de rendez-vous :</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li><strong>Nom et prénom :</strong> identification du patient pour la tenue du registre des consultations.</li>
                  <li><strong>Numéro de téléphone :</strong> contact direct par le secrétariat pour la confirmation ou modification du créneau.</li>
                  <li><strong>Date et heure souhaitées :</strong> planification de la charge des consultations médicales.</li>
                  <li><strong>Motif de consultation (optionnel) :</strong> orientation préalable du patient vers le service adéquat (dispensaire, maternité, laboratoire). <span className="text-teal-700 dark:text-teal-400 font-medium">Vous êtes libre de ne pas renseigner de détails intimes en ligne et de les réserver à votre consultation en tête-à-tête avec le praticien.</span></li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Formulaire de contact général :</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Nom, adresse e-mail ou téléphone, et contenu de votre message, destinés exclusivement au secrétariat administratif.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 : Cadre légal au Bénin */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <Lock className="text-teal-600 dark:text-teal-400" size={24} />
              2. Cadre légal et conformité (Loi béninoise / APDP)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Le traitement de vos données est soumis à la <strong>Loi n° 2017-20 du 20 avril 2017 portant Code du numérique en République du Bénin</strong> (Livre V relatif à la protection des données à caractère personnel), sous l'autorité de l'<strong>Autorité de Protection des Données Personnelles (APDP Bénin)</strong>.
            </p>
          </section>

          {/* Section 3 : Destinataires & Conservation */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <CheckCircle2 className="text-teal-600 dark:text-teal-400" size={24} />
              3. Destinataires et durée de conservation
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>
                <strong>Destinataires habilités :</strong> Seuls les agents du secrétariat médical et le personnel soignant assermenté ont accès aux informations nécessaires au bon déroulement des soins.
              </p>
              <p>
                <strong>Durée de conservation :</strong> Les demandes de rendez-vous en ligne sont archivées pendant la durée nécessaire à la prise en charge médicale, puis purgées selon les règles déontologiques de conservation des archives de santé.
              </p>
            </div>
          </section>

          {/* Section 4 : Vos Droits */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <ShieldCheck className="text-teal-600 dark:text-teal-400" size={24} />
              4. Exercice de vos droits (Accès, Rectification, Suppression)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Conformément à la législation béninoise en vigueur, vous disposez d'un droit d'accès, de rectification et d'opposition ou de suppression des informations vous concernant.
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Contact pour l'exercice de vos droits :</p>
                <p className="text-gray-600 dark:text-gray-300">Directement à l'accueil du Centre de Santé de Zogbo ou par téléphone au :</p>
              </div>
              <a 
                href={`tel:${CONTACT_INFO.phoneRaw}`} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                <Phone size={14} />
                {CONTACT_INFO.phone}
              </a>
            </div>
          </section>

          {/* Section 5 : Sécurité */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <AlertTriangle className="text-teal-600 dark:text-teal-400" size={24} />
              5. Sécurité technique des transmissions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Toutes les communications entre votre navigateur et notre plateforme sont protégées par le protocole de chiffrement standard SSL/TLS (HTTPS). L'accès aux données administratives est strictement protégé par une authentification sécurisée réservée au personnel autorisé.
            </p>
          </section>

          {/* Footer links */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm">
            <Link to="/mentions-legales" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
              &larr; Consulter les Mentions Légales
            </Link>
            <Link to="/appointment" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
              Demander un rendez-vous &rarr;
            </Link>
          </div>

        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default PrivacyPolicy;
