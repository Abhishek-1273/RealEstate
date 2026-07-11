// HyperRelestix — Data Layer
// Focused: Pune + Pimpri-Chinchwad | Target: NRI Buyers

export const agents = [
  {
    id: 1,
    name: 'Arjun Kapoor',
    role: 'Senior NRI Property Advisor',
    experience: 14,
    propertiesSold: 380,
    rating: 4.9,
    reviews: 148,
    phone: '+91 98765 43210',
    email: 'arjun@hyperrelestix.in',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    specialization: ['Koregaon Park', 'NRI Investment', 'Luxury Penthouses'],
    socials: { linkedin: '#', instagram: '#', twitter: '#' },
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Luxury Property Consultant',
    experience: 10,
    propertiesSold: 245,
    rating: 4.9,
    reviews: 112,
    phone: '+91 98765 43211',
    email: 'priya@hyperrelestix.in',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
    specialization: ['Baner', 'Wakad', 'PCMC Villas'],
    socials: { linkedin: '#', instagram: '#', twitter: '#' },
  },
  {
    id: 3,
    name: 'Rahul Mehta',
    role: 'NRI Investment Specialist',
    experience: 8,
    propertiesSold: 196,
    rating: 4.8,
    reviews: 88,
    phone: '+91 98765 43212',
    email: 'rahul@hyperrelestix.in',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    specialization: ['FEMA Compliance', 'Aundh', 'Hinjewadi'],
    socials: { linkedin: '#', instagram: '#', twitter: '#' },
  },
  {
    id: 4,
    name: 'Neha Gupta',
    role: 'Villa & Estate Specialist',
    experience: 12,
    propertiesSold: 310,
    rating: 4.9,
    reviews: 130,
    phone: '+91 98765 43213',
    email: 'neha@hyperrelestix.in',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    specialization: ['Koregaon Park', 'Boat Club Road', 'Heritage Estates'],
    socials: { linkedin: '#', instagram: '#', twitter: '#' },
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Rajiv Singhania',
    role: 'NRI — Based in Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    rating: 5,
    text: 'Living in Dubai, I was nervous about buying property remotely in Pune. HyperRelestix handled everything — virtual tours, FEMA compliance, Power of Attorney, and final registration. I never had to fly back.',
    property: 'Elysian Heights, Koregaon Park, Pune',
  },
  {
    id: 2,
    name: 'Sunita Patel',
    role: 'NRI — Based in London, UK',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    rating: 5,
    text: 'As a UK-based NRI, I needed a team I could trust completely. They found us a stunning villa in Baner, handled all legal verification, and now manage the property on our behalf. Truly stress-free.',
    property: 'Serene Baner Villa, Pune',
  },
  {
    id: 3,
    name: 'Rohan Malhotra',
    role: 'NRI — Based in Toronto, Canada',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
    rating: 5,
    text: 'Remote legal verification was my biggest concern. HyperRelestix managed the entire process — from virtual walkthroughs to FEMA compliance and bank coordination. My penthouse in Koregaon Park exceeded expectations.',
    property: 'The Grand Penthouse, Koregaon Park, Pune',
  },
  {
    id: 4,
    name: 'Meera Iyer',
    role: 'NRI — Based in San Francisco, USA',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
    rating: 5,
    text: "I wanted to invest in Pune's booming real estate but had no time to be physically present. HyperRelestix's NRI desk was exceptional — they shortlisted, negotiated, and closed the deal entirely remotely.",
    property: 'Aundh Sky Residence, Pune',
  },
];

// ── CITIES — Pune localities (used by Globe + city tabs) ──────────────────────
// The globe onSelectCity passes the city name — must match these names exactly
export const cities = [
  {
    id: 1,
    name: 'Koregaon Park',
    properties: 48,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    tag: "Pune's Most Prestigious Address",
  },
  {
    id: 2,
    name: 'Baner',
    properties: 36,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    tag: 'Modern Living · Tech Hub',
  },
  {
    id: 3,
    name: 'Aundh',
    properties: 29,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    tag: 'Green & Premium',
  },
  {
    id: 4,
    name: 'Hinjewadi',
    properties: 24,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    tag: 'IT Corridor · High ROI',
  },
  {
    id: 5,
    name: 'Wakad',
    properties: 31,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    tag: 'Fast-Growing · PCMC',
  },
  {
    id: 6,
    name: 'Boat Club Road',
    properties: 18,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    tag: 'Ultra Premium · Old Pune',
  },
];

export const stats = [
  { label: 'Premium Properties in Pune & PCMC', value: 500, suffix: '+' },
  { label: 'NRI Clients Served Successfully', value: 320, suffix: '+' },
  { label: 'Years of Pune Market Expertise', value: 15, suffix: '+' },
  { label: 'Average Client Satisfaction', value: 4.9, suffix: '★' },
];

export const blogs = [
  {
    id: 1,
    title: 'NRI Guide to Buying Property in Pune: FEMA, RBI Rules & Smart Investment Zones in 2025',
    category: 'NRI Guide',
    date: 'June 28, 2025',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    excerpt: 'Everything an NRI needs to know before investing in Pune real estate — FEMA compliance, RBI guidelines, Power of Attorney, tax implications, and the localities offering the best ROI.',
    author: { name: 'Arjun Kapoor', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    featured: true,
  },
  {
    id: 2,
    title: 'Koregaon Park vs Baner vs Aundh: Which Pune Locality Suits Your Luxury Investment?',
    category: 'Market Insights',
    date: 'June 20, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    excerpt: "A detailed locality-by-locality breakdown of Pune's top premium neighbourhoods — comparing price trends, infrastructure, connectivity, and rental yields for NRI investors.",
    author: { name: 'Priya Sharma', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80' },
    featured: false,
  },
  {
    id: 3,
    title: 'Remote Property Management in Pune: How NRIs Can Own Without Being Present',
    category: 'NRI Services',
    date: 'June 12, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    excerpt: "From tenant management and rent collection to maintenance and legal compliance — how HyperRelestix's NRI desk handles your Pune property end-to-end while you live abroad.",
    author: { name: 'Rahul Mehta', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
    featured: false,
  },
];

export const faqs = [
  {
    id: 1,
    question: 'Can NRIs buy residential property in Pune?',
    answer: 'Yes. NRIs and OCIs can freely purchase residential and commercial properties in India under FEMA regulations, without RBI approval. Our NRI desk handles all documentation, Power of Attorney arrangements, and compliance on your behalf.',
  },
  {
    id: 2,
    question: 'Can I buy a property in Pune without physically being present?',
    answer: 'Absolutely. We offer end-to-end remote buying services — HD virtual property tours, digital document verification, Power of Attorney execution at your local Indian consulate, and complete registration coordination. Many of our NRI clients have purchased entirely remotely.',
  },
  {
    id: 3,
    question: 'Are all listed properties RERA registered?',
    answer: 'Yes. Every property on HyperRelestix undergoes RERA compliance verification, clean title checks, and developer background checks before listing. We list only verified premium properties in Pune and Pimpri-Chinchwad.',
  },
  {
    id: 4,
    question: 'Which localities in Pune do you specialise in?',
    answer: "We focus exclusively on Pune and PCMC's premium localities: Koregaon Park, Baner, Aundh, Boat Club Road, Hinjewadi, Wakad, Kharadi, Kalyani Nagar, and Viman Nagar.",
  },
  {
    id: 5,
    question: 'Do you offer property management for NRIs?',
    answer: 'Yes. Our NRI Property Management service covers tenant finding, rent collection, maintenance, legal compliance, and monthly reporting — so your Pune property is fully managed while you are abroad.',
  },
];

export const categories = [
  { id: 1, name: 'Luxury Villas',  count: 85,  image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80', icon: '🏡' },
  { id: 2, name: 'Apartments',     count: 220, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', icon: '🏢' },
  { id: 3, name: 'Penthouses',     count: 44,  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', icon: '🌇' },
  { id: 4, name: 'Commercial',     count: 62,  image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80', icon: '🏬' },
  { id: 5, name: 'Farm Houses',    count: 28,  image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', icon: '🌾' },
  { id: 6, name: 'Plots',          count: 41,  image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', icon: '🌿' },
];

export const developerLogos = [
  { id: 1, name: 'Panchshil Realty' },
  { id: 2, name: 'Kolte-Patil' },
  { id: 3, name: 'Godrej Properties' },
  { id: 4, name: 'Lodha Pune' },
  { id: 5, name: 'Goel Ganga' },
  { id: 6, name: 'Kumar Properties' },
  { id: 7, name: 'Rohan Builders' },
  { id: 8, name: 'Majestique Landmarks' },
];

export const companyLogos = [
  { id: 1, name: 'HDFC Bank' },
  { id: 2, name: 'ICICI Bank' },
  { id: 3, name: 'SBI Home Loans' },
  { id: 4, name: 'Axis Bank' },
  { id: 5, name: 'Kotak Mahindra' },
  { id: 6, name: 'LIC Housing' },
  { id: 7, name: 'Bank of Maharashtra' },
];
