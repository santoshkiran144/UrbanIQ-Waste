import { Camera, UploadCloud, X } from "./Icons";

const ScannerModal = ({ isOpen, onClose, onFileSelect, imageName }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-glass">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-100">AI Verification</p>
            <h3 className="mt-2 font-display text-3xl font-bold text-white">Waste Violation Detected - Record Evidence</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Simulate a camera workflow by uploading a waste image. The MVP will use the uploaded evidence as the basis for reporting.
            </p>
          </div>
          <button className="rounded-2xl border border-white/10 p-3 text-slate-200" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>
        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-brand-400/40 bg-brand-400/5 px-6 py-14 text-center transition hover:bg-brand-400/10">
          <span className="rounded-full bg-white/10 p-4 text-brand-100">
            <Camera size={24} />
          </span>
          <span className="mt-4 text-lg font-semibold text-white">Upload mixed-waste evidence</span>
          <span className="mt-2 inline-flex items-center gap-2 text-sm text-slate-300">
            <UploadCloud size={16} />
            {imageName || "Choose image"}
          </span>
          <input accept="image/*" className="hidden" onChange={onFileSelect} type="file" />
        </label>
      </div>
    </div>
  );
};

export default ScannerModal;
