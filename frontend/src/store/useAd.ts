export interface Ad {
  id: string;
  title: string;
  city: string;
  area: string;
  rooms: number;
  space: number;
  propertyType: string;
  type: string;
  address: string;
  description: string;
  price: number;
  slug: string;
  whatsappNumber: string;
  images: Array<{ url: string; key?: string }>;
}
