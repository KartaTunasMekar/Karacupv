import { X } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: any;
  loading: boolean;
}

const PreviewModal = ({ isOpen, onClose, onConfirm, data, loading }: PreviewModalProps) => {
  if (!isOpen) return null;

  const formatData = (key: string, value: any) => {
    if (!value) return '-';
    if (value instanceof File) return value.name;
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects like player and official data
      if ('name' in value) {
        return Object.entries(value).map(([k, v]) => {
          if (v instanceof File) return `${k}: ${v.name}`;
          if (typeof v === 'object') return null; // Skip nested objects
          return `${k}: ${v}`;
        }).filter(Boolean).join(', ');
      }
      return JSON.stringify(value);
    }
    return value.toString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold">Konfirmasi Data Pendaftaran</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Team Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Informasi Tim</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Tim</p>
                  <p className="font-medium">{formatData('teamName', data.teamName)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alamat Tim</p>
                  <p className="font-medium">{formatData('teamAddress', data.teamAddress)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Warna Jersey Utama</p>
                  <p className="font-medium">{formatData('mainJerseyColor', data.mainJerseyColor)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Warna Jersey Cadangan</p>
                  <p className="font-medium">{formatData('alternateJerseyColor', data.alternateJerseyColor)}</p>
                </div>
              </div>
            </div>

            {/* Officials Information */}
            {['manager', 'official1', 'official2'].map((role, index) => (
              <div key={role} className="space-y-4">
                <h4 className="text-lg font-semibold">
                  {role === 'manager' ? 'Manager Tim' : `Official ${index}`}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{formatData(`${role}.name`, data[role]?.name)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">WhatsApp</p>
                    <p className="font-medium">{formatData(`${role}.whatsapp`, data[role]?.whatsapp)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Foto Selfie</p>
                    <p className="font-medium">{formatData(`${role}.selfiePhoto`, data[role]?.selfiePhoto)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Foto KTP</p>
                    <p className="font-medium">{formatData(`${role}.idCard`, data[role]?.idCard)}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Players Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Daftar Pemain</h4>
              {data.players?.map((player: any, index: number) => (
                <div key={index} className="border p-4 rounded-lg">
                  <h5 className="font-medium mb-3">Pemain #{index + 1}</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nama</p>
                      <p className="font-medium">{formatData('name', player.name)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Alamat</p>
                      <p className="font-medium">{formatData('address', player.address)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Usia</p>
                      <p className="font-medium">{formatData('age', player.age)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Posisi</p>
                      <p className="font-medium">{formatData('position', player.position)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nomor Punggung</p>
                      <p className="font-medium">{formatData('jerseyNumber', player.jerseyNumber)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">WhatsApp</p>
                      <p className="font-medium">{formatData('whatsapp', player.whatsapp)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Foto Selfie</p>
                      <p className="font-medium">{formatData('selfiePhoto', player.selfiePhoto)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Foto KTP</p>
                      <p className="font-medium">{formatData('idCard', player.idCard)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Foto KK</p>
                      <p className="font-medium">{formatData('familyCard', player.familyCard)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Kembali
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Konfirmasi & Kirim'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
