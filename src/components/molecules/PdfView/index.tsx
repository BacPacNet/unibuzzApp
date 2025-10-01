import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PDFModalWebView = ({
  visible,
  onClose,
  pdfUrl,
}: {
  visible: boolean;
  onClose: () => void;
  pdfUrl: string;
}) => {
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007aff" />
          </View>
        )}
        <WebView
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`,
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => setLoading(false)}
          style={{ flex: 1 }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "flex-end",
  },
  closeButton: {
    fontSize: 16,
    color: "#007aff",
  },
  loaderContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
    zIndex: 1,
  },
});

export default PDFModalWebView;
