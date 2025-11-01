export type Language = 'en' | 'fr' | 'es';

export interface Translations {
  header: {
    home: string;
    partnerships: string;
    blog: string;
    faqs: string;
    pricing: string;
    community: string;
    latestNews: string;
    login: string;
    signUp: string;
  };
  footer: {
    ctaBanner: string;
    ctaTitle: string;
    ctaSubtitle: string;
    getStarted: string;
    quickLinks: string;
    company: string;
    allRightsReserved: string;
    privacyPolicy: string;
    termsOfService: string;
    cookiePolicy: string;
    description: string;
  };
  partnerships: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    contactPartnership: string;
    whyPartner: string;
    benefitsTitle: string;
    benefitsSubtitle: string;
    platformFeatures: string;
    platformSubtitle: string;
    readyToTransform: string;
    readyHighlight: string;
    readyDescription: string;
  };
  heroes: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    tryForFree: string;
    joinCommunity: string;
    readJournal: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      home: 'Home',
      partnerships: 'Partnerships',
      blog: 'Blog',
      faqs: 'FAQs',
      pricing: 'Pricing',
      community: 'Community',
      latestNews: 'Latest News',
      login: 'Login',
      signUp: 'Sign Up',
    },
    footer: {
      ctaBanner: 'Start Your Aviation Journey',
      ctaTitle: 'Ready to soar into',
      ctaSubtitle: 'Knowledge with ATPS?',
      getStarted: 'Get Started',
      quickLinks: 'Quick Links',
      company: 'Company',
      allRightsReserved: '© All rights reserved. ATPS Aviation. Powered by innovation.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePolicy: 'Cookie Policy',
      description: 'Master aviation effortlessly. Your complete ATPL training platform with AI-powered learning and comprehensive resources.',
    },
    partnerships: {
      badge: 'Partner with ATPS',
      title: 'Empowering Aviation Schools',
      titleHighlight: 'Through Innovation',
      subtitle: 'ATPS provides cutting-edge ATPL preparation tools, comprehensive learning resources, and advanced analytics designed to elevate student success rates and streamline training programs.',
      contactPartnership: 'Contact Partnership Team',
      whyPartner: 'Why Partner with ATPS',
      benefitsTitle: 'Benefits for Aviation Schools',
      benefitsSubtitle: 'Transform your ATPL training program with comprehensive resources and cutting-edge technology',
      platformFeatures: 'Platform Features',
      platformSubtitle: 'Everything you need to deliver exceptional ATPL training and track student success',
      readyToTransform: 'Ready to Transform Your',
      readyHighlight: 'ATPL Training Program?',
      readyDescription: 'Get in touch with our partnership team to learn how ATPS can elevate your aviation training program.',
    },
    heroes: {
      badge: 'Start Your Aviation Journey Today',
      title: 'Soar into knowledge',
      titleHighlight: 'with ATPS',
      description: 'ATPS is the most performant aviation training platform, designed to provide the most precise, efficient, and high-quality ATPL preparation available today.',
      tryForFree: 'TRY FOR FREE',
      joinCommunity: 'Join Our Community',
      readJournal: 'Read the ATPS Aviation Journal',
    },
  },
  fr: {
    header: {
      home: 'Accueil',
      partnerships: 'Partenariats',
      blog: 'Blog',
      faqs: 'FAQ',
      pricing: 'Tarifs',
      community: 'Communauté',
      latestNews: 'Actualités',
      login: 'Connexion',
      signUp: 'S\'inscrire',
    },
    footer: {
      ctaBanner: 'Commencez Votre Voyage Aéronautique',
      ctaTitle: 'Prêt à s\'envoler vers',
      ctaSubtitle: 'la Connaissance avec ATPS?',
      getStarted: 'Commencer',
      quickLinks: 'Liens Rapides',
      company: 'Entreprise',
      allRightsReserved: '© Tous droits réservés. ATPS Aviation. Alimenté par l\'innovation.',
      privacyPolicy: 'Politique de Confidentialité',
      termsOfService: 'Conditions d\'Utilisation',
      cookiePolicy: 'Politique de Cookies',
      description: 'Maîtrisez l\'aviation sans effort. Votre plateforme complète de formation ATPL avec un apprentissage alimenté par l\'IA et des ressources complètes.',
    },
    partnerships: {
      badge: 'Devenir Partenaire d\'ATPS',
      title: 'Soutenir les Écoles d\'Aviation',
      titleHighlight: 'à Travers l\'Innovation',
      subtitle: 'ATPS fournit des outils de préparation ATPL de pointe, des ressources d\'apprentissage complètes et des analyses avancées conçues pour améliorer les taux de réussite des étudiants et rationaliser les programmes de formation.',
      contactPartnership: 'Contacter l\'Équipe Partenariats',
      whyPartner: 'Pourquoi Partenier avec ATPS',
      benefitsTitle: 'Avantages pour les Écoles d\'Aviation',
      benefitsSubtitle: 'Transformez votre programme de formation ATPL avec des ressources complètes et une technologie de pointe',
      platformFeatures: 'Fonctionnalités de la Plateforme',
      platformSubtitle: 'Tout ce dont vous avez besoin pour dispenser une formation ATPL exceptionnelle et suivre le succès des étudiants',
      readyToTransform: 'Prêt à Transformer Votre',
      readyHighlight: 'Programme de Formation ATPL?',
      readyDescription: 'Contactez notre équipe partenariats pour découvrir comment ATPS peut améliorer votre programme de formation aéronautique.',
    },
    heroes: {
      badge: 'Commencez Votre Voyage Aéronautique Aujourd\'hui',
      title: 'Envolez-vous vers la connaissance',
      titleHighlight: 'avec ATPS',
      description: 'ATPS est la plateforme de formation aéronautique la plus performante, conçue pour fournir la préparation ATPL la plus précise, efficace et de haute qualité disponible aujourd\'hui.',
      tryForFree: 'ESSAYEZ GRATUITEMENT',
      joinCommunity: 'Rejoignez Notre Communauté',
      readJournal: 'Lisez le Journal Aéronautique ATPS',
    },
  },
  es: {
    header: {
      home: 'Inicio',
      partnerships: 'Asociaciones',
      blog: 'Blog',
      faqs: 'Preguntas',
      pricing: 'Precios',
      community: 'Comunidad',
      latestNews: 'Últimas Noticias',
      login: 'Iniciar Sesión',
      signUp: 'Registrarse',
    },
    footer: {
      ctaBanner: 'Comienza Tu Viaje Aviatorio',
      ctaTitle: '¿Listo para volar hacia',
      ctaSubtitle: 'el Conocimiento con ATPS?',
      getStarted: 'Comenzar',
      quickLinks: 'Enlaces Rápidos',
      company: 'Empresa',
      allRightsReserved: '© Todos los derechos reservados. ATPS Aviation. Impulsado por la innovación.',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      cookiePolicy: 'Política de Cookies',
      description: 'Domina la aviación sin esfuerzo. Tu plataforma completa de entrenamiento ATPL con aprendizaje impulsado por IA y recursos integrales.',
    },
    partnerships: {
      badge: 'Asociarse con ATPS',
      title: 'Potenciando Escuelas de Aviación',
      titleHighlight: 'a Través de la Innovación',
      subtitle: 'ATPS proporciona herramientas de preparación ATPL de vanguardia, recursos de aprendizaje completos y análisis avanzados diseñados para elevar las tasas de éxito de los estudiantes y optimizar los programas de entrenamiento.',
      contactPartnership: 'Contactar Equipo de Asociaciones',
      whyPartner: 'Por Qué Asociarse con ATPS',
      benefitsTitle: 'Beneficios para Escuelas de Aviación',
      benefitsSubtitle: 'Transforma tu programa de entrenamiento ATPL con recursos completos y tecnología de vanguardia',
      platformFeatures: 'Características de la Plataforma',
      platformSubtitle: 'Todo lo que necesitas para brindar entrenamiento ATPL excepcional y rastrear el éxito de los estudiantes',
      readyToTransform: '¿Listo para Transformar Tu',
      readyHighlight: 'Programa de Entrenamiento ATPL?',
      readyDescription: 'Ponte en contacto con nuestro equipo de asociaciones para descubrir cómo ATPS puede elevar tu programa de entrenamiento de aviación.',
    },
    heroes: {
      badge: 'Comienza Tu Viaje Aviatorio Hoy',
      title: 'Vuela hacia el conocimiento',
      titleHighlight: 'con ATPS',
      description: 'ATPS es la plataforma de entrenamiento de aviación más eficiente, diseñada para brindar la preparación ATPL más precisa, eficiente y de alta calidad disponible hoy.',
      tryForFree: 'PRUÉBALO GRATIS',
      joinCommunity: 'Únete a Nuestra Comunidad',
      readJournal: 'Lee el Diario de Aviación ATPS',
    },
  },
};

