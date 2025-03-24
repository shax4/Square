import { StyleSheet } from 'react-native';
import colors from '../../../assets/colors';

export const styles = StyleSheet.create({
  fieldContainer: {
    width: '100%',
    marginBottom: 16,
  },
  container: {
    width: 335,
    height: 51,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E1E6',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  containerDisabled: {
    backgroundColor: '#F2F2F7',
    borderColor: '#E1E1E6',
  },
  containerError: {
    borderColor: colors.warnRed,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.black,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  inputDisabled: {
    color: colors.disabledText,
  },
  inputError: {
    color: colors.black,
  },
  errorText: {
    fontSize: 12,
    color: colors.warnRed,
    marginTop: 4,
  },
  placeholder: {
    color: '#A0A0A8',
  },
});