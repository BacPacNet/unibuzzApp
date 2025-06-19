import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavArrowLeft } from 'iconoir-react-native';

type BackHeaderProps = {
  label?: string;
  onPress?: () => void;
};

const BackHeader: React.FC<BackHeaderProps> = ({ label = 'Back', onPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress || (() => navigation.goBack())}
      >
        <NavArrowLeft width={24} height={24} color="#6744FF" />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  height:32,
  marginTop:16,
  paddingLeft:16
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, 
  },
  label: {
    color: '#6744FF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BackHeader;
