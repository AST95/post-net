import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroTrackingReason,
  ViroTrackingStateConstants,
  ViroMaterials,
} from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

ViroMaterials.createMaterials({
  ShirtMaterial: {
    diffuseTexture: require("./models/13647PoloTeamShirt_cloth_diffuse.jpg"),
  },
});

const HelloWorldSceneAR = () => {
  const [trackingState, setTrackingState] = useState("Initializing AR...");

  const [shirtPosition, setShirtPosition] = useState<[number, number, number]>([0, 0, -6]); // Move closer
  const [shirtScale, setShirtScale] = useState<[number, number, number]>([0.1, 0.1, 0.1]); // Adjust as needed
  const [shirtRotation, setShirtRotation] = useState<[number, number, number]>([-90, 0, 0]); // Adjust as needed

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
        materials={["ShirtMaterial"]} // Assign the custom material
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