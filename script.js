/*
1) 서로 다른 두 종류 이상의 Light 사용
2) Texture가 포함된 두 개 이상의 material 사용
3) Shadow가 한 개 이상 보이게 할 것
4) 한가지 이상의 계층적 애니메이션 이용
5) Orbit control이 반드시 존재
6) GUI control로 무엇인가 control 가능
*/
// global variables
var startTime, controlOrbit; 
var scene, renderer, camera, light;
var lightHelper, axesHelper, shadowCameraHelper; 
var cube, sphere, plane; 
var cubeMaterial, sphereMaterial, planeMaterial, textMaterial; 
var geometry, material;
var balls = new Array();
var ballsF = new Array();
var planeSize = 200;
var ballMax = 50;
var listener;
var car;
var tires = new Array();
var fontLoader;
var textGeometry;
var textAMesh, textSMesh, textDMesh, textFMesh;
var ambientLight;
var lights = [];
var directionalLight;
var MAX_TIME = 100;
var playSound;
var score = 0;
var ballDrop = new Array(ballMax);


// GUI control prototype object 
var guiControls = new function() {
  this.resistance = 0.2;  //바닥 마찰력
  this.velocity = 1; //차 속도
  this.power = 5;  //미는 힘
  this.color = 0xffffff; //Spot Light 색
  this.maxTime = 100;
}

init();
animate(); 

function init(){

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  document.body.appendChild( renderer.domElement );

  // main camera (3인칭 시점) 
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(50, 80, 60);
  camera.lookAt(0, 0, 0); 

  listener = new THREE.AudioListener();
  camera.add(listener);

  // scene
  scene = new THREE.Scene();

  ambientLight = new THREE.AmbientLight(0x888888);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight( "#568EA6", 0.1);
  scene.add( directionalLight );
  
  // orbit controls
  controlOrbit = new THREE.OrbitControls( camera, renderer.domElement );
  controlOrbit.target.set(0,0,0);
  controlOrbit.update();

    //car
    car = new THREE.Object3D();
    scene.add(car);
    const cubeSize = 6;
    var cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
    //cubeMaterial = new THREE.MeshPhongMaterial({color: 'red'});
    const textureLoader = new THREE.TextureLoader();
    const textureMaterials = [
      new THREE.MeshBasicMaterial({map:textureLoader.load('./datas/images/tayo_right.JPG')}),
      new THREE.MeshBasicMaterial({map:textureLoader.load('./datas/images/tayo_left.JPG')}),
      new THREE.MeshBasicMaterial({map:textureLoader.load('./datas/images/tayo_default.JPG')}),
      new THREE.MeshBasicMaterial({map:textureLoader.load('./datas/images/tayo_default.JPG')}),
      new THREE.MeshBasicMaterial({map:textureLoader.load('./datas/images/tayo_front.JPG')}),
      new THREE.MeshBasicMaterial({map:textureLoader.load('./datas/images/tayo_back.JPG')}),
      
    ];
    cube = new THREE.Mesh(cubeGeo, textureMaterials);
    cube.castShadow = true; 
    cube.receiveShadow = true; 
    cube.position.set(0, cubeSize / 2 +1, 0);
    car.add(cube);

    // cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize/2, cubeSize*0.8);
    // cubeMaterial = new THREE.MeshPhongMaterial({color:'red'});
    // cube = new THREE.Mesh(cubeGeo, cubeMaterial);
    // cube.castShadow = true;
    // cube.receiveShadow = true;
    // cube.position.set(0, cubeSize, -cubeSize*0.1);
    // car.add(cube);

    // cubeGeo = new THREE.BoxBufferGeometry(cubeSize-0.5, cubeSize/2, 3);
    // cubeMaterial = new THREE.MeshPhongMaterial({color:'cyan'});
    // cube = new THREE.Mesh(cubeGeo, cubeMaterial);
    // cube.position.set(0, cubeSize-0.3, cubeSize*0.2);
    // cube.rotation.x = toRad(-10);
    // car.add(cube);

    fontLoader = new THREE.FontLoader();
    fontLoader.load( './datas/fonts/gentilis_bold.typeface.json', function ( font ) {

      textGeometry = new THREE.TextBufferGeometry( 'A', {
        font: font,
        size: 1.5,
        height: 1,
        curveSegments: 1,
        bevelEnabled: false
      } );
      textMaterial = new THREE.MeshLambertMaterial({color:"#F0B7A4"});
      textAMesh = new THREE.Mesh(textGeometry, textMaterial);
      textAMesh.position.set(2.5, 8, -0.75);
      textAMesh.rotation.x = toRad(90);
      textAMesh.rotation.z = toRad(90);
      textAMesh.castShadow = true;
      textAMesh.receiveShadow = true;
      car.add(textAMesh);
      
      textMaterial = new THREE.MeshLambertMaterial({color:"#FF6372"});
      textGeometry = new THREE.TextBufferGeometry( 'S', {
        font: font,
        size: 1.75,
        height: 1,
        curveSegments: 1,
        bevelEnabled: false
      } );
      textSMesh = new THREE.Mesh(textGeometry, textMaterial);
      textSMesh.position.set(-0.7, 8, 1);
      textSMesh.rotation.x = toRad(90);
      textSMesh.rotation.z = toRad(0);
      textSMesh.castShadow = true;
      textSMesh.receiveShadow = true;
      car.add(textSMesh);

      textMaterial = new THREE.MeshLambertMaterial({color:"#F1D185"});
      textGeometry = new THREE.TextBufferGeometry( 'F', {
        font: font,
        size: 1.5,
        height: 1,
        curveSegments: 1,
        bevelEnabled: false
      } );
      textDMesh = new THREE.Mesh(textGeometry, textMaterial);
      textDMesh.position.set(-1.1, 7, 0.5);
      textDMesh.rotation.x = toRad(-90);
      textDMesh.rotation.z = toRad(90);
      textDMesh.castShadow = true;
      textDMesh.receiveShadow = true;
      car.add(textDMesh);

      textMaterial = new THREE.MeshLambertMaterial({color:"#568EA6"});
      textGeometry = new THREE.TextBufferGeometry( 'D', {
        font: font,
        size: 1.75,
        height: 1,
        curveSegments: 1,
        bevelEnabled: false
      } );
      textFMesh = new THREE.Mesh(textGeometry, textMaterial);
      textFMesh.position.set(-0.5, 7, -1);
      textFMesh.rotation.x = toRad(-90);
      textFMesh.rotation.z = toRad(0);
      textFMesh.castShadow = true;
      textFMesh.receiveShadow = true;
      car.add(textFMesh);

      
    } );



    const tireRadius = 1;
    var tireGeo = new THREE.CylinderBufferGeometry(tireRadius, tireRadius, tireRadius, 24);
    var tireMaterial = new THREE.MeshPhongMaterial({color:'#555555'});
    for(var i=-1; i<=1; i+=2){
        for(var j=-1; j<=1; j+=2){
            var tempTire = new THREE.Mesh(tireGeo, tireMaterial);
            tempTire.castShadow = true;
            tempTire.receiveShadow = true;
            tempTire.position.set(cubeSize/2*j, tireRadius, cubeSize/2*i);
            tempTire.rotation.z = toRad(90);
            tires.push(tempTire);
        }
    }
    for(var i=0; i<4; i++){
        car.add(tires[i]);
    }

      // sphere
  for(var i=0; i<ballMax; i++){
      balls.push(getBall());
      ballsF.push(new THREE.Vector3(0, 0, 0));
      scene.add(balls[i]);
  }

  // plane
  const loader = new THREE.TextureLoader();
  const texture = loader.load('./datas/images/check2x2pink.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);  // repeat.x, repeat.y

  const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
  planeMaterial = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  plane = new THREE.Mesh(planeGeo, planeMaterial);
  plane.receiveShadow = true;     // 바닥에 shadow가 드리워질 수 있도록 on
  plane.rotation.x = Math.PI * -.5;
  scene.add(plane);


  // light
  const color = "#ffffff";
  const intensity = 0.45;
  light = new THREE.SpotLight(color, intensity, 200, toRad(30), 0.2);
  light.position.set(5, 40, 5); 
  light.castShadow = true;    // light가 shadow를 만들도록 on
  scene.add(light);
  scene.add(light.target); 

  // light helper (light, color)
  lightHelper = new THREE.SpotLightHelper(light, 0xFFFF00); 
//  scene.add(lightHelper); 
  
  // shadow camera helper 
  shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
//  scene.add(shadowCameraHelper);

  // shadow camera parameter setting
  light.shadow.camera.near = 0.01; 
  light.shadow.camera.far = 1000; 
  // 헬퍼가 가이드라인을 그릴 때 필요한 조명 목표(target)의 matrixWorld를 업데이트 합니다
  light.target.updateMatrixWorld();
  lightHelper.update();
  // 그림자용 카메라의 투영 행렬(projection matrix)를 업데이트합니다
  light.shadow.camera.updateProjectionMatrix();
  // 그림자용 카메라를 보기 위해 설치한 카메라의 헬퍼를 업데이트합니다
  shadowCameraHelper.update();

  // axes helper (size)
//  axesHelper = new THREE.AxesHelper(30);
//  scene.add(axesHelper); 

  // GUI
  var gui = new dat.GUI();
  var lightFolder = gui.addFolder('SpotLight');
  lightFolder.addColor(guiControls, 'color').name('color').onChange(
    function() {
      light.color.set(guiControls.color); 
    }
  );
  lightFolder.add(light, 'intensity', 0, 2, 0.1); 
  lightFolder.add(light, 'distance', 0, 400, 0.1); 
  lightFolder.add(light, 'decay', 0.1, 5, 0.1);
  lightFolder.add(light, 'angle', 0, 1.57).onChange(onChangeOfLight); 
  lightFolder.add(light, 'penumbra', 0, 1, 0.1).onChange(onChangeOfLight); 

  gui.add(guiControls, 'velocity', 0, 5, 0.1).name("타요 속도");
  gui.add(guiControls, 'resistance', 0, 1, 0.001).name("마찰");
  gui.add(guiControls, 'power', 0, 20, 0.1).name("미는 힘");
  gui.add(guiControls, 'maxTime', 0, 1000, 1).name("게임 시간(초)");

  var audioLoader5 = new THREE.AudioLoader();
  var playSound = new THREE.Audio(listener);
  audioLoader5.load('./datas/sounds/playsound.mp3', function(buffer)
  {
    playSound.setBuffer(buffer);
    playSound.setLoop(true);
    playSound.setVolume(0.15);
    playSound.play();
  });
  
  // ending of init()
  window.addEventListener( 'resize', onWindowResize, false);
  startTime = Date.now();  
}


function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min)) + min;
}

function getBall(){
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, 
                                  sphereWidthDivisions, sphereHeightDivisions);
    sphereMaterial = new THREE.MeshPhongMaterial({color: randomPrettyColor(), transparent:true, opacity:0.75});
    sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphere.castShadow = true;  // 자신이 그림자를 만드는 것이 가능  
    sphere.receiveShadow = true;  // 그림자를 자신에게 드리우는 것이 가능
    sphere.position.set(getRandom(-planeSize/2, planeSize/2), sphereRadius, getRandom(-planeSize/2, planeSize/2));
    return sphere;
}

function countScore(){
  score = 0;
  for(var i=0; i<ballMax; i++){
    if(ballDrop[i]==1) score++;
  }
}

function animate() {
  var currentTime = Date.now(); 
  var time = (currentTime - startTime) / 1000;   // in seconds

  countScore();

  $(".score_text").text(score);

  if(score >= ballMax){
    $("body").append("<div class='overlay'>YOU WIN!</div>");
    $(".clock").text("Press F5 to Restart");
    return;
  }

  $(".clock_text").text(Math.floor(guiControls.maxTime-time));
  if(time >= guiControls.maxTime){
    $("body").append("<div class='overlay'>GAMEOVER</div>");
    $(".clock").text("Press F5 to Restart");
    var audioLoader1 = new THREE.AudioLoader();
    var sound1 = new THREE.Audio(listener);
    audioLoader1.load('./datas/sounds/endsound.mp3', function(buffer)
    {
        sound1.setBuffer(buffer);
        sound1.setLoop(false);
        sound1.setVolume(0.5);
        sound1.play();
    });
    playSound.Stop();

    return;
  }
  console.log(time);


  document.onkeydown = function(e){

    switch (e.keyCode) {
        case 65:  //A
            car.position.x += guiControls.velocity;
            textAMesh.position.y = 7.5;
            tires[0].rotation.y = toRad(90);
            tires[1].rotation.y = toRad(90);
            tires[2].rotation.y = toRad(90);
            tires[3].rotation.y = toRad(90);
            break;
        case 83:  //S
            car.position.z += guiControls.velocity;
            textSMesh.position.y = 7.5;
            tires[0].rotation.y = 0;
            tires[1].rotation.y = 0;
            tires[2].rotation.y = 0;
            tires[3].rotation.y = 0;
            break;
        case 68:  //F
            car.position.z -= guiControls.velocity;
            textFMesh.position.y = 6.5;
            tires[0].rotation.y = toRad(180);
            tires[1].rotation.y = toRad(180);
            tires[2].rotation.y = toRad(180);
            tires[3].rotation.y = toRad(180);
            break;
        case 70:  //D
            car.position.x -= guiControls.velocity;
            textDMesh.position.y = 6.5;
            tires[0].rotation.y = toRad(-90);
            tires[1].rotation.y = toRad(-90);
            tires[2].rotation.y = toRad(-90);
            tires[3].rotation.y = toRad(-90);
            break;
        
      }

      
  }

  document.onkeyup = function(e){
    textAMesh.position.y = 8;
    textSMesh.position.y = 8;
    textDMesh.position.y = 7;
    textFMesh.position.y = 7;
  }
  light.target.position.set(car.position.x, 0, car.position.z);  

  for(var i=0; i<ballMax; i++){
      if(Math.abs(balls[i].position.x-car.position.x)<=6 && Math.abs(balls[i].position.z-car.position.z)<=6){
        ballsF[i].add(getVector(car, balls[i]).multiplyScalar(0.01*guiControls.power));
        var audioLoader2 = new THREE.AudioLoader();
        var sound2 = new THREE.Audio(listener);
        audioLoader2.load('./datas/sounds/Dorr.mp3', function(buffer)
        {
            sound2.setBuffer(buffer);
            sound2.setLoop(false);
            sound2.setVolume(0.5);
            sound2.play();
        });
      }
      for(var j=0; j<ballMax; j++){
        if(i!=j && getDistance(balls[i], balls[j])<=6.0){
            ballsF[i].add(getVector(balls[j], balls[i]).multiplyScalar(0.01*guiControls.power));
            ballsF[j].add(getVector(balls[i], balls[j]).multiplyScalar(0.01*guiControls.power));
            // var audioLoader4 = new THREE.AudioLoader();
            // var sound4 = new THREE.Audio(listener);
            // audioLoader4.load('./datas/sounds/Cheng.mp3', function(buffer)
            // {
            //     sound4.setBuffer(buffer);
            //     sound4.setLoop(false);
            //     sound4.setVolume(0.2);
            //     sound4.play();
            // });
        }
      }
      if(Math.abs(balls[i].position.x) >= planeSize/2 || Math.abs(balls[i].position.z) >= planeSize/2){
          ballsF[i].add(new THREE.Vector3(0, -0.9, 0));
          if(balls[i].position.y > -5){
            ballDrop[i] = 1;
            var audioLoader3 = new THREE.AudioLoader();
            var sound3 = new THREE.Audio(listener);
            audioLoader3.load('./datas/sounds/Drop.mp3', function(buffer)
            {
                sound3.setBuffer(buffer);
                sound3.setLoop(false);
                sound3.setVolume(0.3);
                sound3.play();
            });
          }

      }
      if(Math.abs(car.position.x) >= planeSize/2+3 || Math.abs(car.position.z) >= planeSize/2+3){
        car.position.y += -0.1;
      }
      if(car.position.y<-40.0){
        $("body").append("<div class='overlay'>GAMEOVER</div>");
        $(".clock").text("Press F5 to Restart");
        var audioLoader1 = new THREE.AudioLoader();
        var sound1 = new THREE.Audio(listener);
        audioLoader1.load('./datas/sounds/endsound.mp3', function(buffer)
        {
            sound1.setBuffer(buffer);
            sound1.setLoop(false);
            sound1.setVolume(0.5);
            sound1.play();
        });
        playSound.Stop();
        return;
      }
      balls[i].position.add(ballsF[i]);
      ballsF[i].multiplyScalar(1-guiControls.resistance*0.1);
      
  }

  camera.lookAt(car.position);
  camera.position = (30 + car.position.x, 60 + car.position.y,  car.position.z);


  // next frame
  requestAnimationFrame( animate );
  renderer.render( scene, camera );  // 선택된 camera를 사용하여 render
}

function getVector(obj2, obj1){
    var x = obj1.position.x-obj2.position.x;
    var y = 0;
    var z = obj1.position.z-obj2.position.z;
    return new THREE.Vector3(x, y, z);
}

function getDistance(obj2, obj1){
    var x = obj1.position.x-obj2.position.x;
    var y = obj1.position.y-obj2.position.y;
    var z = obj1.position.z-obj2.position.z;
    return Math.sqrt(x*x + y*y + z*z);
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onChangeOfLight() {
  lightHelper.update(); 
  shadowCameraHelper.update(); 
}

function toRad(degree) {
  return (Math.PI / 180.0) * degree;
}

function randomPrettyColor(){
    var rand = Math.floor(Math.random() * 4);
    if(rand==0) return "#FF6372";
    if(rand==1) return "#F0B7A4";
    if(rand==2) return "#F1D185";
    if(rand==3) return "#568EA6";
    return "#F0B7A4";
}