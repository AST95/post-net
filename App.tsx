import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroTrackingStateConstants,
  ViroMaterials,
  ViroTrackingState,
} from "@reactvision/react-viro";
import { RNCamera } from "react-native-camera";

ViroMaterials.createMaterials({
  ShirtMaterial: {
    diffuseTexture: require("./models/13647PoloTeamShirt_cloth_diffuse.jpg"),
  },
});

type Position = [number, number, number];
type Scale = [number, number, number];
type Rotation = [number, number, number];

const PoseNetTShirtAR = () => {
  const [shirtPosition, setShirtPosition] = useState<Position>([0, 0, -6]);
  const [shirtScale, setShirtScale] = useState<Scale>([0.1, 0.1, 0.1]);
  const [shirtRotation, setShirtRotation] = useState<Rotation>([-90, 0, 0]);
  const cameraRef = useRef<RNCamera | null>(null);

  useEffect(() => {
    async function loadPoseNet() {
      await tf.ready();
      const net = await posenet.load();
      detectPose(net);
    }
    loadPoseNet();
  }, []);

  const detectPose = async (net: posenet.PoseNet) => {
    if (!cameraRef.current) return;

    const options = { quality: RNCamera.Constants.VideoQuality['720p'], base64: true };
    const frame = await cameraRef.current.takePictureAsync(options);
    const imageTensor = tf.browser.fromPixels(frame);
    const pose = await net.estimateSinglePose(imageTensor, {
      flipHorizontal: false,
    });

    if (pose) {
      const leftShoulder = pose.keypoints.find((p: posenet.Keypoint) => p.part === "leftShoulder");
      const rightShoulder = pose.keypoints.find((p: posenet.Keypoint) => p.part === "rightShoulder");
      
      if (leftShoulder && rightShoulder) {
        const midPointX = (leftShoulder.position.x + rightShoulder.position.x) / 2;
        const midPointY = (leftShoulder.position.y + rightShoulder.position.y) / 2;
        const scaleFactor = Math.abs(rightShoulder.position.x - leftShoulder.position.x) / 200;

        setShirtPosition([midPointX / 100 - 1, -midPointY / 200 + 1, -3]);
        setShirtScale([scaleFactor, scaleFactor, scaleFactor]);
      }
    }

    requestAnimationFrame(() => detectPose(net));
  };

  const onTrackingUpdated = (state: ViroTrackingState) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log("Tracking Normal");
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={(ref) => (cameraRef.current = ref)}
        style={styles.camera}
        type={RNCamera.Constants.Type.front}
        playSoundOnCapture={false}
      />
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => (
            <ViroARScene onTrackingUpdated={onTrackingUpdated}>
              <Viro3DObject
                source={require("./models/13647_Polo_Team_Shirt_v2_L3.obj")}
                materials={["ShirtMaterial"]}
                position={shirtPosition}
                scale={shirtScale}
                rotation={shirtRotation}
                type="OBJ"
              />
            </ViroARScene>
          ),
        }}
        style={styles.f1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  f1: { flex: 1 },
});

export default PoseNetTShirtAR;