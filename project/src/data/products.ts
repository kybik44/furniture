import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "Aria Lounge Chair",
    price: 229,
    category: "chairs",
    description: "The Aria Lounge Chair combines comfort with minimalist design. The curved backrest and plush cushioning provide exceptional comfort, while the sleek wooden legs add a touch of warmth. Perfect for reading corners or living room spaces.",
    shortDescription: "Comfortable curved lounge chair with wooden legs",
    isBestseller: true,
    images: [
      "https://images.pexels.com/photos/106839/pexels-photo-106839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/4846097/pexels-photo-4846097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/4846106/pexels-photo-4846106.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    materials: ["Wood", "Fabric", "Foam"],
    dimensions: {
      width: 75,
      height: 80,
      depth: 85
    }
  },
  {
    id: 2,
    name: "Seta Coffee Table",
    price: 187,
    category: "tables",
    description: "The Seta Coffee Table features a distinctive round design with a solid wood construction. Its minimalist aesthetic blends seamlessly with various interior styles. The smooth surface and sturdy base ensure both functionality and durability.",
    shortDescription: "Minimalist round coffee table with solid wood construction",
    isBestseller: true,
    images: [
      "https://images.pexels.com/photos/3932929/pexels-photo-3932929.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/3932930/pexels-photo-3932930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/3932931/pexels-photo-3932931.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    materials: ["Solid Wood", "Natural Finish"],
    dimensions: {
      width: 90,
      height: 45,
      depth: 90
    }
  },
  {
    id: 3,
    name: "Marco Work Chair",
    price: 309,
    category: "chairs",
    description: "The Marco Work Chair combines ergonomic design with aesthetic appeal. The contoured backrest provides lumbar support for long working hours, while the premium upholstery adds a touch of luxury. The adjustable height and swivel function enhance functionality.",
    shortDescription: "Ergonomic work chair with premium upholstery",
    isBestseller: true,
    images: [
      "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6707629/pexels-photo-6707629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    materials: ["Metal", "Premium Fabric", "High-density Foam"],
    dimensions: {
      width: 60,
      height: 110,
      depth: 65
    }
  },
  {
    id: 4,
    name: "Luna Pendant Light",
    price: 129,
    category: "lamps",
    description: "The Luna Pendant Light features a minimalist design with a warm, diffused glow. The sleek metal shade directs light downward, making it perfect for dining areas or kitchen islands. The adjustable cord allows for customized height placement.",
    shortDescription: "Minimalist pendant light with adjustable cord",
    isBestseller: false,
    images: [
      "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6606354/pexels-photo-6606354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6606355/pexels-photo-6606355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    materials: ["Metal", "E27 Socket"],
    dimensions: {
      width: 30,
      height: 35,
      depth: 30
    }
  },
  {
    id: 5,
    name: "Nova Sofa",
    price: 749,
    category: "sofas",
    description: "The Nova Sofa combines modern design with exceptional comfort. The plush cushions and soft upholstery invite relaxation, while the sleek wooden legs add a touch of elegance. The neutral color palette ensures versatility for various interior styles.",
    shortDescription: "Modern three-seater sofa with wooden legs",
    isBestseller: false,
    images: [
      "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6489116/pexels-photo-6489116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6489118/pexels-photo-6489118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    materials: ["Wood", "High-quality Fabric", "High-density Foam"],
    dimensions: {
      width: 220,
      height: 85,
      depth: 95
    }
  },
  {
    id: 6,
    name: "Aura Bed Frame",
    price: 599,
    category: "beds",
    description: "The Aura Bed Frame features a minimalist design with a focus on natural materials. The solid wood construction ensures durability, while the sleek lines create a sense of openness in the bedroom. The platform design eliminates the need for a box spring.",
    shortDescription: "Minimalist solid wood bed frame",
    isBestseller: false,
    images: [
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6489094/pexels-photo-6489094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6489095/pexels-photo-6489095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    materials: ["Solid Wood", "Metal Supports"],
    dimensions: {
      width: 160,
      height: 40,
      depth: 200
    }
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getBestsellers = (): Product[] => {
  return products.filter(product => product.isBestseller);
};