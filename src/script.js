

import { AnimationPlayer, AnimationSet, AnimationParser, LOOP_TYPE } from './cesium_model_animation_player.js';
// // The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = '/';
import * as Cesium from 'cesium';
import { Cartesian3, IonImageryProvider, Ion, Math as CesiumMath, Terrain, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

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

import scoreData from './scoredata.json';
import Hammer from 'hammerjs'; 
// Use scoreData in your code


/**************************************************************
 *                                                           *
 *                   MAIN FUNCTION                            *
 *                                                           *
 **************************************************************/
/**************************************************************
 *                                                           *
 *      tempsheetObject can be available throught sheet       *
 *          all you need to do is to iterate it 
 *                                                            *
 **************************************************************/


    async function main() {
      
        let allData = await fetchData();
              
        allData = allData.replace(/[""]+/g,'"'); //dont' know why data has extra ""  so remove them
        allData = allData.replace('"[{','[{'); //dont' know why data has extra ["  so remove them
        allData = allData.replace('}]"','}]');     
        // console.log(allData);  
        var sheet_arrayObject = JSON.parse(allData);  
        var participants = Object.keys(sheet_arrayObject).length;
        
        // console.log(s);
      

        function onComplete(sheet_arrayObject){ // When the code completes, do this
                const forLoop = async _ => {
                console.log("Start");
                  
                  
                 for (let index = 0; index < participants; index++) {
                  var tempsheetObject = sheet_arrayObject[index]
                  let groupType = sheet_arrayObject[index].group;
                  
                  if (groupType != "Group")
                  //  await myPromise(tempsheetObject);     //****************very important Uncomment this to run */
                   { if(tempsheetObject.Total>0) // only load model and list the names ******* if the score is not 0
                   {loadModels(tempsheetObject);}
                  }
                  
                   if (groupType == "Group")
                   {//only run for Group score
                      // await myPromise2(tempsheetObject);  //****************very important Uncomment this to run */
                    }
                  
                  }
                  
                 console.log("End");
                 
                 };
                 forLoop();
    }
    





        //   migrate from dat ui to https://lil-gui.georgealways.com/#Guide#Installation
        const gui = new GUI({
          closeFolders : true,
          autoPlace: true, //autoPlace - Adds the GUI to document.body and fixes it to the top right of the page.
          title: 'Participants',
          

        }); 
        

        var a_br_folder = gui.addFolder('विवाहित भाई');
        var a_sis_folder = gui.addFolder('विवाहित बहन');
        var y_br_folder = gui.addFolder('युवा और छात्र भाई');
        var y_sis_folder = gui.addFolder('युवा और छात्र बहन');
        var pandesra_group = gui.addFolder('पांडेसरा');
        var group_folder = gui.addFolder('विवाहित बहन');

        var a_br_folder_group1 = a_br_folder.addFolder('इसहाक');
        var a_br_folder_group2 = a_br_folder.addFolder('इम्मानुएल');
        var a_sis_folder_group1 = a_sis_folder.addFolder('रूत');
        var a_sis_folder_group2 = a_sis_folder.addFolder('सराह');
        var a_sis_folder_group3 = a_sis_folder.addFolder('एस्तेर');
        //   var y_br_folder_group2 = a_br_folder.addFolder('Group2');

        const scoreBoard = {
            
          स्कोरबोर्ड: function() { window.location.href = './scoreboard_code/score_board.html' }
        }
            gui.add(scoreBoard,'स्कोरबोर्ड');










            // const flightData = JSON.parse(
            //   '[{"longitude":-122.39053,"latitude":37.61779,"height":-27.32},{"longitude":-122.39035,"latitude":37.61803,"height":-27.32},{"longitude":-122.39019,"latitude":37.61826,"height":-27.32},{"longitude":-122.39006,"latitude":37.6185,"height":-27.32},{"longitude":-122.38985,"latitude":37.61864,"height":-27.32},{"longitude":-122.39005,"latitude":37.61874,"height":-27.32},{"longitude":-122.39027,"latitude":37.61884,"height":-27.32},{"longitude":-122.39057,"latitude":37.61898,"height":-27.32},{"longitude":-122.39091,"latitude":37.61912,"height":-27.32},{"longitude":-122.39053,"latitude":37.61779,"height":-27.32}]');


        let airplaneEntity;
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MjAyYjg4NC02NzM0LTQxOGMtOGNhOC0wZDYxN2Q4ZTA2YmEiLCJpZCI6MTgzODk5LCJpYXQiOjE3MDIzNTg1ODd9.ti2Hyf1LxJL3UPbXCUwuIz8So9DCU3Uwovqm-FN0gxI';
        const  viewer = new Cesium.Viewer('cesiumContainer', 
        {
         
        
          animation: false,
          shouldAnimate: true, // Ensure animation is enabled
          baseLayerPicker: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          
          // timeline: false
          });
          viewer.scene.setTerrain(
            new Cesium.Terrain(Cesium.CesiumTerrainProvider.fromIonAssetId(1))
          );
          viewer.scene.globe.terrainExaggeration = 9.0;
          viewer.scene.globe.enableLighting = true;
          
                    
        let isLayerVisible = false;
        let baseLayer;

        const layerCheckbox = gui.add({ visibility: isLayerVisible }, 'visibility').name('नक्शे का नाम');
        function toggleBaseLayerVisibility() {
            if (!baseLayer) {
                // Create the Cesium Imagery Layer for the base layer
                baseLayer = 
                    Cesium.ImageryLayer.fromWorldImagery({
                        style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
                    });
                    viewer.imageryLayers.add(baseLayer);
            }
            isLayerVisible = !isLayerVisible;
            if (baseLayer) {
                baseLayer.show = isLayerVisible;
            }
        }
        layerCheckbox.onChange(toggleBaseLayerVisibility);
        

        // Set the camera view to focus on India
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(78.9629, 20.5937, 2000000.0), // Coordinates for India (longitude, latitude)
          orientation: {
              heading: Cesium.Math.toRadians(0.0), // Set desired heading in radians
              pitch: Cesium.Math.toRadians(-90.0), // Set desired pitch in radians
              roll: 0.0 // Set desired roll in radians
          },
          duration: 3 // Set the duration of the flight animation in seconds
        });


        function hideCesiuminfo(){
          //hide the unwanted additional layers here
          document.querySelector(".cesium-timeline-bar").hidden = true;
          document.querySelector(".cesium-viewer-bottom").hidden = true;

        }
        hideCesiuminfo();



        // Initialize camerOnClick object

        const loadedModels = {};
        
              const loadModels = async (tempsheetObject) => {
                  
                  const objectFilename = './assets/glb/low-size/cartoon_Plane_pink.glb';
                  let modelId_asset;
                  var age_group = tempsheetObject.group;
                  switch (true) {
                    case age_group.includes('Isaac'):
                          modelId_asset = '2408884';  
                      break;
                    
                    case age_group.includes('Immanuel'):
                          modelId_asset = '2408884';  
                    break;

                    case age_group.includes('Ruth'):
                          modelId_asset = '2408886';  
                      break;
                    
                    case age_group.includes('Sarah'):
                         modelId_asset = '2408886';  
                    break;
                    
                    case age_group.includes('Esther'):
                         modelId_asset = '2408886';  
                      break;
                    
                    case age_group.includes('Y & St. Brother'):
                         modelId_asset = '2408887';  
                    break;

                    case age_group.includes('Y & St. Sister'):
                         modelId_asset = '2408885';  
                      break;
                    
                    case age_group.includes('Pandesra'):
                         modelId_asset = '2408887';  
                    break;
                  
                    default:
                      modelId_asset = '2408887';  
                      break;
                  }
                  const resource = await Cesium.IonResource.fromAssetId(modelId_asset);
                    const loadModel = async () => {
                      // positionProperty =  ;
                      let airplaneEntity = viewer.entities.add({
                      
                        model: {
                          uri: objectFilename,
                          scale: 50,
                          minimumPixelSize: 32,
                        },
                        label: {
                          text: tempsheetObject.Participant, // Replace with the text you want to display
                          font: '12px sans-serif', // Specify the font and size
                          fillColor: Cesium.Color.WHITE, // Set the text color
                          outlineColor: Cesium.Color.BLACK, // Set the outline color
                          outlineWidth: 2, // Set the outline width
                          style: Cesium.LabelStyle.FILL_AND_OUTLINE, // Specify the label style
                          pixelOffset: new Cesium.Cartesian2(0, -50), // Offset the label from the model
                          showBackground: true,
                          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0,50000.0), //set the distance from the names can be seen
                      }
                                      
                        // orientation: new Cesium.VelocityOrientationProperty(positionProperty),
                        
                      });
                  
                      var id = tempsheetObject.Id;
                      //let's calculate height by age group
                      let height_by_group = calculate_height_by_group(tempsheetObject.group,tempsheetObject.Total);
                      //animate the model
                      animateModel(airplaneEntity,tempsheetObject.Total,height_by_group);
                    // Assign an ID to the loaded model entity
                    loadedModels[id] = airplaneEntity;
                
                      // Fetch and parse animation data
                      // const response = await fetch(resource);
                      // const blob = await response.blob();
                      // const animationSet = await AnimationParser.parseAnimationSetFromFile(blob);
                      // const animationPlayer = new AnimationPlayer(animationSet, airplaneEntity, 30);
                      // animationPlayer.loop_type = LOOP_TYPE.LOOP;
                      // animationPlayer.play();
                      // animationPlayer.speed = 2.0;
                    };
                                                  
                                                      
                    // Load the model
                  await loadModel();
                 
                  var name_participant = tempsheetObject.Participant;
                  
      
                      
                    // Define a function inside the object
                  // const camerOnClick = {
                  //   [name_participant]: function() {   console.log("Complete")         }
                  // }
                  const camerOnClick = {
                    [name_participant]: function () {
                      const entity = loadedModels[tempsheetObject.Id];
                     
                      if (entity) {
                        scoreBox_CSS(tempsheetObject);
                        document.querySelectorAll(".title")[0].click()  // toggle the lil-gui
                        if (timeElapsed()>1)
                            {   viewer.trackedEntity = undefined;
                              flyToModel(entity).then(() => {// using promise to call this function twice by itself 
                                flyToModel(entity).then(() => {// using promise to call this function twice by itself 
                                  viewer.trackedEntity = entity;
                                }).catch((error) => {console.error('Error:', error.message);});
                              }).catch((error) => {console.error('Error:', error.message);});
                            }
                        else 
                            flyToModelWhile_Moving(entity);
                        
                        console.log(`Camera focused on model with ID: ${tempsheetObject.Id}`);
                      } else {
                        console.log(`Model with ID ${tempsheetObject.Id} not found.`);
                      }
                    }
                  };


                  // Add the camerOnClick function to a_br_folder_group1 in the GUI
                  if (age_group === 'Isaac') {
                    a_br_folder_group1.add(camerOnClick, name_participant);
                    console.log(age_group);
                  }
                  else if(age_group==='Immanuel')
                  a_br_folder_group2.add(camerOnClick, name_participant );

                  else if(age_group==='Ruth')
                  a_sis_folder_group1.add(camerOnClick, name_participant);

                  else if(age_group==='Sarah')
                  a_sis_folder_group2.add(camerOnClick, name_participant);

                  else if(age_group==='Esther')
                  a_sis_folder_group3.add(camerOnClick, name_participant);

                  else if(age_group==='Y & St. Brother')
                  y_br_folder.add(camerOnClick, name_participant);
                  
                  else if(age_group==='Y & St. Sister')
                  y_sis_folder.add(camerOnClick, name_participant);

                  else if(age_group==='Pandesra')
                  a_br_folder_group2.add(camerOnClick, name_participant);
                  
                
              };
            

    onComplete(sheet_arrayObject);

     // Event listener to handle the click event on the model
     viewer.selectedEntityChanged.addEventListener(function () {
      const selectedEntity = viewer.selectedEntity;
      if (selectedEntity) {
        // Call the function to handle the model click event
        // handleModelClick(selectedEntity.id); // Pass the ID of the clicked model
        console.log(" "+selectedEntity.id);
      }
    });

    // Smoothly transition the camera to focus on the model's position
// Assuming entity is your Cesium Entity representing the model you want to focus on


// Function to smoothly transition the camera to focus on a specific model
function flyToModel2(entity) {
  const modelPosition = entity.position.getValue(Cesium.JulianDate.now()); // Get the position of the model

  if (Cesium.defined(modelPosition)) {
    const flightDuration = 3.0; // Duration of the flight animation in seconds

    // Get the current camera position and orientation
    const startPosition = viewer.camera.positionWC.clone();
    const startOrientation = viewer.camera.directionWC.clone();

    // Calculate the end position of the camera focusing on the model
    const endPosition = Cesium.Cartesian3.add(modelPosition, new Cesium.Cartesian3(0, 0, 500), new Cesium.Cartesian3()); // Adjust the height as needed
    const endOrientation = Cesium.Cartesian3.subtract(modelPosition, startPosition, new Cesium.Cartesian3());
    Cesium.Cartesian3.normalize(endOrientation, endOrientation);

    // Start the camera flight animation
    viewer.camera.flyTo({
      destination: endPosition,
      orientation: {
        direction: endOrientation,
        up: viewer.camera.up,
      },
      duration: flightDuration,
      complete: function () {
        // Optionally, you can perform actions once the flight animation is complete
        console.log('Camera flight animation complete!');
      },
    });
  }
}



function flyToModel(entity) {
  return new Promise((resolve, reject) => {
    const modelPosition = entity.position.getValue(Cesium.JulianDate.now()); // Get the position of the model
   
    if (Cesium.defined(modelPosition)) {
      const flightDuration = 3.0; // Duration of the flight animation in seconds

      // Get the current camera position and orientation
      const startPosition = viewer.camera.positionWC.clone();
      const startOrientation = viewer.camera.directionWC.clone();

      // Calculate the end position of the camera focusing on the model
      const endPosition = Cesium.Cartesian3.add(modelPosition, new Cesium.Cartesian3(0, 0, 500), new Cesium.Cartesian3()); // Adjust the height as needed
      const endOrientation = Cesium.Cartesian3.subtract(modelPosition, startPosition, new Cesium.Cartesian3());
      Cesium.Cartesian3.normalize(endOrientation, endOrientation);

      // Start the camera flight animation
      viewer.camera.flyTo({
        destination: endPosition,
        orientation: {
          direction: endOrientation,
          up: viewer.camera.up,
          roll: 0,
          pitch: 0,
        },
        duration: flightDuration,
        complete: function () {
          // Optionally, you can perform actions once the flight animation is complete
          console.log('Camera flight animation complete!');
       
          resolve(); // Resolve the promise when animation is complete
        },
      });
    } else {
      reject(new Error('Model position is not defined'));
    }
  });
}




// Function to smoothly transition the camera to focus on a specific model and track its movement
function flyToModelWhile_Moving(entity) {
  const modelPosition = entity.position.getValue(Cesium.JulianDate.now()); // Get the initial position of the model

  if (Cesium.defined(modelPosition)) {
    const flightDuration = 3.0; // Duration of the flight animation in seconds

    // Calculate the end position of the camera focusing on the model
    const endPosition = Cesium.Cartesian3.add(modelPosition, new Cesium.Cartesian3(100, 0, 1000), new Cesium.Cartesian3()); // Adjust the height as needed

    // Start the camera flight animation
    viewer.camera.flyTo({
      destination: endPosition,
      duration: flightDuration,
      complete: function () {
        // Optionally, you can perform actions once the flight animation is complete
        console.log('Camera flight animation complete!');

        // Remove the onTick event listener to restore camera control
        viewer.clock.onTick.removeEventListener(trackModel);
        if (viewer.camera.controller) {
          viewer.camera.controller.lookEventTypes = {
            mouse: Cesium.CameraEventType.LEFT_DOWN,
            touch: Cesium.CameraEventType.PINCH
          };
          viewer.camera.controller.lookResetEventTypes = {
            mouse: Cesium.CameraEventType.RIGHT_UP,
            touch: Cesium.CameraEventType.PINCH_END
          };
        viewer.camera.controller.enableRotate = true;
        viewer.camera.controller.enableTilt = true;
        viewer.camera.controller.enableTranslate = true;
        viewer.camera.controller.enableZoom = true;
        }
      },
    });

    // Update the camera position to track the model continuously
    function trackModel() {
      const currentModelPosition = entity.position.getValue(Cesium.JulianDate.now()); // Get the current position of the model

     

      if (Cesium.defined(currentModelPosition)) {
        // Update the camera position to track the model
        const newPosition = Cesium.Cartesian3.add(currentModelPosition, new Cesium.Cartesian3(0, 0, 1000), new Cesium.Cartesian3()); // Adjust the height as needed
        // Calculate the position slightly behind the model
        const behindPosition = Cesium.Cartesian3.subtract(currentModelPosition, new Cesium.Cartesian3(0, 0, -50), new Cesium.Cartesian3()); // Adjust the distance as needed

      
        viewer.camera.setView({
          destination: behindPosition,
          orientation: {
            heading: viewer.camera.heading,
            pitch:  Cesium.Math.toRadians(-20),
            roll: viewer.camera.roll
          }
        });
      }
    }

    // Update the camera position to track the model continuously
    viewer.clock.onTick.addEventListener(trackModel);
  }
}




// Function to animate the model along flight data using Tween.js
function animateModel(modelEntity,totalScoreOfModel,height_by_group) {
  let currentIndex = 0;
  const duration = 2000; // Assuming a fixed duration of 2000 milliseconds for each transition
  let flightData_of_thisModel = [];
  let totalScore_minus_5=totalScoreOfModel-5;
  if(totalScoreOfModel<5) {
        totalScore_minus_5 = 1;
        
        }
  flightData_of_thisModel = generateFlightData(totalScore_minus_5,totalScoreOfModel);
  function tweenNext() {
    if (currentIndex < flightData_of_thisModel.length - 1) {
      const startPosition = Cesium.Cartesian3.fromDegrees(flightData_of_thisModel[currentIndex].longitude, flightData_of_thisModel[currentIndex].latitude, height_by_group);
      const endPosition = Cesium.Cartesian3.fromDegrees(flightData_of_thisModel[currentIndex + 1].longitude, flightData_of_thisModel[currentIndex + 1].latitude, height_by_group);

      if(isNaN(flightData_of_thisModel[currentIndex].longitude)||isNaN(flightData_of_thisModel[currentIndex].latitude))
      console.log("true nan");

      // Calculate the direction vector from start to end position
      const direction = Cesium.Cartesian3.subtract(endPosition, startPosition, new Cesium.Cartesian3());
      Cesium.Cartesian3.normalize(direction, direction);

      new TWEEN.Tween({ x: startPosition.x, y: startPosition.y, z: startPosition.z })
        .to({
          x: endPosition.x,
          y: endPosition.y,
          z: endPosition.z
        }, duration)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function(obj) {
          modelEntity.position = new Cesium.Cartesian3(obj.x, obj.y, obj.z); // Update the model's position

          // Calculate the orientation based on the direction of movement using VelocityOrientationProperty
          const velocityOrientation = new Cesium.VelocityOrientationProperty(new Cesium.SampledPositionProperty());
          velocityOrientation.position.addSample(Cesium.JulianDate.now(), startPosition);
          velocityOrientation.position.addSample(Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), 1.0, new Cesium.JulianDate()), endPosition);
          // Set interpolation options for smoother transitions
          
          modelEntity.orientation = velocityOrientation.getValue(Cesium.JulianDate.now());
        })
        .onComplete(() => {
          currentIndex++;
          tweenNext(); // Continue to the next point
          // upDownYOYO(modelEntity);
        })
        .start();
    }else{upDownYOYO(modelEntity);}
  }

  // Start animation
  tweenNext();
}


function calculate_height_by_group(ageGroup,totalScore){

          let minim,max;
          
          totalScore = parseFloat(totalScore);
          if (ageGroup === 'Isaac') 
              { minim = 110; max = 120;}
          else if(ageGroup==='Immanuel')
              { minim = 100; max = 110;}

          else if(ageGroup==='Ruth')
              { minim = 90; max = 100;}

          else if(ageGroup==='Sarah')
              { minim = 80; max = 90;}

          else if(ageGroup==='Esther')
              { minim = 70; max = 80;}

          else if(ageGroup==='Y & St. Brother')
              { minim = 60; max = 70;}
          
          else if(ageGroup==='Y & St. Sister')
              { minim = 50; max = 60;}

          else if(ageGroup==='Pandesra')
              { minim = 80; max = 70;}

              minim = parseFloat(minim);
              max = parseFloat(max);
              minim = totalScore * minim;
              max =  totalScore * max;  
  return Math.floor(Math.random() * (max - minim + 1)) + minim;
}


// up and donw for animation
function upDownYOYO(modelEntity) {
  var startPosition = modelEntity.position.getValue(Cesium.JulianDate.now());
  var endPosition = Cesium.Cartesian3.add(startPosition, new Cesium.Cartesian3(0, 10, 10), new Cesium.Cartesian3()); // Move up by 100 units

  // Use Tween.js to animate the position
  new TWEEN.Tween(startPosition)
      .to(endPosition, 10000) // Animation duration: 2000 milliseconds
      .easing(TWEEN.Easing.Quadratic.InOut) // Use a specific easing function if needed
      .onUpdate(function() {
          modelEntity.position.setValue(startPosition);
      })
      .repeat(Infinity) // Repeat the animation indefinitely
      .yoyo(true) // Alternate between the start and end positions
      .start();
}



 // Update Tween.js
 function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}
animate();

    







//lets get the scoreboard data


// Function to generate flightData based on a specific range (1 to 5 in this case)
function generateFlightData(startIndex, endIndex) {
  const flightData5 = [];
  for (let i = startIndex; i <= endIndex; i++) {
    if (scoreData["SCOREbyLOCATION"][i]) {
      flightData5.push({
        latitude: scoreData["SCOREbyLOCATION"][i].latitude,
        longitude: scoreData["SCOREbyLOCATION"][i].longitude
      });
    }
  }
  return flightData5;
}




// Get the initial time when the page loads
const initialTime = performance.now();

// Function to calculate time elapsed since page load
function timeElapsed() {
  const currentTime = performance.now();
  const elapsedTimeInSeconds = (currentTime - initialTime) / 1000; // Convert milliseconds to seconds
  return elapsedTimeInSeconds;
}




function scoreBox_CSS (tempsheetObject){ // NOT USING X AND Y
            
  var parti_name  = tempsheetObject.Participant;
  var preach      = (tempsheetObject.totalPreach).toFixed(2);
  var m_Preach    = (tempsheetObject.totalApp_visit).toFixed(2);
  var fruits       = (tempsheetObject.totalFruits).toFixed(2);
  var total_score = (tempsheetObject.Total).toFixed(2);
  var elohim_aca  = (tempsheetObject.totalSign+tempsheetObject.chap_complete).toFixed(2);

  var text2 = document.createElement('container');
  text2.style.position = 'absolute';
  text2.classList.add('animated-border-box-glow');
  text2.classList.add('animated-border-box');
  text2.classList.add('center-box');
 
  // text2.style.height = 100;
  // text2.style.backgroundColor = "blue";
  text2.innerHTML = "<p class='titles' > नाम: <f class='score' style = 'alight-right:100%'>"+parti_name+"</f></p>";
  text2.innerHTML += "<p class='titles' > सा.प्रचार: <f class='score' style = 'alight-right:100%'>"+preach+"km</f></p>";
  text2.innerHTML += "<p class='titles' > अप्पोइ&विजि: <f class='score' style = 'alight-right:100%'>"+m_Preach+"km</f></p>";
  text2.innerHTML += "<p class='titles' > फल: <f class='score' style = 'alight-right:100%'>"+fruits+"km</f></p>";
  text2.innerHTML += "<p class='titles' > एलोहिम अका.: <f class='score' style = 'alight-right:100%'>"+elohim_aca+"km</f></p>";
  text2.innerHTML += "<p class='titles' > Total Score: <f class='score' style = 'alight-right:100%'>"+total_score+"km</f></p>";
  
  text2.style.bottom = 0 + 'px';
  // text2.style.center = 0 + 'px';
  document.body.appendChild(text2);
  $("container").click(function(){
      //clicked on the box
       //remove box
       var container = document.querySelectorAll("container")[0];
       if(container != null)
          {
          document.querySelectorAll("container")[0].remove();
          document.querySelectorAll(".title")[0].click()  // toggle the lil-gui
          }
   
      });
      var cesiumContainer = document.getElementById("cesiumContainer");
      cesiumContainer.addEventListener('click', function(event) {
        var container = document.querySelectorAll("container")[0];
        if(container != null)
           {
           document.querySelectorAll("container")[0].remove();
         
           }
       
    });
     
}

// Create an instance of Hammer and pass the Cesium viewer's container element
const hammerHandler = new Hammer(viewer.canvas);

// Function to handle double tap (double click) event
function handleDoubleTap(event) {
    // Check if it's a double tap event
    if (event.tapCount === 2) {
        // Handle the double tap action here
        console.log('Double tap detected!');
        viewer.trackedEntity = undefined;
    }
}

// Add an event listener for double tap
hammerHandler.on('doubletap', handleDoubleTap);

    /**************************************************************
     *                                                           *
     *                   MAIN FUNCTION  ENDS NOW                 *
     *                                                           *
     **************************************************************/

        
}












async function fetchData() {
  try {
    let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7Zx1Vnsdizp-ee3wroRGSME9hyu8bUvXWBQWiWf0zNWMJ7z5Wtj0lN52ibU_jg8PEsEWG53VFZ8ee/pub?gid=1246387545&single=true&output=csv&range=C3";
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const text = await response.text();
    return text; // This is the fetched data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
 

//CALL MAIN
main();

































// loadData();

// function loadData (){
//     let result; 
//     // ========================================================================================================================================================================================
 
//     let url ="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7Zx1Vnsdizp-ee3wroRGSME9hyu8bUvXWBQWiWf0zNWMJ7z5Wtj0lN52ibU_jg8PEsEWG53VFZ8ee/pub?gid=1246387545&single=true&output=csv&range=C3"          
//                   fetch(url) 
//                   .then(response => response.text())
//                   .then(text => { //what to do with result?
//                    result = text; 
//                    onComplete(result);
//                 }); 
//                 }

//   function getAllData(allData)
//         {   allData = allData.replace(/[""]+/g,'"'); //dont' know why data has extra ""  so remove them
//         allData = allData.replace('"[{','[{'); //dont' know why data has extra ["  so remove them
//         allData = allData.replace('}]"','}]'); 
        
//             var myobje = JSON.parse(allData);
//             console.log(myobje[1].Id);
//             // myobje.map(x => console.log(x.Id)); to loop it through                     
            
//         }    