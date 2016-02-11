
var scene;
var camera;

var monkey;
var monkeyLoaded = false;

function main()
{
    // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
    // Only enable it if you actually need to.
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);

    // Append the canvas element created by the renderer to document body element.
    document.body.appendChild(renderer.domElement);

    // Create a three.js scene.
    scene = new THREE.Scene();

    // Create a three.js camera.
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    // Apply VR headset positional data to camera.
    var controls = new THREE.VRControls(camera);

    // Apply VR stereo rendering to renderer.
    var effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);


    // Add a repeating grid as a skybox.
    var boxWidth = 5;
    var loader = new THREE.TextureLoader();
    loader.load('img/box.png', onTextureLoaded);

    // model
    
    var monkeyPos = new THREE.Vector3(0,1,0);

    var loader = new THREE.OBJLoader( manager );
    loader.load( 'media/monkey.obj', function ( object ) {
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {

                    //child.material.map = texture;
                    child.material = new THREE.MeshPhongMaterial( { 
                            color: 0x333333, 
                            specular: 0x333333, 
                            shininess: 50
                        })

                }

            } );

            object.scale.set(0.3, 0.3, 0.3);

            //object.position.x = 1;
            object.position.copy(monkeyPos);
            //object.position.set(monkeyPos);
            //object.position.set(0,1,0);

            monkey = object;
            monkeyLoaded = true;
            scene.add( monkey );

        }, function(){}, function(){} );

    function onTextureLoaded(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(boxWidth, boxWidth);

        var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
        var material = new THREE.MeshBasicMaterial({
                        map: texture,
                        color: 0x01BE00,
                        side: THREE.BackSide
                    });

        var skybox = new THREE.Mesh(geometry, material);
        scene.add(skybox);
    }


    // Create a VR manager helper to enter and exit VR mode.
    var params = {
        hideButton: false, // Default: false.
        isUndistorted: false // Default: false.
    };
    var manager = new WebVRManager(renderer, effect, params);

    // Create 3D objects.
    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(geometry, material);

    // Position cube mesh
    cube.position.z = -1;

    // Add cube mesh to your three.js scene
    scene.add(cube);

    var light = new THREE.PointLight(0xff0040, 20, 50);
    //light.position.y = 1;
    var floor = new THREE.Mesh(new THREE.BoxGeometry(1000,0.05,1000), new THREE.MeshPhongMaterial( { color: 0x333333 , specular: 0x333333, shininess: 50} ));
    floor.position.y = -0.25;

    scene.add(light);
    scene.add(floor);

    // Request animation frame loop function
    var lastRender = 0;
    function animate(timestamp) {
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;

        // Apply rotation to cube mesh
        cube.rotation.y += delta * 0.0006;

        if(monkeyLoaded)
        {
            monkey.rotation.x += delta * 0.0006;
            monkey.rotation.y += delta * 0.0006;
            monkey.rotation.z += delta * 0.0006;
        }

        // Update VR headset position and apply to camera.
        controls.update();

        // Render the scene through the manager.
        manager.render(scene, camera, timestamp);

        requestAnimationFrame(animate);
    }

    // Kick off animation loop
    animate(performance ? performance.now() : Date.now());

    // Reset the position sensor when 'z' pressed.
    function onKey(event) {
      if (event.keyCode == 90) { // z
        controls.resetSensor();
      }
    }

    window.addEventListener('keydown', onKey, true);
}
