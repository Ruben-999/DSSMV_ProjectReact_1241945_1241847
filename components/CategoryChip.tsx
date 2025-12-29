import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type Props = {
  label: string;
  active?: boolean;
  danger?: boolean;     // delete mode selecionado
  disabled?: boolean;   // protegido (Todos)
  onPress?: () => void;
};

const CategoryChip: React.FC<Props> = ({
  label,
  active = false,
  danger = false,
  disabled = false,
  onPress,
}) => {
  const chipStyle: ViewStyle[] = [styles.chip];

  if (active) chipStyle.push(styles.active);
  if (danger) chipStyle.push(styles.danger);
  if (disabled) chipStyle.push(styles.disabled);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={disabled ? undefined : onPress}
      style={chipStyle}
    >
      <Text
        style={[
          styles.text,
          active && styles.textActive,
          danger && styles.textDanger,
          disabled && styles.textDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryChip;

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#1e1e1e',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },

  active: {
    backgroundColor: '#6c2cff',
    borderColor: '#6c2cff',
  },

  danger: {
    backgroundColor: '#7f1d1d',
    borderColor: '#ef4444',
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: '600',
  },

  textActive: {
    color: '#fff',
  },

  textDanger: {
    color: '#fee2e2',
  },

  textDisabled: {
    color: '#aaa',
  },
});
