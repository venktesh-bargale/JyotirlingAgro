/* ==========================================================
   SITE CONTENT — products, crops, schemes, seasons, care tips
   Text fields are [Marathi, Hindi, English].
   To add a product photo: put the image in /assets and add  img: 'assets/photo.jpg'
   To show a price: add  price: 12500  (otherwise "Ask price" is shown)
   ========================================================== */
window.SITE_DATA = {

  categories: ['machinery', 'sprayers', 'dairy', 'livestock', 'fertilizer', 'pesticide', 'seeds', 'spares'],

  products: [
    { id: 'chaff-manual', cat: 'machinery', n: ['हाताची कडबा कुट्टी', 'हाथ वाली चाफ कटर', 'Manual chaff cutter'], d: ['वीज नसतानाही चारा बारीक करा', 'बिना बिजली चारा काटें', 'Chop fodder without electricity'] },
    { id: 'chaff-electric', cat: 'machinery', n: ['इलेक्ट्रिक कडबा कुट्टी', 'इलेक्ट्रिक चाफ कटर', 'Electric chaff cutter'], d: ['मोठ्या गोठ्यासाठी जलद कुट्टी', 'बड़ी गौशाला के लिए तेज़ कटाई', 'Fast chopping for bigger sheds'] },
    { id: 'power-weeder', cat: 'machinery', n: ['पॉवर वीडर', 'पावर वीडर', 'Power weeder'], d: ['आंतरमशागत व तण नियंत्रण', 'निराई-गुड़ाई व खरपतवार नियंत्रण', 'Inter-cultivation and weed control'] },
    { id: 'battery-sprayer', cat: 'sprayers', n: ['बॅटरी स्प्रेअर', 'बैटरी स्प्रेयर', 'Battery sprayer'], d: ['हात न दुखता दिवसभर फवारणी', 'बिना थकान दिनभर छिड़काव', 'Spray all day without hand pumping'] },
    { id: 'knapsack-sprayer', cat: 'sprayers', n: ['हाताचा फवारणी पंप', 'हाथ वाला स्प्रे पंप', 'Manual knapsack sprayer'], d: ['साधा, टिकाऊ आणि स्वस्त', 'सरल, टिकाऊ और सस्ता', 'Simple, durable and low-cost'] },
    { id: 'power-sprayer', cat: 'sprayers', n: ['पेट्रोल पॉवर स्प्रेअर (HTP)', 'पेट्रोल पावर स्प्रेयर (HTP)', 'Petrol power sprayer (HTP)'], d: ['द्राक्ष व डाळिंब बागांसाठी', 'अंगूर व अनार बागों के लिए', 'For grape and pomegranate orchards'] },
    { id: 'milking-single', cat: 'dairy', n: ['मिल्किंग मशीन — सिंगल बकेट', 'मिल्किंग मशीन — सिंगल बकेट', 'Milking machine — single bucket'], d: ['५–१० जनावरांच्या गोठ्यासाठी', '5–10 पशुओं की गौशाला के लिए', 'For sheds with 5–10 animals'] },
    { id: 'milking-double', cat: 'dairy', n: ['मिल्किंग मशीन — डबल बकेट', 'मिल्किंग मशीन — डबल बकेट', 'Milking machine — double bucket'], d: ['मोठ्या डेअरी फार्मसाठी', 'बड़े डेयरी फार्म के लिए', 'For larger dairy farms'] },
    { id: 'cow-mat', cat: 'livestock', n: ['गोठ्यासाठी रबर मॅट', 'गौशाला रबर मैट', 'Cattle rubber mat'], d: ['जनावरांना आराम, खुरांचे संरक्षण', 'पशुओं को आराम, खुरों की सुरक्षा', 'Comfort for animals, protects hooves'] },
    { id: 'water-bowl', cat: 'livestock', n: ['स्वयंचलित पाण्याचे भांडे', 'ऑटोमैटिक पानी का बर्तन', 'Automatic water bowl'], d: ['जनावरांना सतत स्वच्छ पाणी', 'पशुओं को लगातार साफ़ पानी', 'Clean water for animals all day'] },
    { id: 'urea', cat: 'fertilizer', n: ['युरिया (४५ किलो)', 'यूरिया (45 किलो)', 'Urea (45 kg)'], d: ['४६% नत्र', '46% नाइट्रोजन', '46% nitrogen'] },
    { id: 'dap', cat: 'fertilizer', n: ['डीएपी (५० किलो)', 'डीएपी (50 किलो)', 'DAP (50 kg)'], d: ['१८% नत्र, ४६% स्फुरद', '18% नाइट्रोजन, 46% फास्फोरस', '18% N, 46% P'] },
    { id: 'mop', cat: 'fertilizer', n: ['एमओपी पोटॅश (५० किलो)', 'एमओपी पोटाश (50 किलो)', 'MOP potash (50 kg)'], d: ['६०% पालाश', '60% पोटाश', '60% potash'] },
    { id: 'npk-102626', cat: 'fertilizer', n: ['मिश्रखत १०:२६:२६', 'मिश्रित खाद 10:26:26', 'NPK 10:26:26'], d: ['पेरणी व लागवडीच्या वेळी', 'बुवाई व रोपाई के समय', 'At sowing and planting'] },
    { id: 'wsf-191919', cat: 'fertilizer', n: ['पाण्यात विरघळणारे खत १९:१९:१९', 'पानी में घुलनशील खाद 19:19:19', 'Water-soluble 19:19:19'], d: ['ठिबक व फवारणीतून', 'ड्रिप व छिड़काव से', 'Through drip or foliar spray'] },
    { id: 'insecticide', cat: 'pesticide', n: ['कीटकनाशके', 'कीटनाशक', 'Insecticides'], d: ['मावा, तुडतुडे, अळी नियंत्रण', 'माहू, तेला, इल्ली नियंत्रण', 'For aphids, hoppers and caterpillars'] },
    { id: 'fungicide', cat: 'pesticide', n: ['बुरशीनाशके', 'फफूंदनाशक', 'Fungicides'], d: ['डाऊनी, भुरी, करपा', 'डाउनी, पाउडरी मिल्ड्यू, झुलसा', 'Downy, powdery mildew, blight'] },
    { id: 'herbicide', cat: 'pesticide', n: ['तणनाशके', 'खरपतवारनाशक', 'Herbicides'], d: ['पिकानुसार योग्य तणनाशक', 'फसल अनुसार सही खरपतवारनाशक', 'The right herbicide for each crop'] },
    { id: 'veg-seeds', cat: 'seeds', n: ['भाजीपाला बियाणे', 'सब्ज़ी बीज', 'Vegetable seeds'], d: ['टोमॅटो, मिरची, वांगी, कोबी', 'टमाटर, मिर्च, बैंगन, गोभी', 'Tomato, chilli, brinjal, cabbage'] },
    { id: 'rabi-seeds', cat: 'seeds', n: ['रब्बी बियाणे', 'रबी बीज', 'Rabi seeds'], d: ['गहू, हरभरा, ज्वारी', 'गेहूँ, चना, ज्वार', 'Wheat, gram, jowar'] },
    { id: 'kharif-seeds', cat: 'seeds', n: ['खरीप बियाणे', 'खरीफ बीज', 'Kharif seeds'], d: ['सोयाबीन, मका, भुईमूग', 'सोयाबीन, मक्का, मूंगफली', 'Soybean, maize, groundnut'] },
    { id: 'blades', cat: 'spares', n: ['कडबा कुट्टी ब्लेड', 'चाफ कटर ब्लेड', 'Chaff cutter blades'], d: ['धार असलेले नवीन ब्लेड', 'धारदार नए ब्लेड', 'Sharp replacement blades'] },
    { id: 'nozzles', cat: 'spares', n: ['नोझल व स्प्रे गन', 'नोज़ल व स्प्रे गन', 'Nozzles & spray guns'], d: ['सर्व पंपांसाठी', 'सभी पंपों के लिए', 'For all sprayers'] },
    { id: 'sprayer-battery', cat: 'spares', n: ['स्प्रेअर बॅटरी व चार्जर', 'स्प्रेयर बैटरी व चार्जर', 'Sprayer battery & charger'], d: ['जुन्या पंपाला नवीन जीव', 'पुराने पंप में नई जान', 'New life for your old sprayer'] }
  ],

  // Fertilizer doses per ACRE [N, P, K] kg — source: reference site (MPKV recommendations)
  crops: [
    { id: 'cane', n: ['आडसाली ऊस', 'आडसाली गन्ना', 'Adsali sugarcane'], npk: [160, 68, 68] },
    { id: 'grape', n: ['द्राक्षे', 'अंगूर', 'Grapes'], npk: [120, 80, 100] },
    { id: 'soy', n: ['सोयाबीन', 'सोयाबीन', 'Soybean'], npk: [12, 24, 12] },
    { id: 'veg', n: ['भाजीपाला व टोमॅटो', 'सब्ज़ी व टमाटर', 'Vegetables & tomato'], npk: [80, 40, 40] },
    { id: 'turmeric', n: ['हळद', 'हल्दी', 'Turmeric'], npk: [80, 40, 40] },
    { id: 'pom', n: ['डाळिंब', 'अनार', 'Pomegranate'], npk: [100, 50, 80] },
    { id: 'maize', n: ['मका', 'मक्का', 'Maize'], npk: [48, 24, 16] },
    { id: 'wheat', n: ['गहू', 'गेहूँ', 'Wheat'], npk: [48, 24, 16] }
  ],

  // Season guide — chosen automatically from the current month
  seasons: [
    { months: [6, 7, 8, 9], title: ['खरीप हंगाम · जून ते सप्टेंबर', 'खरीफ मौसम · जून से सितंबर', 'Kharif season · June to September'],
      head: ['पेरणी, खुरपणी आणि कीड नियंत्रणाचा काळ', 'बुवाई, निराई और कीट नियंत्रण का समय', 'Time for sowing, weeding and pest control'],
      items: [
        { t: ['पेरणी व बेसल डोस', 'बुवाई व बेसल डोज़', 'Sowing & basal dose'], d: ['सोयाबीन, मका पेरणीसोबत मिश्रखत द्या. पाऊस नीट झाल्यावरच पेरा.', 'सोयाबीन, मक्का बुवाई के साथ मिश्रित खाद दें। अच्छी बारिश के बाद ही बोएँ।', 'Apply NPK at sowing of soybean and maize. Sow only after good rain.'], tag: 'seeds' },
        { t: ['खुरपणी', 'निराई', 'Weeding'], d: ['पेरणीनंतर २०–३० दिवसांत तण काढा — पॉवर वीडरने मजुरी वाचवा.', 'बुवाई के 20–30 दिन में खरपतवार निकालें — पावर वीडर से मज़दूरी बचाएँ।', 'Weed 20–30 days after sowing — a power weeder saves labour.'], tag: 'machinery' },
        { t: ['कीड नियंत्रण', 'कीट नियंत्रण', 'Pest control'], d: ['पावसाळ्यात अळी व बुरशी वाढते. कोरड्या वेळेत फवारणी करा.', 'बारिश में इल्ली व फफूंद बढ़ती है। सूखे समय में छिड़काव करें।', 'Caterpillars and fungus rise in the rains. Spray in dry spells.'], tag: 'sprayers' }
      ] },
    { months: [10, 11, 12, 1, 2], title: ['रब्बी हंगाम · ऑक्टोबर ते फेब्रुवारी', 'रबी मौसम · अक्टूबर से फ़रवरी', 'Rabi season · October to February'],
      head: ['हिवाळ्यात मिरज परिसरातील शेतीच्या गरजा', 'सर्दियों में मिरज क्षेत्र की खेती की ज़रूरतें', 'What farms around Miraj need this winter'],
      items: [
        { t: ['द्राक्ष बागा', 'अंगूर के बाग', 'Grape vineyards'], d: ['ऑक्टोबर छाटणीनंतर फवारणीचा मुख्य काळ. पंप, नोझल आणि सुटे भाग गर्दीपूर्वीच तपासून घ्या.', 'अक्टूबर छंटाई के बाद छिड़काव का मुख्य समय। पंप, नोज़ल और स्पेयर पहले ही जाँच लें।', 'Peak spraying after October pruning. Get pumps, nozzles and spares checked before the rush.'], tag: 'sprayers' },
        { t: ['ऊस तोडणी', 'गन्ना कटाई', 'Sugarcane harvest'], d: ['उसाचे वाडे चाऱ्यासाठी भरपूर मिळतात — कडबा कुट्टीने बारीक करून नासाडी टाळा.', 'गन्ने के अगोले चारे में भरपूर मिलते हैं — चाफ कटर से काटकर बर्बादी रोकें।', 'Plenty of cane tops for fodder — chop them and cut waste.'], tag: 'machinery' },
        { t: ['दुग्धव्यवसाय', 'डेयरी', 'Dairy'], d: ['हिवाळ्यात दूध उत्पादन वाढतं. मिल्किंग मशीनने वेळ वाचवा आणि दूध स्वच्छ ठेवा.', 'सर्दियों में दूध बढ़ता है। मिल्किंग मशीन से समय बचाएँ और दूध साफ़ रखें।', 'Milk yields rise in winter. A milking machine saves time and keeps milk clean.'], tag: 'dairy' }
      ] },
    { months: [3, 4, 5], title: ['उन्हाळी हंगाम · मार्च ते मे', 'गर्मी का मौसम · मार्च से मई', 'Summer · March to May'],
      head: ['पाणी, चारा आणि पुढच्या हंगामाची तयारी', 'पानी, चारा और अगले मौसम की तैयारी', 'Water, fodder and getting ready for kharif'],
      items: [
        { t: ['पाणी बचत', 'पानी की बचत', 'Save water'], d: ['ठिबकने पाणी वाचवा; पाण्यात विरघळणारी खते ठिबकमधून द्या.', 'ड्रिप से पानी बचाएँ; घुलनशील खाद ड्रिप से दें।', 'Save water with drip; feed water-soluble fertilizers through it.'], tag: 'fertilizer' },
        { t: ['चारा टंचाई', 'चारे की कमी', 'Fodder shortage'], d: ['उन्हाळ्यात चारा कमी पडतो — कुट्टी करून एक काडीही वाया घालवू नका.', 'गर्मी में चारा कम पड़ता है — काटकर एक तिनका भी बर्बाद न करें।', 'Fodder runs short in summer — chop it so nothing is wasted.'], tag: 'machinery' },
        { t: ['यंत्र सर्व्हिसिंग', 'यंत्र सर्विसिंग', 'Machine servicing'], d: ['खरीपापूर्वी पंप, वीडर व कुट्टीची सर्व्हिसिंग व सुटे भाग बदलून घ्या.', 'खरीफ से पहले पंप, वीडर व कटर की सर्विसिंग करा लें।', 'Service pumps, weeders and cutters before kharif.'], tag: 'spares' }
      ] }
  ],

  // Machine care guide
  care: [
    { id: 'sprayer', n: ['बॅटरी स्प्रेअर', 'बैटरी स्प्रेयर', 'Battery sprayer'], steps: [
      ['प्रत्येक वापरानंतर टाकी व नोझल स्वच्छ पाण्याने धुवा.', 'हर उपयोग के बाद टंकी व नोज़ल साफ़ पानी से धोएँ।', 'Rinse the tank and nozzle with clean water after every use.'],
      ['औषध रात्रभर टाकीत ठेवू नका — पंपाचे सील खराब होतात.', 'दवा रातभर टंकी में न छोड़ें — पंप की सील खराब होती है।', 'Never leave chemical in the tank overnight — it ruins the seals.'],
      ['बॅटरी पूर्ण संपण्याआधी चार्ज करा; महिन्यातून एकदा तरी चार्ज करा.', 'बैटरी पूरी खत्म होने से पहले चार्ज करें; महीने में कम से कम एक बार।', 'Charge before the battery runs flat, and at least once a month in storage.'],
      ['गाळणी (फिल्टर) आठवड्यातून एकदा साफ करा.', 'फ़िल्टर हफ़्ते में एक बार साफ़ करें।', 'Clean the strainer once a week.']
    ] },
    { id: 'chaff', n: ['कडबा कुट्टी', 'चाफ कटर', 'Chaff cutter'], steps: [
      ['ब्लेडची धार दर १५ दिवसांनी तपासा; बोथट ब्लेडने मोटर तापते.', 'हर 15 दिन ब्लेड की धार जाँचें; कुंद ब्लेड से मोटर गरम होती है।', 'Check blade sharpness every 15 days; blunt blades overheat the motor.'],
      ['गार्ड नेहमी लावा आणि लहान मुलांना दूर ठेवा.', 'गार्ड हमेशा लगाएँ और बच्चों को दूर रखें।', 'Always keep the guard on and children away.'],
      ['चारा हाताने खोलवर ढकलू नका — काठीने ढकला.', 'चारा हाथ से अंदर तक न धकेलें — डंडे से धकेलें।', 'Never push fodder in by hand — use a stick.'],
      ['बेअरिंगला आठवड्याला ग्रीस द्या.', 'बेयरिंग में हर हफ़्ते ग्रीस डालें।', 'Grease the bearings every week.']
    ] },
    { id: 'weeder', n: ['पॉवर वीडर', 'पावर वीडर', 'Power weeder'], steps: [
      ['दर २५ तासांनी एअर फिल्टर साफ करा.', 'हर 25 घंटे पर एयर फ़िल्टर साफ़ करें।', 'Clean the air filter every 25 hours.'],
      ['इंजिन ऑइल कंपनीने सांगितलेल्या वेळेवर बदला.', 'इंजन ऑयल कंपनी के बताए समय पर बदलें।', 'Change engine oil on the maker’s schedule.'],
      ['वापरानंतर टायन्सवरील माती काढा.', 'उपयोग के बाद टाइन्स से मिट्टी हटाएँ।', 'Scrape soil off the tines after use.'],
      ['दीर्घकाळ ठेवताना टाकीतील पेट्रोल काढून ठेवा.', 'लंबे समय रखने पर टंकी से पेट्रोल निकाल दें।', 'Drain petrol before long storage.']
    ] },
    { id: 'milking', n: ['मिल्किंग मशीन', 'मिल्किंग मशीन', 'Milking machine'], steps: [
      ['कास स्वच्छ धुवून कोरडी केल्यावरच कप लावा.', 'थन धोकर सुखाने के बाद ही कप लगाएँ।', 'Wash and dry the udder before fitting cups.'],
      ['कप व नळ्या रोज कोमट पाण्याने व डिटर्जंटने धुवा.', 'कप व नलियाँ रोज़ गुनगुने पानी व डिटर्जेंट से धोएँ।', 'Wash cups and tubes daily with warm water and detergent.'],
      ['व्हॅक्यूम प्रेशर ठरलेल्या मर्यादेतच ठेवा.', 'वैक्यूम प्रेशर तय सीमा में रखें।', 'Keep vacuum pressure within the set range.'],
      ['रबर लायनर दर ६ महिन्यांनी बदला.', 'रबर लाइनर हर 6 महीने बदलें।', 'Replace rubber liners every 6 months.']
    ] }
  ],

  // Government schemes (checked Nov 2026 — confirm on official portals)
  schemes: [
    { id: 'mech', tag: ['महाडीबीटी', 'महाडीबीटी', 'MahaDBT'], big: '40–50%', t: ['कृषी यांत्रिकीकरण अनुदान', 'कृषि यंत्रीकरण सब्सिडी', 'Farm mechanisation subsidy'],
      d: ['कडबा कुट्टी, पॉवर वीडर, स्प्रेअर, ट्रॅक्टरचलित अवजारांसाठी अनुदान.', 'चाफ कटर, पावर वीडर, स्प्रेयर, ट्रैक्टर उपकरणों पर सब्सिडी।', 'Subsidy on chaff cutters, power weeders, sprayers and tractor implements.'],
      elig: ['७/१२ असलेले महाराष्ट्रातील शेतकरी. अल्प/अत्यल्प भूधारक, अनुसूचित जाती/जमाती व महिला शेतकऱ्यांना जास्त अनुदान.', '7/12 वाले महाराष्ट्र के किसान। छोटे/सीमांत, एससी/एसटी और महिला किसानों को ज़्यादा सब्सिडी।', 'Maharashtra farmers with a 7/12 extract. Small/marginal, SC/ST and women farmers get the higher rate.'],
      how: ['MahaDBT वर नोंदणी → यंत्र निवडा → सोडत/निवड → पूर्वसंमती → अधिकृत विक्रेत्याकडून खरेदी → बिल अपलोड → अनुदान थेट बँकेत.', 'MahaDBT पर पंजीकरण → यंत्र चुनें → लॉटरी/चयन → पूर्व-स्वीकृति → अधिकृत विक्रेता से खरीद → बिल अपलोड → सब्सिडी सीधे बैंक में।', 'Register on MahaDBT → pick the machine → lottery/selection → pre-sanction → buy from an authorised dealer → upload bill → subsidy paid to your bank.'],
      url: 'https://mahadbt.maharashtra.gov.in' },
    { id: 'drip', tag: ['ठिबक व तुषार', 'ड्रिप व स्प्रिंकलर', 'Drip & sprinkler'], big: '55–80%', t: ['सूक्ष्म सिंचन अनुदान', 'सूक्ष्म सिंचाई सब्सिडी', 'Micro-irrigation subsidy'],
      d: ['केंद्राकडून अल्प/अत्यल्प भूधारकांना ५५%, इतरांना ४५%. राज्याच्या पूरक अनुदानासह अल्प भूधारकांना ८०% पर्यंत.', 'केंद्र से छोटे/सीमांत किसानों को 55%, अन्य को 45%। राज्य की पूरक सब्सिडी से छोटे किसानों को 80% तक।', 'Centre pays 55% for small/marginal farmers and 45% for others. With Maharashtra’s top-up, small farmers can reach 80%.'],
      elig: ['५ हेक्टरपर्यंत क्षेत्रासाठी सर्व शेतकरी. अल्प/अत्यल्प (२ हेक्टरपर्यंत) भूधारकांना जास्त दर.', '5 हेक्टेयर तक सभी किसान। छोटे/सीमांत (2 हेक्टेयर तक) किसानों को ज़्यादा दर।', 'All farmers, up to 5 hectares. Small/marginal farmers (up to 2 ha) get the higher rate.'],
      how: ['MahaDBT वर अर्ज → पूर्वसंमती → नोंदणीकृत कंपनीकडून संच बसवा → तपासणी → अनुदान बँकेत.', 'MahaDBT पर आवेदन → पूर्व-स्वीकृति → पंजीकृत कंपनी से सिस्टम लगवाएँ → निरीक्षण → सब्सिडी बैंक में।', 'Apply on MahaDBT → pre-sanction → install through a registered company → inspection → subsidy to your bank.'],
      url: 'https://mahadbt.maharashtra.gov.in' },
    { id: 'pmfby', tag: ['बदल लक्षात घ्या', 'बदलाव ध्यान दें', 'Rule changed'], warn: true, big: '1.5–5%', t: ['प्रधानमंत्री पीक विमा', 'प्रधानमंत्री फसल बीमा', 'PM crop insurance (PMFBY)'],
      d: ['₹१ पीक विमा योजना २०२५ मध्ये बंद झाली. आता शेतकरी हिस्सा: खरीप २%, रब्बी १.५%, नगदी/बागायती ५%.', '₹1 फसल बीमा योजना 2025 में बंद हुई। अब किसान हिस्सा: खरीफ 2%, रबी 1.5%, नकदी/बागवानी 5%।', 'The ₹1 crop insurance ended in 2025. Farmer share is now 2% for kharif, 1.5% for rabi and 5% for cash/horticulture crops.'],
      elig: ['अधिसूचित पिके घेणारे सर्व शेतकरी, कुळाने शेती करणाऱ्यांसह.', 'अधिसूचित फसल लेने वाले सभी किसान, बटाईदार सहित।', 'All farmers growing notified crops, including tenant farmers.'],
      how: ['हंगामाच्या अंतिम तारखेपूर्वी pmfby.gov.in, बँक किंवा CSC केंद्रातून नोंदणी.', 'मौसम की अंतिम तिथि से पहले pmfby.gov.in, बैंक या CSC से पंजीकरण।', 'Enrol before the season deadline on pmfby.gov.in, at your bank or a CSC centre.'],
      url: 'https://pmfby.gov.in' },
    { id: 'kisan', tag: ['केंद्र शासन', 'केंद्र सरकार', 'Central govt'], big: '₹6,000', t: ['पीएम-किसान सन्मान निधी', 'पीएम-किसान सम्मान निधि', 'PM-KISAN'],
      d: ['पात्र शेतकरी कुटुंबांना वर्षाला ₹६,००० — तीन समान हप्त्यांत थेट बँक खात्यात.', 'पात्र किसान परिवारों को साल में ₹6,000 — तीन बराबर किस्तों में सीधे बैंक खाते में।', '₹6,000 a year to eligible farmer families, in three equal instalments straight to the bank.'],
      elig: ['जमीनधारक शेतकरी कुटुंब. आयकरदाते व काही पदधारक अपात्र.', 'भूमिधारक किसान परिवार। आयकरदाता व कुछ पदधारक अपात्र।', 'Land-owning farmer families. Income-tax payers and some office holders are excluded.'],
      how: ['pmkisan.gov.in वर नोंदणी, ई-केवायसी पूर्ण करा आणि बँक खाते आधारशी जोडा.', 'pmkisan.gov.in पर पंजीकरण, ई-केवाईसी पूरा करें और बैंक खाता आधार से जोड़ें।', 'Register on pmkisan.gov.in, complete e-KYC and link your bank account to Aadhaar.'],
      url: 'https://pmkisan.gov.in' }
  ],

  docs: [
    ['आधार कार्ड', 'आधार कार्ड', 'Aadhaar card'],
    ['७/१२ उतारा', '7/12 उतारा', '7/12 land extract'],
    ['८-अ उतारा', '8-अ उतारा', '8-A extract'],
    ['बँक पासबुक', 'बैंक पासबुक', 'Bank passbook'],
    ['जातीचा दाखला (लागू असल्यास)', 'जाति प्रमाणपत्र (यदि लागू)', 'Caste certificate (if applicable)'],
    ['आधारशी जोडलेला मोबाईल नंबर', 'आधार से जुड़ा मोबाइल नंबर', 'Mobile number linked to Aadhaar'],
    ['यंत्राचे कोटेशन / बिल', 'यंत्र का कोटेशन / बिल', 'Machine quotation / bill']
  ],

  // Market (APMC) names from Agmarknet → local names
  markets: {
    'sangli': ['सांगली', 'सांगली', 'Sangli'], 'miraj': ['मिरज', 'मिरज', 'Miraj'], 'tasgaon': ['तासगाव', 'तासगांव', 'Tasgaon'],
    'islampur': ['इस्लामपूर', 'इस्लामपुर', 'Islampur'], 'vita': ['विटा', 'विटा', 'Vita'], 'palus': ['पलूस', 'पलूस', 'Palus'],
    'jat': ['जत', 'जत', 'Jat'], 'atpadi': ['आटपाडी', 'आटपाडी', 'Atpadi'], 'kavathe mahankal': ['कवठे महांकाळ', 'कवठे महांकाल', 'Kavathe Mahankal'],
    'shirala': ['शिराळा', 'शिराला', 'Shirala'], 'kolhapur': ['कोल्हापूर', 'कोल्हापुर', 'Kolhapur'], 'jaysingpur': ['जयसिंगपूर', 'जयसिंगपुर', 'Jaysingpur'],
    'gadhinglaj': ['गडहिंग्लज', 'गडहिंग्लज', 'Gadhinglaj'], 'vadgaon': ['वडगाव', 'वडगांव', 'Vadgaon'], 'kagal': ['कागल', 'कागल', 'Kagal'],
    'radhanagari': ['राधानगरी', 'राधानगरी', 'Radhanagari'], 'ajara': ['आजरा', 'आजरा', 'Ajara'], 'chandgad': ['चंदगड', 'चंदगड', 'Chandgad']
  },

  // Commodity names from Agmarknet → local names
  commodities: {
    'turmeric': ['हळद', 'हल्दी', 'Turmeric'], 'onion': ['कांदा', 'प्याज़', 'Onion'], 'soyabean': ['सोयाबीन', 'सोयाबीन', 'Soybean'],
    'gur': ['गूळ', 'गुड़', 'Jaggery'], 'jaggery': ['गूळ', 'गुड़', 'Jaggery'], 'raisin': ['बेदाणा', 'किशमिश', 'Raisins'],
    'bengal gram': ['हरभरा', 'चना', 'Gram'], 'gram': ['हरभरा', 'चना', 'Gram'], 'wheat': ['गहू', 'गेहूँ', 'Wheat'],
    'jowar': ['ज्वारी', 'ज्वार', 'Jowar'], 'maize': ['मका', 'मक्का', 'Maize'], 'bajra': ['बाजरी', 'बाजरा', 'Bajra'],
    'tomato': ['टोमॅटो', 'टमाटर', 'Tomato'], 'potato': ['बटाटा', 'आलू', 'Potato'], 'grapes': ['द्राक्षे', 'अंगूर', 'Grapes'],
    'pomegranate': ['डाळिंब', 'अनार', 'Pomegranate'], 'banana': ['केळी', 'केला', 'Banana'], 'groundnut': ['भुईमूग', 'मूंगफली', 'Groundnut'],
    'green chilli': ['हिरवी मिरची', 'हरी मिर्च', 'Green chilli'], 'dry chillies': ['सुकी मिरची', 'सूखी मिर्च', 'Dry chilli'],
    'brinjal': ['वांगी', 'बैंगन', 'Brinjal'], 'cabbage': ['कोबी', 'पत्ता गोभी', 'Cabbage'], 'cauliflower': ['फ्लॉवर', 'फूल गोभी', 'Cauliflower'],
    'garlic': ['लसूण', 'लहसुन', 'Garlic'], 'ginger': ['आले', 'अदरक', 'Ginger'], 'lemon': ['लिंबू', 'नींबू', 'Lemon'],
    'coriander': ['कोथिंबीर', 'धनिया', 'Coriander'], 'methi': ['मेथी', 'मेथी', 'Fenugreek'], 'arhar': ['तूर', 'अरहर', 'Tur'],
    'tur': ['तूर', 'अरहर', 'Tur'], 'green gram': ['मूग', 'मूंग', 'Moong'], 'black gram': ['उडीद', 'उड़द', 'Urad'],
    'cotton': ['कापूस', 'कपास', 'Cotton'], 'sugarcane': ['ऊस', 'गन्ना', 'Sugarcane'], 'bhindi': ['भेंडी', 'भिंडी', 'Okra'],
    'cucumbar': ['काकडी', 'खीरा', 'Cucumber'], 'cucumber': ['काकडी', 'खीरा', 'Cucumber'], 'carrot': ['गाजर', 'गाजर', 'Carrot'],
    'peas': ['वाटाणा', 'मटर', 'Peas'], 'rice': ['तांदूळ', 'चावल', 'Rice'], 'paddy': ['भात', 'धान', 'Paddy'],
    'sunflower': ['सूर्यफूल', 'सूरजमुखी', 'Sunflower'], 'mango': ['आंबा', 'आम', 'Mango'], 'papaya': ['पपई', 'पपीता', 'Papaya'],
    'guava': ['पेरू', 'अमरूद', 'Guava'], 'orange': ['संत्री', 'संतरा', 'Orange'], 'watermelon': ['कलिंगड', 'तरबूज़', 'Watermelon'],
    'spinach': ['पालक', 'पालक', 'Spinach'], 'bottle gourd': ['दुधी भोपळा', 'लौकी', 'Bottle gourd'], 'bitter gourd': ['कारले', 'करेला', 'Bitter gourd'],
    'drumstick': ['शेवगा', 'सहजन', 'Drumstick'], 'pumpkin': ['भोपळा', 'कद्दू', 'Pumpkin'], 'capsicum': ['ढोबळी मिरची', 'शिमला मिर्च', 'Capsicum']
  }
};
