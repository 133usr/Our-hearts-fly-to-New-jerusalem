

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
                   { loadModels(tempsheetObject);
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
        

        var a_br_folder = gui.addFolder('Adult Brothers');
        var a_sis_folder = gui.addFolder('Adult Sisters');
        var y_br_folder = gui.addFolder('Youth & Stud. Brothers');
        var y_sis_folder = gui.addFolder('Youth & Stud. Sisters');
        var group_folder = gui.addFolder('By Group');

        var a_br_folder_group1 = a_br_folder.addFolder('Group1');
        var a_br_folder_group2 = a_br_folder.addFolder('Group2');
        var a_sis_folder_group1 = a_sis_folder.addFolder('Group1');
        var a_sis_folder_group2 = a_sis_folder.addFolder('Group2');
        var a_sis_folder_group3 = a_sis_folder.addFolder('Group3');
        //   var y_br_folder_group2 = a_br_folder.addFolder('Group2');
        const scoreBoard = {
            
          Scoreboard: function() { window.location.href = './scoreboard_code/score_board.html' }
        }
            gui.add(scoreBoard,'Scoreboard');


            const flightData2 = JSON.parse(
              '[{"longitude":-122.39053,"latitude":37.61779,"height":-27.32},{"longitude":-122.39035,"latitude":37.61803,"height":-27.32},{"longitude":-122.39019,"latitude":37.61826,"height":-27.32},{"longitude":-122.39006,"latitude":37.6185,"height":-27.32},{"longitude":-122.38985,"latitude":37.61864,"height":-27.32},{"longitude":-122.39005,"latitude":37.61874,"height":-27.32},{"longitude":-122.39027,"latitude":37.61884,"height":-27.32},{"longitude":-122.39057,"latitude":37.61898,"height":-27.32},{"longitude":-122.39091,"latitude":37.61912,"height":-27.32}]');


              const flightData = [
                { "longitude": -122.39053, "latitude": 37.61779, "height": -27.32, "time": 0 },
                { "longitude": -122.39035, "latitude": 37.61803, "height": -27.32, "time": 3 },
                // Add more coordinates as needed, each with a 'time' attribute in seconds
              ];

        let airplaneEntity;

        const  viewer = new Cesium.Viewer('cesiumContainer', {
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

          viewer.scene.globe.enableLighting = true;

        
        let positionProperty = new Cesium.SampledPositionProperty();




        flightData.forEach(({ longitude, latitude, height }) => {
          const time = Cesium.JulianDate.now(); // You might need to adjust the time for each sample
          const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
          positionProperty.addSample(time, position);
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
             
            const objectFilename = './assets/glb/low-size/cartoon_plane.glb';
         
              const loadModel = async () => {
                // positionProperty =  ;
                let airplaneEntity = viewer.entities.add({
                  // availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start, stop })]),
                  // position: Cesium.Cartesian3.fromDegrees(flightData[0].longitude, flightData[0].latitude, flightData[0].height),
                  model: {
                    uri: objectFilename,
                    scale: 50
                  },
                  position: Cesium.Cartesian3.fromDegrees(flightData[0].longitude, flightData[0].latitude, flightData[0].height) // Initial position
 
                 
                  
                });
                var id = tempsheetObject.Id;
               
                animateModel(airplaneEntity);
              // Assign an ID to the loaded model entity
              loadedModels[id] = airplaneEntity;
                                
              


              
                // Fetch and parse animation data
                const response = await fetch(objectFilename);
                const blob = await response.blob();
                const animationSet = await AnimationParser.parseAnimationSetFromFile(blob);
                const animationPlayer = new AnimationPlayer(animationSet, airplaneEntity, 30);
                animationPlayer.loop_type = LOOP_TYPE.LOOP;
                animationPlayer.play();
                animationPlayer.speed = 2.0;
              };
                                            
                                                
              // Load the model
            await loadModel();
            var age_group = tempsheetObject.group;
            var name_participant = tempsheetObject.Participant;
            
 
            
              console.log(" ");
              
              // Define a function inside the object
            // const camerOnClick = {
            //   [name_participant]: function() {   console.log("Complete")         }
            // }
            const camerOnClick = {
              [name_participant]: function () {
                const entity = loadedModels[tempsheetObject.Id];
                if (entity) {
                  viewer.trackedEntity = entity;
                  console.log(`Camera focused on model with ID: ${tempsheetObject.Id}`);
                } else {
                  console.log(`Model with ID ${tempsheetObject.Id} not found.`);
                }
              }
            };


            // Add the camerOnClick function to a_br_folder_group1 in the GUI
            if (age_group === 'Adult Brother1') {
              a_br_folder_group1.add(camerOnClick, name_participant);
              console.log(age_group);
            }
            
          
        };


    onComplete(sheet_arrayObject);


    function animateModel(modelEntity) {
      for (let i = 1; i < flightData.length; i++) {
        const startPosition = Cesium.Cartesian3.fromDegrees(flightData[i - 1].longitude, flightData[i - 1].latitude, flightData[i - 1].height);
        const endPosition = Cesium.Cartesian3.fromDegrees(flightData[i].longitude, flightData[i].latitude, flightData[i].height);
        const duration = (flightData[i].time - flightData[i - 1].time) * 5000; // Time in milliseconds

        // Use Tween.js to animate the model's position
        new TWEEN.Tween({ x: startPosition.x, y: startPosition.y, z: startPosition.z })
          .to({
            x: endPosition.x,
            y: endPosition.y,
            z: endPosition.z
          }, duration)
          .easing(TWEEN.Easing.Linear.None)
          .onUpdate(function(obj) {
            modelEntity.position = new Cesium.Cartesian3(obj.x, obj.y, obj.z); // Update the model's position
            console.log(modelEntity.position);
          })
          .start();
      }
    }
 // Update Tween.js
 function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}
animate();

        // Start the model animation using tweens
       









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