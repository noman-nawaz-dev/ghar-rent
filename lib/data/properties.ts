export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  areaUnit: 'Marla' | 'Kanal';
  bedrooms: number;
  bathrooms: number;
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
    id: "prop-001",
    title: "Modern Family Home in Bahria Town",
    description: "Beautifully designed family home in a prime location of Bahria Town. Features spacious rooms, modern kitchen, and a lovely garden. Perfect for families looking for comfort and convenience.",
    price: 75000,
    area: 10,
    areaUnit: "Marla",
    bedrooms: 3,
    bathrooms: 2,
    address: "Phase 5, Bahria Town",
    city: "Lahore",
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 300 1234567",
    sellerName: "Kamran Ahmed",
    listedDate: "2023-06-15",
    status: "Available",
    propertyType: "House"
  },
  {
    id: "prop-002",
    title: "Luxury Apartment in Clifton",
    description: "High-end apartment with panoramic city views. Features include modern finishes, 24/7 security, and access to community amenities like swimming pool and gym.",
    price: 120000,
    area: 2000,
    areaUnit: "Marla",
    bedrooms: 4,
    bathrooms: 3,
    address: "Block 8, Clifton",
    city: "Karachi",
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    ],
    sellerPhone: "+92 321 7654321",
    sellerName: "Sarah Khan",
    listedDate: "2023-06-20",
    status: "Available",
    propertyType: "Apartment"
  },
  {
    id: "prop-003",
    title: "Cozy 2-Bedroom in DHA",
    description: "Well-maintained 2-bedroom house perfect for small families or professionals. Conveniently located near markets, schools, and parks.",
    price: 45000,
    area: 5,
    areaUnit: "Marla",
    bedrooms: 2,
    bathrooms: 1,
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
    bathrooms: 4,
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
    bathrooms: 2,
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
    bathrooms: 3,
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
  }
];