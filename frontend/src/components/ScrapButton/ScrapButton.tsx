import { TouchableOpacity } from "react-native";
import { Icons } from "../../../assets/icons/Icons";

interface ScrapButtonProps {
    isScraped: boolean;
    onPressScrap: () => void;
}

const ScrapButton = ({
    isScraped = false,
    onPressScrap
}: ScrapButtonProps) => {
    return (
        <TouchableOpacity onPress={onPressScrap}>
            {isScraped ? <Icons.bookmarkUndo /> : <Icons.bookmark />}
        </TouchableOpacity>
    );
};

export default ScrapButton;
