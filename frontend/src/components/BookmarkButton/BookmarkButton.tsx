import { TouchableOpacity } from "react-native";
import { Icons } from "../../../assets/icons/Icons";

interface BookmarkButtonProps {
    isScraped: boolean;
    onPressScrap: () => void;
}

const BookmarkButton = ({
    isScraped = false,
    onPressScrap
}: BookmarkButtonProps) => {
    return (
        <TouchableOpacity onPress={onPressScrap}>
            {isScraped ? <Icons.bookmarkUndo /> : <Icons.bookmark />}
        </TouchableOpacity>
    );
};

export default BookmarkButton;
