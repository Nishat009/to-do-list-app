'use client';

import { useRef, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { X } from 'lucide-react';
import Camera from '@/components/logo/Camera';
import Calendar from '@/components/logo/Calendar';
import UploadButton from '@/components/logo/UploadButton';

export default function ProfilePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // -------------- CAMERA LOGIC -------------------
  const openCamera = async () => {
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);

    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/png");

    setPhoto(data);
    closeCamera();
  };

  // -------------- FILE UPLOAD LOGIC -------------------
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // -------------- RETURN JSX -------------------
  return (
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


            {/* -------- PROFILE PHOTO SECTION -------- */}


            {/* -------- FORM -------- */}
            <form className="space-y-6 mt-6">
              <div className='border px-6 py-[14px] rounded-2xl border-[#A1A3ABA1] w-max'>
                <div className="flex items-center gap-6">

                  {/* Profile Image */}
                  <div className="w-28 h-28 rounded-full bg-[#E5E7EB] relative flex items-center justify-center">
                    {photo ? (
                      <img src={photo} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 text-sm">No Photo</span>
                    )}

                    {/* Camera Button → openCamera() */}
                    <button
                      onClick={openCamera}
                      className="absolute z-[99999] bottom-1 right-1 bg-[#5272FF] p-1.5 rounded-full"
                    >
                      <Camera />
                    </button>
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={handleUploadClick}
                    className="bg-[#5272FF] text-white font-normal flex gap-2 items-center justify-center px-[16px] py-2.5 rounded-lg"
                  >
                    <UploadButton />
                    Upload New Photo
                  </button>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* -------- CAMERA POPUP -------- */}
                {isCameraOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-xl shadow-lg relative">

                      <button
                        onClick={closeCamera}
                        className="absolute top-3 right-3 text-gray-600"
                      >
                        <X size={22} />
                      </button>

                      <video
                        ref={videoRef}
                        className="w-80 h-60 bg-black rounded-lg"
                      />

                      <button
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
              <div className='border px-12 py-5 rounded-2xl border-[#A1A3ABA1]'>
                <div className="grid grid-cols-2 gap-6 ">
                  <div>
                    <label className="text-sm font-medium text-[#0C0C0C]">First Name</label>
                    <input className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg mt-1.5 h-[42px]" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#0C0C0C]">Last Name</label>
                    <input className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg mt-1.5 h-[42px]" />
                  </div>
                </div>

                <div className='mt-2'>
                  <label className="text-sm font-medium text-[#0C0C0C]">Email</label>
                  <input className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg mt-1.5 h-[42px]" />
                </div>

                <div className="grid grid-cols-2 gap-6 mt-2">
                  <div>
                    <label className="text-sm font-medium text-[#0C0C0C]">Address</label>
                    <input className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg mt-1.5 h-[42px]" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#0C0C0C]">Contact Number</label>
                    <input className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg mt-1.5 h-[42px]" />
                  </div>
                </div>

                <div className='mt-2' >
                  <label className="text-sm font-medium text-[#0C0C0C]">Birthday</label>
                  <div className="relative">
                    <input className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg mt-1.5 h-[42px]" type="date" />
                    <Calendar className="absolute right-3 top-3 text-gray-500" />
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4 pt-4">
                  <button className="bg-[#5272FF] text-white w-[200px] h-10 rounded-lg text-sm">Save Changes</button>
                  <button className="bg-[#8CA3CD] text-white w-[200px] h-10 text-sm rounded-lg">Cancel</button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
