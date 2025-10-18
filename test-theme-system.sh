#!/bin/bash

echo "🌙 Test du système de thème dark/light"
echo "====================================="

# 1. Vérifier que le frontend est démarré
echo -e "\n1. Vérification du frontend:"
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend accessible sur http://localhost:3000"
else
    echo "❌ Frontend non accessible. Démarrez avec: cd /Users/isaaclamare/Desktop/atps-frontend && npm run dev"
    exit 1
fi

# 2. Test de la page de test des thèmes
echo -e "\n2. Test de la page de test des thèmes:"
if curl -s http://localhost:3000/test-theme | grep -q "Test du Système de Thème"; then
    echo "✅ Page de test des thèmes accessible"
else
    echo "❌ Page de test des thèmes non accessible"
fi

# 3. Test de la sidebar avec le bouton de thème
echo -e "\n3. Test de la sidebar:"
if curl -s http://localhost:3000/dashboard | grep -q "Toggle theme"; then
    echo "✅ Bouton de thème présent dans la sidebar"
else
    echo "❌ Bouton de thème non trouvé dans la sidebar"
fi

echo -e "\n🎯 Instructions pour tester manuellement :"
echo "1. Allez sur http://localhost:3000"
echo "2. Regardez la sidebar à gauche - vous devriez voir un bouton 'Dark mode'"
echo "3. Cliquez sur le bouton pour basculer entre les thèmes"
echo "4. Allez sur http://localhost:3000/test-theme pour voir tous les composants"
echo "5. Vérifiez que les couleurs changent correctement"
echo "6. Rafraîchissez la page pour vérifier la persistance du thème"

echo -e "\n✅ Tests terminés !"
