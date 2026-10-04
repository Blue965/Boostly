import React, { useState } from 'react';

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  const steps = [
    { title: "Bienvenue sur Boostly", desc: "Créez une page unique pour centraliser vos liens et réseaux sociaux." },
    { title: "Étape 1 : Personnalisez votre profil", desc: "Choisissez un nom d'affichage et une bio courte pour votre audience." },
    { title: "Étape 2 : Ajoutez vos liens", desc: "Ajoutez vos réseaux sociaux, votre site web ou votre boutique." },
    { title: "Étape 3 : Choisissez votre style", desc: "Sélectionnez parmi plusieurs thèmes élégants dans l'onglet Apparence." },
    { title: "Votre page est prête !", desc: "Partagez votre lien /u/username dès maintenant." }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
            Étape {step} sur 5
          </span>
          <h2 className="text-xl font-bold text-white">{steps[step - 1].title}</h2>
          <p className="text-xs text-slate-400">{steps[step - 1].desc}</p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Précédent
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-medium"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-medium"
            >
              Accéder au Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};