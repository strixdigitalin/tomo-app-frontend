import {View, Text, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import useThemeColor from '../utils/useThemeColor';

const Loader = ({visible = false}) => {
  const { isDarkMode, primaryColor } = useThemeColor();

  return (
    <Modal transparent visible={visible}
    style={{alignSelf:'center'}}
    >
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf:'center'}}>
        <View
          style={{
            padding: 15,
            backgroundColor: 'transparent',
            borderRadius: 12,
            // elevation: 12,
          }}>
          <ActivityIndicator size={'large'} color={isDarkMode?'white':primaryColor} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
