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
    examQuestions: string;
    satisfactionRate: string;
    aiSupport: string;
    cloudBased: string;
    comprehensiveTraining: string;
    comprehensiveTrainingDesc: string;
    realTimeTracking: string;
    realTimeTrackingDesc: string;
    industryValidated: string;
    industryValidatedDesc: string;
    collaborativeLearning: string;
    collaborativeLearningDesc: string;
    performanceAnalytics: string;
    performanceAnalyticsDesc: string;
    aiPoweredAssistance: string;
    aiPoweredAssistanceDesc: string;
    customizableCurriculum: string;
    whiteLabelSolution: string;
    bulkStudentManagement: string;
    instructorDashboard: string;
    automatedReports: string;
    lmsIntegration: string;
    mobileFirstDesign: string;
    multiLanguageSupport: string;
  };
  heroes: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    tryForFree: string;
    joinCommunity: string;
    joinCommunityDesc: string;
    readJournal: string;
    globalNetwork: string;
    globalNetworkDesc: string;
    studyDiscussions: string;
    studyDiscussionsDesc: string;
    industryUpdates: string;
    industryUpdatesDesc: string;
    communityTitle: string;
    communityDescription: string;
    aviationAssistant: string;
    aviationAssistantDesc: string;
    expertCourses: string;
    expertCoursesDesc: string;
    simulator: string;
    simulatorDesc: string;
    verifiedQuestions: string;
    verifiedQuestionsDesc: string;
  };
  slider: {
    whyChooseUs: string;
    whyStudyTitle: string;
    whyStudySubtitle: string;
    whyStudyDescription: string;
    questionsBank: string;
    questionsBankDesc: string;
    courses: string;
    coursesDesc: string;
    ai: string;
    aiDesc: string;
    simulator: string;
    simulatorDesc: string;
    tryItNow: string;
  };
  journal: {
    badge: string;
    title: string;
    subtitle: string;
    hiringUpdates: string;
    hiringUpdatesDesc: string;
    safetyReports: string;
    safetyReportsDesc: string;
    regulatoryUpdates: string;
    regulatoryUpdatesDesc: string;
    sourceExcellence: string;
    sourceDescription: string;
    weeklyUpdates: string;
    update1: string;
    update2: string;
    update3: string;
    latestTrends: string;
    updatedWeekly: string;
    readJournal: string;
  };
  faqs: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    all: string;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    mostPopular: string;
    specialOffer: string;
    save: string;
    billedFor: string;
    month: string;
    months: string;
    confirmTitle: string;
    confirmButton: string;
    processing: string;
    standardOffer: string;
    standardDesc: string;
    premiumOffer: string;
    premiumDesc: string;
    close: string;
    safetyFirst: string;
    safetyFirstDesc: string;
    flexibleSchedule: string;
    flexibleScheduleDesc: string;
    expertInstructors: string;
    expertInstructorsDesc: string;
    comprehensiveMaterial: string;
    comprehensiveMaterialDesc: string;
  };
  partnershipForm: {
    title: string;
    subtitle: string;
    schoolName: string;
    contactPerson: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    studentsNumber: string;
    timeline: string;
    currentTraining: string;
    currentTrainingPlaceholder: string;
    integrationNeeds: string;
    integrationPlaceholder: string;
    additionalInfo: string;
    cancel: string;
    submit: string;
    submitting: string;
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
      examQuestions: 'Exam Questions',
      satisfactionRate: 'Satisfaction Rate',
      aiSupport: 'AI Support',
      cloudBased: 'Cloud Based',
      comprehensiveTraining: 'Comprehensive Training Content',
      comprehensiveTrainingDesc: 'Access to 25,000+ verified exam questions covering all ATPL subjects, ensuring your students are thoroughly prepared for their exams.',
      realTimeTracking: 'Real-Time Progress Tracking',
      realTimeTrackingDesc: 'Monitor student performance, identify knowledge gaps, and adjust teaching strategies with detailed analytics and insights.',
      industryValidated: 'Industry-Validated Questions',
      industryValidatedDesc: 'Questions tagged with "Last Seen in Exam" dates and quality scores help students focus on what matters most for success.',
      collaborativeLearning: 'Collaborative Learning Environment',
      collaborativeLearningDesc: 'Foster peer-to-peer learning with community features, study groups, and expert moderation from aviation professionals.',
      performanceAnalytics: 'Performance Analytics',
      performanceAnalyticsDesc: 'Advanced reporting tools that track student progress, exam readiness, and provide actionable insights for curriculum improvement.',
      aiPoweredAssistance: 'AI-Powered Assistance',
      aiPoweredAssistanceDesc: '24/7 AI support provides instant explanations, personalized study guidance, and helps students master complex aviation concepts.',
      customizableCurriculum: 'Customizable curriculum integration',
      whiteLabelSolution: 'White-label solution for schools',
      bulkStudentManagement: 'Bulk student management',
      instructorDashboard: 'Instructor dashboard and analytics',
      automatedReports: 'Automated progress reports',
      lmsIntegration: 'Integration with existing LMS systems',
      mobileFirstDesign: 'Mobile-first responsive design',
      multiLanguageSupport: 'Multi-language support',
    },
    heroes: {
      badge: 'Start Your Aviation Journey Today',
      title: 'Soar into knowledge',
      titleHighlight: 'with ATPS',
      description: 'ATPS is the most performant aviation training platform, designed to provide the most precise, efficient, and high-quality ATPL preparation available today.',
      tryForFree: 'TRY FOR FREE',
      joinCommunity: 'Join Our Community',
      joinCommunityDesc: 'Connect with fellow aviation enthusiasts and industry experts',
      readJournal: 'Read the ATPS Aviation Journal',
      globalNetwork: 'Global Pilot Network',
      globalNetworkDesc: 'Connect with pilots worldwide. Share insights and grow your network.',
      studyDiscussions: 'Study & Discussions',
      studyDiscussionsDesc: 'Exchange strategies, discuss topics, and boost your learning.',
      industryUpdates: 'Industry Updates',
      industryUpdatesDesc: 'Stay informed on aviation news, trends, and regulations.',
      communityTitle: 'Join the ATPS Aviation Community',
      communityDescription: 'The ATPS community brings together aspiring and professional pilots to exchange knowledge, discuss strategies, and stay informed on industry developments. Join a network designed to support your aviation journey.',
      aviationAssistant: 'Aviation Assistant',
      aviationAssistantDesc: 'Instant support for aviation concepts, question explanations, and study optimization.',
      expertCourses: 'Expert-Led Courses',
      expertCoursesDesc: 'Aviation professionals ensure the highest standard of learning materials.',
      simulator: 'Realistic ATC & Flight Simulator',
      simulatorDesc: 'Train with real-world scenarios and enhance your aviation skills',
      verifiedQuestions: '25,000+ Verified Exam Questions',
      verifiedQuestionsDesc: 'Organized, structured, and continuously updated.',
    },
    slider: {
      whyChooseUs: 'Why Choose Us',
      whyStudyTitle: 'Why Study with ATPS',
      whyStudySubtitle: 'Everything You Need to Pass Your ATPL Exams',
      whyStudyDescription: 'Our platform combines AI-powered learning, comprehensive resources, and real-world insights to give you the best preparation for your aviation career.',
      questionsBank: 'Questions Bank',
      questionsBankDesc: '25,000+ verified real exam questions, updated regularly. With "Last Seen in Exam" questions and a Question Quality Score, it helps you focus on key topics to ace your ATPL exams efficiently.',
      courses: 'Courses',
      coursesDesc: 'Our courses provide expert-designed, structured lessons with detailed explanations to help you master aviation theory and excel in your ATPL exams.',
      ai: 'AI',
      aiDesc: 'The ATPS AI provides instant explanations, personalized study guidance, and real-time support, helping you master aviation concepts and optimize your learning efficiently.',
      simulator: 'Simulator',
      simulatorDesc: 'Enhance your training with the ATPS Simulator, featuring realistic scenarios that build practical skills and reinforce your aviation knowledge for real-world readiness.',
      tryItNow: 'TRY IT NOW',
    },
    journal: {
      badge: 'Aviation Industry Insights',
      title: 'ATPS Aviation Journal',
      subtitle: 'Stay informed with the latest aviation industry news, hiring trends, and safety updates through our comprehensive journal.',
      hiringUpdates: 'Airline Hiring Updates',
      hiringUpdatesDesc: 'Stay ahead in your career planning with the latest recruitment trends and opportunities in aviation.',
      safetyReports: 'Safety Reports & Analysis',
      safetyReportsDesc: 'Comprehensive analysis of aviation incidents and safety recommendations for pilots.',
      regulatoryUpdates: 'Regulatory Updates',
      regulatoryUpdatesDesc: 'Stay compliant with the latest aviation regulations and industry standards.',
      sourceExcellence: 'Your Source for Aviation Excellence',
      sourceDescription: 'Stay informed with the latest aviation industry news, hiring trends, and safety updates through our comprehensive journal.',
      weeklyUpdates: 'Weekly Updates',
      update1: 'Airline Hiring Trends',
      update2: 'Safety Incident Reports',
      update3: 'Regulatory Changes',
      latestTrends: 'Stay Ahead of the Curve',
      updatedWeekly: 'Updated Every Week',
      readJournal: 'Read the ATPS Aviation Journal',
    },
    faqs: {
      badge: 'Support Center',
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about ATPS - Your complete aviation training platform',
      searchPlaceholder: 'Search questions...',
      all: 'All',
    },
    pricing: {
      badge: 'Choose Your Plan',
      title: 'Simple, Transparent Pricing',
      subtitle: 'Select the plan that best fits your ATPL preparation needs',
      mostPopular: 'Most Popular',
      specialOffer: 'SPECIAL OFFER',
      save: 'Save €',
      billedFor: 'billed for',
      month: 'month',
      months: 'months',
      confirmTitle: 'Confirm Your Plan',
      confirmButton: 'Confirm Subscription',
      processing: 'Processing...',
      standardOffer: 'Standard Offer',
      standardDesc: 'Unlimited access to our question bank from a single device—your go-to tool for exam preparation.',
      premiumOffer: 'Premium Offer',
      premiumDesc: 'Full access to our question bank, detailed courses, AI support, and an integrated aviation dictionary for a comprehensive learning experience.',
      close: 'Close',
      safetyFirst: 'Safety First',
      safetyFirstDesc: 'Top-rated safety protocols and modern aircraft fleet',
      flexibleSchedule: 'Flexible Schedule',
      flexibleScheduleDesc: 'Train at your own pace with 24/7 ground school access',
      expertInstructors: 'Expert Instructors',
      expertInstructorsDesc: 'Learn from experienced commercial airline pilots',
      comprehensiveMaterial: 'Comprehensive Material',
      comprehensiveMaterialDesc: 'Access to all study materials and practice tests',
    },
    partnershipForm: {
      title: 'Contact Partnership Team',
      subtitle: 'Fill out the form below and our team will get back to you within 24 hours',
      schoolName: 'School Name *',
      contactPerson: 'Contact Person *',
      email: 'Email Address *',
      phone: 'Phone Number *',
      country: 'Country *',
      city: 'City *',
      studentsNumber: 'Number of Students *',
      timeline: 'Expected Timeline *',
      currentTraining: 'Current Training Setup *',
      currentTrainingPlaceholder: 'Describe your current ATPL training approach',
      integrationNeeds: 'Integration Needs *',
      integrationPlaceholder: 'How would you like to integrate ATPS into your program?',
      additionalInfo: 'Additional Information',
      cancel: 'Cancel',
      submit: 'Submit Request',
      submitting: 'Submitting...',
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
      ctaSubtitle: 'la connaissance ATPS?',
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
      examQuestions: 'Questions d\'Examen',
      satisfactionRate: 'Taux de Satisfaction',
      aiSupport: 'Support IA',
      cloudBased: 'Cloud Based',
      comprehensiveTraining: 'Contenu de Formation Complet',
      comprehensiveTrainingDesc: 'Accès à plus de 25 000 questions d\'examen vérifiées couvrant tous les sujets ATPL, garantissant que vos étudiants sont parfaitement préparés pour leurs examens.',
      realTimeTracking: 'Suivi en Temps Réel',
      realTimeTrackingDesc: 'Surveillez les performances des étudiants, identifiez les lacunes de connaissances et ajustez les stratégies d\'enseignement avec des analyses et des informations détaillées.',
      industryValidated: 'Questions Validées par l\'Industrie',
      industryValidatedDesc: 'Les questions étiquetées avec des dates "Vu Dernièrement à l\'Examen" et des scores de qualité aident les étudiants à se concentrer sur ce qui compte le plus pour réussir.',
      collaborativeLearning: 'Environnement d\'Apprentissage Collaboratif',
      collaborativeLearningDesc: 'Favorisez l\'apprentissage entre pairs avec des fonctionnalités communautaires, des groupes d\'étude et une modération experte par des professionnels de l\'aviation.',
      performanceAnalytics: 'Analyses de Performance',
      performanceAnalyticsDesc: 'Outils de reporting avancés qui suivent les progrès des étudiants, la préparation aux examens et fournissent des informations exploitables pour l\'amélioration du curriculum.',
      aiPoweredAssistance: 'Assistance Alimentée par l\'IA',
      aiPoweredAssistanceDesc: 'Le support IA 24/7 fournit des explications instantanées, des conseils d\'étude personnalisés et aide les étudiants à maîtriser des concepts complexes d\'aviation.',
      customizableCurriculum: 'Intégration du curriculum personnalisable',
      whiteLabelSolution: 'Solution white-label pour les écoles',
      bulkStudentManagement: 'Gestion groupée des étudiants',
      instructorDashboard: 'Tableau de bord et analyses de l\'instructeur',
      automatedReports: 'Rapports de progression automatisés',
      lmsIntegration: 'Intégration avec les systèmes LMS existants',
      mobileFirstDesign: 'Design responsive mobile-first',
      multiLanguageSupport: 'Support multilingue',
    },
    heroes: {
      badge: 'Commencez Votre Voyage Aéronautique Aujourd\'hui',
      title: 'Envolez-vous vers',
      titleHighlight: 'la connaissance ATPS',
      description: 'ATPS est la plateforme de formation aéronautique la plus performante, conçue pour fournir la préparation ATPL la plus précise, efficace et de haute qualité disponible aujourd\'hui.',
      tryForFree: 'ESSAYEZ GRATUITEMENT',
      joinCommunity: 'Rejoignez Notre Communauté',
      joinCommunityDesc: 'Connectez-vous avec d\'autres passionnés d\'aviation et des experts de l\'industrie',
      readJournal: 'Lisez le Journal Aéronautique ATPS',
      globalNetwork: 'Réseau Mondial de Pilotes',
      globalNetworkDesc: 'Connectez-vous avec des pilotes du monde entier. Partagez des idées et développez votre réseau.',
      studyDiscussions: 'Études & Discussions',
      studyDiscussionsDesc: 'Échangez des stratégies, discutez de sujets et stimulez votre apprentissage.',
      industryUpdates: 'Actualités de l\'Industrie',
      industryUpdatesDesc: 'Restez informé des actualités aéronautiques, des tendances et des réglementations.',
      communityTitle: 'Rejoignez la Communauté Aéronautique ATPS',
      communityDescription: 'La communauté ATPS rassemble des pilotes en devenir et des professionnels pour échanger des connaissances, discuter de stratégies et rester informés des développements de l\'industrie. Rejoignez un réseau conçu pour soutenir votre parcours aéronautique.',
      aviationAssistant: 'Assistant Aéronautique',
      aviationAssistantDesc: 'Support instantané pour les concepts aéronautiques, explications de questions et optimisation de l\'étude.',
      expertCourses: 'Cours Dirigés par des Experts',
      expertCoursesDesc: 'Les professionnels de l\'aviation garantissent la meilleure qualité de matériel pédagogique.',
      simulator: 'Simulateur ATC & Vol Réaliste',
      simulatorDesc: 'Entraînez-vous avec des scénarios du monde réel et améliorez vos compétences aéronautiques',
      verifiedQuestions: '25 000+ Questions d\'Examen Vérifiées',
      verifiedQuestionsDesc: 'Organisées, structurées et continuellement mises à jour.',
    },
    slider: {
      whyChooseUs: 'Pourquoi Nous Choisir',
      whyStudyTitle: 'Pourquoi Étudier avec ATPS',
      whyStudySubtitle: 'Tout Ce Dont Vous Avez Besoin pour Réussir Vos Examens ATPL',
      whyStudyDescription: 'Notre plateforme combine l\'apprentissage alimenté par l\'IA, des ressources complètes et des informations du monde réel pour vous donner la meilleure préparation à votre carrière aéronautique.',
      questionsBank: 'Banque de Questions',
      questionsBankDesc: 'Plus de 25 000 questions d\'examen vérifiées, mises à jour régulièrement. Avec des questions "Vu Dernièrement à l\'Examen" et un Score de Qualité des Questions, cela vous aide à vous concentrer sur les sujets clés pour réussir efficacement vos examens ATPL.',
      courses: 'Cours',
      coursesDesc: 'Nos cours fournissent des leçons structurées créées par des experts avec des explications détaillées pour vous aider à maîtriser la théorie aéronautique et exceller dans vos examens ATPL.',
      ai: 'IA',
      aiDesc: 'L\'IA ATPS fournit des explications instantanées, des conseils d\'étude personnalisés et un support en temps réel, vous aidant à maîtriser les concepts aéronautiques et à optimiser votre apprentissage efficacement.',
      simulator: 'Simulateur',
      simulatorDesc: 'Améliorez votre formation avec le Simulateur ATPS, avec des scénarios réalistes qui développent des compétences pratiques et renforcent vos connaissances aéronautiques pour une préparation au monde réel.',
      tryItNow: 'ESSAYEZ MAINTENANT',
    },
    journal: {
      badge: 'Informations sur l\'Industrie Aéronautique',
      title: 'Journal Aéronautique ATPS',
      subtitle: 'Restez informé des dernières actualités de l\'industrie aéronautique, des tendances d\'embauche et des mises à jour de sécurité grâce à notre journal complet.',
      hiringUpdates: 'Mises à Jour d\'Embauche des Compagnies Aériennes',
      hiringUpdatesDesc: 'Restez en avance dans votre planification de carrière avec les dernières tendances de recrutement et opportunités dans l\'aviation.',
      safetyReports: 'Rapports et Analyses de Sécurité',
      safetyReportsDesc: 'Analyse complète des incidents aéronautiques et recommandations de sécurité pour les pilotes.',
      regulatoryUpdates: 'Mises à Jour Réglementaires',
      regulatoryUpdatesDesc: 'Restez conforme aux dernières réglementations aéronautiques et normes de l\'industrie.',
      sourceExcellence: 'Votre Source d\'Excellence Aéronautique',
      sourceDescription: 'Restez informé des dernières actualités de l\'industrie aéronautique, des tendances d\'embauche et des mises à jour de sécurité grâce à notre journal complet.',
      weeklyUpdates: 'Mises à Jour Hebdomadaires',
      update1: 'Tendances d\'Embauche des Compagnies Aériennes',
      update2: 'Rapports d\'Incidents de Sécurité',
      update3: 'Changements Réglementaires',
      latestTrends: 'Restez en Avance sur la Courbe',
      updatedWeekly: 'Mis à Jour Chaque Semaine',
      readJournal: 'Lisez le Journal Aéronautique ATPS',
    },
    faqs: {
      badge: 'Centre de Support',
      title: 'Questions Fréquemment Posées',
      subtitle: 'Trouvez des réponses aux questions courantes sur ATPS - Votre plateforme complète de formation aéronautique',
      searchPlaceholder: 'Rechercher des questions...',
      all: 'Tous',
    },
    pricing: {
      badge: 'Choisissez Votre Plan',
      title: 'Tarification Simple et Transparente',
      subtitle: 'Sélectionnez le plan qui correspond le mieux à vos besoins de préparation ATPL',
      mostPopular: 'Le Plus Populaire',
      specialOffer: 'OFFRE SPÉCIALE',
      save: 'Économiser ',
      billedFor: 'facturé pour',
      month: 'mois',
      months: 'mois',
      confirmTitle: 'Confirmez Votre Plan',
      confirmButton: 'Confirmer l\'Abonnement',
      processing: 'Traitement en cours...',
      standardOffer: 'Offre Standard',
      standardDesc: 'Accès illimité à notre banque de questions depuis un seul appareil—votre outil incontournable pour la préparation aux examens.',
      premiumOffer: 'Offre Premium',
      premiumDesc: 'Accès complet à notre banque de questions, cours détaillés, support IA et dictionnaire aéronautique intégré pour une expérience d\'apprentissage complète.',
      close: 'Fermer',
      safetyFirst: 'Sécurité d\'Abord',
      safetyFirstDesc: 'Protocoles de sécurité de premier plan et flotte d\'aéronefs moderne',
      flexibleSchedule: 'Horaires Flexibles',
      flexibleScheduleDesc: 'Entraînez-vous à votre rythme avec un accès 24/7 à l\'école au sol',
      expertInstructors: 'Instructeurs Experts',
      expertInstructorsDesc: 'Apprenez auprès de pilotes expérimentés de compagnies aériennes commerciales',
      comprehensiveMaterial: 'Matériel Complet',
      comprehensiveMaterialDesc: 'Accès à tous les matériels d\'étude et tests pratiques',
    },
    partnershipForm: {
      title: 'Contacter l\'Équipe Partenariats',
      subtitle: 'Remplissez le formulaire ci-dessous et notre équipe vous répondra sous 24 heures',
      schoolName: 'Nom de l\'École *',
      contactPerson: 'Personne de Contact *',
      email: 'Adresse E-mail *',
      phone: 'Numéro de Téléphone *',
      country: 'Pays *',
      city: 'Ville *',
      studentsNumber: 'Nombre d\'Étudiants *',
      timeline: 'Délai Attendu *',
      currentTraining: 'Configuration de Formation Actuelle *',
      currentTrainingPlaceholder: 'Décrivez votre approche actuelle de formation ATPL',
      integrationNeeds: 'Besoins d\'Intégration *',
      integrationPlaceholder: 'Comment souhaitez-vous intégrer ATPS dans votre programme?',
      additionalInfo: 'Informations Supplémentaires',
      cancel: 'Annuler',
      submit: 'Envoyer la Demande',
      submitting: 'Envoi en cours...',
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
      examQuestions: 'Preguntas de Examen',
      satisfactionRate: 'Tasa de Satisfacción',
      aiSupport: 'Soporte IA',
      cloudBased: 'Basado en la Nube',
      comprehensiveTraining: 'Contenido de Entrenamiento Integral',
      comprehensiveTrainingDesc: 'Acceso a más de 25,000 preguntas de examen verificadas que cubren todos los temas ATPL, garantizando que tus estudiantes estén completamente preparados para sus exámenes.',
      realTimeTracking: 'Seguimiento de Progreso en Tiempo Real',
      realTimeTrackingDesc: 'Monitorea el rendimiento de los estudiantes, identifica brechas de conocimiento y ajusta las estrategias de enseñanza con análisis detallados e información.',
      industryValidated: 'Preguntas Validadas por la Industria',
      industryValidatedDesc: 'Las preguntas etiquetadas con fechas "Visto Últimamente en Examen" y puntajes de calidad ayudan a los estudiantes a enfocarse en lo que más importa para el éxito.',
      collaborativeLearning: 'Entorno de Aprendizaje Colaborativo',
      collaborativeLearningDesc: 'Fomenta el aprendizaje entre pares con funciones de comunidad, grupos de estudio y moderación experta por parte de profesionales de la aviación.',
      performanceAnalytics: 'Análisis de Rendimiento',
      performanceAnalyticsDesc: 'Herramientas de informes avanzadas que rastrean el progreso de los estudiantes, la preparación para exámenes y proporcionan información accionable para la mejora del currículo.',
      aiPoweredAssistance: 'Asistencia Impulsada por IA',
      aiPoweredAssistanceDesc: 'El soporte IA 24/7 proporciona explicaciones instantáneas, orientación de estudio personalizada y ayuda a los estudiantes a dominar conceptos complejos de aviación.',
      customizableCurriculum: 'Integración de currículo personalizable',
      whiteLabelSolution: 'Solución de marca blanca para escuelas',
      bulkStudentManagement: 'Gestión masiva de estudiantes',
      instructorDashboard: 'Tablero e informes del instructor',
      automatedReports: 'Informes de progreso automatizados',
      lmsIntegration: 'Integración con sistemas LMS existentes',
      mobileFirstDesign: 'Diseño responsive móvil primero',
      multiLanguageSupport: 'Soporte multilingüe',
    },
    heroes: {
      badge: 'Comienza Tu Viaje Aviatorio Hoy',
      title: 'Vuela hacia el conocimiento',
      titleHighlight: 'con ATPS',
      description: 'ATPS es la plataforma de entrenamiento de aviación más eficiente, diseñada para brindar la preparación ATPL más precisa, eficiente y de alta calidad disponible hoy.',
      tryForFree: 'PRUÉBALO GRATIS',
      joinCommunity: 'Únete a Nuestra Comunidad',
      joinCommunityDesc: 'Conéctate con otros entusiastas de la aviación y expertos de la industria',
      readJournal: 'Lee el Diario de Aviación ATPS',
      globalNetwork: 'Red Global de Pilotos',
      globalNetworkDesc: 'Conéctate con pilotos de todo el mundo. Comparte ideas y haz crecer tu red.',
      studyDiscussions: 'Estudio y Discusiones',
      studyDiscussionsDesc: 'Intercambia estrategias, discute temas y potencia tu aprendizaje.',
      industryUpdates: 'Actualizaciones de la Industria',
      industryUpdatesDesc: 'Mantente informado sobre noticias, tendencias y regulaciones de aviación.',
      communityTitle: 'Únete a la Comunidad de Aviación ATPS',
      communityDescription: 'La comunidad ATPS reúne a pilotos aspirantes y profesionales para intercambiar conocimientos, discutir estrategias y mantenerse informados sobre los desarrollos de la industria. Únete a una red diseñada para apoyar tu viaje de aviación.',
      aviationAssistant: 'Asistente de Aviación',
      aviationAssistantDesc: 'Soporte instantáneo para conceptos de aviación, explicaciones de preguntas y optimización del estudio.',
      expertCourses: 'Cursos Dirigidos por Expertos',
      expertCoursesDesc: 'Los profesionales de aviación garantizan el más alto estándar de materiales de aprendizaje.',
      simulator: 'Simulador de ATC y Vuelo Realista',
      simulatorDesc: 'Entrena con escenarios del mundo real y mejora tus habilidades de aviación',
      verifiedQuestions: '25,000+ Preguntas de Examen Verificadas',
      verifiedQuestionsDesc: 'Organizadas, estructuradas y actualizadas continuamente.',
    },
    slider: {
      whyChooseUs: 'Por Qué Elegirnos',
      whyStudyTitle: 'Por Qué Estudiar con ATPS',
      whyStudySubtitle: 'Todo Lo Que Necesitas para Aprobar Tus Exámenes ATPL',
      whyStudyDescription: 'Nuestra plataforma combina aprendizaje impulsado por IA, recursos completos e ideas del mundo real para darte la mejor preparación para tu carrera en aviación.',
      questionsBank: 'Banco de Preguntas',
      questionsBankDesc: 'Más de 25,000 preguntas de examen verificadas, actualizadas regularmente. Con preguntas "Visto Últimamente en Examen" y un Puntaje de Calidad de Preguntas, te ayuda a enfocarte en temas clave para aprobar eficientemente tus exámenes ATPL.',
      courses: 'Cursos',
      coursesDesc: 'Nuestros cursos proporcionan lecciones estructuradas diseñadas por expertos con explicaciones detalladas para ayudarte a dominar la teoría de aviación y sobresalir en tus exámenes ATPL.',
      ai: 'IA',
      aiDesc: 'La IA de ATPS proporciona explicaciones instantáneas, orientación de estudio personalizada y soporte en tiempo real, ayudándote a dominar conceptos de aviación y optimizar tu aprendizaje eficientemente.',
      simulator: 'Simulador',
      simulatorDesc: 'Mejora tu entrenamiento con el Simulador ATPS, con escenarios realistas que desarrollan habilidades prácticas y refuerzan tu conocimiento de aviación para estar listo para el mundo real.',
      tryItNow: 'PRUÉBALO AHORA',
    },
    journal: {
      badge: 'Información de la Industria de Aviación',
      title: 'Diario de Aviación ATPS',
      subtitle: 'Mantente informado con las últimas noticias de la industria de aviación, tendencias de contratación y actualizaciones de seguridad a través de nuestro diario completo.',
      hiringUpdates: 'Actualizaciones de Contratación de Aerolíneas',
      hiringUpdatesDesc: 'Mantente adelante en tu planificación de carrera con las últimas tendencias de reclutamiento y oportunidades en aviación.',
      safetyReports: 'Informes y Análisis de Seguridad',
      safetyReportsDesc: 'Análisis integral de incidentes de aviación y recomendaciones de seguridad para pilotos.',
      regulatoryUpdates: 'Actualizaciones Regulatorias',
      regulatoryUpdatesDesc: 'Mantente cumpliendo con las últimas regulaciones de aviación y estándares de la industria.',
      sourceExcellence: 'Tu Fuente de Excelencia en Aviación',
      sourceDescription: 'Mantente informado con las últimas noticias de la industria de aviación, tendencias de contratación y actualizaciones de seguridad a través de nuestro diario completo.',
      weeklyUpdates: 'Actualizaciones Semanales',
      update1: 'Tendencias de Contratación de Aerolíneas',
      update2: 'Informes de Incidentes de Seguridad',
      update3: 'Cambios Regulatorios',
      latestTrends: 'Mantente Adelante de la Curva',
      updatedWeekly: 'Actualizado Cada Semana',
      readJournal: 'Lee el Diario de Aviación ATPS',
    },
    faqs: {
      badge: 'Centro de Soporte',
      title: 'Preguntas Frecuentes',
      subtitle: 'Encuentra respuestas a preguntas comunes sobre ATPS - Tu plataforma completa de entrenamiento de aviación',
      searchPlaceholder: 'Buscar preguntas...',
      all: 'Todos',
    },
    pricing: {
      badge: 'Elige Tu Plan',
      title: 'Precios Simples y Transparentes',
      subtitle: 'Selecciona el plan que mejor se adapte a tus necesidades de preparación ATPL',
      mostPopular: 'Más Popular',
      specialOffer: 'OFERTA ESPECIAL',
      save: 'Ahorrar ',
      billedFor: 'facturado por',
      month: 'mes',
      months: 'meses',
      confirmTitle: 'Confirma Tu Plan',
      confirmButton: 'Confirmar Suscripción',
      processing: 'Procesando...',
      standardOffer: 'Oferta Estándar',
      standardDesc: 'Acceso ilimitado a nuestro banco de preguntas desde un solo dispositivo—tu herramienta ideal para la preparación de exámenes.',
      premiumOffer: 'Oferta Premium',
      premiumDesc: 'Acceso completo a nuestro banco de preguntas, cursos detallados, soporte de IA y diccionario de aviación integrado para una experiencia de aprendizaje completa.',
      close: 'Cerrar',
      safetyFirst: 'Seguridad Primero',
      safetyFirstDesc: 'Protocolos de seguridad de primer nivel y flota de aviones moderna',
      flexibleSchedule: 'Horario Flexible',
      flexibleScheduleDesc: 'Entrena a tu ritmo con acceso 24/7 a la escuela terrestre',
      expertInstructors: 'Instructores Expertos',
      expertInstructorsDesc: 'Aprende de pilotos experimentados de aerolíneas comerciales',
      comprehensiveMaterial: 'Material Integral',
      comprehensiveMaterialDesc: 'Acceso a todos los materiales de estudio y exámenes de práctica',
    },
    partnershipForm: {
      title: 'Contactar Equipo de Asociaciones',
      subtitle: 'Completa el formulario a continuación y nuestro equipo se pondrá en contacto contigo en 24 horas',
      schoolName: 'Nombre de la Escuela *',
      contactPerson: 'Persona de Contacto *',
      email: 'Dirección de Correo Electrónico *',
      phone: 'Número de Teléfono *',
      country: 'País *',
      city: 'Ciudad *',
      studentsNumber: 'Número de Estudiantes *',
      timeline: 'Cronograma Esperado *',
      currentTraining: 'Configuración de Entrenamiento Actual *',
      currentTrainingPlaceholder: 'Describe tu enfoque actual de entrenamiento ATPL',
      integrationNeeds: 'Necesidades de Integración *',
      integrationPlaceholder: '¿Cómo te gustaría integrar ATPS en tu programa?',
      additionalInfo: 'Información Adicional',
      cancel: 'Cancelar',
      submit: 'Enviar Solicitud',
      submitting: 'Enviando...',
    },
  },
};

