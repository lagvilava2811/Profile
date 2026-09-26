// js/data/projects.js
// ვაკო ლაღვილავას გუნდის პორტფოლიოს პროექტები კატეგორიებითა და Case Study მონაცემებით

export const projectsData = [
  {
    id: "proj-1",
    title: "Apex Logistics & Supply Chain",
    category: "web-dev",
    categoryName: "ვებ დეველოპმენტი",
    tag: "Custom Web App",
    year: "2026",
    summary: "საერთაშორისო სატვირთო გადაზიდვების პლატფორმა რეალურ დროში ტვირთების მონიტორინგითა და ავტომატური კალკულაციით.",
    client: "Apex Global Transit",
    challenge: "კლიენტის ძველი საიტი იყო ნელი (Lighthouse 34), არ ჰქონდა მობილური ადაპტაცია და მომხმარებლებს არ შეეძლოთ ფასის ავტომატური გამოთვლა.",
    solution: "ნულიდან ავაწყეთ მაღალი წარმადობის ვებ პლატფორმა მოდულარულ არქიტექტურაზე, ინტეგრირებული GPS ტრეკინგითა და ტარიფების ჭკვიანი კალკულატორით.",
    result: "+240% გაზრდილი კონვერსია, 0.4 წამი ჩატვირთვის დრო (Lighthouse 99), თვეში 40,000+ დამუშავებული შეკვეთა.",
    metrics: [
      { label: "ჩატვირთვის დრო", value: "0.4s" },
      { label: "კონვერსიის ზრდა", value: "+240%" },
      { label: "Lighthouse Score", value: "99/100" }
    ],
    tech: ["JavaScript ES6+", "Node.js", "GSAP ScrollTrigger", "Interactive Maps API"],
    beforeAfter: {
      type: "speed",
      beforeLabel: "ძველი სისტემა: 6.8s ჩატვირთვა",
      afterLabel: "ახალი სისტემა: 0.4s ჩატვირთვა"
    }
  },
  {
    id: "proj-2",
    title: "Nova Health & Wellness Brand",
    category: "design",
    categoryName: "დიზაინი & ბრენდინგი",
    tag: "UI/UX & Identity",
    year: "2026",
    summary: "პრემიუმ ველნეს-ბრენდის სრული ვიზუალური იდენტობა, ლოგოტიპი, შეფუთვის დიზაინი და მობილური აპლიკაციის UI/UX.",
    client: "Nova Care Labs",
    challenge: "ბრენდი შემოდიოდა კონკურენტულ ბაზარზე მკაფიო განმასხვავებელი ნიშნის გარეშე, საჭირო იყო ელიტური, სანდო და სუფთა იმიჯი.",
    solution: "შევქმენით მინიმალისტური, ბუნებასა და მეცნიერებაზე დაფუძნებული ვიზუალური სისტემა, ინტერაქტიული აპლიკაციის პროტოტიპი და 3D შეფუთვები.",
    result: "პირველ თვეში გაყიდვების 3.8x ზრდა, Awwwards Mobile Excellence ნომინაცია და 100% დადებითი მომხმარებლის შეფასება.",
    metrics: [
      { label: "გაყიდვების ზრდა", value: "3.8x" },
      { label: "მომხმარებელთა კმაყოფილება", value: "98%" },
      { label: "დიზაინის ნომინაცია", value: "Awwwards" }
    ],
    tech: ["Figma", "Design System", "3D Product Renders", "Micro-Interactions"],
    beforeAfter: {
      type: "visual",
      beforeLabel: "ძველი იდენტობა: ტიპური და შეუმჩნეველი",
      afterLabel: "ახალი იდენტობა: პრემიუმ და დასამახსოვრებელი"
    }
  },
  {
    id: "proj-3",
    title: "Kura FinTech AI Concierge",
    category: "ai-automation",
    categoryName: "AI ავტომატიზაცია",
    tag: "Autonomous AI Agent",
    year: "2026",
    summary: "ფინტექ პლატფორმისთვის შექმნილი ავტონომიური AI აგენტების ქსელი — მომხმარებელთა 24/7 მომსახურება და ფინანსური რეპორტინგის ავტომატიზაცია.",
    client: "Kura Capital Group",
    challenge: "მხარდაჭერის გუნდს უწევდა დღეში 1,500+ განმეორებად შეკითხვაზე პასუხის გაცემა, რაც იწვევდა შეფერხებებს და მომხმარებლების უკმაყოფილებას.",
    solution: "ავაგეთ მრავალდონიანი RAG AI აგენტი, რომელიც უკავშირდება კლიენტის შიდა ცოდნის ბაზას, უსაფრთხოდ ამოწმებს ანგარიშის სტატუსებს და მომენტალურად გასცემს პასუხებს.",
    result: "მხარდაჭერის ხარჯების 72%-ით შემცირება, საშუალო პასუხის დრო 15 წუთიდან 1.2 წამამდე დაყვანა, 24/7 უწყვეტი მუშაობა.",
    metrics: [
      { label: "პასუხის სიჩქარე", value: "1.2s" },
      { label: "ხარჯების დაზოგვა", value: "72%" },
      { label: "ავტომატიზებული მოთხოვნები", value: "88%" }
    ],
    tech: ["Custom AI Agents", "Python / Node", "Vector Search", "Enterprise Security"],
    beforeAfter: {
      type: "time",
      beforeLabel: "ხელით პასუხი: 15 წთ ლოდინი",
      afterLabel: "AI აგენტი: 1.2 წმ მომენტალური პასუხი"
    }
  },
  {
    id: "proj-4",
    title: "Vortex Motion Series & 3D Promo",
    category: "video",
    categoryName: "ვიდეო პროდუქცია",
    tag: "3D Motion Graphics",
    year: "2026",
    summary: "ინოვაციური აუდიოტექნოლოგიის პროდუქტის გამშვები 3D ანიმაცია და სარეკლამო ვიდეო რგოლები გლობალური კამპანიისთვის.",
    client: "Vortex Audio",
    challenge: "პროდუქტის შიდა აკუსტიკური ტექნოლოგია უხილავი იყო ფოტოზე; საჭირო იყო ვიზუალი, რომელიც აჩვენებდა ხმის ტალღების დინამიკას.",
    solution: "შევქმენით ფოტორეალისტური 3D მოდელირება, დინამიური ნაწილაკების (particles) სიმულაცია და ხმოვანი დიზაინი (custom Sound FX).",
    result: "2.4 მილიონი ორგანული ნახვა სოციალურ ქსელებში, ვიდეოს ნახვის დასრულების მაჩვენებელი (VTR) 68% (ინდუსტრიის საშუალოზე 3-ჯერ მეტი).",
    metrics: [
      { label: "ორგანული ნახვები", value: "2.4M" },
      { label: "Completion Rate", value: "68%" },
      { label: "ROAS რეკლამაში", value: "5.4x" }
    ],
    tech: ["Cinema 4D", "After Effects", "Octane Render", "Sound Design"],
    beforeAfter: {
      type: "retention",
      beforeLabel: "სტატიკური ფოტო: 12% ჩართულობა",
      afterLabel: "3D Motion ვიდეო: 68% სრული ნახვა"
    }
  },
  {
    id: "proj-5",
    title: "MedTech Global Localization",
    category: "translation",
    categoryName: "თარგმნა & ლოკალიზაცია",
    tag: "Medical Translation & UI",
    year: "2026",
    summary: "სამედიცინო აპარატურისა და პროგრამული უზრუნველყოფის სრული ლოკალიზაცია 4 ენაზე (ქართული, ინგლისური, გერმანული, ფრანგული).",
    client: "BioSync Diagnostics",
    challenge: "მკაცრი სამედიცინო რეგულაციები და სპეციფიკური ტერმინოლოგია, სადაც ოდნავი უზუსტობაც კი დაუშვებელი იყო.",
    solution: "სამედიცინო ექსპერტ-მთარგმნელებისა და ტექნიკური რედაქტორების ორეტაპიანი გადამოწმება, UI სტრინგების სიგრძის ადაპტაცია ინტერფეისისთვის.",
    result: "100%-ით წარმატებული სერტიფიცირება ევროკავშირის რეგულატორთან, უნაკლო UI და ადგილობრივ ბაზრებზე შეუფერხებელი გაშვება.",
    metrics: [
      { label: "ლოკალიზებული ენები", value: "4 ენა" },
      { label: "ტერმინოლოგიური სიზუსტე", value: "100%" },
      { label: "რეგულატორის აკრედიტაცია", value: "Certified" }
    ],
    tech: ["CAT QA Tools", "Medical Glossary", "Bilingual Review", "UI String Validation"],
    beforeAfter: {
      type: "quality",
      beforeLabel: "მანქანური: 'ხელოვნური და ხარვეზიანი'",
      afterLabel: "პროფესიონალური: 'ბუნებრივი და სერტიფიცირებული'"
    }
  },
  {
    id: "proj-6",
    title: "EuroEstate Organic Search Dominance",
    category: "seo",
    categoryName: "SEO & მარკეტინგი",
    tag: "High-Intent SEO Engine",
    year: "2026",
    summary: "უძრავი ქონების პრემიუმ სააგენტოს Google-ის ტოპ პოზიციებზე გაყვანა მაღალკონვერსიულ საკვანძო სიტყვებზე.",
    client: "EuroEstate Real Estate",
    challenge: "კომპანია ხარჯავდა თვეში $8,000+ Google Ads-ში, თუმცა რეკლამის გათიშვისთანავე კლიენტების შემოდინება ნულამდე ეცემოდა.",
    solution: "სიღრმისეული ტექნიკური აუდიტი, Core Web Vitals ოპტიმიზაცია, უძრავი ქონების სპეციფიკური Schema Markup და ლოკალური SEO არქიტექტურა.",
    result: "ორგანული ტრაფიკის 410%-ით ზრდა 6 თვეში, 85+ საკვანძო სიტყვა Google-ის TOP 3-ში, სარეკლამო ბიუჯეტის 60%-ით დაზოგვა.",
    metrics: [
      { label: "ორგანული ზრდა", value: "+410%" },
      { label: "Top 3 პოზიციები", value: "85+ Keyword" },
      { label: "დაზოგილი Ad Spend", value: "$4,800/თვე" }
    ],
    tech: ["Technical Audit", "Semantic Schema", "Search Console", "High-Intent Strategy"],
    beforeAfter: {
      type: "traffic",
      beforeLabel: "დამოკიდებულება რეკლამაზე: $8,000/თვე",
      afterLabel: "ორგანული TOP 1: უფასო სტაბილური ტრაფიკი"
    }
  }
];

export const projectCategories = [
  { id: "all", label: "ყველა ნამუშევარი" },
  { id: "web-dev", label: "ვებ & აპლიკაციები" },
  { id: "design", label: "დიზაინი & ბრენდინგი" },
  { id: "ai-automation", label: "AI ავტომატიზაცია" },
  { id: "video", label: "ვიდეო & Motion" },
  { id: "translation", label: "თარგმნა" },
  { id: "seo", label: "SEO & ზრდა" }
];
