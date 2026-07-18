import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fetchProperties } from '../../../utils/api';
import { featuredProperties } from '../../../data/properties';
import SectionHeader from '../../../components/common/SectionHeader';
import PropertyCard from '../../../components/common/PropertyCard';
import { fadeUp, staggerContainer } from '../../../animations/variants';

export default function FeaturedProperties() {
  const [list, setList] = useState(featuredProperties.slice(0, 6));

  useEffect(() => {
    let active = true;
    const getFeatured = async () => {
      try {
        const data = await fetchProperties({ featured: 'true', limit: 6 });
        if (active && data?.properties?.length > 0) {
          setList(data.properties);
        }
      } catch (err) {
        // Fallback already matches static featuredProperties
      }
    };
    getFeatured();
    return () => { active = false; };
  }, []);

  return (
    <section className="section-pad bg-surface-alt dark:bg-navy transition-colors duration-300">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <SectionHeader
            label="Handpicked for You"
            title={<>Featured <span style={{ color: '#D4AF37' }}>Properties</span></>}
            description="Every listing personally vetted by our senior advisors. These represent the finest available in India right now."
          />
          <Link to="/properties" className="btn-outline shrink-0 hidden md:inline-flex">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {list.map((p) => (
            <motion.div key={p._id || p.id} variants={fadeUp}>
              <PropertyCard property={p} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View All at bottom */}
        <div className="flex justify-center mt-10 md:hidden">
          <Link to="/properties" className="btn-outline w-full text-center justify-center">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
