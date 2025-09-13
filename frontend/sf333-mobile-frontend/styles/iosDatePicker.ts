import { StyleSheet } from "react-native"

export const iosDatePicker = StyleSheet.create({
 dateInputContainer: {
    // marginVertical: 4,
    position: 'relative',
    width: '100%',
    marginLeft: '30%'
  },
  dateInputText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: 'grey',
  },
  iosPickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  iosPickerContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding for iOS
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  iosPickerButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  confirmButton: {
    fontWeight: 'bold',
  },
  iosPicker: {
    height: 200,
  },
})