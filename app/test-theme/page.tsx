import React from 'react';
import { AdvancedThemeSwitch } from '@/components/advanced-theme-switch';
import { ThemeSwitch } from '@/components/theme-switch';
import { ThemeToggle } from '@/components/theme-toggle';

const TestThemePage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test du Système de Thème</h1>
      <p className="mb-8 text-gray-700 dark:text-gray-300">
        Cette page teste les différents composants de basculement de thème.
      </p>

      <div className="space-y-8">
        {/* Test du composant avancé */}
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Composant Avancé (avec étoiles/nuages)</h2>
          <AdvancedThemeSwitch />
        </div>

        {/* Test du composant simple */}
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Composant Simple</h2>
          <ThemeSwitch />
        </div>

        {/* Test du composant bouton */}
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Composant Bouton</h2>
          <ThemeToggle />
        </div>

        {/* Test des couleurs */}
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Test des Couleurs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary text-primary-foreground rounded">
              Primary
            </div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded">
              Secondary
            </div>
            <div className="p-4 bg-muted text-muted-foreground rounded">
              Muted
            </div>
            <div className="p-4 bg-accent text-accent-foreground rounded">
              Accent
            </div>
          </div>
        </div>

        {/* Test du texte */}
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Test du Texte</h2>
          <p className="text-foreground mb-2">
            Ce texte devrait changer de couleur selon le thème.
          </p>
          <p className="text-muted-foreground">
            Ce texte devrait être plus subtil.
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions de test :</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Cliquez sur les différents boutons de basculement pour changer de thème</li>
          <li>Vérifiez que les couleurs changent correctement</li>
          <li>Vérifiez que le thème persiste lors du rafraîchissement de la page</li>
          <li>Testez le thème "system" qui suit les préférences du système</li>
        </ul>
      </div>
    </div>
  );
};

export default TestThemePage;
