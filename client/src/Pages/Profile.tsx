import { useRef } from 'react';
import { useGetMeQuery, useUploadAvatarMutation } from '../store/slices/userApiSlice';
import { User, Loader2, Camera, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { UpdateEmailForm } from '@/Components/EmailUpdateComponent';
import { UpdateNameForm } from '@/Components/UpdateNameForm';
import { UpdatePasswordForm } from '@/Components/PasswordUpdateForm';

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useGetMeQuery();
  const [uploadAvatar, { isLoading: isUpdating }] = useUploadAvatarMutation();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-zinc-500" size={32} />
      </div>
    );
  }

  const user = data?.data.user;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error("Please select an image file");
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      await uploadAvatar(formData).unwrap();
      toast.success("Profile picture updated!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to upload image");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6 pb-20"> {/* Max width increased to 6xl */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8"> {/* Increased gap for breathing room */}

        {/* CARD 1: Avatar Section - Full Row */}
        <div className="lg:col-span-12 p-10 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar Circle */}
            <div
              className="relative group cursor-pointer flex-shrink-0"
              onClick={() => !isUpdating && fileInputRef.current?.click()}
            >
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-zinc-50 bg-zinc-50 shadow-md relative">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                    <User size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={32} />
                </div>
                {isUpdating && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-zinc-900" size={32} />
                  </div>
                )}
              </div>
            </div>

            {/* Text and Button info aligned to the right of avatar on desktop */}
            <div className="flex-1 text-center md:text-left pt-4">
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Profile Picture</h1>
              <p className="text-zinc-500 mb-6 max-w-md">
                Your avatar is visible to everyone. We recommend an image of at least 400x400px.
              </p>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUpdating}
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                {isUpdating ? 'Uploading...' : 'Change Photo'}
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: Update Name - 6 Columns (Half) */}
        <div className="lg:col-span-6 flex">
          <UpdateNameForm currentName={user?.name} />
        </div>

        {/* CARD 3: Update Email - 6 Columns (Half) */}
        <div className="lg:col-span-6 flex">
          <UpdateEmailForm currentEmail={user?.email} />
        </div>

        {/* FULL WIDTH PASSWORD CARD */}
        <div className="lg:col-span-12 mt-4">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;