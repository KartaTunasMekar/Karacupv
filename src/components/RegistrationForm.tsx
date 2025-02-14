import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Upload, Plus, Minus, User, FileText, Camera } from 'lucide-react';
import PreviewModal from './PreviewModal';
import imageCompression from 'browser-image-compression';

interface PlayerData {
  name: string;
  address: string;
  age: number;
  position: string;
  jerseyNumber: string;
  selfiePhoto: FileList | null;
  idCard: FileList | null;
  familyCard: FileList | null;
  whatsapp: string;
}

interface OfficialData {
  name: string;
  whatsapp: string;
  selfiePhoto: FileList | null;
  idCard: FileList | null;
}

interface FormData {
  teamName: string;
  teamAddress: string;
  mainJerseyColor: string;
  alternateJerseyColor: string;
  manager: OfficialData;
  official1: OfficialData;
  official2: OfficialData;
  players: PlayerData[];
}

const TEAM_NAMES = [
  'ARUMBA FC A', 'ARUMBA FC B', 'ARUMBA FC C',
  'BALLPASS FC A', 'BALLPASS FC B', 'BALLPASS FC C',
  'DL GUNS FC A', 'DL GUNS FC B', 'DL GUNS FC C',
  'GANESA FC A', 'GANESA FC B', 'GANESA FC C',
  'LEMKA FC A', 'LEMKA FC B', 'LEMKA FC C',
  'PALAPA FC A', 'PALAPA FC B', 'PALAPA FC C',
  'PELANA FC A', 'PELANA FC B', 'PELANA FC C',
  'PERKID FC A', 'PERKID FC B', 'PERKID FC C',
  'PERU FC A', 'PERU FC B', 'PERU FC C',
  'PORBA JAYA A', 'PORBA JAYA B', 'PORBA JAYA C',
  'PUTRA MANDIRI FC A', 'PUTRA MANDIRI FC B', 'PUTRA MANDIRI FC C',
  'REMAJA PUTRA FC A', 'REMAJA PUTRA FC B', 'REMAJA PUTRA FC C',
  'TOCXNET FC A', 'TOCXNET FC B', 'TOCXNET FC C'
];

const POSITIONS = ['Penjaga Gawang', 'Bek', 'Gelandang', 'Penyerang'];

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [formDataPreview, setFormDataPreview] = useState<FormData | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      players: [{}] as any[]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "players"
  });

  const validateFile = (fileList: FileList) => {
    if (!fileList || fileList.length === 0) return "File diperlukan";
    const file = fileList[0];
    if (file.size > 5 * 1024 * 1024) return "Ukuran file maksimal 5MB"; // Increased limit since we'll compress
    if (!file.type.startsWith('image/')) return "File harus berupa gambar";
    return true;
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone) || "Nomor WhatsApp tidak valid";
  };

  const handleFormSubmit = async (data: FormData) => {
    setFormDataPreview(data);
    setShowPreview(true);
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.2, // Reduced from 0.5 to 0.2
      maxWidthOrHeight: 800, // Reduced from 1024 to 800
      useWebWorker: true,
      initialQuality: 0.7, // Added quality control
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  };

  const convertFileToBase64 = async (fileList: FileList | null): Promise<string | null> => {
    if (!fileList || fileList.length === 0) return null;
    
    const file = fileList[0];
    if (!file || !(file instanceof Blob)) return null;

    try {
      // Compress the image before converting to base64
      const compressedFile = await compressImage(file);
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert file to base64'));
          }
        };
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  };

  const prepareDataForFirestore = async (data: FormData) => {
    try {
      // Prepare main registration document (without players)
      const mainDoc: any = {
        teamName: data.teamName,
        teamAddress: data.teamAddress,
        mainJerseyColor: data.mainJerseyColor,
        alternateJerseyColor: data.alternateJerseyColor,
        timestamp: new Date().toISOString(),
        status: 'pending',
        registrationDate: new Date().toISOString(),
      };

      // Process officials
      for (const official of ['manager', 'official1', 'official2']) {
        const officialData = data[official as keyof FormData] as OfficialData;
        if (officialData) {
          mainDoc[official] = {
            name: officialData.name,
            whatsapp: officialData.whatsapp,
            selfiePhoto: await convertFileToBase64(officialData.selfiePhoto),
            idCard: await convertFileToBase64(officialData.idCard),
          };
        }
      }

      // Process players separately
      const players = await Promise.all(
        data.players.map(async (player, index) => ({
          name: player.name,
          address: player.address,
          age: player.age,
          position: player.position,
          jerseyNumber: player.jerseyNumber,
          whatsapp: player.whatsapp,
          selfiePhoto: await convertFileToBase64(player.selfiePhoto),
          idCard: await convertFileToBase64(player.idCard),
          familyCard: await convertFileToBase64(player.familyCard),
          playerNumber: index + 1,
        }))
      );

      return { mainDoc, players };
    } catch (error) {
      console.error('Error preparing data:', error);
      throw error;
    }
  };

  const handleError = (error: any) => {
    console.error('Registration error:', error);
    let errorMessage = 'Terjadi kesalahan saat mengirim data.';

    if (error?.code === 'permission-denied') {
      errorMessage = 'Akses ditolak. Silakan coba lagi dalam beberapa saat.';
    } else if (error?.code === 'unavailable') {
      errorMessage = 'Layanan sedang tidak tersedia. Silakan coba lagi nanti.';
    } else if (error?.code === 'cancelled') {
      errorMessage = 'Pengiriman dibatalkan. Silakan coba lagi.';
    }

    setMessage(errorMessage);
    return false;
  };

  const saveRegistration = async (mainDoc: any, players: any[]) => {
    try {
      // Start a batch write
      const batch = writeBatch(db);

      // Create main registration document
      const registrationRef = doc(collection(db, 'registrations'));
      batch.set(registrationRef, mainDoc);

      // Add players to a subcollection
      players.forEach((player) => {
        const playerRef = doc(collection(registrationRef, 'players'));
        batch.set(playerRef, player);
      });

      // Commit the batch
      await batch.commit();
      return { success: true, registrationId: registrationRef.id };
    } catch (error) {
      if (retryCount < 3) {
        // Add exponential backoff
        const backoffTime = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        setRetryCount(prev => prev + 1);
        return saveRegistration(mainDoc, players);
      }
      throw error;
    }
  };

  const handleFinalSubmit = async () => {
    if (!formDataPreview) return;
    
    setLoading(true);
    setMessage('');
    setRetryCount(0);
    
    try {
      // Show processing message
      setMessage('Sedang memproses data...');

      // Prepare the data
      const { mainDoc, players } = await prepareDataForFirestore(formDataPreview);

      // Add timestamp and status
      mainDoc.timestamp = new Date().toISOString();
      mainDoc.status = 'pending';
      mainDoc.registrationDate = new Date().toISOString();

      // Try to save the registration
      const result = await saveRegistration(mainDoc, players);

      if (result.success) {
        setMessage(`Pendaftaran berhasil! ID Registrasi: ${result.registrationId}`);
        setShowPreview(false);
        window.scrollTo(0, 0);
      } else {
        handleError(new Error('Failed to save registration'));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...
  // (keeping all the JSX render code as is)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Formulir Pendaftaran Tim</h2>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('berhasil') 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <p className="text-sm font-medium">{message}</p>
            {!message.includes('berhasil') && !message.includes('memproses') && (
              <p className="text-xs mt-1">
                Jika masalah berlanjut, silakan refresh halaman atau hubungi panitia.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Team Information */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">Informasi Tim</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Tim</label>
              <select
                {...register('teamName', { required: 'Pilih nama tim' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">Pilih Tim</option>
                {TEAM_NAMES.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              {errors.teamName && (
                <p className="mt-1 text-sm text-red-600">{errors.teamName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Alamat Lengkap Tim</label>
              <textarea
                {...register('teamAddress', { required: 'Alamat tim diperlukan' })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Warna Jersey Utama</label>
                <input
                  type="text"
                  {...register('mainJerseyColor', { required: 'Warna jersey utama diperlukan' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Warna Jersey Cadangan</label>
                <input
                  type="text"
                  {...register('alternateJerseyColor', { required: 'Warna jersey cadangan diperlukan' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Officials Section */}
          {['manager', 'official1', 'official2'].map((role, index) => (
            <div key={role} className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="text-xl font-semibold mb-4">
                {role === 'manager' ? 'Manager Tim' : `Official ${index}`}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <input
                    type="text"
                    {...register(`${role}.name` as any, { required: 'Nama diperlukan' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                  <input
                    type="text"
                    {...register(`${role}.whatsapp` as any, {
                      required: 'Nomor WhatsApp diperlukan',
                      validate: validatePhoneNumber
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Foto Selfie</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register(`${role}.selfiePhoto` as any, { validate: validateFile })}
                    className="mt-1 block w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Foto KTP</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register(`${role}.idCard` as any, { validate: validateFile })}
                    className="mt-1 block w-full"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Players Section */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Daftar Pemain</h3>
              <button
                type="button"
                onClick={() => append({})}
                disabled={fields.length >= 20}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                <Plus size={16} className="mr-2" /> Tambah Pemain
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Pemain #{index + 1}</h4>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input
                      type="text"
                      {...register(`players.${index}.name` as const, { required: 'Nama diperlukan' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat (sesuai KTP)</label>
                    <textarea
                      {...register(`players.${index}.address` as const, { required: 'Alamat diperlukan' })}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Usia</label>
                    <input
                      type="number"
                      {...register(`players.${index}.age` as const, {
                        required: 'Usia diperlukan',
                        min: { value: 1, message: 'Usia minimal 1 tahun' },
                        max: { value: 70, message: 'Usia maksimal 70 tahun' }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Posisi</label>
                    <select
                      {...register(`players.${index}.position` as const, { required: 'Posisi diperlukan' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                      <option value="">Pilih Posisi</option>
                      {POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor Punggung</label>
                    <input
                      type="text"
                      {...register(`players.${index}.jerseyNumber` as const, { required: 'Nomor punggung diperlukan' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                    <input
                      type="text"
                      {...register(`players.${index}.whatsapp` as const, {
                        required: 'Nomor WhatsApp diperlukan',
                        validate: validatePhoneNumber
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Foto Selfie dengan Jersey</label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register(`players.${index}.selfiePhoto` as const, { validate: validateFile })}
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Foto KTP</label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register(`players.${index}.idCard` as const, { validate: validateFile })}
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Foto KK/Dokumen Lainnya</label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register(`players.${index}.familyCard` as const, { validate: validateFile })}
                      className="mt-1 block w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Preview Data'}
          </button>
        </form>

        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onConfirm={handleFinalSubmit}
          data={formDataPreview}
          loading={loading}
        />
      </div>
    </section>
  );
};

export default RegistrationForm;
