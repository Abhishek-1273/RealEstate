import Testimonial from '../models/Testimonial.js';
import FAQ from '../models/FAQ.js';
import SiteSettings from '../models/SiteSettings.js';
import User from '../models/User.js';

export const seedDefaultData = async () => {
  try {
    // 0. Ensure default admin & management users exist
    const adminEmails = ['akayg@gmail.com'];
    for (const email of adminEmails) {
      const existingAdmin = await User.findOne({ email });
      if (!existingAdmin) {
        await User.create({
          name: 'Abhishek Kayg',
          phone: '9999999999',
          email,
          password: 'Admin@123456',
          role: 'admin',
          isActive: true,
          department: 'Management'
        });
        console.info(`🌱 Created default admin user: ${email}`);
      }
    }



    const managerEmail = 'admin@hyperrelestix.in';
    const existingManager = await User.findOne({ email: managerEmail });
    if (!existingManager) {
      await User.create({
        name: 'Office Manager',
        phone: '8888888888',
        email: managerEmail,
        password: 'Manager@123456',
        role: 'management',
        isActive: true,
        department: 'Management'
      });
      console.info('🌱 Created default manager user: admin@hyperrelestix.in');
    } else if (existingManager.role !== 'management' && existingManager.role !== 'admin') {
      existingManager.role = 'management';
      await existingManager.save();
    }
    // 1. Seed Testimonials if empty
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const defaultTestimonials = [
        {
          name: 'Rajiv Singhania',
          role: 'NRI — Based in Dubai, UAE',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
          rating: 5,
          text: 'Living in Dubai, I was nervous about buying property remotely in Pune. HyperRelestix handled everything — virtual tours, FEMA compliance, Power of Attorney, and final registration. I never had to fly back.',
          property: 'Elysian Heights, KP, Pune',
        },
        {
          name: 'Sunita Patel',
          role: 'NRI — Based in London, UK',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
          rating: 5,
          text: 'As a UK-based NRI, I needed a team I could trust completely. They found us a stunning villa in Baner, handled all legal verification, and now manage the property on our behalf. Truly stress-free.',
          property: 'Serene Baner Villa, Pune',
        },
        {
          name: 'Rohan Malhotra',
          role: 'NRI — Based in Toronto, Canada',
          image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
          rating: 5,
          text: 'Remote legal verification was my biggest concern. HyperRelestix managed the entire process — from virtual walkthroughs to FEMA compliance and bank coordination. My penthouse in KP exceeded expectations.',
          property: 'The Grand Penthouse, KP, Pune',
        },
        {
          name: 'Meera Iyer',
          role: 'NRI — Based in San Francisco, USA',
          image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
          rating: 5,
          text: "I wanted to invest in Pune's booming real estate but had no time to be physically present. HyperRelestix's NRI desk was exceptional — they shortlisted, negotiated, and closed the deal entirely remotely.",
          property: 'Viman Nagar Sky Residence, Pune',
        }
      ];
      await Testimonial.insertMany(defaultTestimonials);
      console.info('🌱 Successfully seeded default testimonials.');
    }

    // 2. Seed FAQs if empty
    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
      const defaultFaqs = [
        {
          question: 'Can NRIs buy residential property in Pune?',
          answer: 'Yes. NRIs and OCIs can freely purchase residential and commercial properties in India under FEMA regulations, without RBI approval. Our NRI desk handles all documentation, Power of Attorney arrangements, and compliance on your behalf.',
          order: 0,
        },
        {
          question: 'Can I buy a property in Pune without physically being present?',
          answer: 'Absolutely. We offer end-to-end remote buying services — HD virtual property tours, digital document verification, Power of Attorney execution at your local Indian consulate, and complete registration coordination. Many of our NRI clients have purchased entirely remotely.',
          order: 1,
        },
        {
          question: 'Are all listed properties RERA registered?',
          answer: 'Yes. Every property on HyperRelestix undergoes RERA compliance verification, clean title checks, and developer background checks before listing. We list only verified premium properties in Pune and Pimpri-Chinchwad.',
          order: 2,
        },
        {
          question: 'Which localities in Pune do you specialise in?',
          answer: "We focus exclusively on Pune's premium localities: Balewadi, Baner, Kharadi, Viman Nagar, KP, Hadapsar, NIBM Road, Kothrud, Hinjewadi Phase I & II, Ravet, Prabhat Road, Swargate, Katraj, Karve Nagar, Pashan, Bawadhan, and more.",
          order: 3,
        },
        {
          question: 'Do you offer property management for NRIs?',
          answer: 'Yes. Our NRI Property Management service covers tenant finding, rent collection, maintenance, legal compliance, and monthly reporting — so your Pune property is fully managed while you are abroad.',
          order: 4,
        }
      ];
      await FAQ.insertMany(defaultFaqs);
      console.info('🌱 Successfully seeded default FAQs.');
    }

    // 3. Ensure SiteSettings exists and has default stats & socials
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        stats: {
          experience: 12,
          propertiesSold: 1500,
          happyClients: 98,
          dealsClosed: 350
        },
        socials: {
          facebook: '#',
          instagram: '#',
          linkedin: '#',
          twitter: '#',
          youtube: '#',
          whatsapp: '#'
        }
      });
      console.info('🌱 Created default site settings with stats and socials.');
    } else {
      let isUpdated = false;
      if (!settings.stats || settings.stats.experience === undefined) {
        settings.stats = {
          experience: 12,
          propertiesSold: 1500,
          happyClients: 98,
          dealsClosed: 350
        };
        isUpdated = true;
      }
      if (!settings.socials || !settings.socials.linkedin || !settings.socials.youtube) {
        settings.socials = {
          facebook: settings.socials?.facebook || '#',
          instagram: settings.socials?.instagram || '#',
          linkedin: settings.socials?.linkedin || '#',
          twitter: settings.socials?.twitter || '#',
          youtube: settings.socials?.youtube || '#',
          whatsapp: settings.socials?.whatsapp || '#'
        };
        isUpdated = true;
      }
      if (isUpdated) {
        await settings.save();
        console.info('🌱 Updated existing site settings with missing stats/socials defaults.');
      }
    }
  } catch (error) {
    console.error('❌ Error seeding default data:', error);
  }
};
