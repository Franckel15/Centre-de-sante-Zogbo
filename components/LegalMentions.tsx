import React from 'react';
import { ShieldCheck, Building2, Phone, Mail, MapPin, AlertCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../constants';
import BackToTop from './BackToTop';
import Reveal from './Reveal';

const LegalMentions: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Header */}
      <div className="bg-teal-800 dark:bg-teal-950 text-white pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal direction="down">
            <div className="inline-flex p-3 bg-teal-700/50 rounded-full mb-4 ring-1 ring-teal-400/30">
              <FileText size={28} className="text-teal-300" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Mentions Légales & Agréments</h1>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto">
              Informations institutionnelles et cadre réglementaire du Centre de Santé de Zogbo.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800 space-y-10 leading-relaxed">
          
          {/* Avertissement Médical */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-4">
            <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={24} />
            <div className="text-sm text-amber-900 dark:text-amber-200">
              <strong className="block font-bold mb-1">Avertissement Médical Important :</strong>
              Les informations présentées sur ce site sont fournies à titre strictement indicatif et éducatif. Elles ne constituent en aucun cas une prescription, un diagnostic ou un conseil médical personnalisé. En cas de malaise, de symptômes aigus ou d'urgence médicale vitale, veuillez vous rendre directement au centre de santé ou contacter les services d'urgence nationaux (SAMU / Sapeurs-Pompiers au 118).
            </div>
          </div>

          {/* Section 1 : Identité de l'Établissement */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <Building2 className="text-teal-600 dark:text-teal-400" size={24} />
              1. Identité de l'Établissement
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase font-bold mb-1">Dénomination</span>
                <span className="font-semibold text-gray-900 dark:text-white">Centre de Santé de Zogbo</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase font-bold mb-1">Nature de l'activité</span>
                <span className="font-semibold text-gray-900 dark:text-white">Centre de santé, dispensaire, maternité & laboratoire d'analyses</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase font-bold mb-1">Localisation</span>
                <span className="font-semibold text-gray-900 dark:text-white">{CONTACT_INFO.address}, Cotonou, République du Bénin</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase font-bold mb-1">Téléphone officiel</span>
                <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>
          </section>

          {/* Section 2 : Tutelle Sanitaire & Gouvernance */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <ShieldCheck className="text-teal-600 dark:text-teal-400" size={24} />
              2. Cadre Réglementaire & Tutelle Sanitaire
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Le Centre de Santé de Zogbo exerce ses activités médico-sanitaires conformément aux directives et normes du <strong>Ministère de la Santé de la République du Bénin</strong> et de la Direction Départementale de la Santé du Littoral (DDS-Littoral).
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm space-y-2">
              <p><strong>Gouvernance communautaire :</strong> Le centre est administré en concertation avec le Comité de Gestion (COGES) conformément à la politique nationale de santé communautaire du Bénin.</p>
              <p><strong>Direction Médicale :</strong> Le Médecin Chef coordonne l'équipe technique et assure la conformité des protocoles de soins primaires.</p>
            </div>
          </section>

          {/* Section 3 : Édition & Hébergement */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FileText className="text-teal-600 dark:text-teal-400" size={24} />
              3. Édition du Site & Hébergement
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
              <p>
                <strong>Directeur de la publication :</strong> Le Médecin Chef et le Comité de Gestion du Centre de Santé de Zogbo.
              </p>
              <p>
                <strong>Contact éditorial :</strong> <a href={`mailto:${CONTACT_INFO.email}`} className="text-teal-600 dark:text-teal-400 hover:underline">{CONTACT_INFO.email}</a> {CONTACT_INFO.emailNote}.
              </p>
              <p>
                <strong>Hébergement de l'application web :</strong> Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, California 94107, USA.
              </p>
            </div>
          </section>

          {/* Section 4 : Propriété Intellectuelle & Données */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <ShieldCheck className="text-teal-600 dark:text-teal-400" size={24} />
              4. Données Personnelles & Confidentialité
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Pour en savoir plus sur les modalités de traitement des demandes de rendez-vous et des messages de contact, veuillez consulter notre <Link to="/confidentialite" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">Politique de Confidentialité et de Protection des Données</Link>.
            </p>
          </section>

          {/* Section 5 : Contact */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">Dernière mise à jour : Mars 2026</span>
            <Link to="/contact" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
              Contacter le secrétariat &rarr;
            </Link>
          </div>

        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default LegalMentions;
