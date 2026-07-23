// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

export type UiLanguage = "sv" | "en" | "es" | "sw" | "vi";

export interface TranslationDict {
  gatewayTitle: string;
  gatewaySubtitle: string;
  gatewayPrompt: string;
  introScreenText: string;
  introScreenBtn: string;
  introScreenBtnOk: string;
  introScreenBtnCustomize: string;
  
  // OnboardingForm
  onboardingHeader: string;
  onboardingSubtitle: string;
  onboardingIntro: string;
  customizeChoicesBtn: string;
  
  // Step 1: Plats och närområde
  step1Title: string;
  step1Subtitle: string;
  
  // Step 2: Språkstöd
  step2Title: string;
  step2Subtitle: string;

  // Step 3: Grupptillhörighet
  step3Title: string;
  step3Subtitle: string;
  
  // Step 4: Format
  step4Title: string;
  step4Subtitle: string;
  
  formatPhysicalTitle: string;
  formatPhysicalDesc: string;
  formatDigitalTitle: string;
  formatDigitalDesc: string;
  formatSpiritualTitle: string;
  formatSpiritualDesc: string;

  orgChoiceLabel: string;
  orgBror: string;
  orgSyster: string;

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

  // New keys for tabs and status bar
  tabInvitations: string;
  tabCreateInvitation: string;
  tabCustomize: string;
  primaryAreaLabel: string;
  noAreaSelected: string;
  showingCount: string;
  bulletinBoardStatus: string;
  realtimeSynced: string;
  syncingText: string;
  syncSynced: string;
  syncSyncing: string;

  // Intro & Disclaimer
  introHeading: string;
  introShortText: string;
  introFullText: string;
  readMoreBtn: string;
  readLessBtn: string;
  disclaimerText: string;
}


export const TRANSLATIONS: Record<UiLanguage, TranslationDict> = {
  sv: {
    gatewayTitle: "Inbjudan till dig",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    introScreenText: "Denna tjänst underlättar för var och en som besöker församlingen att vara en vän, få näring av Guds goda ord och hjälpa andra med respekt om varandras integritet. Var och en med intresse för att besöka kyrkan kan när som helst slå på eller av notiser eller föreslå inbjudningar. Man läser där inbjudningar anonymt men bjuder in andra öppet med enkla förslag via församlingsledare. Ingen annan än du, eller den du väljer att SMSa ett svar till, kan se om att du fått eller sett notiserna. Detta är en fristående, inofficiell tjänst utan sponsring från Utby församling.",
    introScreenBtn: "Börja använda appen",
    introScreenBtnOk: "OK, uppfattat",
    introScreenBtnCustomize: "⚙️ Anpassa notiser",
    
    onboardingHeader: "Bli notifierad",
    onboardingSubtitle: "Du får då en diskret avisering direkt i din telefon när det finns en inbjudan till dig som matchar dina val. Allt sparas i ett flöde.",
    onboardingIntro: "Välkommen! Genom att ställa in fyra olika personliga preferenser nedan kan du välja exakt var och hur du vill delta och hjälpa till. Så fort ett behov uppstår som matchar din profil får du en diskret mobilavisering i realtid samtidigt som din integritet skyddas. Ingen annan än du kan se vilka notiser du följer eller tar emot. Endast den som du SMS:ar ett svar kan se när du svarar.",
    customizeChoicesBtn: "ANPASSA MINA VAL",
    
    step1Title: "Steg 1 av 4: Dina områden",
    step1Subtitle: "Vilka områden brukar du träffa andra i?",
    
    step2Title: "Steg 2 av 4: Språkstöd",
    step2Subtitle: "Vilka språk förstår du eller kan hjälpa till att översätta på?",

    step3Title: "Steg 3 av 4: Grupptillhörighet",
    step3Subtitle: "Här kan du ta del av öppna inbjudningar från följande grupper och de unga missionärerna i kyrkan. Bli notifierad från grupper som samarbetar (välj en för dig):",
    
    step4Title: "Steg 4 av 4: Välj format",
    step4Subtitle: "Välj de format som passar din livssituation bäst.",

    formatPhysicalTitle: "Fysiskt på plats",
    formatPhysicalDesc: "Fysiskt på plats: Jag deltar gärna fysiskt på plats (t.ex. hemma hos någon, i kyrkan, städdagar eller gemensamma middagar).",
    formatDigitalTitle: "Via telefon / video / distans",
    formatDigitalDesc: "Via telefon / video / distans: Jag deltar gärna via telefon eller digitalt vid behov.",
    formatSpiritualTitle: "Via Andliga tankar",
    formatSpiritualDesc: "Via Andliga tankar: Jag kan tänka mig ta emot eller dela korta upplyftande andliga tankar via tysta aviseringar eller förfrågningar som församlings- och heltidsmissionärerna sänder till mig.",

    orgChoiceLabel: "Min organisation (välj en):",
    orgBror: "Äldstekvorum (Broder)",
    orgSyster: "Hjälpförening (Syster)",

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
    privacyNotice: "Integritetsskydd: För att skydda medlemmars och arrangörers personliga integritet visas inga exakta hemadresser i texten. Platsen är maskerad till det allmänna närområdet på kartan.",
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
    footerNotice: "När du klickar på knappen öppnas din telefons inbyggda SMS-app med ett färdigskrivet meddelande till arrangörens dolda telefonnummer.",
    tabInvitations: "Inbjudan till dig",
    tabCreateInvitation: "Bjud in andra",
    tabCustomize: "Anpassa val",
    primaryAreaLabel: "Primärt område",
    noAreaSelected: "Inget förvalt område",
    showingCount: "Visar {count} av totalt {total} inbjudningar",
    bulletinBoardStatus: "Status på anslagstavlan",
    realtimeSynced: "Synkroniserad i realtid",
    syncingText: "Synkroniserar...",
    syncSynced: "Synkad",
    syncSyncing: "Synkar",
    introHeading: "Inbjudan till dig",
    introShortText: "En digital anslagstavla och SMS-gateway för samlingar, fika och aktiviteter i ditt närområde.",
    introFullText: "Denna PWA-anslagstavla gör det enkelt för alla att skapa, hitta och svara på samlingar, fika, promenader och möten. Denna tjänst underlättar för var och en att vara en vän, få näring av Guds goda ord och hjälpa andra med respekt om varandras integritet.",
    readMoreBtn: "...läs mer",
    readLessBtn: "visa mindre",
    disclaimerText: "Detta är en fristående, inofficiell tjänst utan sponsring från Utby församling."
  },

  en: {
    gatewayTitle: "Invitation for you",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    introScreenText: "This service makes it easier for everyone who visits the ward to be a friend, be nourished by the good word of God, and help others while respecting each other's privacy. Anyone with an interest in visiting the church can turn notifications on or off at any time, or suggest invitations. Here, invitations are read anonymously, but you invite others openly with simple suggestions via ward leaders. No one but you, or the person you choose to text a reply to, can see whether you have received or viewed the notifications. This is an independent, unofficial service without sponsorship from the Utby ward.",
    introScreenBtn: "Start using the app",
    introScreenBtnOk: "OK, got it",
    introScreenBtnCustomize: "⚙️ Customize notifications",
    
    onboardingHeader: "Get notified",
    onboardingSubtitle: "You will receive a discrete notification directly on your phone when there is an invitation for you that matches your choices. Everything is saved in a feed.",
    onboardingIntro: "Welcome! By setting four different personal preferences below, you can choose exactly where and how you want to participate and help. As soon as a need arises that matches your profile, you will receive a discrete mobile notification in real-time while your privacy is protected. No one but you can see which notifications you follow or receive. Only the person you SMS a reply to can see when you answer.",
    customizeChoicesBtn: "CUSTOMIZE MY CHOICES",
    
    step1Title: "Step 1 of 4: Your areas",
    step1Subtitle: "Which areas do you usually meet others in?",
    
    step2Title: "Step 2 of 4: Language support",
    step2Subtitle: "Click on the languages you can help with during common gatherings or lessons (none is selected by default, you do not have to choose).",

    step3Title: "Step 3 of 4: Group affiliation",
    step3Subtitle: "Get notified from groups that collaborate (choose one for you): Here you can take part in open invitations from the following groups and the young missionaries in the church.",
    
    step4Title: "Step 4 of 4: Choose formats",
    step4Subtitle: "Choose the formats that best fit your life situation.",

    formatPhysicalTitle: "In-person",
    formatPhysicalDesc: "In-person: I gladly participate physically on site (e.g. at someone's home, in church, cleaning days or shared dinners).",
    formatDigitalTitle: "Via phone / video / remote",
    formatDigitalDesc: "Via phone / video / remote: I gladly participate via phone or digitally when needed.",
    formatSpiritualTitle: "Via Spiritual thoughts",
    formatSpiritualDesc: "Via Spiritual thoughts: I can imagine receiving or sharing short uplifting spiritual thoughts via silent notifications or inquiries sent by ward and full-time missionaries.",

    orgChoiceLabel: "My organization (select one):",
    orgBror: "Elders Quorum (Brother)",
    orgSyster: "Relief Society (Sister)",

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
    privacyNotice: "Privacy Protection: To protect the personal privacy of members and organizers, no exact home addresses are shown in the text. The location is masked to the general vicinity on the map.",
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
    footerNotice: "When you click the button, your phone's built-in SMS app opens with a pre-written message to the organizer's hidden phone number.",
    tabInvitations: "Invitation for you",
    tabCreateInvitation: "Invite others",
    tabCustomize: "Customize choices",
    primaryAreaLabel: "Primary area",
    noAreaSelected: "No area selected",
    showingCount: "Showing {count} of total {total} invitations",
    bulletinBoardStatus: "Bulletin board status",
    realtimeSynced: "Synchronized in real time",
    syncingText: "Syncing...",
    syncSynced: "Synced",
    syncSyncing: "Syncing",
    introHeading: "Invitation for you",
    introShortText: "A digital bulletin board and SMS gateway for gatherings, coffee and activities in your area.",
    introFullText: "This PWA bulletin board makes it easy for everyone to create, find, and respond to gatherings, walks, and meetings. This service makes it easier for everyone to be a friend, be nourished by God's good word, and help others with respect for each other's privacy.",
    readMoreBtn: "...read more",
    readLessBtn: "show less",
    disclaimerText: "This is an independent, unofficial service without sponsorship from the Utby ward."
  },
  es: {

    gatewayTitle: "Invitación para ti",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    introScreenText: "Este servicio facilita que todos los que visitan el barrio sean amigos, se nutran de la buena palabra de Dios y ayuden a los demás, respetando la privacidad de cada uno. Cualquier persona interesada en visitar la iglesia puede activar o desactivar las notificaciones en cualquier momento, o sugerir invitaciones. Aquí las invitaciones se leen de forma anónima, pero se invita a otros abiertamente con sugerencias sencillas a través de los líderes del barrio. Nadie más que tú, o la persona a la que elijas enviar un mensaje de texto, puede ver si has recibido o visto las notificaciones. Este es un servicio independiente y no oficial, sin el patrocinio del barrio de Utby.",
    introScreenBtn: "Empezar a usar la aplicación",
    introScreenBtnOk: "OK, entendido",
    introScreenBtnCustomize: "⚙️ Personalizar notificaciones",
    
    onboardingHeader: "Recibe notificaciones",
    onboardingSubtitle: "Recibirá una notificación discreta directamente en su teléfono cuando haya una invitación que coincida con sus elecciones. Todo se guarda en un flujo.",
    onboardingIntro: "¡Bienvenido! Al configurar cuatro preferencias personales diferentes a continuación, puede elegir exactamente dónde y cómo desea participar y ayudar. Tan pronto como surja una necesidad que coincida con su perfil, recibirá una notificación móvil discreta en tiempo real mientras se protege su privacidad. Nadie más que usted puede ver qué notificaciones sigue o recibe. Solo la persona a la que responda por SMS de forma privada podrá ver cuando responda.",
    customizeChoicesBtn: "PERSONALIZAR MIS SELECCIONES",
    
    step1Title: "Paso 1 de 4: Tu esfuerzo como apoyo local",
    step1Subtitle: "Seleccione el lugar donde principalmente puede brindar apoyo local (por ejemplo, durante lecciones, conversaciones o ayuda práctica). Este lugar será su área de monitoreo principal.",
    
    step2Title: "Paso 2 de 4: Soporte de idiomas",
    step2Subtitle: "Haga clic en los idiomas con los que puede ayudar durante reuniones comunes o lecciones (ninguno está preseleccionado, no es obligatorio elegir).",

    step3Title: "Paso 3 de 4: Afiliación de grupo",
    step3Subtitle: "Reciba notificaciones de grupos que colaboran (elija uno para usted): Aquí puede participar en invitaciones abiertas de los siguientes grupos y de los jóvenes misioneros de la iglesia.",
    
    step4Title: "Paso 4 de 4: Elegir formatos",
    step4Subtitle: "Elija los formatos que mejor se adapten a su situación de vida.",

    formatPhysicalTitle: "En persona",
    formatPhysicalDesc: "En persona: Participo con gusto físicamente en el lugar (por ejemplo, en la casa de alguien, en la iglesia, días de servicio o cenas compartidas).",
    formatDigitalTitle: "Por teléfono / video / remoto",
    formatDigitalDesc: "Por teléfono / video / remoto: Participo con gusto por teléfono o digitalmente cuando sea necesario.",
    formatSpiritualTitle: "A través de pensamientos espirituales",
    formatSpiritualDesc: "A través de pensamientos espirituales: Puedo considerar recibir o compartir pensamientos espirituales breves y edificantes a través de notificaciones silenciosas o consultas enviadas por los misioneros de la congregación y de tiempo completo.",

    orgChoiceLabel: "Mi organización (seleccione una):",
    orgBror: "Quórum de Élderes (Hermano)",
    orgSyster: "Sociedad de Socorro (Hermana)",

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
    privacyNotice: "Protección de Privacidad: Para proteger la privacidad de los miembros y organizadores, no se muestran direcciones exactas en el texto. La ubicación está enmascarada en el mapa al área general.",
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
    footerNotice: "Al hacer clic en el botón, se abre la aplicación de SMS integrada de tu teléfono con un mensaje preescrito para el número oculto del organizador.",
    tabInvitations: "Invitación para ti",
    tabCreateInvitation: "Invitar a otros",
    tabCustomize: "Personalizar selecciones",
    primaryAreaLabel: "Área primaria",
    noAreaSelected: "Ningún área seleccionada",
    showingCount: "Mostrando {count} de un total de {total} invitaciones",
    bulletinBoardStatus: "Estado de la cartelera",
    realtimeSynced: "Sincronizado en tiempo real",
    syncingText: "Sincronizando...",
    syncSynced: "Sincronizado",
    syncSyncing: "Sincronizando",
    introHeading: "Invitación para ti",
    introShortText: "Un tableros de anuncios digital y puerta de enlace SMS para reuniones en tu área.",
    introFullText: "Este tablero de anuncios PWA facilita que todos creen, encuentren y respondan a reuniones y actividades en el área local.",
    readMoreBtn: "...leer más",
    readLessBtn: "mostrar menos",
    disclaimerText: "Este es un servicio independiente e no oficial sin patrocinio del barrio de Utby."
  },
  sw: {

    gatewayTitle: "Mwaliko kwako",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    introScreenText: "Huduma hii inarahisisha kwa kila mtu anayetembelea kata kuwa rafiki, kulishwa na neno zuri la Mungu, na kusaidia wengine huku mkiheshimu faragha ya kila mmoja. Yeyote aliye na nia ya kutembelea kanisa anaweza kuwasha au kuzima arifa wakati wowote, au kupendekeza mialiko. Hapa, mialiko inasomwa bila kujulikana, lakini unawaalika wengine waziwazi kwa mapendekezo rahisi kupitia viongozi wa kata. Hakuna mtu mwingine ila wewe, au mtu unayechagua kumtumia ujumbe, anayeweza kuona kama umepokea au kutazama arifa. Hii ni huduma inayojitegemea, isiyo rasmi na haina ufadhili kutoka kwa kata ya Utby.",
    introScreenBtn: "Anza kutumia programu",
    introScreenBtnOk: "Sawa, nimeelewa",
    introScreenBtnCustomize: "⚙️ Rekebisha arifa",
    
    onboardingHeader: "Pata arifa",
    onboardingSubtitle: "Utapokea arifa ya siri moja kwa moja kwenye simu yako wakati kuna mwaliko unaolingana na chaguo zako. Kila kitu kinahifadhiwa kwenye mkondo.",
    onboardingIntro: "Karibu! Kwa kuweka mapendeleo manne tofauti ya kibinafsi hapa chini, unaweza chagua haswa wapi na jinsi unavyotaka kushiriki na kusaidia. Mara tu hitaji linapotokea linalolingana na wasifu wako, utapokea arifa ya siri ya rununu kwa wakati halisi huku faragha yako ikilindwa. Hakuna mtu isipokuwa wewe anayeweza kuona ni arifa gani unazofuata au kupokea. Ni mtu tu unayemjibu kwa SMS ndiye anayeweza kuona unapojibu.",
    customizeChoicesBtn: "GEUZA CHAGUO ZANGU",
    
    step1Title: "Hatua ya 1 ya 4: Juhudi zako kama msaada wa kienyeji",
    step1Subtitle: "Chagua eneo ambalo unaweza kutoa msaada wa kienyeji kwanza (k.m., wakati wa masomo, mazungumzo, au msaada wa vitendo). Eneo hili litakuwa eneo lako kuu la ufuatiliaji.",
    
    step2Title: "Hatua ya 2 ya 4: Msaada wa lugha",
    step2Subtitle: "Bofya kwenye lugha unazoweza kusaidia nazo wakati wa mikutano au masomo (hakuna iliyochaguliwa mapema, sio lazima kuchagua).",

    step3Title: "Hatua ya 3 ya 4: Uhusiano wa kikundi",
    step3Subtitle: "Pata arifa kutoka kwa vikundi vinavyoshirikiana (chagua moja kwa ajili yako): Hapa unaweza kushiriki katika mialiko ya wazi kutoka kwa vikundi vifuatavyo na wamisionari vijana kanisani.",
    
    step4Title: "Hatua ya 4 ya 4: Chagua muundo",
    step4Subtitle: "Chagua muundo unaofaa zaidi maisha yako.",

    formatPhysicalTitle: "Kihalisia mahali husika",
    formatPhysicalDesc: "Kihalisia mahali husika: Ninashiriki kwa furaha ana kwa ana (k.m. nyumbani kwa mtu, kanisani, siku za huduma au milo ya pamoja).",
    formatDigitalTitle: "Kupitia simu / video / mbali",
    formatDigitalDesc: "Kupitia simu / video / mbali: Ninashiriki kwa furaha kupitia simu au kidijitali inapohitajika.",
    formatSpiritualTitle: "Kupitia mawazo ya kiroho",
    formatSpiritualDesc: "Kupitia mawazo ya kiroho: Naweza kufikiria kupokea au kushiriki mawazo mafupi ya kiroho yanayojenga kupitia arifa za kimya au maswali yanayotumwa na wamisionari wa mtaa na wa muda wote.",

    orgChoiceLabel: "Shirika langu (chagua moja):",
    orgBror: "Akidi ya Wazee (Kaka)",
    orgSyster: "Muungano wa Usaidizi (Dada)",

    iosTipHeader: "Kidokezo muhimu kwa watumiaji av iPhone/iOS:",
    iosTipBody: "Huduma hii inafanya kazi vizuri daha ikiwa imesakinishwa kwenye simu yako ya mkononi. Ikiwa unatumia iPhone, kwanza gusa kitufe cha Shiriki (mraba wenye mshale av juu) katika Safari na uchague \"Ongeza kwenye Skrini ya Nyumbani\". Kisha fungua programu kutoka hapo ili kuwezesha arifa za moja kwa mo.",
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
    privacyNotice: "Ulinzi av Faragha: Ili kulinda faragha ya wanachama na waandalizi, hakuna anwani halisi za nyumbani zinazoonyeshwa kwenye maandishi. Eneo limefichwa kwenye ramani kwa ujumla wake.",
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
    footerNotice: "Unapobofya kitufe, programu ya SMS ya simu yako inafunguka na ujumbe uliotayarishwa kwenda kwa nambari iliyofichwa ya mratibu.",
    tabInvitations: "Mwaliko kwako",
    tabCreateInvitation: "Alika wengine",
    tabCustomize: "Anpassa chaguzi",
    primaryAreaLabel: "Eneo la msingi",
    noAreaSelected: "Hakuna eneo lililoteuliwa",
    showingCount: "Inaonyesha {count} kati ya jumla ya mialiko {total}",
    bulletinBoardStatus: "Hali ya ubao wa matangazo",
    realtimeSynced: "Imeoanishwa katika muda halisi",
    syncingText: "Inasawazisha...",
    syncSynced: "Imesawazishwa",
    syncSyncing: "Inasawazisha",
    introHeading: "Mwaliko kwako",
    introShortText: "Ubao wa matangazo ya kidijitali na lango la SMS kwa ajili ya mikutano na shughuli katika eneo lako.",
    introFullText: "Ubao huu wa matangazo wa PWA unamrahisishia kila mtu kuunda, kupata na kujibu mikutano na shughuli katika eneo la karibu.",
    readMoreBtn: "...soma zaidi",
    readLessBtn: "onyesha kidogo",
    disclaimerText: "Hii ni huduma inayojitegemea, isiyo rasmi na haina ufadhili kutoka kwa kata ya Utby."
  },
  vi: {
    gatewayTitle: "Lời mời dành cho bạn",
    gatewaySubtitle: "",
    gatewayPrompt: "Välj ditt språk för att fortsätta • Choose your language",
    introScreenText: "Dịch vụ này giúp cho mọi người đến thăm tiểu giáo khu dễ dàng trở thành một người bạn, được nuôi dưỡng bởi lời tốt lành của Thượng Đế và giúp đỡ người khác trong khi tôn trọng quyền riêng tư của nhau. Bất kỳ ai quan tâm đến việc đến thăm nhà thờ đều có thể bật hoặc tắt thông báo bất cứ lúc nào, hoặc đề xuất lời mời. Tại đây, các lời mời được đọc ẩn danh, nhưng bạn mời người khác một cách công khai bằng những đề xuất đơn giản thông qua các lãnh đạo tiểu giáo khu. Không ai khác ngoài bạn, hoặc người mà bạn chọn để nhắn tin trả lời, có thể thấy liệu bạn đã nhận hoặc xem thông báo hay chưa. Đây là một dịch vụ độc lập, không chính thức và không có sự tài trợ từ tiểu giáo khu Utby.",
    introScreenBtn: "Bắt đầu sử dụng ứng dụng",
    introScreenBtnOk: "OK, đã hiểu",
    introScreenBtnCustomize: "⚙️ Tùy chỉnh thông báo",
    
    onboardingHeader: "Nhận thông báo",
    onboardingSubtitle: "Bạn sẽ nhận được thông báo kín đáo trực tiếp trên điện thoại của mình khi có lời mời phù hợp với các lựa chọn của bạn. Mọi thứ được lưu trong một nguồn cấp dữ liệu.",
    onboardingIntro: "Chào mừng! Bằng cách thiết lập bốn tùy chọn cá nhân khác nhau bên dưới, bạn có thể chọn chính xác nơi và cách bạn muốn tham gia và giúp đỡ. Ngay khi có nhu cầu phù hợp với hồ sơ của bạn, bạn sẽ nhận được thông báo di động kín đáo trong thời gian thực trong khi quyền riêng tư của bạn được bảo vệ. Không ai ngoài bạn có thể thấy thông báo nào bạn theo dõi hoặc nhận. Chỉ người bạn trả lời qua SMS riêng tư mới có thể biết khi bạn trả lời.",
    customizeChoicesBtn: "TÙY CHỈNH LỰA CHỌN CỦA TÔI",
    
    step1Title: "Bước 1 trên 4: Nỗ lực hỗ trợ địa phương",
    step1Subtitle: "Chọn địa điểm nơi bạn có thể hỗ trợ địa phương là chính (ví dụ: trong các buổi học, trò chuyện hoặc giúp đỡ thực tế). Địa điểm này sẽ là khu vực giám sát chính của bạn.",
    
    step2Title: "Bước 2 trên 4: Hỗ trợ ngôn ngữ",
    step2Subtitle: "Nhấp vào các ngôn ngữ bạn có thể giúp đỡ trong các buổi gặp gỡ hoặc bài học (không có ngôn ngữ nào được chọn sẵn, bạn không bắt buộc phải chọn).",

    step3Title: "Bước 3 trên 4: Thành viên nhóm",
    step3Subtitle: "Nhận thông báo từ các nhóm hợp tác (chọn một nhóm dành cho bạn): Tại đây bạn có thể tham gia vào các lời mời mở từ các nhóm sau và các truyền giáo trẻ trong giáo hội.",
    
    step4Title: "Bước 4 trên 4: Chọn định dạng",
    step4Subtitle: "Chọn định dạng phù hợp nhất với hoàn cảnh sống của bạn.",

    formatPhysicalTitle: "Gặp mặt trực tiếp",
    formatPhysicalDesc: "Trực tiếp: Tôi rất sẵn lòng tham gia trực tiếp (ví dụ: tại nhà của ai đó, nhà thờ, các ngày phục vụ hoặc bữa ăn chung).",
    formatDigitalTitle: "Qua điện thoại / video / từ xa",
    formatDigitalDesc: "Qua điện thoại / video / từ xa: Tôi sẵn sàng tham gia qua điện thoại hoặc kỹ thuật số khi cần thiết.",
    formatSpiritualTitle: "Qua ý tưởng tâm linh",
    formatSpiritualDesc: "Qua ý tưởng tâm linh: Tôi có thể xem xét việc nhận hoặc chia sẻ những suy nghĩ tâm linh ngắn gọn, mang tính nâng đỡ thông qua thông báo im lặng hoặc các yêu cầu từ những người truyền giáo của giáo khu và toàn thời gian gửi cho tôi.",

    orgChoiceLabel: "Tổ chức của tôi (chọn một):",
    orgBror: "Nhóm túc số Trưởng lão (Anh em)",
    orgSyster: "Hội Cứu trợ (Chị em)",

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
    privacyNotice: "Bảo vệ Quyền riêng tư: Để bảo vệ quyền riêng tư cá nhân của các thành viên và người tổ chức, không có địa chỉ nhà chính xác nào được hiển thị trong văn bản. Vị trí được làm mờ trên bản đồ thành khu vực chung.",
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
    footerNotice: "Khi bạn nhấp vào nút, ứng dụng SMS tích hợp trên điện thoại của bạn sẽ mở ra với một tin nhắn được viết sẵn gửi đến số điện thoại ẩn của người tổ chức.",
    tabInvitations: "Lời mời dành cho bạn",
    tabCreateInvitation: "Mời người khác",
    tabCustomize: "Tùy chỉnh lựa chọn",
    primaryAreaLabel: "Khu vực chính",
    noAreaSelected: "Chưa chọn khu vực",
    showingCount: "Hiển thị {count} trên tổng số {total} lời mời",
    bulletinBoardStatus: "Trạng thái bảng thông báo",
    realtimeSynced: "Được đồng bộ hóa trong thời gian thực",
    syncingText: "Đang đồng bộ hóa...",
    syncSynced: "Đã đồng bộ",
    syncSyncing: "Đang đồng bộ",
    introHeading: "Lời mời dành cho bạn",
    introShortText: "Bảng thông báo kỹ thuật số và cổng SMS cho các cuộc gặp gỡ trong khu vực của bạn.",
    introFullText: "Bảng thông báo PWA này giúp mọi người dễ dàng tạo, tìm và phản hồi các cuộc gặp gỡ và hoạt động trong khu vực địa phương.",
    readMoreBtn: "...đọc thêm",
    readLessBtn: "thu gọn",
    disclaimerText: "Đây là dịch vụ độc lập, không chính thức và không có sự tài trợ từ tiểu giáo khu Utby."
  }
};

