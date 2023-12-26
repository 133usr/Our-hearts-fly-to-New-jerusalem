

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
        

        var a_br_folder = gui.addFolder('Adult Brothers');
        var a_sis_folder = gui.addFolder('Adult Sisters');
        var y_br_folder = gui.addFolder('Youth & Stud. Brothers');
        var y_sis_folder = gui.addFolder('Youth & Stud. Sisters');
        var pandesra_group = gui.addFolder('Pandesra');
        var group_folder = gui.addFolder('By Group');

        var a_br_folder_group1 = a_br_folder.addFolder('Isaac');
        var a_br_folder_group2 = a_br_folder.addFolder('Immanuel');
        var a_sis_folder_group1 = a_sis_folder.addFolder('Ruth');
        var a_sis_folder_group2 = a_sis_folder.addFolder('Sarah');
        var a_sis_folder_group3 = a_sis_folder.addFolder('Esther');
        //   var y_br_folder_group2 = a_br_folder.addFolder('Group2');
        const scoreBoard = {
            
          Scoreboard: function() { window.location.href = './scoreboard_code/score_board.html' }
        }
            gui.add(scoreBoard,'Scoreboard');


            const flightData = JSON.parse(
              '[{"longitude":-122.39053,"latitude":37.61779,"height":-27.32},{"longitude":-122.39035,"latitude":37.61803,"height":-27.32},{"longitude":-122.39019,"latitude":37.61826,"height":-27.32},{"longitude":-122.39006,"latitude":37.6185,"height":-27.32},{"longitude":-122.38985,"latitude":37.61864,"height":-27.32},{"longitude":-122.39005,"latitude":37.61874,"height":-27.32},{"longitude":-122.39027,"latitude":37.61884,"height":-27.32},{"longitude":-122.39057,"latitude":37.61898,"height":-27.32},{"longitude":-122.39091,"latitude":37.61912,"height":-27.32},{"longitude":-122.39053,"latitude":37.61779,"height":-27.32}]');


              const flightData2 = [
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
                      
                        model: {
                          uri: objectFilename,
                          scale: 50
                        },
                                      
                        // orientation: new Cesium.VelocityOrientationProperty(positionProperty),
                        
                      });
                      var id = tempsheetObject.Id;
                    
                      animateModel(airplaneEntity,tempsheetObject.Total);
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


// Function to animate the model along flight data using Tween.js
function animateModel(modelEntity,totalScoreOfModel) {
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
      const startPosition = Cesium.Cartesian3.fromDegrees(flightData_of_thisModel[currentIndex].longitude, flightData_of_thisModel[currentIndex].latitude, flightData_of_thisModel[currentIndex].height);
      const endPosition = Cesium.Cartesian3.fromDegrees(flightData_of_thisModel[currentIndex + 1].longitude, flightData_of_thisModel[currentIndex + 1].latitude, flightData_of_thisModel[currentIndex + 1].height);

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
        })
        .start();
    }
  }

  // Start animation
  tweenNext();
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