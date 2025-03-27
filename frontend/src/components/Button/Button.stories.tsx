import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react-native";
import Button from "./Button";

const ButtonMeta: ComponentMeta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
};

export default ButtonMeta;

export const Primary: ComponentStory<typeof Button> = () => (
  <Button label="다음" variant="primary" />
);

export const Secondary: ComponentStory<typeof Button> = () => (
  <Button label="다음" variant="secondary" />
);

export const Disabled: ComponentStory<typeof Button> = () => (
  <Button label="다음" disabled />
);

export const Check: ComponentStory<typeof Button> = () => (
  <Button label="중복 확인" variant="check" />
);
