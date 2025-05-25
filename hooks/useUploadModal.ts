import { create } from 'zustand';

interface useUploadStore {
    isOpen: boolean;
    onOpen : () => void;
    onClose: () => void;
};

const useuseUpload = create<useUploadStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useuseUpload;