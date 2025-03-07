import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

const HelloWorldSceneAR = () => {
  const [trackingState, setTrackingState] = useState("Initializing AR...");

  // Position, scale, and rotation for the shirt model
  const [shirtPosition, setShirtPosition] = useState([0, 0, -6]); // Adjust as needed
  const [shirtScale, setShirtScale] = useState([0.1, 0.1, 0.1]); // Adjust as needed
  const [shirtRotation, setShirtRotation] = useState([-90, 0, 0]); // Adjust as needed

  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("onInitialized", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setTrackingState("Tracking Normal");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setTrackingState("Tracking Unavailable");
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* 3D Shirt Model */}
      <Viro3DObject
        source={require("./models/13647_Polo_Team_Shirt_v2_L3.obj")}
        resources={[require("./models/13647PoloTeamShirt_cloth_diffuse.jpg")]}
        position={shirtPosition}
        scale={shirtScale}
        rotation={shirtRotation}
        type="OBJ"
      />
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1 },
});