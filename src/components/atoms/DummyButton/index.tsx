import { Xmark } from "iconoir-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DummyButton = ({ onPress, text, icon, toShowCross, onCrossPress,label }: any) => {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
        
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <View style={styles.buttonContent}>
                <Text>{text}</Text>
                {!toShowCross && icon && <View style={styles.iconWrapper}>{icon}</View>}
                {toShowCross && (
                    <TouchableOpacity onPress={onCrossPress} style={styles.iconWrapper}>
                        <Xmark width={20} height={20} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
        </View>
    );
};

export default DummyButton;

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: "#E5E5E5",
        padding: 10,
        borderRadius: 10,
        height: 40,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    iconWrapper: {
        marginRight: 8,
    },
    label:{
        fontSize:14,
        fontWeight:"500",
        color:"#3A3B3C",
        marginBottom:8
      }
});
