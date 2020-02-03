
var scene = new THREE.Scene;
var meshs = [];
window.onload=function(){     
    var ind = document.getElementsByClassName("indicate");
    var x = 0, z = 0;
	var vec3 = new THREE.Vector3;    
	//scene.background = new THREE.Color( 0x000000, 0 );
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);
    var render = new THREE.WebGLRenderer({ alpha: true, transparent: true  } ); 	//{ antialias: true },       
    render.setSize(window.innerWidth, window.innerHeight);
    render.setClearColor(0xEEEEEE, 0.7);
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(render.domElement);

    var axes = new THREE.AxesHelper( 60 );
    scene.add(axes);
    
    var turn = -1;
    var tm = document.getElementsByClassName('btn');

    var screen_size = new THREE.Vector2;
    render.getDrawingBufferSize(screen_size);
//==========================  ============================
	var shaderMaterial = new THREE.ShaderMaterial( {
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });    
    
    camera.position.set(15, 20, 40);
    camera.lookAt(scene.position);
	var amColor = "#faffe3";
	var amLight = new THREE.AmbientLight(amColor, 0.9);
	scene.add(amLight);

	var light = new THREE.DirectionalLight(0xfff7e8, 1); 
	scene.add(light);
    light.position.y += 40;
        
    //Set up shadow properties for the light
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;	
	spotLight.shadow.mapSize.width = 2048;  // default
	spotLight.shadow.mapSize.height = 2048; // default
	spotLight.shadow.camera.near = 0.5;       // default
	spotLight.shadow.camera.far = 500      // default       
    scene.add(spotLight );

    //------------------phisics-----------------------
    world = new OIMO.World({ 
        timestep: 1/60, 
        iterations: 8, 
        broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
        worldscale: 10, // scale full world 
        // worldrotation: [20,20,20],
        random: true,  // randomize sample
        info: false,   // calculate statistic or not
        gravity: [0,-9.8,0] 
    });

    var floor_phs = world.add({ 
        type:'box', // type of shape : sphere, box, cylinder 
        size:[10,1,10], // size of shape
        pos:[0,-15,0], // start position in degree
        rot:[0,0,10], // start rotation in degree
        move:false, // dynamic or statique
        density: 1,
        friction: 0.2,  //0.2
        restitution: 0.2,
        belongsTo: 1, // The bits of the collision groups to which the shape belongs.
        collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
    });
    //---------------------- front limit polygon------------------------
    var frontLimit = world.add({ 
        type:'box', // type of shape : sphere, box, cylinder 
        size:[70,70,1], // size of shape
        pos:[0,0,1], // start position in degree
        rot:[0,0,10], // start rotation in degree
        move:false, // dynamic or statique
        density: 1,
        friction: 0.2,  //0.2
        restitution: 0.2,
        belongsTo: 1, // The bits of the collision groups to which the shape belongs.
        collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
    });
    //---------------------- back limit polygon------------------------
    var backLimit = world.add({ 
        type:'box', // type of shape : sphere, box, cylinder 
        size:[70,70,1], // size of shape
        pos:[0,0,-1], // start position in degree
        rot:[0,0,10], // start rotation in degree
        move:false, // dynamic or statique
        density: 1,
        friction: 0.2,  //0.2
        restitution: 0.2,
        belongsTo: 1, // The bits of the collision groups to which the shape belongs.
        collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
    });
    
    //==========================add phisics simulate spheres==============
    var arSpheres = [];
    var SIZE_SPHERES = 0.47;
    for (var nsp = 0; nsp < 40; nsp ++){        
        arSpheres[nsp] = world.add({ 
            type:'sphere', // type of shape : sphere, box, cylinder 
            size:[SIZE_SPHERES, SIZE_SPHERES, SIZE_SPHERES], // size of shape
            pos:[ -5 + (nsp%10)*SIZE_SPHERES*2, 12.8 + 0.5*Math.floor(nsp/10),  0*Math.random()*0.01], // start position in degree
            rot:[0,0,10], // start rotation in degree
            move:true, // dynamic or statique
            density: 1,
            friction: 0.1,  //0.2
            restitution: 0.2,
            belongsTo: 1, // The bits of the collision groups to which the shape belongs.
            collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
        });
    }
    // //=========================================================    
    var str1 = document.getElementById ('lab').textContent;
    var d = parse_str(str1);        
    var res = formingData(d.vertices, d.faces);   
    var odf = OutDataForPhisics(res.containX, res.containY);    
    var obScale = 1;
    var cpo = createPhisObjects(odf, obScale);    
    var sceneObjects = createSceeneObjects(odf, obScale, cpo);

    var namesObjects = [];  //ідентифікатори об'єктів 

    for (var cnt = 0; cnt < cpo.length; cnt++){                      
        namesObjects[cnt] = world.add(cpo[cnt]);
        sceneObjects[cnt].position.copy(namesObjects[cnt].getPosition() );      
        // sceneObjects[cnt].quaternion.copy(namesObjects[cnt].getQuaternion() );
        var qtrn = namesObjects[cnt].getQuaternion();
        // this.console.log('quaternion = ', qtrn);
        // qtrn.z *= 1.01;     //не зрозумілий глюк. Без цього  
        // qtrn.w *= 1.01;     //фізичні обєкти повернуті на невеличкий кут відносно реагування сфер

        sceneObjects[cnt].quaternion.copy(qtrn);
        sceneObjects[cnt].receiveShadow = true;
    }
    //============================phisics geom============================
    //=========================tex phis ======================
    function basicTexture(n){
        var canvas = document.createElement( 'canvas' );
        canvas.width = canvas.height = 64;
        var ctx = canvas.getContext( '2d' );
        var color;
        // if(n===0) color = "#3884AA";// sphere58AA80
        if(n===0) color = "#005500";
        if(n===1) color = "#61686B";// sphere sleep
        if(n===2) color = "#AA6538";// box
        if(n===3) color = "#61686B";// box sleep
        if(n===4) color = "#AAAA38";// cyl
        if(n===5) color = "#61686B";// cyl sleep
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = "rgba(30, 30, 30, 1)";
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillRect(32, 32, 32, 32);
        // ctx.beginPath();
        // ctx.arc(32, 32, 8, 0, 2* Math.PI);
        // ctx.stroke();

        var tx = new THREE.Texture(canvas);
        tx.needsUpdate = true;
        return tx;
    }
    //=================================================================
    var scale = 1;
    var box_floor_phis_geometry = new THREE.CubeGeometry(10, 1, 10);
    var floor = new THREE.Mesh(box_floor_phis_geometry, shaderMaterial);
    floor.scale.set(scale, scale, scale);
    scene.add(floor);
    floor.position.copy( floor_phs.getPosition() );
    floor.quaternion.copy( floor_phs.getQuaternion() );

    var arSpheresMesh = [];
    var arGeom = [];
    var sphM = new THREE.MeshPhongMaterial({map: basicTexture(0), /*side: THREE.DoubleSide, */wireframe: false,
                                            specular: 0x080808});
    for (var nn = 0; nn < arSpheres.length; nn++){
        arGeom = new THREE.SphereBufferGeometry(SIZE_SPHERES, 16, 16);  //default = 10, 10
        arSpheresMesh[nn] = new THREE.Mesh(arGeom, sphM);
        arSpheresMesh[nn].castShadow = true;
        scene.add(arSpheresMesh[nn]);    
    }
    //============================end of phisics geom============================

    meshes = [];
    var objLoader = new THREE.OBJLoader();
    objLoader.load('model/visual_model.obj', function(object){ 
        object.traverse(function(child){
            if (child instanceof THREE.Mesh){
                meshes.push(child);
            }
        });
		var body = meshes[0];   
        body.scale.set(10, 10, 10);
        body.rotation.set(0, 0, 0);
		body.receiveShadow = true;
        scene.add(body);  
        // console.log('visual model = ', body.geometry.attributes.position);    
        body.material = new THREE.MeshPhongMaterial({  
            color: 0xcc0000,                 
            specular: 0x333333,                       
        });      
    });    
    
    var strela = new THREE.Mesh();
    var strelkaLoader = new THREE.OBJLoader();
    strelkaLoader.load('model/stralka.obj', function(object){ 
        var meshes2 = [];
        object.traverse(function(child){
            if (child instanceof THREE.Mesh){
                meshes2.push(child);
            }
        });               
           
        strela = meshes2[0];
        strela.material = new THREE.MeshPhongMaterial({specular: 0x222222, color: 0x0000ff});
        strela.castShadow = true;
        scene.add(strela);
        // console.log('Mesh strela = ', strela.geometry.attributes.position);
    });
    
    var controls = new THREE.OrbitControls (camera, render.domElement);  
	controls.enablePan = false;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 300;
    
    var angle = 0;  
    var angle_change = 2*Math.PI/180;
    var k_left = false;
    var k_right = false;
    var k_up = false;
    var k_down = false;
     
	document.addEventListener('keydown', function(event) {
		if (event.key =="ArrowLeft")            
            k_left = true;
		if (event.key =="ArrowRight")
            k_right = true;    
		if (event.key =="ArrowUp"){
            k_up = true;
        }
		if (event.key =="ArrowDown"){
            k_down = true;
        }        
    });

    document.addEventListener('keyup', function(event) {
        if (event.key =="ArrowLeft")
            k_left = false;
        if (event.key =="ArrowRight")
            k_right = false;        
        if (event.key =="ArrowUp")
            k_up = false;
        if (event.key =="ArrowDown")
            k_down = false;                      
    });
	
    var rendering = function(){  
        //=======================key test====================
        if (k_left)
            angle += angle_change;        
        if (k_right)
            angle -= angle_change;            
        if (k_up){
            z -=0.2*Math.cos(angle);
            x -=0.2*Math.sin(angle);        
        }
        if (k_down){
            z +=0.2*Math.cos(angle);
            x +=0.2*Math.sin(angle);
        }
        angle %= 2*Math.PI;
        //======================= end key test====================
        // update world
        world.step();

        for (var mp = 0; mp < arSpheres.length; mp++){
            var mpos = arSpheres[mp].getPosition();
            if (mpos.y < -30){
                arSpheres[mp].resetPosition(0, 13, 0);
            }
            arSpheresMesh[mp].position.copy (arSpheres[mp].getPosition() );
            arSpheresMesh[mp].quaternion.copy ( arSpheres[mp].getQuaternion() );    
        }
        //-----------------------end of phisics-------------------
        strela.position.z = z + -20;
        strela.position.x = x;
        strela.rotation.y = angle;
		// camera.getWorldDirection(vec3);
        ind[0].innerHTML = 'x=' + x + '<br>' + 'z=' + z + '<br>' +'angle=' + angle*180/Math.PI + '<br>';
        requestAnimationFrame(rendering);
        controls.update();
        render.render(scene, camera);        
    }
    rendering();
}