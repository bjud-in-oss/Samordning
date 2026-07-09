// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

export type UiLanguage = "sv" | "en" | "es" | "sw" | "vi";

export interface TranslationDict {
  gatewayTitle: string;
  gatewaySubtitle: string;
  gatewayPrompt: string;
  
  // OnboardingForm
  onboardingHeader: string;
  onboardingSubtitle: string;
  onboardingIntro: string;
  step1Title: string;
  step1Subtitle: string;
  
  // New Step 2 (Organizations & Language selection)
  step2Title: string;
  step2Subtitle: string;
  step2OrgHeader: string;
  step2OrgText: string;
  orgChoiceLabel: string;
  orgBror: string;
  orgSyster: string;
  step2LangHeader: string;
  step2LangSubtitle: string;

  // Step 3 (How to participate)
  step3Title: string;
  step3Subtitle: string;
  formatPhysicalTitle: string;
  formatPhysicalDesc: string;
  formatDigitalTitle: string;
  formatDigitalDesc: string;
  
  // Step 4 & 5 (Customize notifications)
  step4Title: string;
  step4Subtitle: string;
  notifyOptionTitle: string;
  notifyOptionDesc: string;
  spiritualOptionTitle: string;
  spiritualOptionDesc: string;
  
  iosTipHeader: string;
  iosTipBody: string;
  pushHeader: string;
  pushSubtitle: string;
  pushBtnActive: string;
  pushBtnInactive: string;
  saveBtn: string;
  saveFeedback: string;

  // AlertDetail
  alertDetailTitle: string;
  loadingInfo: string;
  successTitle: string;
  successDeliveredTitle: string;
  successDeliveredDesc: string;
  successClosedTitle: string;
  successClosedDesc: string;
  inactiveTitle: string;
  inactiveDesc: string;
  backToHome: string;
  backBtn: string;
  activeRequest: string;
  approxLocation: string;
  timeLabel: string;
  participantsLabel: string;
  languageLabel: string;
  privacyNotice: string;
  respondTitle: string;
  respondSubtitle: string;
  quickReply1: string;
  quickReply2: string;
  quickReply3: string;
  quickReply4: string;
  messageLabel: string;
  messagePlaceholder: string;
  sendResponseBtn: string;
  sendingText: string;
  footerNotice: string;
}

export const TRANSLATIONS: Record<UiLanguage, TranslationDict> = {
  sv: {
    gatewayTitle: "Älska, dela och bjud in",
    gatewaySubtitle: "Varmt och anonymt församlingsstöd i Göteborg",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Anmälan som stödmedlem",
    onboardingSubtitle: "Ett varmt, helt anonymt sätt att hjälpa våra unga missionärer.",
    onboardingIntro: "Välkommen till vår trygga och enkla samordningstjänst. Genom att fylla i dina val underlättar du för våra missionärer att snabbt hitta en vuxen stödmedlem. Du får en mjuk avisering (notis) i din telefon eller dator så fort en förfrågan skapas i något av dina valda områden.",
    step1Title: "Steg 1 av 5: Välj områden där du kan hjälpa till",
    step1Subtitle: "Klicka på de områden i Göteborg där du har möjlighet att stötta. Sorterat geografiskt från norr till söder.",
    
    step2Title: "Steg 2 av 5: Samarbete & Språkstöd",
    step2Subtitle: "Våra organisationer samarbetar för att stötta missionärerna på deras modersmål.",
    step2OrgHeader: "Samarbetande Organisationer",
    step2OrgText: "Missionshjälpen samordnar behov i Göteborg genom ett nära samarbete med Hjälpföreningen (kyrkans kvinnoorganisation) och Äldstekvorumet (kyrkans herrorganisation) för att säkerställa att missionärerna alltid har en pålitlig, vuxen stödmedlem med sig.",
    orgChoiceLabel: "Min organisation (välj en):",
    orgBror: "Äldstekvorum (Broder)",
    orgSyster: "Hjälpförening (Syster)",
    step2LangHeader: "Språk jag kan hjälpa till med",
    step2LangSubtitle: "Klicka på de språk du talar och kan tänka dig att stötta på under möten (du kan välja flera).",

    step3Title: "Steg 3 av 5: Hur vill du delta?",
    step3Subtitle: "Välj de format som passar din livssituation bäst.",
    formatPhysicalTitle: "Fysiskt på plats",
    formatPhysicalDesc: "Jag deltar gärna i mötet på plats (t.ex. hemma hos någon, i kyrkan eller på ett kafé).",
    formatDigitalTitle: "Via telefon / video",
    formatDigitalDesc: "Jag deltar gärna via telefon eller videosamtal på Zoom eller WhatsApp.",
    
    step4Title: "Steg 4 & 5 av 5: Anpassa dina aviseringar",
    step4Subtitle: "Finjustera hur och när du vill bli meddelad.",
    notifyOptionTitle: "Skicka aviseringar direkt till min enhet",
    notifyOptionDesc: "Du får ett vänligt meddelande när ett missionsbehov uppstår i dina valda områden. Du avgör helt i stunden om du har möjlighet att delta eller ej.",
    spiritualOptionTitle: "Prenumerera på veckovisa andliga tankar",
    spiritualOptionDesc: "Få en kort, upplyftande tanke skickad som en tyst notis en gång i veckan.",
    
    iosTipHeader: "Viktigt tips för iPhone/iOS-användare:",
    iosTipBody: "Denna tjänst fungerar bäst i din mobiltelefon. Om du använder en iPhone måste du först trycka på Dela-knappen (fyrkanten med en pil uppåt) i webbläsaren och välja \"Lägg till på hemskärmen\". Öppna sedan appen från din hemskärm för att kunna aktivera aviseringarna.",
    pushHeader: "Slå på aviseringar",
    pushSubtitle: "För att kunna ta emot förfrågningar i samma sekund som de skapas behöver du godkänna aviseringar.",
    pushBtnActive: "✓ Notiser aktiverade",
    pushBtnInactive: "Aktivera aviseringar",
    saveBtn: "Spara inställningar",
    saveFeedback: "Dina inställningar sparades tryggt och anonymt!",
    alertDetailTitle: "Missionsbehov i",
    loadingInfo: "Hämtar information om förfrågan...",
    successTitle: "Ditt svar har skickats!",
    successDeliveredTitle: "1. Svaret har levererats:",
    successDeliveredDesc: "Ditt meddelande har vidarebefordrats helt anonymt till rätt missionärspar.",
    successClosedTitle: "2. Förfrågan har stängts:",
    successClosedDesc: "För allas trygghet har detta behov och tillhörande data raderats permanent. Inga spår eller personuppgifter lagras i systemet.",
    inactiveTitle: "Förfrågan har redan besvarats",
    inactiveDesc: "Denna förfrågan är inte längre tillgänglig. Antingen har en annan stödmedlem redan tackat ja och tagit sig an mötet (vilket stänger och raderar förfrågan direkt), eller så har tiden för mötet redan passerat.",
    backToHome: "Tillbaka till startsidan",
    backBtn: "Tillbaka",
    activeRequest: "Aktiv förfrågan",
    approxLocation: "Plats (Ungefärlig)",
    timeLabel: "Tidpunkt",
    participantsLabel: "Deltagare",
    languageLabel: "Språk",
    privacyNotice: "För allas trygghet och integritet: Tjänsten visar endast den ungefärliga mötesplatsen och det allmänna grannskapet, inte exakta adresser. Det ger tillräcklig information för att du ska veta om du kan delta, samtidigt som medlemmens integritet värnas till fullo.",
    respondTitle: "Besvara förfrågan",
    respondSubtitle: "Skriv ett kort svar eller välj ett av de färdiga alternativen nedan.",
    quickReply1: "Jag kan vara med!",
    quickReply2: "Jag deltar gärna via video/telefon.",
    quickReply3: "Min man/fru/vän följer också med!",
    quickReply4: "Jag möter upp er vid angiven tid.",
    messageLabel: "Ditt meddelande till missionärerna",
    messagePlaceholder: "Skriv svar här...",
    sendResponseBtn: "Skicka svar och hjälp till",
    sendingText: "Skickar...",
    footerNotice: "Ditt svar skickas helt anonymt och säkert vidare till missionärerna. För att skydda allas integritet raderas denna förfrågan permanent från vårt tillfälliga minne så snart du klickat på skicka."
  },
  en: {
    gatewayTitle: "Love, share, invite",
    gatewaySubtitle: "Warm and anonymous parish support in Gothenburg",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Register as a Support Member",
    onboardingSubtitle: "A warm, completely anonymous way to assist our young missionaries.",
    onboardingIntro: "Welcome to our secure coordination service. By completing this form, you make it easy for our missionaries to quickly find an adult support member. You will receive a gentle notification on your device as soon as a request is created in your selected areas.",
    step1Title: "Step 1 of 5: Select areas where you can help",
    step1Subtitle: "Click on the areas in Gothenburg where you are able to support. Sorted geographically from north to south.",
    
    step2Title: "Step 2 of 5: Collaboration & Language Support",
    step2Subtitle: "Our organizations work together to support the missionaries in their native languages.",
    step2OrgHeader: "Collaborating Organizations",
    step2OrgText: "The Missionary Support service coordinates needs in Gothenburg through close cooperation with the Relief Society (the church's women's organization) and the Elders Quorum (the church's men's organization) to ensure that missionaries always have a reliable, adult support member with them.",
    orgChoiceLabel: "My organization (select one):",
    orgBror: "Elders Quorum (Brother)",
    orgSyster: "Relief Society (Sister)",
    step2LangHeader: "Languages I can help with",
    step2LangSubtitle: "Click on the languages you speak and are willing to support in during meetings (you can select multiple).",

    step3Title: "Step 3 of 5: How would you like to participate?",
    step3Subtitle: "Choose the formats that best fit your lifestyle.",
    formatPhysicalTitle: "In-person",
    formatPhysicalDesc: "I would love to participate in the meeting on-site (e.g. at someone's home, at church, or at a café).",
    formatDigitalTitle: "Via phone / video",
    formatDigitalDesc: "I am happy to participate remotely via phone, Zoom, or WhatsApp video call.",
    
    step4Title: "Step 4 & 5 of 5: Customize your notifications",
    step4Subtitle: "Fine-tune how and when you want to be notified.",
    notifyOptionTitle: "Send notifications directly to my device",
    notifyOptionDesc: "You will receive a friendly message when a missionary need arises in your selected areas. You decide in the moment whether you are able to help.",
    spiritualOptionTitle: "Subscribe to weekly spiritual thoughts",
    spiritualOptionDesc: "Receive a short, uplifting thought sent as a silent notification once a week.",
    
    iosTipHeader: "Important tip for iPhone/iOS users:",
    iosTipBody: "This service works best on your mobile phone. If you are using an iPhone, you must first tap the Share button (square with an upward arrow) in your browser and choose \"Add to Home Screen\". Then, open the app from your home screen to activate notifications.",
    pushHeader: "Turn on notifications",
    pushSubtitle: "To receive requests the very second they are created, you need to approve notifications.",
    pushBtnActive: "✓ Notifications enabled",
    pushBtnInactive: "Enable notifications",
    saveBtn: "Save settings",
    saveFeedback: "Your settings have been saved safely and anonymously!",
    alertDetailTitle: "Missionary Need in",
    loadingInfo: "Fetching request details...",
    successTitle: "Your response has been sent!",
    successDeliveredTitle: "1. Response delivered:",
    successDeliveredDesc: "Your message has been forwarded completely anonymously to the missionary pair.",
    successClosedTitle: "2. Request closed:",
    successClosedDesc: "For everyone's safety, this request and all associated data have been permanently deleted. No traces or personal data are stored in the system.",
    inactiveTitle: "Request already resolved",
    inactiveDesc: "This request is no longer available. Either another support member has already accepted the request (which closes and deletes the request immediately), or the time for the meeting has already passed.",
    backToHome: "Back to home",
    backBtn: "Back",
    activeRequest: "Active Request",
    approxLocation: "Location (Approximate)",
    timeLabel: "Time",
    participantsLabel: "Participants",
    languageLabel: "Language",
    privacyNotice: "For everyone's safety and privacy: The service only shows the approximate meeting location and general neighborhood, not exact addresses. This provides enough information for you to know if you can assist, while fully protecting the member's privacy.",
    respondTitle: "Respond to Request",
    respondSubtitle: "Write a short message or select one of the quick options below.",
    quickReply1: "I can join you!",
    quickReply2: "I'd love to join via video/phone.",
    quickReply3: "My spouse/friend is also joining!",
    quickReply4: "I will meet you at the specified time.",
    messageLabel: "Your message to the missionaries",
    messagePlaceholder: "Write reply here...",
    sendResponseBtn: "Send reply and assist",
    sendingText: "Sending...",
    footerNotice: "Your response is sent completely anonymously and securely to the missionaries. To protect everyone's privacy, this request is permanently deleted from our temporary memory as soon as you click send."
  },
  es: {
    gatewayTitle: "Amar, compartir, invitar",
    gatewaySubtitle: "Apoyo parroquial cálido y anónimo en Gotemburgo",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Registrarse como Miembro de Apoyo",
    onboardingSubtitle: "Una forma cálida y completamente anónima de ayudar a nuestros jóvenes misioneros.",
    onboardingIntro: "Bienvenido a nuestro servicio de coordinación seguro. Al completar este formulario, facilita que nuestros misioneros encuentren rápidamente un miembro de apoyo adulto. Recibirá una notificación amigable en su dispositivo tan pronto como se cree una solicitud en sus áreas seleccionadas.",
    step1Title: "Paso 1 de 5: Seleccione áreas donde pueda ayudar",
    step1Subtitle: "Haga clic en las áreas de Gotemburgo en las que pueda brindar apoyo. Ordenadas geográficamente de norte a sur.",
    
    step2Title: "Paso 2 de 5: Colaboración y Soporte de Idiomas",
    step2Subtitle: "Nuestras organizaciones trabajan juntas para apoyar a los misioneros en sus idiomas nativos.",
    step2OrgHeader: "Organizaciones Colaboradoras",
    step2OrgText: "La iniciativa \"Amar, compartir, invitar\" coordina las necesidades en Gotemburgo mediante una estrecha cooperación con la Sociedad de Socorro (la organización de mujeres de la iglesia) y el Quórum de Élderes (la organización de hombres de la iglesia) para garantizar que los misioneros siempre tengan un miembro de apoyo adulto confiable con ellos.",
    orgChoiceLabel: "Mi organización (seleccione una):",
    orgBror: "Quórum de Élderes (Hermano)",
    orgSyster: "Sociedad de Socorro (Hermana)",
    step2LangHeader: "Idiomas con los que puedo ayudar",
    step2LangSubtitle: "Haga clic en los idiomas que habla y está dispuesto a apoyar durante las reuniones (puede seleccionar varios).",

    step3Title: "Paso 3 de 5: ¿Cómo le gustaría participar?",
    step3Subtitle: "Elija los formatos que mejor se adapten a su estilo de vida.",
    formatPhysicalTitle: "En persona",
    formatPhysicalDesc: "Me encantaría participar en la reunión en el lugar (p. ej., en la casa de alguien, en la iglesia o en un café).",
    formatDigitalTitle: "Por teléfono / video",
    formatDigitalDesc: "Con gusto participo de forma remota por teléfono, Zoom o videollamada de WhatsApp.",
    
    step4Title: "Paso 4 y 5 de 5: Personaliza tus notificaciones",
    step4Subtitle: "Ajuste cómo y cuándo desea ser notificado.",
    notifyOptionTitle: "Enviar notificaciones directamente a mi dispositivo",
    notifyOptionDesc: "Recibirá un mensaje amistoso cuando surja una necesidad misionera en sus áreas seleccionadas. Usted decide en el momento si puede ayudar.",
    spiritualOptionTitle: "Suscribirse a pensamientos espirituales semanales",
    spiritualOptionDesc: "Reciba un pensamiento corto e inspirador enviado como notificación silenciosa una vez a la semana.",
    
    iosTipHeader: "Consejo importante para usuarios de iPhone/iOS:",
    iosTipBody: "Este servicio funciona mejor en su teléfono móvil. Si usa un iPhone, primero debe tocar el botón Compartir (el cuadrado con una flecha hacia arriba) en su navegador y elegir \"Agregar a la pantalla de inicio\". Luego, abra la aplicación desde su pantalla de inicio para activar las notificaciones.",
    pushHeader: "Activar notificaciones",
    pushSubtitle: "Para recibir solicitudes en el mismo segundo en que se crean, debe aprobar las notificaciones.",
    pushBtnActive: "✓ Notificaciones activadas",
    pushBtnInactive: "Activar notificaciones",
    saveBtn: "Guardar configuración",
    saveFeedback: "¡Su configuración se ha guardado de forma segura y anónima!",
    alertDetailTitle: "Necesidad Misionera en",
    loadingInfo: "Obteniendo detalles de la solicitud...",
    successTitle: "¡Su respuesta ha sido enviada!",
    successDeliveredTitle: "1. Respuesta entregada:",
    successDeliveredDesc: "Su mensaje ha sido enviado de forma completamente anónima a la pareja de misioneros.",
    successClosedTitle: "2. Solicitud cerrada:",
    successClosedDesc: "Para la seguridad de todos, esta solicitud y todos los datos asociados han sido eliminados permanentemente. No se almacenan rastros ni datos personales en el sistema.",
    inactiveTitle: "Solicitud ya resuelta",
    inactiveDesc: "Esta solicitud ya no está disponible. O bien otro miembro de apoyo ya ha aceptado la solicitud (lo que cierra y elimina la solicitud de inmediato), o el tiempo para la reunión ya ha pasado.",
    backToHome: "Volver al inicio",
    backBtn: "Atrás",
    activeRequest: "Solicitud Activa",
    approxLocation: "Ubicación (Aproximada)",
    timeLabel: "Hora",
    participantsLabel: "Participantes",
    languageLabel: "Idioma",
    privacyNotice: "Para la seguridad y privacidad de todos: El servicio solo muestra la ubicación aproximada de la reunión y el vecindario general, no direcciones exactas. Esto proporciona suficiente información para saber si puede ayudar, mientras se protege plenamente la privacidad del miembro.",
    respondTitle: "Responder a la Solicitud",
    respondSubtitle: "Escriba un mensaje corto o seleccione una de las opciones rápidas a continuación.",
    quickReply1: "¡Puedo unirme!",
    quickReply2: "Me encantaría unirme por video/teléfono.",
    quickReply3: "¡Mi esposo/a / amigo/a también se une!",
    quickReply4: "Los veré a la hora especificada.",
    messageLabel: "Su mensaje a los misioneros",
    messagePlaceholder: "Escriba su respuesta aquí...",
    sendResponseBtn: "Enviar respuesta y ayudar",
    sendingText: "Enviando...",
    footerNotice: "Su respuesta se envía de forma completamente anónima y segura a los misioneros. Para proteger la privacidad de todos, esta solicitud se elimina permanentemente de nuestra memoria temporal tan pronto como hace clic en enviar."
  },
  sw: {
    gatewayTitle: "Penda, shiriki, alika",
    gatewaySubtitle: "Usaidizi wa joto na usiojulikana wa parokia huko Gothenburg",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Jiandikishe kama Mwanachama wa Msaada",
    onboardingSubtitle: "Njia ya joto, isiyojulikana kabisa ya kusaidia wamisionari wetu vijana.",
    onboardingIntro: "Karibu kwenye huduma yetu salama ya uratibu. Kwa kujaza fomu hii, unarahisisha wamisionari wetu kupata mwanachama mzee wa msaada haraka. Utapokea arifa ya kirafiki kwenye kifaa chako mara tu ombi linapoundwa katika maeneo uliyochagua.",
    step1Title: "Hatua ya 1 ya 5: Chagua maeneo unayoweza kusaidia",
    step1Subtitle: "Bofya kwenye maeneo ya Gothenburg ambapo una uwezo wa kusaidia. Imepangwa kijiografia kutoka kaskazini hadi kusini.",
    
    step2Title: "Hatua ya 2 ya 5: Ushirikiano & Usaidizi wa Lugha",
    step2Subtitle: "Mashirika yetu yanafanya kazi pamoja ili kusaidia wamisionari katika lugha zao za asili.",
    step2OrgHeader: "Mashirika Yanayoshirikiana",
    step2OrgText: "Huduma ya Msaada wa Wamisionari inaratibu mahitaji huko Gothenburg kupitia ushirikiano wa karibu na Muungano wa Usaidizi wa Kina Mama (shirika la wanawake la kanisa) na Ukidi wa Wazee (shirika la wanaume la kanisa) utakaohakikisha kuwa wamisionari daima wana mwanachama mzee wa msaada anayeaminika pamoja nao.",
    orgChoiceLabel: "Shirika langu (chagua moja):",
    orgBror: "Akidi ya Wazee (Kaka)",
    orgSyster: "Muungano wa Usaidizi (Dada)",
    step2LangHeader: "Lugha ninazoweza kusaidia nazo",
    step2LangSubtitle: "Bofya kwenye lugha unazozungumza na uko tayari kusaidia nazo wakati wa mikutano (unaweza kuchagua nyingi).",

    step3Title: "Hatua ya 3 ya 5: Ungependa kushiriki vipi?",
    step3Subtitle: "Chagua muundo unaofaa zaidi maisha yako.",
    formatPhysicalTitle: "Kihalisia mahali husika",
    formatPhysicalDesc: "Ningependa kushiriki katika mkutano ana kwa ana (k.m. nyumbani kwa mtu, kanisani au kwenye mkahawa).",
    formatDigitalTitle: "Kupitia simu / video",
    formatDigitalDesc: "Niko tayari kushiriki kwa mbali kupitia simu, Zoom au simu ya video ya WhatsApp.",
    
    step4Title: "Hatua ya 4 na 5 ya 5: Badilisha arifa zako",
    step4Subtitle: "Kurekebisha jinsi gani na wakati gani unataka kuarifiwa.",
    notifyOptionTitle: "Tuma arifa moja kwa moja kwenye kifaa changu",
    notifyOptionDesc: "Utapokea ujumbe wa kirafiki wakati hitaji la mmisionari linapotokea katika maeneo uliyochagua. Unajiamulia kwa sasa ikiwa unaweza kusaidia.",
    spiritualOptionTitle: "Jiandikishe kwa mawazo ya kiroho ya kila wiki",
    spiritualOptionDesc: "Pokea wazo fupi, la kuinua lililotumwa kama arifa ya kimya mara moja kwa wiki.",
    
    iosTipHeader: "Kidokezo muhimu kwa watumiaji av iPhone/iOS:",
    iosTipBody: "Huduma hii inafanya kazi vizuri zaidi kwenye simu yako ya mkononi. Ikiwa unatumia iPhone, lazima kwanza uguse kitufe cha Shiriki (mraba wenye mshale wa juu) kwenye kivinjari chako na uchague \"Ongeza kwenye Skrini ya Nyumbani\". Kisha, fungua programu kutoka kwenye skrini yako ya nyumbani ili kuwezesha arifa.",
    pushHeader: "Washa arifa",
    pushSubtitle: "Ili kupokea maombi sekunde ile ile yanapoundwa, unahitaji kuidhinisha arifa.",
    pushBtnActive: "✓ Arifa zimewezeshwa",
    pushBtnInactive: "Wezesha arifa",
    saveBtn: "Hifadhi mipangilio",
    saveFeedback: "Mipangilio yako imehifadhiwa salama na bila majina!",
    alertDetailTitle: "Hitaji la Mmisionari katika",
    loadingInfo: "Inaleta maelezo ya ombi...",
    successTitle: "Jibu lako limetumwa!",
    successDeliveredTitle: "1. Jibu limewasilishwa:",
    successDeliveredDesc: "Ujumbe wako umetumwa bila kujulikana kabisa kwa wawili hao wa kimisionari.",
    successClosedTitle: "2. Ombi limefungwa:",
    successClosedDesc: "Kwa usalama wa kila mtu, ombi hili na data zote zinazohusiana zimefutwa kabisa. Hakuna athari au data ya kibinafsi iliyohifadhiwa kwenye mfumo.",
    inactiveTitle: "Ombi tayari limetatuliwa",
    inactiveDesc: "Ombi hili halipatikani tena. Ama mwanachama mwingine wa usaidizi ameshakubali ombi (ambalo hufunga na kufuta ombi mara moja), au muda wa mkutano umeshapita.",
    backToHome: "Rudi nyumbani",
    backBtn: "Nyuma",
    activeRequest: "Ombi Ambalo Liko Wazi",
    approxLocation: "Mahali (Takriban)",
    timeLabel: "Muda",
    participantsLabel: "Washiriki",
    languageLabel: "Lugha",
    privacyNotice: "Kwa usalama na faragha ya kila mtu: Huduma inaonyesha tu eneo la mkutano wa takriban na mtaa wa jumla, si anwani halisi. Hii inatoa habari ya kutosha kwako kujua ikiwa unaweza kusaidia, huku ikilinda kikamilifu faragha ya mwanachama.",
    respondTitle: "Jibu Ombi",
    respondSubtitle: "Andika ujumbe mfupi au uchague moja ya chaguzi za haraka hapa chini.",
    quickReply1: "Naweza kujiunga nanyi!",
    quickReply2: "Ningependa kujiunga kupitia video/simu.",
    quickReply3: "Mwenzi wangu/rafiki yangu anajiunga pia!",
    quickReply4: "Nitakutana nanyi kwa wakati uliowekwa.",
    messageLabel: "Ujumbe wako kwa wamisionari",
    messagePlaceholder: "Andika jibu hapa...",
    sendResponseBtn: "Tuma jibu na usaidie",
    sendingText: "Inatuma...",
    footerNotice: "Jibu lako linatumwa bila jina kabisa na kwa usalama kwa wamisionari. Ili kulinda faragha ya kila mtu, ombi hili linafutwa kabisa kutoka kwa kumbukumbu yetu ya muda punde tu unapobofya tuma."
  },
  vi: {
    gatewayTitle: "Yêu thương, chia sẻ, mời gọi",
    gatewaySubtitle: "Sự hỗ trợ giáo xứ ấm áp và ẩn danh ở Göteborg",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Đăng ký làm Thành viên Hỗ trợ",
    onboardingSubtitle: "Một cách ấm áp, hoàn toàn ẩn danh để hỗ trợ các truyền giáo trẻ của chúng tôi.",
    onboardingIntro: "Chào mừng bạn đến với dịch vụ điều phối an toàn của chúng tôi. Bằng cách hoàn thành biểu mẫu này, bạn giúp các truyền giáo dễ dàng tìm thấy một thành viên hỗ trợ là người lớn một cách nhanh chóng. Bạn sẽ nhận được thông báo nhẹ nhàng trên thiết bị của mình ngay khi có yêu cầu được tạo trong các khu vực bạn đã chọn.",
    step1Title: "Bước 1 trên 5: Chọn các khu vực bạn có thể giúp đỡ",
    step1Subtitle: "Nhấp vào các khu vực ở Göteborg mà bạn có khả năng hỗ trợ. Được sắp xếp theo thứ tự địa lý từ bắc xuống nam.",
    
    step2Title: "Bước 2 trên 5: Hợp tác & Hỗ trợ Ngôn ngữ",
    step2Subtitle: "Các tổ chức của chúng tôi hợp tác cùng nhau để hỗ trợ các truyền giáo bằng ngôn ngữ bản xứ của họ.",
    step2OrgHeader: "Các Tổ chức Hợp tác",
    step2OrgText: "Dịch vụ Hỗ trợ Truyền giáo điều phối các nhu cầu tại Göteborg thông qua sự hợp tác chặt chẽ với Hội Cứu trợ (tổ chức phụ nữ của giáo hội) và Nhóm túc số Trưởng lão (tổ chức nam giới của giáo hội) nhằm đảm bảo các truyền giáo luôn có một thành viên hỗ trợ trưởng thành đáng tin cậy đi cùng.",
    orgChoiceLabel: "Tổ chức của tôi (chọn một):",
    orgBror: "Nhóm túc số Trưởng lão (Anh em)",
    orgSyster: "Hội Cứu trợ (Chị em)",
    step2LangHeader: "Ngôn ngữ tôi có thể giúp đỡ",
    step2LangSubtitle: "Nhấp vào các ngôn ngữ bạn nói và sẵn sàng hỗ trợ trong các buổi họp (bạn có thể chọn nhiều ngôn ngữ).",

    step3Title: "Bước 3 trên 5: Bạn muốn tham gia như thế nào?",
    step3Subtitle: "Chọn phương thức phù hợp nhất với lối sống của bạn.",
    formatPhysicalTitle: "Gặp mặt trực tiếp",
    formatPhysicalDesc: "Tôi rất sẵn lòng tham gia cuộc họp trực tiếp tại chỗ (ví dụ: tại nhà của ai đó, tại nhà thờ hoặc tại quán ca phê).",
    formatDigitalTitle: "Qua điện thoại / video",
    formatDigitalDesc: "Tôi rất sẵn lòng tham gia từ xa qua điện thoại, Zoom hoặc cuộc gọi video WhatsApp.",
    
    step4Title: "Bước 4 & 5 trên 5: Tùy chỉnh thông báo của bạn",
    step4Subtitle: "Tinh chỉnh cách thức và thời điểm bạn muốn nhận thông báo.",
    notifyOptionTitle: "Gửi thông báo trực tiếp đến thiết bị của tôi",
    notifyOptionDesc: "Bạn sẽ nhận được tin nhắn thân thiện khi có nhu cầu truyền giáo phát sinh trong các khu vực bạn đã chọn. Bạn tự quyết định ngay lúc đó xem mình có thể giúp đỡ hay không.",
    spiritualOptionTitle: "Đăng ký nhận những suy nghĩ tâm linh hàng tuần",
    spiritualOptionDesc: "Nhận một suy nghĩ ngắn gọn, mang tính khích lệ được gửi dưới dạng thông báo im lặng mỗi tuần một lần.",
    
    iosTipHeader: "Mẹo quan trọng cho người dùng iPhone/iOS:",
    iosTipBody: "Dịch vụ này hoạt động tốt nhất trên điện thoại di động của bạn. Nếu bạn đang sử dụng iPhone, trước tiên bạn phải chạm vào nút Chia sẻ (hình vuông có mũi tên hướng lên) trong trình duyệt của mình và chọn \"Thêm vào màn hình chính\". Sau đó, mở ứng dụng từ màn hình chính của bạn để kích hoạt thông báo.",
    pushHeader: "Bật thông báo",
    pushSubtitle: "Để nhận các yêu cầu ngay lập tức khi chúng được tạo, bạn cần chấp thuận nhận thông báo.",
    pushBtnActive: "✓ Thông báo đã được bật",
    pushBtnInactive: "Bật thông báo",
    saveBtn: "Lưu cài đặt",
    saveFeedback: "Cài đặt của bạn đã được lưu một cách an toàn và ẩn danh!",
    alertDetailTitle: "Nhu cầu Truyền giáo tại",
    loadingInfo: "Đang tải thông tin yêu cầu...",
    successTitle: "Câu trả lời của bạn đã được gửi!",
    successDeliveredTitle: "1. Câu trả lời đã được gửi đi:",
    successDeliveredDesc: "Tin nhắn của bạn đã được chuyển tiếp hoàn toàn ẩn danh đến cặp truyền giáo.",
    successClosedTitle: "2. Yêu cầu đã đóng:",
    successClosedDesc: "Vì sự an toàn của mọi người, yêu cầu này và tất cả dữ liệu liên quan đã bị xóa vĩnh viễn. Không có dấu vết hoặc dữ liệu cá nhân nào được lưu trữ trong hệ thống.",
    inactiveTitle: "Yêu cầu đã được giải quyết",
    inactiveDesc: "Yêu cầu này không còn hiệu lực. Có thể một thành viên hỗ trợ khác đã chấp nhận yêu cầu (yêu cầu này sẽ đóng và xóa ngay lập tức), hoặc thời gian của cuộc họp đã qua.",
    backToHome: "Quay lại trang chủ",
    backBtn: "Quay lại",
    activeRequest: "Yêu cầu đang hoạt động",
    approxLocation: "Địa điểm (Tương đối)",
    timeLabel: "Thời gian",
    participantsLabel: "Thành phần tham gia",
    languageLabel: "Ngôn ngữ",
    privacyNotice: "Vì sự an toàn và riêng tư của mọi người: Dịch vụ chỉ hiển thị địa điểm cuộc họp gần đúng và khu vực chung, không hiển thị địa chỉ chính xác. Điều này cung cấp đủ thông tin để bạn biết liệu mình có thể hỗ trợ hay không, đồng thời bảo vệ hoàn toàn sự riêng tư của thành viên.",
    respondTitle: "Phản hồi Yêu cầu",
    respondSubtitle: "Viết một tin nhắn ngắn hoặc chọn một trong các tùy chọn nhanh bên dưới.",
    quickReply1: "Tôi có thể tham gia cùng các bạn!",
    quickReply2: "Tôi rất sẵn lòng tham gia qua video/điện thoại.",
    quickReply3: "Vợ/chồng hoặc bạn của tôi cũng sẽ đi cùng!",
    quickReply4: "Tôi sẽ gặp các bạn đúng giờ quy định.",
    messageLabel: "Tin nhắn của bạn gửi đến các truyền giáo",
    messagePlaceholder: "Viết câu trả lời ở đây...",
    sendResponseBtn: "Gửi câu trả lời và hỗ trợ",
    sendingText: "Đang gửi...",
    footerNotice: "Câu trả lời của bạn được gửi hoàn toàn ẩn danh và an toàn đến các truyền giáo. Để bảo vệ sự riêng tư của mọi người, yêu cầu này sẽ bị xóa vĩnh viễn khỏi bộ nhớ tạm thời của chúng tôi ngay khi bạn nhấp vào gửi."
  }
};
