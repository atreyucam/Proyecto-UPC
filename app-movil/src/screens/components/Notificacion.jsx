import React, { useState } from "react";
import { View } from "react-native";
import { IconButton, Menu } from "react-native-paper";

const Notificacion = () => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true); 
  const closeMenu = () => setVisible(false);
  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton icon="bell" color="white" size={24} onPress={openMenu}  />
      }
    >
      <View style={{ marginTop: 30 }}>
        <Menu.Item onPress={() => {}} title="Notification 1" />
        <Menu.Item onPress={() => {}} title="Notification 2" />
        <Menu.Item onPress={() => {}} title="Notification 1" />
        <Menu.Item onPress={() => {}} title="Notification 2" />
        <Menu.Item onPress={() => {}} title="Notification 1" />
        <Menu.Item onPress={() => {}} title="Notification 2" />
      </View>
    </Menu>
  );
};

export default Notificacion;
