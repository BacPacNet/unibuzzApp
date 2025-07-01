import React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Search } from "iconoir-react-native";

interface SearchInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = "Search",
  containerStyle,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        {...rest}
      />
      <Search style={styles.icon} strokeWidth={2} height={20} width={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
    paddingRight: 40,
    borderRadius: 8,
    height: 40,
  },
  icon: {
    position: "absolute",
    top: "50%",
    right: 10,
    transform: [{ translateY: -10 }],
  },
});

export default SearchInput;
