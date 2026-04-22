import { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
// ✅ pakai legacy biar gak error
import * as FileSystem from "expo-file-system/legacy";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestPermission();
    MediaLibrary.requestPermissionsAsync();
  }, []);

  // 📸 TAKE PHOTO
  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
    }
  };

  // 🖼️ PICK IMAGE (FIX deprecated)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // ✅ FIX
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 💾 SAVE IMAGE (FIX deprecated)
  const saveImage = async () => {
    if (image) {
      const fileName = image.split("/").pop();
      const newPath = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({
        from: image,
        to: newPath,
      });

      await MediaLibrary.saveToLibraryAsync(newPath);

      alert("Image saved to gallery!");
    }
  };

  if (!permission) {
    return <Text>Requesting permission...</Text>;
  }

  if (!permission.granted) {
    return <Text>No camera access</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 📷 CAMERA MODE */}
      {!image ? (
        <View style={{ flex: 1 }}>
          <CameraView style={{ flex: 1 }} ref={cameraRef} />

          {/* Overlay */}
          <View
            style={{
              position: "absolute",
              bottom: 40,
              width: "100%",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 15,
              borderRadius: 15,
            }}
          >
            <TouchableOpacity
              onPress={takePhoto}
              style={{
                backgroundColor: "white",
                padding: 12,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text>📸 Take Photo</Text>
            </TouchableOpacity>

            <Text style={{ color: "white", fontSize: 16 }}>
              Nama: Evel Mvl
            </Text>
            <Text style={{ color: "white", fontSize: 16 }}>
              NIM: 00000077234
            </Text>
          </View>
        </View>
      ) : (
        /* 🖼️ RESULT MODE */
        <View style={{ flex: 1 }}>
          <Image source={{ uri: image }} style={{ flex: 1 }} />

          <View
            style={{
              position: "absolute",
              bottom: 40,
              width: "100%",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 15,
              borderRadius: 15,
            }}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <Text>🖼️ Pick Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={saveImage}
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <Text>💾 Save Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setImage(null)}
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text>🔄 Reset</Text>
            </TouchableOpacity>

            <Text style={{ color: "white" }}>
              Nama: Evel Mvl
            </Text>
            <Text style={{ color: "white" }}>
              NIM: 00000077234
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}