import { MenuItem } from "../types/menu";

export const menuItems: MenuItem[] = [
  // --- وجبات رئيسية (main_dishes) ---
  { id: "m1",
    name: "وجبة برجر لحم دبل",
    price: 45, 
    category: "main_dishes", 
    description: "شريحتين من لحم الأنجوس المشوي مع الجبن السائل، الخس، والطماطم يقدم مع البطاطس",
    image: "/img/hamburguesa-cerdo-delicia-gourmet-adornada-tocino-queso-papas-fritas_795881-11284.jpg"
  },
  { id: "m2",
     name: "برجر دجاج مقرمش",
      price: 38, 
      category: "main_dishes", 
      description: "صدر دجاج مقرمش مع صلصة المايونيز الحارة والخس الطازج",
      image: "/img/OIP.webp"
   },
  { id: "m3", 
    name: "بيتزا مارغريتا", 
    price: 40, 
    category: "main_dishes",
     description: "عجينة إيطالية تقليدية مع صلصة الطماطم الغنية وجبن الموزاريلا الفاخر",
     image: "/img/OIP-1.webp"
     },
  { id: "m4", 
    name: "بيتزا دجاج باربكيو", 
    price: 48,
     category: "main_dishes", 
     description: "قطع دجاج مشوية، بصل، جبن موزاريلا، وصلصة الباربكيو المدخنة",
     image: "/img/R.jfif"
     },
  { id: "m5",
     name: "باستا الدجاج بالكريمة (ألفredo)",
      price: 42, 
      category: "main_dishes", 
      description: "معكرونة الفيتوتشيني مع قطع الدجاج والفطر في صلصة الكريمة البيضاء الغنية",
    image: "/img/OIP-2.webp"
    },
  { id: "m6", 
    name: "وجبة شاورما عربي سوبر",
     price: 35,
      category: "main_dishes",
       description: "قطع شاورما دجاج متبلة في خبز صاج، تقطع وتقدم مع بطاطس ومقبلات وثومية",
      image: "/img/OIP-3.webp"
      },

  // --- مقبلات وسلطات (appetizers) ---
  { id: "a1", 
    name: "بطاطس مقلية بالجبن",
     price: 18,
      category: "appetizers", 
      description: "أصابع بطاطس مقرمشة مغطاة بصلصة الجبن الدافئة",
     image: "/img/3653556429.jpg"
    },
  { id: "a2",
     name: "أصابع الموزاريلا المقرمشة",
      price: 22,
       category: "appetizers",
        description: "4 قطع من أصابع جبن الموزاريلا المقلية تقدم مع صلصة المارينارا",
      image: "/img/555.jpg"
      },
  { id: "a3",
     name: "حلقات البصل المقرمشة", 
     price: 15, 
     category: "appetizers",
      description: "حلقات بصل ذهبية مقلية تقدم مع صلصة الباربكيو",
    image: "/img/OIP-6.webp"
    },
  { id: "a4",
     name: "سلطة سيزر بالدجاج",
      price: 25,
       category: "appetizers",
        description: "خس روماني، قطع دجاج مشوية، خبز محمص، مغطاة بصلصة السيزر وجبن البارميزان",
      image: "/img/OIP-7.webp"
      },
  { id: "a5",
     name: "سلطة يونانية",
      price: 20,
       category: "appetizers",
        description: "طماطم، خيار، بصل، زيتون أسود، وجبن الفيتا مع زيت الزيتون والزعتر",
      image: "/img/OIP-8.webp"
      },

  // --- مشروبات (drinks) ---
  { id: "dr1",
     name: "عصير برتقال طازج",
      price: 15,
       category: "drinks",
        description: "عصير برتقال طبيعي 100% معصور طازجاً",
      image: "/img/pngtree-orange-juice-fruit-oranges-tangerines-poster-image_1033353.jpg"
      },
  { id: "dr2",
     name: "ليمون بالنعناع بارد",
      price: 14,
       category: "drinks",
        description: "مزيج منعش من الليمون الحامض والنعناع الطازج مع الثلج",
      image: "/img/OIP-4.webp"
      },
  { id: "dr3",
     name: "ميلك شيك شوكولاتة",
      price: 18,
       category: "drinks",
        description: "مخفوق الحليب البارد مع آيس كريم الشوكولاتة والكريمة المخفوقة",
      image: "/img/OIP-5.jpg"
      },
  { id: "dr4",
     name: "مشروبات غازية",
      price: 8,
       category: "drinks",
        description: "كوكا كولا، سبرايت، فانتا (حسب اختيارك)",
      image: "/img/R (1).jfif"
      },
  { id: "dr5",
     name: "مياه معدنية",
      price: 5,
       category: "drinks",
        description: "زجاجة مياه نقية مبردة",
      image: "/img/OIP-5.webp"
      },

  // --- حلويات (desserts) ---
  { id: "de1",
     name: "مولتن كيك (لافا كيك)",
      price: 25,
       category: "desserts", 
       description: "كعكة الشوكولاتة الدافئة المحشوة بالشوكولاتة السائلة تقدم مع كرة آيس كريم فانيليا",
      image: "/img/OIP-9.webp"
      },
  { id: "de2",
     name: "وافل نوتيلا",
      price: 24,
       category: "desserts",
        description: "قطع الوافل المقرمشة المغطاة بشوكولاتة النوتيلا الغنية وقطع الفراولة",
      image: "/img/OIP-10.webp"
      },
  { id: "de3",
     name: "سلطة فواكه بالآيس كريم",
      price: 20,
       category: "desserts",
        description: "تشكيلة من الفواكه الموسمية الطازجة مع مغرفة من الآيس كريم",
      image: "/img/OIP-11.webp"
      },
  { id: "de4",
     name: "تشيز كيك الفراولة",
      price: 22,
       category: "desserts",
        description: "طبقة غنية من التشيز كيك الكريمي فوق طبقة البسكويت المقرمشة مع صوص الفراولة",
      image: "/img/R (2).jfif"
      }
];