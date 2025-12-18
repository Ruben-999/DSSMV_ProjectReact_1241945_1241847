import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatsCardProps = {
    value: number;
    label: string;
    large?: boolean;
};

const StatsCard = ({value, label, large = false}: StatsCardProps) => {
    return (
        <View style={[styles.card, large && styles.large]}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
    backgroundColor: '#111',
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  large: {
    marginTop: 12,
    marginRight: 0,
  },
  value: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    color: '#aaa',
    marginTop: 4,
  },
});

export default StatsCard;