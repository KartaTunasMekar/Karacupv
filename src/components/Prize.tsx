import { Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Prize = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-12">Hadiah Turnamen</h2>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block p-6 bg-white/10 rounded-full mb-12"
          >
            <Trophy size={80} className="text-yellow-300" />
          </motion.div>

          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Total Hadiah</h3>
            <p className="text-6xl font-bold text-yellow-300 mb-8">Rp 10.000.000</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative bg-gradient-to-b from-yellow-400 to-yellow-600 p-8 rounded-2xl shadow-lg"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Trophy size={48} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mt-4 mb-2">Juara 1</h4>
              <p className="text-3xl font-bold mb-2">Rp 5.000.000</p>
              <p className="text-sm">+ Piala Bergilir + Medali</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative bg-gradient-to-b from-gray-300 to-gray-400 p-8 rounded-2xl shadow-lg"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Medal size={48} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mt-4 mb-2">Juara 2</h4>
              <p className="text-3xl font-bold mb-2">Rp 3.000.000</p>
              <p className="text-sm">+ Piala + Medali</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative bg-gradient-to-b from-amber-600 to-amber-700 p-8 rounded-2xl shadow-lg"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Star size={48} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mt-4 mb-2">Juara 3</h4>
              <p className="text-3xl font-bold mb-2">Rp 2.000.000</p>
              <p className="text-sm">+ Piala + Medali</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Prize;
