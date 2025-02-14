import { Award, Star, Users, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-red-500 via-pink-500 to-yellow-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">Sejarah KARTA CUP</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-6">Perjalanan KARTA CUP</h3>
              <p className="text-lg leading-relaxed">
                KARTA CUP telah menjadi bagian tak terpisahkan dari Desa Pangauban sejak 2020. 
                Turnamen ini lahir dari semangat komunitas untuk memajukan olahraga dan 
                mempersatukan warga melalui kompetisi sepak bola yang sehat dan sportif.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-6">Inovasi KARTA CUP V</h3>
              <p className="text-lg leading-relaxed">
                Di tahun kelima ini, KARTA CUP menghadirkan inovasi dengan 
                mengintegrasikan unsur kesenian lokal. Pertandingan akan diwarnai 
                dengan penampilan seni dan budaya, menciptakan festival olahraga 
                yang lebih meriah dan bermakna.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl"
            >
              <Award className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h4 className="text-xl font-semibold mb-2">Sportivitas</h4>
              <p>Menjunjung tinggi fair play dalam setiap pertandingan</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl"
            >
              <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h4 className="text-xl font-semibold mb-2">Prestasi</h4>
              <p>Wadah pengembangan bakat muda di bidang sepak bola</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl"
            >
              <Users className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h4 className="text-xl font-semibold mb-2">Persatuan</h4>
              <p>Mempererat tali silaturahmi antar warga desa</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl"
            >
              <Palette className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h4 className="text-xl font-semibold mb-2">Budaya</h4>
              <p>Mengintegrasikan kesenian dalam setiap event</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default History;
