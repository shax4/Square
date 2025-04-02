import { TouchableOpacity } from "react-native";
import { Icons } from "../../../assets/icons/Icons";
import { useState } from "react";

interface BookmarkButtonProps {
    isScraped: boolean;
    onPressScrap: () => void
}

const BookmarkButton = ({
    isScraped = false,
    onPressScrap
}: BookmarkButtonProps) => {

    const [scrap, setScrap] = useState(isScraped);

    const handlePress = () => {
        setScrap((prev) => !prev);
        onPressScrap();
    };
    return (
        <TouchableOpacity
            onPress={handlePress}
        >
            {scrap ? <Icons.bookmarkUndo /> : <Icons.bookmark />}
        </TouchableOpacity>
    )
}

export default BookmarkButton;