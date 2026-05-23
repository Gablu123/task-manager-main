import { Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";

const ThemeText = ({ style, children, ...props }) => {
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <Text
      style={[
        {
          color: isDark ? "#fff" : "#000",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ThemeText;