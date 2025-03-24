import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { TextFieldProps, TextFieldVariant } from './TextField.types';
import { styles } from './TextField.styles';

const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  disabled = false,
  error,
  variant = TextFieldVariant.Default,
}: TextFieldProps) => {
  const getContainerStyle = () => {
    const containerStyles = [styles.container];
    
    if (disabled) {
      containerStyles.push(styles.containerDisabled as never);
    }
    
    if (error) {
      containerStyles.push(styles.containerError as never);
    }
    
    return containerStyles;
  };
  
  const getInputStyle = () => {
    const inputStyles = [styles.input];
    
    if (disabled) {
      inputStyles.push(styles.inputDisabled as never);
    }
    
    if (error) {
      inputStyles.push(styles.inputError as never);
    }
    
    return inputStyles;
  };
  
  return (
    <View style={styles.fieldContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={getContainerStyle()}>
        <TextInput
          style={getInputStyle()}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={styles.placeholder.color}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default TextField;