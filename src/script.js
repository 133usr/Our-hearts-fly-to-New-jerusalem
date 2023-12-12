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









// // The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';

import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, Terrain, Viewer,Color } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

let viewer;
let airplaneEntity;

function initializeCesium() {
    viewer = new Viewer('cesiumContainer', {
        animation: false, // Disable animation widget
        baseLayerPicker: false, // Disable base layer picker
        fullscreenButton: false, // Disable fullscreen button
        geocoder: false, // Disable geocoder
        homeButton: false, // Disable home button
        infoBox: false, // Disable info box
        sceneModePicker: false, // Disable scene mode picker
        selectionIndicator: false, // Disable selection indicator
        timeline: false, // Disable timeline widget
        navigationHelpButton: false, // Disable navigation help button
        navigationInstructionsInitiallyVisible: false // Hide navigation instructions initially
    });

  
  viewer.scene.globe.enableLighting = true;

  // Load the 3D model of the airplane
  const airplanePosition = Cartesian3.fromDegrees(85.3240, 27.7172, 30000); // Nepal coordinates at 30000ft altitude
  airplaneEntity = viewer.entities.add({
      position: airplanePosition,
      model: {
          uri: './assets/glb/low-size/cartoon_plane.glb', // Replace with the path to your airplane model
          scale: 100.0,
          silhouetteColor: Color.RED, // Highlight the airplane silhouette
          silhouetteSize: 5 // Adjust the size of the silhouette
      }
  });
 // Adjusting the near and far planes to avoid clipping
 viewer.scene.camera.frustum.near = 1.0; // Adjust the near plane value
 viewer.scene.camera.frustum.far = 5000000.0; // Adjust the far plane value

  // Focus the camera on the airplane
  viewer.zoomTo(airplaneEntity);

  // Simulate flight when the function is called
  simulateFlight(0.2); // Change the argument to set the flight percentage (e.g., 0.2 for 20%)
}

function simulateFlight(flightPercentage) {
  const koreaPosition = Cartesian3.fromDegrees(127.7669, 35.9078, 30000); // Korea coordinates at 30000ft altitude

  // Calculate the intermediate position based on the percentage
  const interpolatedPosition = Cartesian3.lerp(
      airplaneEntity.position.getValue(viewer.clock.currentTime),
      koreaPosition,
      flightPercentage,
      new Cartesian3()
  );

  // Update airplane's position
  airplaneEntity.position.setValue(interpolatedPosition);
}

initializeCesium(); // Call the initialization function