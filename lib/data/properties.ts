export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  areaUnit: 'Marla' | 'Kanal';
  bedrooms: number;
  floors: number;
  kitchens: number;
  hasLawn: boolean;
  additionalInfo: string;
  address: string;
  city: string;
  images: string[];
  sellerPhone: string;
  sellerName: string;
  listedDate: string;
  status: 'Available' | 'Pending' | 'Rented';
  propertyType: string;
}

export const propertyData: Property[] = [
  {
    id: "prop-003",
    title: "Cozy 2-Bedroom in DHA",
    description: "Well-maintained 2-bedroom house perfect for small families or professionals. Conveniently located near markets, schools, and parks.",
    price: 45000,
    area: 5,
    areaUnit: "Marla",
    bedrooms: 2,
    floors: 1,
    kitchens: 1,
    hasLawn: false,
    additionalInfo: "Nearby schools and parks",
    address: "Phase 2, DHA",
    city: "Islamabad",
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 333 9876543",
    sellerName: "Ali Raza",
    listedDate: "2023-06-25",
    status: "Available",
    propertyType: "House"
  },
  {
    id: "prop-004",
    title: "Spacious Villa in Gulberg",
    description: "Elegant villa with large reception areas, multiple bedrooms, and a beautiful garden. Ideal for large families or for entertaining guests.",
    price: 150000,
    area: 1,
    areaUnit: "Kanal",
    bedrooms: 5,
    floors: 2,
    kitchens: 2,
    hasLawn: true,
    additionalInfo: "Servant quarter, two lounges, garage",
    address: "Block C, Gulberg III",
    city: "Lahore",
    images: [
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 300 8765432",
    sellerName: "Malik Fahad",
    listedDate: "2023-07-01",
    status: "Available",
    propertyType: "Villa"
  },
  {
    id: "prop-005",
    title: "Modern Apartment in Johar Town",
    description: "Contemporary apartment with open-plan living space, modern kitchen, and a balcony overlooking the city. Close to shopping centers and restaurants.",
    price: 60000,
    area: 8,
    areaUnit: "Marla",
    bedrooms: 3,
    floors: 1,
    kitchens: 1,
    hasLawn: false,
    additionalInfo: "Elevator access, balcony view",
    address: "Block G1, Johar Town",
    city: "Lahore",
    images: [
      "https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 321 1234987",
    sellerName: "Zainab Mahmood",
    listedDate: "2023-07-05",
    status: "Available",
    propertyType: "Apartment"
  },
  {
    id: "prop-006",
    title: "Family Home in Model Town",
    description: "Comfortable family home in a quiet, residential area. Features a spacious living room, separate dining area, and a well-maintained garden.",
    price: 85000,
    area: 12,
    areaUnit: "Marla",
    bedrooms: 4,
    floors: 2,
    kitchens: 1,
    hasLawn: true,
    additionalInfo: "Storage room, lawn, near community center",
    address: "Block F, Model Town",
    city: "Lahore",
    images: [
      "https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 333 7654321",
    sellerName: "Hassan Ahmed",
    listedDate: "2023-07-10",
    status: "Available",
    propertyType: "House"
  },
  {
    id: "prop-007",
    title: "Penthouse with Sea View",
    description: "Luxury penthouse in a high-rise building featuring floor-to-ceiling windows, designer interiors, and a rooftop terrace with stunning sea views.",
    price: 250000,
    area: 3000,
    areaUnit: "Marla",
    bedrooms: 4,
    floors: 1,
    kitchens: 1,
    hasLawn: false,
    additionalInfo: "Rooftop access, smart home system, indoor pool",
    address: "Sea View Apartments, Clifton",
    city: "Karachi",
    images: [
      "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1909791/pexels-photo-1909791.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 311 5556677",
    sellerName: "Nadia Sheikh",
    listedDate: "2023-07-15",
    status: "Available",
    propertyType: "Penthouse"
  },
  {
    id: "prop-008",
    title: "Budget-Friendly Home in Korangi",
    description: "Affordable home ideal for small families, located in a peaceful neighborhood with easy access to local markets and public transport.",
    price: 35000,
    area: 3,
    areaUnit: "Marla",
    bedrooms: 2,
    floors: 1,
    kitchens: 1,
    hasLawn: false,
    additionalInfo: "Recently renovated, new paint and tiles",
    address: "Sector 33, Korangi",
    city: "Karachi",
    images: [
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 345 9988776",
    sellerName: "Rashid Mehmood",
    listedDate: "2023-07-18",
    status: "Available",
    propertyType: "House"
  },
  {
    id: "prop-009",
    title: "Luxury Farmhouse in Bahria",
    description: "An expansive farmhouse ideal for weekend getaways with a spacious lawn and private pool.",
    price: 55000,
    area: 10,
    areaUnit: "Marla",
    bedrooms: 4,
    floors: 2,
    kitchens: 2,
    hasLawn: true,
    additionalInfo: "Pool and BBQ area",
    address: "Block A, Sector 1",
    city: "Islamabad",
    images: [
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 345 5358310",
    sellerName: "Asad Khan",
    listedDate: "2023-07-20",
    status: "Available",
    propertyType: "Farmhouse"
  },
  {
    id: "prop-010",
    title: "Stylish Studio in F-11",
    description: "Compact and stylish studio apartment with all essential amenities.",
    price: 120000,
    area: 7,
    areaUnit: "Marla",
    bedrooms: 1,
    floors: 2,
    kitchens: 2,
    hasLawn: false,
    additionalInfo: "Balcony with city view",
    address: "Block B, Sector 2",
    city: "Islamabad",
    images: [
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/259957/pexels-photo-259957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 337 6630016",
    sellerName: "Maria Iqbal",
    listedDate: "2023-07-21",
    status: "Available",
    propertyType: "Studio"
  },
  {
    id: "prop-011",
    title: "Executive Suite in Blue Area",
    description: "Modern executive suite perfect for working professionals with scenic city views.",
    price: 120000,
    area: 5,
    areaUnit: "Kanal",
    bedrooms: 1,
    floors: 2,
    kitchens: 2,
    hasLawn: false,
    additionalInfo: "Smart appliances included",
    address: "Block C, Sector 3",
    city: "Lahore",
    images: [
      "https://images.pexels.com/photos/259957/pexels-photo-259957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 324 7932895",
    sellerName: "Tariq Jameel",
    listedDate: "2023-07-22",
    status: "Available",
    propertyType: "Suite"
  },
  {
    id: "prop-012",
    title: "Duplex in Askari 11",
    description: "Well-designed duplex with separate entrances for each floor.",
    price: 120000,
    area: 1,
    areaUnit: "Marla",
    bedrooms: 4,
    floors: 1,
    kitchens: 1,
    hasLawn: false,
    additionalInfo: "Separate servant quarter",
    address: "Block D, Sector 4",
    city: "Lahore",
    images: [
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 340 5118884",
    sellerName: "Sana Farooq",
    listedDate: "2023-07-23",
    status: "Available",
    propertyType: "Duplex"
  },
  {
    id: "prop-013",
    title: "Corner Plot House in EME Society",
    description: "Well-ventilated home with plenty of natural light and a peaceful ambiance.",
    price: 95000,
    area: 7,
    areaUnit: "Marla",
    bedrooms: 5,
    floors: 1,
    kitchens: 1,
    hasLawn: true,
    additionalInfo: "Corner unit with extra lawn",
    address: "Block E, Sector 5",
    city: "Karachi",
    images: [
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 337 1191735",
    sellerName: "Bilal Zafar",
    listedDate: "2023-07-24",
    status: "Available",
    propertyType: "House"
  },
  {
    id: "prop-014",
    title: "Contemporary Flat in Gulshan",
    description: "Spacious flat close to shopping malls and schools.",
    price: 40000,
    area: 5,
    areaUnit: "Kanal",
    bedrooms: 4,
    floors: 1,
    kitchens: 1,
    hasLawn: false,
    additionalInfo: "Gated community with security",
    address: "Block F, Sector 6",
    city: "Lahore",
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 334 7269161",
    sellerName: "Rabia Hasan",
    listedDate: "2023-07-25",
    status: "Available",
    propertyType: "Flat"
  }  
];
