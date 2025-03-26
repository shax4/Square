import {Image} from "react-native";
import { ProfileImageProps } from "./ProfileImage.types";
import {styles} from "./ProfileImage.styles";

const ProfileImage = ({imageUrl, variant = "small"}: ProfileImageProps) => {
    const getImageSize = () => {
        switch(variant){
            case "small":
                return styles.small;
            case "medium":
                return styles.medium;
            case "large":
                return styles.large;
            case "extralarge":
                return styles.extralarge;
        }
    };

    const source = imageUrl ? {uri : imageUrl} : require("../../../assets/images/profile-image.jpg");

    return <Image source={source} style={[styles.image, getImageSize()]}/>;
}

export default ProfileImage;