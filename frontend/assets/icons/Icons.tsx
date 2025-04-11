import React from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  Octicons,
  FontAwesome,
  EvilIcons,
} from "@expo/vector-icons";

export const Icons = {
  edit: (props: any) => <Ionicons name="pencil" size={24} {...props} />,
  delete: (props: any) => <Ionicons name="trash" size={24} {...props} />,
  bookmark: (props: any) => (
    <Ionicons name="bookmark-outline" size={24} color="#888888" />
  ),
  bookmarkUndo: (props: any) => (
    <Ionicons name="bookmark" size={24} color="#FF4848" {...props} />
  ),
  report: (props: any) => (
    <MaterialCommunityIcons
      name="alarm-light-outline"
      size={24}
      color="black"
    />
  ),
  add: (props: any) => <Octicons name="diff-added" size={24} color="black" />,
  addwhite: (props: any) => <Octicons name="diff-added" size={24} color="white" />,
  share: (props: any) => (
    <Feather name="share" size={24} color="black" {...props} />
  ),
  settings: (props: any) => (
    <Feather name="settings" size={24} color="black" {...props} />
  ),
  logout: (props: any) => (
    <Ionicons name="exit-outline" size={24} color="black" {...props} />
  ),
  send: (props: any) => (
    <MaterialCommunityIcons name="send" size={24} {...props} />
  ),
  write: (props: any) => (
    <Feather name="edit" size={24} color="white" {...props} />
  ),
  back: (props: any) => (
    <Ionicons name="chevron-back" size={24} color="black" {...props} />
  ),
  heartFill: (props: any) => <AntDesign name="heart" size={20} color="red" />,
  heartBlank: (props: any) => (
    <AntDesign name="hearto" size={20} color="gray" />
  ),
  comment: (props: any) => <EvilIcons name="comment" size={32} color="gray" />,
  commentNew: (props: any) => (
    <Ionicons name="chatbubble-outline" size={24} color="#888888" />
  ),
  leftOptionEmoji: "🙆‍♂️",
  rightOptionEmoji: "🙅",
};
