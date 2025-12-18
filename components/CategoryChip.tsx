import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type CategoryChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

const CategoryChip = ({ label, active = false, onPress }: CategoryChipProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.chip, active && styles.active]}>
        <Text style={[styles.text, active && styles.textActive]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryChip;

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#222',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  active: {
    backgroundColor: '#6c2cff',
  },
  text: {
    color: '#ccc',
  },
  textActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
