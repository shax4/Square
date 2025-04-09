import { useAdminModeStore } from "../stores/adminMode";

export const useAdminMode = () => {
    const isAdminMode = useAdminModeStore((state) => state.isAdminMode);
    const setAdminMode = useAdminModeStore((state) => state.setAdminMode);

    return { isAdminMode, setAdminMode };
}