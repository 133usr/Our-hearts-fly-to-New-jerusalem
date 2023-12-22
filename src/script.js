

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
import Tween from '@tweenjs/tween.js'
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
      try {
        let allData = await fetchData();
              
        allData = allData.replace(/[""]+/g,'"'); //dont' know why data has extra ""  so remove them
        allData = allData.replace('"[{','[{'); //dont' know why data has extra ["  so remove them
        allData = allData.replace('}]"','}]');     
        // console.log(allData);    
        var participants = Object.keys(sheet_arrayObject).length;
        var sheet_arrayObject = JSON.parse(allData);
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







        let airplaneEntity;

        const  viewer = new Cesium.Viewer('cesiumContainer', {
          animation: false,
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










        function hideCesiuminfo(){
          //hide the unwanted additional layers here
          document.querySelector(".cesium-timeline-bar").hidden = true;
          document.querySelector(".cesium-viewer-bottom").hidden = true;

        }
        hideCesiuminfo();






        // Initialize camerOnClick object

        const loadedModels = {};

        const loadModels = async (tempsheetObject) => {
          const suratPosition = Cesium.Cartesian3.fromDegrees(21.1702, 72.8311,1000); // Surat, India
        const mumbaiPosition = Cesium.Cartesian3.fromDegrees(23.0760, 72.8777,1000); // Mumbai, India
        const mumbaiPosition2 = Cesium.Cartesian3.fromDegrees(23.0760, 72.8777,2000); // Mumbai, India
        const mumbaiPosition3 = Cesium.Cartesian3.fromDegrees(23.0760, 72.8777,3000); // Mumbai, India
        const mumbaiPosition4 = Cesium.Cartesian3.fromDegrees(23.0760, 72.8777,4000); // Mumbai, India
        const ahmedabadPosition = Cesium.Cartesian3.fromDegrees(23.0225, 72.5714,1000); // Ahmedabad, India
        const vadodaraPosition = Cesium.Cartesian3.fromDegrees(22.3072, 73.1812,1000); // Vadodara, India
        const rajkotPosition = Cesium.Cartesian3.fromDegrees(22.3039, 70.8022,1000); // Rajkot, India


        
            const objectFilename = './assets/glb/low-size/cartoon_plane.glb';
          // Scale of the selected model
              // const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
              // const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());

              // Create function to load a single model
              const loadModel = async () => {
                
                const airplaneEntity = viewer.entities.add({
                  // availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start, stop })]),
                  position: positionProperty,
                  model: {
                    uri: objectFilename,
                    scale: 50
                  },
                  orientation: new Cesium.VelocityOrientationProperty(positionProperty),
                  path: new Cesium.PathGraphics({ width: 0 })
                  
                });
                var id = tempsheetObject.Id;
                if(id ==2)airplaneEntity.position = mumbaiPosition2;
                if(id ==3)airplaneEntity.position = mumbaiPosition;
                if(id ==4)airplaneEntity.position = mumbaiPosition3;
                if(id ==5)airplaneEntity.position = mumbaiPosition4;
                if(id ==6)airplaneEntity.position = rajkotPosition;
                
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
            if (age_group === 'Adult Brother1') {
              a_br_folder_group1.add(camerOnClick, name_participant);
              console.log(age_group);
            }
            
          
        };


    onComplete(sheet_arrayObject);

    /**************************************************************
     *                                                           *
     *                   MAIN FUNCTION  ENDS NOW                 *
     *                                                           *
     **************************************************************/

        } catch (error) {
          // Handle errors if needed
          console.log("err "+error);
        }
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