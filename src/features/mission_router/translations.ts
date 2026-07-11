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
    gatewayTitle: "Inbjudan till dig",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Bli notifierad om nya inbjudningar",
    onboardingSubtitle: "Få snabba notiser om måltider, tjänande och aktiviteter i din närhet.",
    onboardingIntro: "Genom att anpassa valen nedan får du en diskret avisering (notis) direkt i din telefon eller dator så fort någon i församlingen delar en ny inbjudan eller aktivitet i något av dina valda områden. Du kan enkelt läsa detaljerna och tacka ja via SMS.",
    step1Title: "Steg 1 av 5: Välj områden du vill bevaka",
    step1Subtitle: "Klicka på de områden i Göteborg där du vill se inbjudningar och aktiviteter. Sorterat geografiskt från norr till söder.",
    
    step2Title: "Steg 2 av 5: Samarbete & Intresse",
    step2Subtitle: "Vi samordnar behov och inbjudningar för att stärka församlingens gemenskap.",
    step2OrgHeader: "Samarbetande Grupper",
    step2OrgText: "Här kan du ta del av öppna inbjudningar från Hjälpföreningen (kyrkans kvinnoorganisation), Äldstekvorumet (kyrkans herrorganisation) och unga missionärer. Allt samlas på en och samma anslagstavla för enkel tillgång.",
    orgChoiceLabel: "Min organisation (välj en):",
    orgBror: "Äldstekvorum (Broder)",
    orgSyster: "Hjälpförening (Syster)",
    step2LangHeader: "Språkstöd",
    step2LangSubtitle: "Klicka på de språk du kan hjälpa till med under gemensamma träffar eller lektioner (du kan välja flera).",

    step3Title: "Steg 3 av 5: Hur vill du delta?",
    step3Subtitle: "Välj de format som passar din livssituation bäst.",
    formatPhysicalTitle: "Fysiskt på plats",
    formatPhysicalDesc: "Jag deltar gärna fysiskt på plats (t.ex. hemma hos någon, i kyrkan, städdagar eller gemensamma middagar).",
    formatDigitalTitle: "Via telefon / video / distans",
    formatDigitalDesc: "Jag deltar gärna via telefon eller digitalt vid behov.",
    
    step4Title: "Step 4 & 5 av 5: Anpassa dina aviseringar",
    step4Subtitle: "Finjustera hur och när du vill bli meddelad.",
    notifyOptionTitle: "Skicka direktnotiser till min enhet",
    notifyOptionDesc: "Du får ett trevligt meddelande i realtid när en ny inbjudan skapas i dina bevakade områden. Du väljer själv helt fritt i stunden om du vill tacka ja.",
    spiritualOptionTitle: "Prenumerera på veckovisa andliga tankar",
    spiritualOptionDesc: "Få en kort, upplyftande tanke skickad som en tyst notis en gång i veckan.",
    
    iosTipHeader: "Viktigt tips för iPhone/iOS-användare:",
    iosTipBody: "Denna tjänst fungerar bäst installerad i mobilen. Om du använder en iPhone, trycka först på Dela-knappen (fyrkanten med pil uppåt) i Safari och välj \"Lägg till på hemskärmen\". Öppna sedan appen därifrån för att kunna aktivera automatiska notiser.",
    pushHeader: "Prenumerera på notiser",
    pushSubtitle: "Du får då en diskret avisering direkt i din telefon när det finns en inbjudan till dig.",
    pushBtnActive: "✓ Notiser aktiverade",
    pushBtnInactive: "Prenumerera på notiser",
    saveBtn: "Spara inställningar",
    saveFeedback: "Dina val har sparats!",
    alertDetailTitle: "Inbjudan i",
    loadingInfo: "Hämtar information om inbjudan...",
    successTitle: "Hoppa till din SMS-app!",
    successDeliveredTitle: "Öppnar SMS-applikation:",
    successDeliveredDesc: "Djuplänken aktiveras nu för att öppna ditt förberedda SMS till arrangören.",
    successClosedTitle: "Fullbokad status:",
    successClosedDesc: "Denna aktivitet har markerats som fullbokad och går inte längre att anmäla sig till.",
    inactiveTitle: "Inbjudan är inte längre aktiv",
    inactiveDesc: "Denna inbjudan har antingen raderats av arrangören, markerats som fullbokad, eller så har sluttiden för aktiviteten passerat med mer än 2 timmar (automatisk rensning via systemet).",
    backToHome: "Tillbaka till anslagstavlan",
    backBtn: "Tillbaka",
    activeRequest: "Aktiv inbjudan",
    approxLocation: "Mötesplats / Område",
    timeLabel: "Tidpunkt",
    participantsLabel: "Målgrupp",
    languageLabel: "Språk",
    privacyNotice: "Integritetsskydd: För att skydda medlemmars och arrangörers personliga integritet i enlighet med Allmänna handboken 33.8 visas inga exakta hemadresser i texten. Platsen är maskerad till det allmänna närområdet på kartan.",
    respondTitle: "Tacka ja till inbjudan",
    respondSubtitle: "Skicka ett SMS direkt till arrangören för att anmäla dig eller ställa frågor.",
    quickReply1: "Hej! Jag kommer gärna!",
    quickReply2: "Jag vill gärna delta, ses där!",
    quickReply3: "Jag kommer och tar med mig en vän!",
    quickReply4: "Vi ses på plats vid angiven tid!",
    messageLabel: "Förbered ditt meddelande till arrangören",
    messagePlaceholder: "Skriv eventuell kommentar...",
    sendResponseBtn: "Tacka ja / OSA via SMS",
    sendingText: "Öppnar SMS...",
    footerNotice: "När du klickar på knappen öppnas din telefons inbyggda SMS-app med ett färdigskrivet meddelande till arrangörens dolda telefonnummer."
  },
  en: {
    gatewayTitle: "Invitation for you",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Get notified of new invitations",
    onboardingSubtitle: "Receive quick notifications of meals, service, and activities nearby.",
    onboardingIntro: "By customizing the choices below, you receive a discrete notification directly on your phone or computer as soon as someone in the congregation shares a new invitation or activity in one of your selected areas. You can easily read the details and RSVP via SMS.",
    step1Title: "Step 1 of 5: Select areas you want to monitor",
    step1Subtitle: "Click on the areas in Gothenburg where you want to see invitations and activities. Sorted geographically from north to south.",
    
    step2Title: "Step 2 of 5: Collaboration & Interest",
    step2Subtitle: "We coordinate needs and invitations to strengthen the ward community.",
    step2OrgHeader: "Collaborating Groups",
    step2OrgText: "Here you can see open invitations from the Relief Society (the church's women's organization), the Elders Quorum (the church's men's organization), and young missionaries. Everything is gathered in one single bulletin board for easy access.",
    orgChoiceLabel: "My organization (select one):",
    orgBror: "Elders Quorum (Brother)",
    orgSyster: "Relief Society (Sister)",
    step2LangHeader: "Language Support",
    step2LangSubtitle: "Click on the languages you can help with during common gatherings or lessons (you can select multiple).",

    step3Title: "Step 3 of 5: How would you like to participate?",
    step3Subtitle: "Choose the formats that best fit your lifestyle.",
    formatPhysicalTitle: "In-person",
    formatPhysicalDesc: "I would love to participate in-person (e.g. at someone's home, at church, service projects, or shared dinners).",
    formatDigitalTitle: "Via phone / video / remote",
    formatDigitalDesc: "I am happy to participate remotely or digitally when needed.",
    
    step4Title: "Step 4 & 5 of 5: Customize your notifications",
    step4Subtitle: "Fine-tune how and when you want to be notified.",
    notifyOptionTitle: "Send direct notifications to my device",
    notifyOptionDesc: "You will receive a pleasant real-time notification when a new invitation is created in your monitored areas. You decide freely in the moment whether to accept.",
    spiritualOptionTitle: "Subscribe to weekly spiritual thoughts",
    spiritualOptionDesc: "Receive a short, uplifting thought sent as a silent notification once a week.",
    
    iosTipHeader: "Important tip for iPhone/iOS users:",
    iosTipBody: "This service works best installed on your mobile phone. If you are using an iPhone, first tap the Share button (square with an upward arrow) in Safari and choose \"Add to Home Screen\". Then open the app from there to activate automatic notifications.",
    pushHeader: "Subscribe to notifications",
    pushSubtitle: "You will receive a discrete notification directly on your phone when there is an invitation for you.",
    pushBtnActive: "✓ Notifications enabled",
    pushBtnInactive: "Subscribe to notifications",
    saveBtn: "Save settings",
    saveFeedback: "Your preferences have been saved!",
    alertDetailTitle: "Invitation in",
    loadingInfo: "Fetching request details...",
    successTitle: "Jump to your SMS app!",
    successDeliveredTitle: "Opening SMS Application:",
    successDeliveredDesc: "The deep-link is now opening your prefilled SMS to the organizer.",
    successClosedTitle: "Fully booked status:",
    successClosedDesc: "This activity has been marked as fully booked and is no longer open for sign-ups.",
    inactiveTitle: "Invitation is no longer active",
    inactiveDesc: "This invitation has either been deleted by the organizer, marked as fully booked, or the end time for the activity has passed by more than 2 hours (automatic cleanup by the system).",
    backToHome: "Back to bulletin board",
    backBtn: "Back",
    activeRequest: "Active Invitation",
    approxLocation: "Meeting spot / Area",
    timeLabel: "Time",
    participantsLabel: "Target audience",
    languageLabel: "Language",
    privacyNotice: "Privacy Protection: To protect the personal privacy of members and organizers in accordance with General Handbook 33.8, no exact home addresses are shown in the text. The location is masked to the general vicinity on the map.",
    respondTitle: "Accept Invitation",
    respondSubtitle: "Send an SMS directly to the organizer to sign up or ask questions.",
    quickReply1: "Hi! I would love to come!",
    quickReply2: "I'd love to participate, see you there!",
    quickReply3: "I am coming and bringing a friend!",
    quickReply4: "See you there at the specified time!",
    messageLabel: "Prepare your message to the organizer",
    messagePlaceholder: "Write any comment here...",
    sendResponseBtn: "Accept / RSVP via SMS",
    sendingText: "Opening SMS...",
    footerNotice: "When you click the button, your phone's built-in SMS app opens with a pre-written message to the organizer's hidden phone number."
  },
  es: {
    gatewayTitle: "Invitación para ti",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Recibe notificaciones sobre nuevas invitaciones",
    onboardingSubtitle: "Recibe notificaciones rápidas sobre comidas, servicio y actividades cercanas.",
    onboardingIntro: "Al adaptar las opciones a continuación, recibirá una notificación discreta directamente en su teléfono o computadora tan pronto como alguien de la congregación comparta una nueva invitación o actividad en sus áreas seleccionadas. Puede leer los detalles fácilmente y responder por SMS.",
    step1Title: "Paso 1 de 5: Selecciona las áreas que deseas monitorear",
    step1Subtitle: "Haz clic en las áreas de Gotemburgo donde deseas ver invitaciones y actividades. Ordenadas geográficamente de norte a sur.",
    
    step2Title: "Paso 2 de 5: Colaboración e Interés",
    step2Subtitle: "Coordinamos necesidades e invitaciones para fortalecer la comunidad de la congregación.",
    step2OrgHeader: "Grupos Colaboradores",
    step2OrgText: "Aquí puedes ver las invitaciones abiertas de la Sociedad de Socorro (organización de mujeres de la iglesia), el Quórum de Élderes (organización de hombres de la iglesia) y los jóvenes misioneros. Todo se reúne en un solo tablón de anuncios para un acceso fácil.",
    orgChoiceLabel: "Mi organización (seleccione una):",
    orgBror: "Quórum de Élderes (Hermano)",
    orgSyster: "Sociedad de Socorro (Hermana)",
    step2LangHeader: "Soporte de Idiomas",
    step2LangSubtitle: "Haz clic en los idiomas con los que puedes ayudar durante las reuniones o lecciones (puedes seleccionar varios).",

    step3Title: "Paso 3 de 5: ¿Cómo le gustaría participar?",
    step3Subtitle: "Elija los formatos que mejor se adapten a su estilo de vida.",
    formatPhysicalTitle: "En persona",
    formatPhysicalDesc: "Me encantaría participar en persona (por ejemplo, en la casa de alguien, en la iglesia, días de servicio o cenas compartidas).",
    formatDigitalTitle: "Por teléfono / video / remoto",
    formatDigitalDesc: "Con gusto participo de forma remota o digital cuando sea necesario.",
    
    step4Title: "Paso 4 y 5 de 5: Personaliza tus notificaciones",
    step4Subtitle: "Ajuste cómo y cuándo desea ser notificado.",
    notifyOptionTitle: "Enviar notificaciones directas a mi dispositivo",
    notifyOptionDesc: "Recibirás un mensaje amigable en tiempo real cuando se cree una nueva invitación en tus áreas monitoreadas. Decides libremente en el momento si deseas aceptar.",
    spiritualOptionTitle: "Suscribirse a pensamientos espirituales semanales",
    spiritualOptionDesc: "Reciba un pensamiento corto e inspirador enviado como notificación silenciosa una vez a la semana.",
    
    iosTipHeader: "Consejo importante para usuarios de iPhone/iOS:",
    iosTipBody: "Este servicio funciona mejor instalado en tu teléfono móvil. Si usa un iPhone, primero debe tocar el botón Compartir (el cuadrado con una flecha hacia arriba) en su navegador y elegir \"Agregar a la pantalla de inicio\". Luego, abra la aplicación desde su pantalla de inicio para activar las notificaciones.",
    pushHeader: "Suscribirse a las notificaciones",
    pushSubtitle: "Recibirá una notificación discreta directamente en su teléfono cuando haya una invitación para usted.",
    pushBtnActive: "✓ Notificaciones activadas",
    pushBtnInactive: "Suscribirse a las notificaciones",
    saveBtn: "Guardar configuración",
    saveFeedback: "¡Sus preferencias han sido guardadas!",
    alertDetailTitle: "Invitación en",
    loadingInfo: "Obteniendo detalles de la solicitud...",
    successTitle: "¡Abre tu aplicación de SMS!",
    successDeliveredTitle: "Abriendo aplicación de SMS:",
    successDeliveredDesc: "El enlace directo se está activando para abrir tu SMS preparado para el organizador.",
    successClosedTitle: "Estado de cupo completo:",
    successClosedDesc: "Esta actividad ha sido marcada como completa y ya no está abierta para inscripciones.",
    inactiveTitle: "La invitación ya no está activa",
    inactiveDesc: "Esta invitación ha sido eliminada por el organizador, marcada como completa, o la hora de finalización de la actividad ha pasado por más de 2 horas (limpieza automática del sistema).",
    backToHome: "Volver al tablón de anuncios",
    backBtn: "Atrás",
    activeRequest: "Invitación Activa",
    approxLocation: "Lugar de encuentro / Área",
    timeLabel: "Hora",
    participantsLabel: "Público objetivo",
    languageLabel: "Idioma",
    privacyNotice: "Protección de Privacidad: Para proteger la privacidad de los miembros y organizadores de acuerdo con el Manual General 33.8, no se muestran direcciones exactas en el texto. La ubicación está enmascarada en el mapa al área general.",
    respondTitle: "Aceptar Invitación",
    respondSubtitle: "Escriba un mensaje corto o seleccione una de las opciones rápidas a continuación.",
    quickReply1: "¡Hola! ¡Me encantaría ir!",
    quickReply2: "¡Me encantaría participar, nos vemos allí!",
    quickReply3: "¡Voy a ir y llevaré a un amigo!",
    quickReply4: "¡Nos vemos allí a la hora especificada!",
    messageLabel: "Prepara tu mensaje para el organizador",
    messagePlaceholder: "Escribe cualquier comentario aquí...",
    sendResponseBtn: "Aceptar / Reservar vía SMS",
    sendingText: "Abriendo SMS...",
    footerNotice: "Al hacer clic en el botón, se abre la aplicación de SMS integrada de tu teléfono con un mensaje preescrito para el número oculto del organizador."
  },
  sw: {
    gatewayTitle: "Mwaliko kwako",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Pata arifa kuhusu mialiko mipya",
    onboardingSubtitle: "Pokea arifa za haraka kuhusu milo, huduma, na shughuli za karibu.",
    onboardingIntro: "Kwa kubinafsisha chaguzi hapa chini, utapokea arifa ya siri moja kwa moja kwenye simu au kompyuta yako mara tu mtu katika ushirika anaposhiriki mwaliko au shughuli mpya katika maeneo yako uliyochagua. Unaweza kusoma maelezo kwa urahisi na kujibu kupitia SMS.",
    step1Title: "Hatua ya 1 ya 5: Chagua maeneo unayotaka kufuatilia",
    step1Subtitle: "Bofya kwenye maeneo ya Gothenburg ambapo unataka kuona mialiko na shughuli. Imepangwa kijiografia kutoka kaskazini hadi kusini.",
    
    step2Title: "Hatua ya 2 ya 5: Ushirikiano na Maslahi",
    step2Subtitle: "Tunaratibu mahitaji na mialiko ili kuimarisha jumuiya ya ushirika.",
    step2OrgHeader: "Vikundi Vinavyoshirikiana",
    step2OrgText: "Hapa unaweza kuona mialiko ya wazi kutoka kwa Muungano wa Usaidizi av Kina Mama (Relief Society), Akidi ya Wazee (Elders Quorum), na wamisionari vijana. Kila kitu kinakusanywa kwenye ubao mmoja av matangazo kwa ufikiaji rahisi.",
    orgChoiceLabel: "Shirika langu (chagua moja):",
    orgBror: "Akidi ya Wazee (Kaka)",
    orgSyster: "Muungano wa Usaidizi (Dada)",
    step2LangHeader: "Msaada wa Lugha",
    step2LangSubtitle: "Bofya kwenye lugha unazoweza kusaidia nazo wakati wa mikutano au masomo (unaweza kuchagua nyingi).",

    step3Title: "Hatua ya 3 ya 5: Ungependa kushiriki vipi?",
    step3Subtitle: "Chagua muundo unaofaa zaidi maisha yako.",
    formatPhysicalTitle: "Kihalisia mahali husika",
    formatPhysicalDesc: "Ningependa kushiriki ana kwa ana (k.m., nyumbani kwa mtu, kanisani, miradi ya huduma, au milo ya pamoja).",
    formatDigitalTitle: "Kupitia simu / video / mbali",
    formatDigitalDesc: "Niko tayari kushiriki kwa mbali au kidijitali inapohitajika.",
    
    step4Title: "Hatua ya 4 na 5 ya 5: Badilisha arifa zako",
    step4Subtitle: "Kurekebisha jinsi gani na wakati gani unataka kuarifiwa.",
    notifyOptionTitle: "Tuma arifa za moja kwa moja kwenye kifaa changu",
    notifyOptionDesc: "Utapokea ujumbe mzuri av wakati halisi wakati mwaliko mpya unapoundwa katika maeneo yako yanayofuatiliwa. Unajiamulia kwa uhuru jika unataka kukubali.",
    spiritualOptionTitle: "Jiandikishe kwa mawazo ya kiroho ya kila wiki",
    spiritualOptionDesc: "Pokea wazo fupi, la kuinua lililotumwa kama arifa ya kimya mara moja kwa wiki.",
    
    iosTipHeader: "Kidokezo muhimu kwa watumiaji av iPhone/iOS:",
    iosTipBody: "Huduma hii inafanya kazi vizuri zaidi jika imesakinishwa kwenye simu yako ya mkononi. Ikiwa unatumia iPhone, kwanza gusa kitufe cha Shiriki (mraba wenye mshale av juu) katika Safari na uchague \"Ongeza kwenye Skrini ya Nyumbani\". Kisha fungua programu kutoka hapo ili kuwezesha arifa za moja kwa moja.",
    pushHeader: "Jiandikishe kwa arifa",
    pushSubtitle: "Utapokea arifa ya siri moja kwa moja kwenye simu yako wakati kuna mwaliko kwako.",
    pushBtnActive: "✓ Arifa zimewezeshwa",
    pushBtnInactive: "Jiandikishe kwa arifa",
    saveBtn: "Hifadhi mipangilio",
    saveFeedback: "Chaguzi zako zimehifadhiwa!",
    alertDetailTitle: "Mwaliko katika",
    loadingInfo: "Inaleta maelezo ya ombi...",
    successTitle: "Nenda kwenye programu yako ya SMS!",
    successDeliveredTitle: "Inafungua Programu ya SMS:",
    successDeliveredDesc: "Kiungo cha SMS kinafungua SMS yako iliyoandaliwa tayari kwenda kwa nambari iliyofichwa ya mratibu.",
    successClosedTitle: "Hali ya nafasi kujaa:",
    successClosedDesc: "Shughuli hii imewekewa alama ya kujaa na haipokei tena usajili.",
    inactiveTitle: "Mwaliko hauko hai tena",
    inactiveDesc: "Mwaliko huu umefutwa na mratibu, umewekewa alama ya kujaa, au muda wa kumalizika kwa shughuli umepita kwa zaidi ya masaa 2 (kusafishwa kiotomatiki na mfumo).",
    backToHome: "Rudi kwenye ubao wa matangazo",
    backBtn: "Nyuma",
    activeRequest: "Mwaliko Ambao Uko Wazi",
    approxLocation: "Sehemu ya mkutano / Eneo",
    timeLabel: "Muda",
    participantsLabel: "Walengwa",
    languageLabel: "Lugha",
    privacyNotice: "Ulinzi av Faragha: Ili kulinda faragha ya wanachama na waandalizi kwa mujibu av Mwongozo Mkuu 33.8, hakuna anwani halisi za nyumbani zinazoonyeshwa kwenye maandishi. Eneo limefichwa kwenye ramani kwa ujumla wake.",
    respondTitle: "Kukubali Mwaliko",
    respondSubtitle: "Tuma SMS moja kwa moja kwa mratibu ili kujiandikisha au kuuliza maswali.",
    quickReply1: "Habari! Ningependa kuja!",
    quickReply2: "Ningependa kushiriki, tutakutana hapo!",
    quickReply3: "Naja na nitamleta rafiki yangu!",
    quickReply4: "Tutakutana hapo kwa muda uliopangwa!",
    messageLabel: "Andaa ujumbe wako kwa mratibu",
    messagePlaceholder: "Andika maoni hapa...",
    sendResponseBtn: "Kukubali / RSVP kupitia SMS",
    sendingText: "Inafungua SMS...",
    footerNotice: "Unapobofya kitufe, programu ya SMS ya simu yako inafunguka na ujumbe uliotayarishwa kwenda kwa nambari iliyofichwa ya mratibu."
  },
  vi: {
    gatewayTitle: "Lời mời dành cho bạn",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    onboardingHeader: "Nhận thông báo về lời mời mới",
    onboardingSubtitle: "Nhận thông báo nhanh về các bữa ăn, phục vụ và hoạt động gần bạn.",
    onboardingIntro: "Bằng cách tùy chỉnh các lựa chọn bên dưới, bạn sẽ nhận được thông báo kín đáo trực tiếp trên điện thoại hoặc máy tính của mình ngay khi có người trong hội thánh chia sẻ lời mời hoặc hoạt động mới tại các khu vực bạn đã chọn. Bạn có thể dễ dàng đọc chi tiết và trả lời qua SMS.",
    step1Title: "Bước 1 trên 5: Chọn các khu vực bạn muốn theo dõi",
    step1Subtitle: "Nhấp vào các khu vực ở Göteborg mà bạn muốn xem lời mời và hoạt động. Được sắp xếp theo thứ tự địa lý từ bắc xuống nam.",
    
    step2Title: "Bước 2 trên 5: Hợp tác & Quan tâm",
    step2Subtitle: "Chúng tôi điều phối các nhu cầu và lời mời để thắt chặt tình thân hữu trong hội thánh.",
    step2OrgHeader: "Các nhóm hợp tác",
    step2OrgText: "Tại đây, bạn có thể xem các lời mời mở từ Hội Cứu Trợ (tổ chức phụ nữ), Nhóm túc số Trưởng Lão (tổ chức nam giới) và các truyền giáo trẻ. Mọi thứ được tập hợp trên một bảng thông tin duy nhất để dễ dàng truy cập.",
    orgChoiceLabel: "Tổ chức của tôi (chọn một):",
    orgBror: "Nhóm túc số Trưởng lão (Anh em)",
    orgSyster: "Hội Cứu trợ (Chị em)",
    step2LangHeader: "Hỗ trợ ngôn ngữ",
    step2LangSubtitle: "Nhấp vào các ngôn ngữ bạn có thể giúp đỡ trong các buổi gặp gỡ hoặc bài học (bạn có thể chọn nhiều ngôn ngữ).",

    step3Title: "Bước 3 trên 5: Bạn muốn tham gia như thế nào?",
    step3Subtitle: "Chọn phương thức phù hợp nhất với lối sống của bạn.",
    formatPhysicalTitle: "Gặp mặt trực tiếp",
    formatPhysicalDesc: "Tôi rất sẵn lòng tham gia trực tiếp (ví dụ: tại nhà của ai đó, nhà thờ, các dự án phục vụ hoặc bữa ăn chung).",
    formatDigitalTitle: "Qua điện thoại / video / từ xa",
    formatDigitalDesc: "Tôi sẵn sàng tham gia từ xa hoặc qua kỹ thuật số khi cần thiết.",
    
    step4Title: "Bước 4 & 5 trên 5: Tùy chỉnh thông báo của bạn",
    step4Subtitle: "Tinh chỉnh cách thức và thời điểm bạn muốn nhận thông báo.",
    notifyOptionTitle: "Gửi thông báo trực tiếp đến thiết bị của tôi",
    notifyOptionDesc: "Bạn sẽ nhận được một tin nhắn thân thiện trong thời gian thực khi có lời mời mới được tạo trong các khu vực bạn theo dõi. Bạn tự do quyết định ngay lúc đó có chấp nhận hay không.",
    spiritualOptionTitle: "Đăng ký nhận những suy nghĩ tâm linh hàng tuần",
    spiritualOptionDesc: "Nhận một suy nghĩ ngắn gọn, mang tính khích lệ được gửi dưới dạng thông báo im lặng mỗi tuần một lần.",
    
    iosTipHeader: "Mẹo quan trọng cho người dùng iPhone/iOS:",
    iosTipBody: "Dịch vụ này hoạt động tốt nhất khi được cài đặt trên điện thoại di động của bạn. Nếu sử dụng iPhone, trước tiên hãy chạm vào nút Chia sẻ (hình vuông có mũi tên hướng lên) trong Safari và chọn \"Thêm vào màn hình chính\". Sau đó mở ứng dụng từ đó để kích hoạt thông báo tự động.",
    pushHeader: "Đăng ký nhận thông báo",
    pushSubtitle: "Bạn sẽ nhận được thông báo kín đáo trực tiếp trên điện thoại của mình khi có lời mời dành cho bạn.",
    pushBtnActive: "✓ Thông báo đã được bật",
    pushBtnInactive: "Đăng ký nhận thông báo",
    saveBtn: "Lưu cài đặt",
    saveFeedback: "Lựa chọn của bạn đã được lưu!",
    alertDetailTitle: "Lời mời tại",
    loadingInfo: "Đang tải thông tin yêu cầu...",
    successTitle: "Chuyển sang ứng dụng SMS của bạn!",
    successDeliveredTitle: "Đang mở ứng dụng SMS:",
    successDeliveredDesc: "Liên kết trực tiếp đang được kích hoạt để mở tin nhắn SMS được soạn sẵn gửi đến người tổ chức.",
    successClosedTitle: "Trạng thái đã đầy chỗ:",
    successClosedDesc: "Hoạt động này đã được đánh dấu là đầy chỗ và không còn nhận đăng ký nữa.",
    inactiveTitle: "Lời mời không còn hoạt động",
    inactiveDesc: "Lời mời này đã bị người tổ chức xóa, được đánh dấu là đầy chỗ hoặc thời gian kết thúc hoạt động đã trôi qua hơn 2 giờ (hệ thống tự động dọn dẹp).",
    backToHome: "Quay lại bảng thông tin",
    backBtn: "Quay lại",
    activeRequest: "Lời mời đang hoạt động",
    approxLocation: "Địa điểm gặp mặt / Khu vực",
    timeLabel: "Thời gian",
    participantsLabel: "Đối tượng hướng đến",
    languageLabel: "Ngôn ngữ",
    privacyNotice: "Bảo vệ Quyền riêng tư: Để bảo vệ quyền riêng tư cá nhân của các thành viên và người tổ chức theo Hướng dẫn Tổng quát 33.8, không có địa chỉ nhà chính xác nào được hiển thị trong văn bản. Vị trí được làm mờ trên bản đồ thành khu vực chung.",
    respondTitle: "Chấp nhận Lời mời",
    respondSubtitle: "Gửi tin nhắn SMS trực tiếp đến người tổ chức để đăng ký hoặc đặt câu hỏi.",
    quickReply1: "Xin chào! Tôi rất vui lòng tham gia!",
    quickReply2: "Tôi rất muốn tham gia, hẹn gặp bạn ở đó!",
    quickReply3: "Tôi sẽ đến và rủ thêm một người bạn đi cùng!",
    quickReply4: "Hẹn gặp lại các bạn tại địa điểm vào thời gian đã định!",
    messageLabel: "Soạn tin nhắn gửi đến người tổ chức",
    messagePlaceholder: "Viết nhận xét nếu có...",
    sendResponseBtn: "Chấp nhận / RSVP qua SMS",
    sendingText: "Đang mở SMS...",
    footerNotice: "Khi bạn nhấp vào nút, ứng dụng SMS tích hợp trên điện thoại của bạn sẽ mở ra với một tin nhắn được viết sẵn gửi đến số điện thoại ẩn của người tổ chức."
  }
};
