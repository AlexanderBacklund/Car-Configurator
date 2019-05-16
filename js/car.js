
    // Load 3D Scene
    var scene = new THREE.Scene();

    undoStack = [];
    redoStack = [];

    function topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    var carParts = {
      body: [],
      rims: [],
      glass: [],
      leather: [],
      rest: []
    };
    var carModel;

    // Load Camera Perspektive
    var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(-15, 9, 15);

    // Load a Renderer
    var renderer = new THREE.WebGLRenderer({
      alpha: false
    });
    renderer.setClearColor(0xC5C5C3);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Load the Orbitcontroller
    var controls = new THREE.OrbitControls(camera, renderer.domElement);


    window.addEventListener('resize', function () {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize(width, height)
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    // Load Light
    var ambientLight = new THREE.AmbientLight(0xcccccc);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data


    // glTf 2.0 Loader
    var loader = new THREE.GLTFLoader();
    THREE.DRACOLoader.setDecoderPath('js/three.js-master/examples/js/libs/draco/');
    loader.setDRACOLoader(new THREE.DRACOLoader());

    // Optional: Pre-fetch Draco WASM/JS module, to save time while parsing.
    THREE.DRACOLoader.getDecoderModule();

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
        carModel.getObjectByName('nuts'),
        carModel.getObjectByName('yellow_trim'),

      )
      updateMaterials();
    });

    var bodyMat = new THREE.MeshStandardMaterial({
      color: 'red',
      metalness: 0.8,
      roughness: 0.2,
      name: 'orange'
    });;

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

    var rimMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.8,
      roughness: 0.2,
      name: 'orange'
    });

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

    var leatherMat = new THREE.MeshStandardMaterial({
      color: 0x7a797a,
      metalness: 0.8,
      roughness: 0.2,
      name: 'orange'
    });

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

    var restMat = restMat = new THREE.MeshStandardMaterial({
      color: 'grey',
      metalness: 0.5,
      roughness: 0.2,
      name: 'orange'
    });

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

    var glassMat = new THREE.MeshStandardMaterial({
      color: 0x000ff0,
      metalness: 1,
      roughness: 0,
      opacity: 0.2,
      transparent: true,
      premultipliedAlpha: true,
      name: 'clear'
    });



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

    function animate() {
      render();
      requestAnimationFrame(animate);
    }

    function render() {
      renderer.render(scene, camera);
    }

    saveToUndo = function () {
      undoStack.push([bodyMat.clone(), rimMat.clone(), glassMat.clone(), leatherMat.clone(), restMat.clone()]);
      redoStack = [];
    }

    saveToRedo = function () {
      redoStack.push([bodyMat.clone(), rimMat.clone(), glassMat.clone(), leatherMat.clone(), restMat.clone()]);
    }

    updateVariables = function (variables) {
      var _variables = variables;
      bodyMat = _variables[0];
      rimMat = _variables[1];
      glassMat = _variables[2];
      leatherMat = _variables[3];
      restMat = _variables[4];
    }

    var undo = function () {
      if (undoStack.length != 0) {
        var u = undoStack.pop();
        saveToRedo();
        updateVariables(u);
        updateMaterials();
      }
    }

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
