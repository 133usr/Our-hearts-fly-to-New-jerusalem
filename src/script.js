// // The URL on your server where CesiumJS's static files are hosted.
// window.CESIUM_BASE_URL = '/';

// import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
// import "cesium/Build/Cesium/Widgets/widgets.css";

// // Your access token can be found at: https://ion.cesium.com/tokens.
// // Replace `your_access_token` with your Cesium ion access token.

// Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MjAyYjg4NC02NzM0LTQxOGMtOGNhOC0wZDYxN2Q4ZTA2YmEiLCJpZCI6MTgzODk5LCJpYXQiOjE3MDIzNTg1ODd9.ti2Hyf1LxJL3UPbXCUwuIz8So9DCU3Uwovqm-FN0gxI';

// // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
// const viewer = new Viewer('cesiumContainer', {
//   terrain: Terrain.fromWorldTerrain(),
// });    

// // Fly the camera to San Francisco at the given longitude, latitude, and height.
// viewer.camera.flyTo({
//   destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
//   orientation: {
//     heading: CesiumMath.toRadians(0.0),
//     pitch: CesiumMath.toRadians(-15.0),
//   }
// });

// // Add Cesium OSM Buildings, a global 3D buildings layer.
// const buildingTileset = await createOsmBuildingsAsync();
// viewer.scene.primitives.add(buildingTileset);   



import '../src/style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
// import * as dat from 'dat.gui'
import { Object3D } from 'three'
import TWEEN from '@tweenjs/tween.js'
import { InteractionManager } from 'three.interactive';
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';







// // The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

let viewer;
let airplaneEntity;

function initializeCesium() {
    viewer = new Viewer('cesiumContainer', {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false
    });
    viewer.scene.globe.enableLighting = true;

    // Load the 3D model of the airplane
    const airplanePosition = Cartesian3.fromDegrees(85.3240, 27.7172, 30000); // Nepal coordinates
    airplaneEntity = viewer.entities.add({
        position: airplanePosition,
        model: {
            uri: './assets/glb/low-size/cartoon_plane.glb', // Replace with the path to your airplane model
            scale: 2900.0
        }
    });

    viewer.zoomTo(viewer.entities); // Zoom to show the airplane

    // Simulate flight when the function is called
    simulateFlight(0.2); // Change the argument to set the flight percentage (e.g., 0.2 for 20%)


    viewer.scene.camera.moveEnd.addEventListener(function() {
      updateAirplanePosition();
  });

  // Optional: Add event listeners for other interactions, such as zoom or click
  // For example:
  viewer.scene.postRender.addEventListener(function() {
      // Check if the globe was zoomed or interacted with and update the airplane's position accordingly
      updateAirplanePosition();
  });
}
// Function to update the airplane's position based on globe view
function updateAirplanePosition() {
  const koreaPosition = Cartesian3.fromDegrees(127.7669, 35.9078, 30000); // Korea coordinates

  // Calculate the intermediate position based on the current camera position
  const cameraPosition = viewer.camera.positionCartographic;
  const flightPercentage = calculateFlightPercentage(cameraPosition);

  const interpolatedPosition = Cartesian3.lerp(
      airplaneEntity.position.getValue(viewer.clock.currentTime),
      koreaPosition,
      flightPercentage,
      new Cartesian3()
  );

  // Update airplane's position
  airplaneEntity.position.setValue(interpolatedPosition);
}

// Function to calculate flight percentage based on camera position
function calculateFlightPercentage(cameraPosition) {
  // Perform calculations to determine flight percentage based on camera position or other criteria
  // Example: Use altitude or camera position to calculate flight percentage
  // Modify this according to your specific logic

  const maxAltitude = 100000; // Example maximum altitude
  const minAltitude = 5000; // Example minimum altitude
  const currentAltitude = cameraPosition.height;

  // Calculate flight percentage based on altitude
  const flightPercentage = (currentAltitude - minAltitude) / (maxAltitude - minAltitude);

  // Ensure the flight percentage remains within bounds (0 to 1)
  return CesiumMath.clamp(flightPercentage, 0, 1);
}

initializeCesium(); // Call the initialization function
