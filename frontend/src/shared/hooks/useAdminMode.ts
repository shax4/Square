import { useAdminModeStore } from "../stores/adminMode";

export const useAdminMode = () => {
    const isAdminMode = useAdminModeStore((state) => state.isAdminMode);
    const setAdminMode = useAdminModeStore((state) => state.setAdminMode);
    const isAdminState = useAdminModeStore((state) => state.isAdminState);
    const setAdminState = useAdminModeStore((state) => state.setAdminState);

    return { isAdminMode, setAdminMode, isAdminState, setAdminState };
}