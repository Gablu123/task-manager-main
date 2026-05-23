import { useColorScheme, View } from "react-native";
import { useSelector } from "react-redux";

const ThemeView = ({ style, children, ...props }) => {
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <View
      style={[
        {
          backgroundColor: isDark ? "#000" : "#f5f6fa",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default ThemeView;