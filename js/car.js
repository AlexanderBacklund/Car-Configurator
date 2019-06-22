
    // Load 3D Scene
    var scene = new THREE.Scene();

    undoStack = [];
    redoStack = [];

    // Function for going to the top of the page
    function topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    var carParts = {
      body: [],
      rims: [],
      glass: [],
      leather: [],
      rest: [],
      lights: [],
    };
    var carModel;

    // Load Camera Perspektive
    // field of view 25%, aspect = width/height, near = from start to field of view, far = from start to end
    // camera position
    var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(-15, 9, 15);

    // Load a Renderer
    // Loads our render. We use WebGLRender because it let us use the GPU
    // This also creates a canvas tag rendered inside body
    var renderer = new THREE.WebGLRenderer({
      alpha: false
    });
    // sets the background color
    renderer.setClearColor(0xC5C5C3);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Load the Orbitcontroller, used to rotate the car  
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    // updateProjectionMatrix used to resize the the browser
    window.addEventListener('resize', function () {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize(width, height)
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    // Load Light
    // we need light in order to see the the 3D model 
    // ambientLight light globally all objects equally
    var ambientLight = new THREE.AmbientLight(0xcccccc);
    scene.add(ambientLight);

    // Light in a specific direction
    // often used to simulate daylight
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data


    // glTf 2.0 Loader
    // GL Transmission Format is an open format specification 
    // for efficient delivery and loading of 3D content either in json or binary format
    var loader = new THREE.GLTFLoader();
    // Draco used to compress and decompress the data
    THREE.DRACOLoader.setDecoderPath('js/three.js-master/examples/js/libs/draco/');
    loader.setDRACOLoader(new THREE.DRACOLoader());

    // Optional: Pre-fetch Draco WASM/JS module, to save time while parsing.
    THREE.DRACOLoader.getDecoderModule();

    //Traverse through the model file
    loader.load('ferrari.glb', function (gltf) {
      carModel = gltf.scene.children[0];
      carModel.traverse(function (child) {
        //if ( child.isMesh  ) {
        //child.material.envMap = envMap;
      });

      var object = gltf.scene;
      gltf.scene.scale.set(2, 2, 2);
      gltf.scene.position.x = 0; //Position (x = right+ left-)
      gltf.scene.position.y = 0; //Position (y = up+, down-)
      gltf.scene.position.z = 0; //Position (z = front +, back-)

      scene.add(gltf.scene);

      // car parts for material selection
      carParts.body.push(carModel.getObjectByName('body'));
      carParts.rims.push(
        carModel.getObjectByName('rim_fl'),
        carModel.getObjectByName('rim_fr'),
        carModel.getObjectByName('rim_rr'),
        carModel.getObjectByName('rim_rl'),
      );
      carParts.glass.push(
        carModel.getObjectByName('glass'),
      );
      carParts.leather.push(
        carModel.getObjectByName('leather'),
        carModel.getObjectByName('steering_leather'),
      );
      carParts.rest.push(
        carModel.getObjectByName('trim'),
        carModel.getObjectByName('yellow_trim'),
        carModel.getObjectByName('steering_trim'),
      );
      carParts.lights.push(
        carModel.getObjectByName('brakes'),

      )

      updateMaterials();
    });

    // Create a body material
    var bodyMat = new THREE.MeshStandardMaterial({
      color: 'red',
      metalness: 0.8,
      roughness: 0.2,
      name: 'orange'
    });;

    // Changes the body color of the car and saves the old one to the undo stack
    function changeColorBody(_color) {
      saveToUndo();
      bodyMat = new THREE.MeshStandardMaterial({
        color: _color,
        metalness: 0.8,
        roughness: 0.2,
        name: 'orange'
      });
      updateMaterials()
    }

    // Create a rim material
    var rimMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.8,
      roughness: 0.2,
      name: 'orange'
    });

    // Changes the rim color of the car and saves the old one to the undo stack
    function changeColorRim(_color) {
      saveToUndo();
      rimMat = new THREE.MeshStandardMaterial({
        color: _color,
        metalness: 0.8,
        roughness: 0.2,
        name: 'orange'
      });
      updateMaterials()
    }

    // Create a leather material
    var leatherMat = new THREE.MeshStandardMaterial({
      color: 0x7a797a,
      metalness: 0.8,
      roughness: 0.2,
      name: 'orange'
    });

    // Changes the leather color of the car and saves the old one to the undo stack
    function changeColorLeather(_color) {
      saveToUndo();
      leatherMat = new THREE.MeshStandardMaterial({
        color: _color,
        metalness: 0.5,
        roughness: 0.2,
        name: 'orange'
      });
      updateMaterials()
    }

    // Create a rest material
    var restMat = restMat = new THREE.MeshStandardMaterial({
      color: 'grey',
      metalness: 0.5,
      roughness: 0.2,
      name: 'orange'
    });

    // Changes the details color of the car and saves the old one to the undo stack
    function changeColorSmall(_color) {
      saveToUndo();
      restMat = new THREE.MeshStandardMaterial({
        color: _color,
        metalness: 0.5,
        roughness: 0.2,
        name: 'orange'
      });
      updateMaterials()
    }

    // Create a glass material
    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x000ff0,
      metalness: 1,
      roughness: 0,
      opacity: 0.2,
      transparent: true,
      premultipliedAlpha: true,
      name: 'clear'
    });


    // Function for changing the different parts of the car
    function updateMaterials() {
      carParts.body.forEach(function (part) {
        part.material = bodyMat;
      });
      carParts.rims.forEach(function (part) {
        part.material = rimMat;
      });
      carParts.glass.forEach(function (part) {
        part.material = glassMat;
      });
      carParts.leather.forEach(function (part) {
        part.material = leatherMat;
      });
      carParts.rest.forEach(function (part) {
        part.material = restMat;
      });
    }

    // Animates and renders the scene
    function animate() {
      render();
      requestAnimationFrame(animate);
    }

    // Creates a renderer with the scene and the camera
    function render() {
      renderer.render(scene, camera);
    }

    // Saves the changes to the car to the undo stack and clears the redo stack
    saveToUndo = function () {
      undoStack.push([bodyMat.clone(), rimMat.clone(), glassMat.clone(), leatherMat.clone(), restMat.clone()]);
      redoStack = [];
    }

    // Saves the old values to the redo stack
    saveToRedo = function () {
      redoStack.push([bodyMat.clone(), rimMat.clone(), glassMat.clone(), leatherMat.clone(), restMat.clone()]);
    }

    // Updates the variables of the different parts of the car
    updateVariables = function (variables) {
      var _variables = variables;
      bodyMat = _variables[0];
      rimMat = _variables[1];
      glassMat = _variables[2];
      leatherMat = _variables[3];
      restMat = _variables[4];
    }

    // Function for undoing the previous action, so for instance switching back to the previous color of the car
    var undo = function () {
      if (undoStack.length != 0) {
        var u = undoStack.pop();
        saveToRedo();
        updateVariables(u);
        updateMaterials();
      }
    }

    // Function for redoing the previous action
    var redo = function () {
      if (redoStack.length != 0) {
        var r = redoStack.pop();
        undoStack.push([bodyMat.clone(), rimMat.clone(), glassMat.clone(), leatherMat.clone(), restMat.clone()]);
        updateVariables(r);
        updateMaterials();
      }
    }

    render();
    animate();
