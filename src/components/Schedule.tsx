import { Calendar, Flag, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const Schedule = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">Jadwal Turnamen</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl"
            >
              <div className="flex items-center mb-6">
                <Calendar className="w-8 h-8 mr-4 text-yellow-300" />
                <h3 className="text-2xl font-bold">Juli 2025</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Users className="w-6 h-6 text-yellow-300 mt-1" />
                  <div>
                    <p className="font-semibold">1-7 Juli</p>
                    <p className="text-gray-200">Pendaftaran Tim</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Flag className="w-6 h-6 text-yellow-300 mt-1" />
                  <div>
                    <p className="font-semibold">10 Juli</p>
                    <p className="text-gray-200">Technical Meeting</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Trophy className="w-6 h-6 text-yellow-300 mt-1" />
                  <div>
                    <p className="font-semibold">15-31 Juli</p>
                    <p className="text-gray-200">Babak Penyisihan</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl"
            >
              <div className="flex items-center mb-6">
                <Calendar className="w-8 h-8 mr-4 text-yellow-300" />
                <h3 className="text-2xl font-bold">Agustus 2025</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Trophy className="w-6 h-6 text-yellow-300 mt-1" />
                  <div>
                    <p className="font-semibold">1-15 Agustus</p>
                    <p className="text-gray-200">Babak 16 Besar & Perempat Final</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Trophy className="w-6 h-6 text-yellow-300 mt-1" />
                  <div>
                    <p className="font-semibold">20 Agustus</p>
                    <p className="text-gray-200">Semifinal</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Trophy className="w-6 h-6 text-yellow-300 mt-1" />
                  <div>
                    <p className="font-semibold">27 Agustus</p>
                    <p className="text-gray-200">Final & Penutupan</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Schedule;
