'use client';

import { useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { X } from 'lucide-react';
import Camera from '@/components/logo/Camera';
import Calendar from '@/components/logo/Calendar';
import UploadButton from '@/components/logo/UploadButton';
import { useAuth } from '../(auth)/contextapi/AuthContext';
import { ProtectedRoute } from '@/components/protectedRoutes';
import AuthInput from '@/components/layout/AuthInput';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load initial user values
  const [photo, setPhoto] = useState<string | null>(user?.photo || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [contact, setContact] = useState(user?.contact_number || '');
  const [birthday, setBirthday] = useState(user?.birthday || '');

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // ---------- CAMERA LOGIC ----------
  const openCamera = async () => {
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], 'camera-photo.png', { type: 'image/png' });

      setPhoto(URL.createObjectURL(file));
      setPhotoFile(file);
    });

    closeCamera();
  };

  // ---------- FILE UPLOAD ----------
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
  };

  // ---------- SAVE PROFILE ----------
  const handleSave = async () => {
    const formData = new FormData();

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("contact_number", contact);
    formData.append("birthday", birthday);

    // If photo file exists, append it
    if (photoFile) {
      formData.append("profile_image", photoFile);
    } else if (photo && photo.startsWith("data:image")) {
      // If photo is base64, convert to file
      const arr = photo.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);

      const file = new File([u8arr], "profile.png", { type: mime });
      formData.append("profile_image", file);
    }

    try {
      await updateUser(formData);
      // Refresh user data to get updated photo URL
      // The updateUser function already updates the context, so we can get it from there
      // But we need to wait for the context to update, so we'll fetch fresh data
      try {
        const { apiService } = await import('@/lib/api');
        const updatedUserData = await apiService.getUserDetails();
        const updatedPhoto = updatedUserData.photo || updatedUserData.profile_image;
        if (updatedPhoto) {
          setPhoto(updatedPhoto);
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
      setPhotoFile(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile. Please try again.");
    }
  };




  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#EEF7FF] flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <div className="px-10 py-10">
          <div className="bg-white mt-6 p-8 shadow rounded-2xl">
            <h2 className="text-2xl font-semibold text-[#0D224A] pb-0 mb-6 relative w-max">
              Account Information
              <span className="block bg-[#5272FF] h-[2px] w-[70%] mt-1"></span>
            </h2>

            <form className="space-y-6 mt-6">
              {/* PROFILE + CAMERA */}
              <div className="border px-6 py-[14px] rounded-2xl border-[#A1A3ABA1] w-max">
                <div className="flex items-center gap-6">
                  <div className="w-28 h-28 rounded-full bg-[#E5E7EB] relative flex items-center justify-center">
                    {photo ? (
                      <img src={photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-gray-500 text-sm">No Photo</span>
                    )}

                    <button
                      type="button"
                      onClick={openCamera}
                      className="absolute bottom-1 right-1 bg-[#5272FF] p-1.5 rounded-full"
                    >
                      <Camera />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="bg-[#5272FF] text-white font-normal flex gap-2 items-center justify-center px-[16px] py-2.5 rounded-lg"
                  >
                    <UploadButton />
                    Upload New Photo
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Camera Popup */}
                {isCameraOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-xl shadow-lg relative">
                      <button
                        onClick={closeCamera}
                        className="absolute top-3 right-3 text-gray-600"
                      >
                        <X size={22} />
                      </button>

                      <video ref={videoRef} className="w-80 h-60 bg-black rounded-lg" />

                      <button
                        type="button"
                        onClick={takePhoto}
                        className="mt-4 w-full bg-[#4F76FF] text-white py-2 rounded-lg"
                      >
                        Capture Photo
                      </button>

                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  </div>
                )}
              </div>

              {/* FORM FIELDS */}
              <div className="border px-12 py-5 rounded-2xl border-[#A1A3ABA1]">
                <div className="grid grid-cols-2 gap-6 ">
                  <AuthInput
                    label="First Name"
                    value={firstName}
                    onChange={setFirstName}
                    labelClass="text-sm font-medium text-[#0C0C0C]"
                    inputClass="border border-[#D1D5DB] rounded-lg px-4 py-2"
                  />

                  <AuthInput
                    label="Last Name"
                    value={lastName}
                    onChange={setLastName}
                    labelClass="text-sm font-medium text-[#0C0C0C]"
                    inputClass="border border-[#D1D5DB] rounded-lg px-4 py-2"
                  />
                </div>

                <div className="mt-2">
                  <AuthInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    labelClass="text-sm font-medium text-[#0C0C0C]"
                    inputClass="border border-[#D1D5DB] rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mt-2">
                  <AuthInput
                    label="Address"
                    value={address}
                    onChange={setAddress}
                    labelClass="text-sm font-medium text-[#0C0C0C]"
                    inputClass="border border-[#D1D5DB] rounded-lg px-4 py-2"
                  />

                  <AuthInput
                    label="Contact Number"
                    type="tel"
                    value={contact}
                    onChange={setContact}
                    labelClass="text-sm font-medium text-[#0C0C0C]"
                    inputClass="border border-[#D1D5DB] rounded-lg px-4 py-2"
                  />
                </div>

                <div className="mt-2">
                  <div className="relative">
                    <AuthInput
                      label="Birthday"
                      type="date"
                      value={birthday}
                      onChange={setBirthday}
                      labelClass="text-sm font-medium text-[#0C0C0C]"
                      inputClass="border border-[#D1D5DB] rounded-lg px-4 py-2 pr-10"
                    />
                    <Calendar className="absolute right-3 top-9 text-gray-500" />
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-[#5272FF] text-white w-[200px] h-10 rounded-lg text-sm"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFirstName(user?.first_name || '');
                      setLastName(user?.last_name || '');
                      setEmail(user?.email || '');
                      setAddress(user?.address || '');
                      setContact(user?.contact_number || '');
                      setBirthday(user?.birthday || '');
                      setPhoto(user?.photo || null);
                      setPhotoFile(null);
                    }}
                    className="bg-[#8CA3CD] text-white w-[200px] h-10 text-sm rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
