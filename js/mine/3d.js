var class3D = function() 
{
	var main 		= this;

	main.elemID 	= "area_3D";
	main.render_id 	= 0;
	main.clock 		= new THREE.Clock();
    main.isObjLoad  = 0;

	main.view_angle = 45;
	main.near 		= 1;
	main.far 		= 500;

	main.camera_x 	= 0;
	main.camera_y 	= 5;
	main.camera_z 	= 50;

	main.camera_lx 	= 0;
	main.camera_ly 	= 0;
	main.camera_lz 	= 0;

	main.dlight 	= 0xFFFFFF;
	main.hlight 	= 0xFFFFFF;
	main.hopacity 	= 0.3;
    main.tick       = 0;
    main.num_dots   = 250;

    main.isPortfMode = 0;    
    main.isAnimSkill = 0;
    main.currAnimInd = 0;
    main.currAboutInd = 2;

    main.main_group = null;
    main.userName   = "Mykhailo Nikolenko"

	main.init 			= function()
	{
		main.initScene();
        main.initCamera();
        main.initRenderer();
        main.initLights();
        main.initElement();
        main.initControl();
        main.initBackground();
        main.initEvent();

        main.addPhoto();
        main.addFloor();
        main.addPortfolios();
        main.addUserName();

        main.initParticle();
		main.render();
	}

	main.initElement 	= function()
	{
		document.getElementById(main.elemID).appendChild(main.webGLRenderer.domElement);
	}

	main.initScene      = function()
    {
        main.scene      = new THREE.Scene();
    }

    main.initEvent      = function()
    {
        window.addEventListener( 'resize', function()
        {
            main.camera.aspect = window.innerWidth / window.innerHeight;
            main.camera.updateProjectionMatrix();
            main.webGLRenderer.setSize( window.innerWidth, window.innerHeight );
        }, 
        false );

        window.addEventListener( 'mousemove', function()
        {
            var left_percent = event.clientX / $(window).width() - 0.5;
            var top_percent  = event.clientY / $(window).height() - 0.5;

            main.camera.position.x = 50 * Math.sin(Math.PI / 180 * -5 * left_percent);
            main.camera.position.y = 50 * Math.sin(Math.PI / 180 * -5 * top_percent) + 5;
            main.camera.position.z = 50 * Math.cos(Math.PI / 180 * -5 * left_percent);
            main.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }, 
        false );
    }

    main.initCamera     = function()
    {
        main.screen_width   = $("#" + main.elemID).width(), main.screen_height  = window.innerHeight;

        var ASPECT 			= main.screen_width / main.screen_height;
        
        main.camera = new THREE.PerspectiveCamera(main.view_angle, ASPECT, main.near, main.far);
        main.scene.add(main.camera);

        if($(window).width() < 700)
        {
            main.camera_z = 1000;
        }
        
        main.camera.position.set(main.camera_x, main.camera_y, main.camera_z);
        main.camera.lookAt(new THREE.Vector3(main.camera_lx, main.camera_ly, main.camera_lz));
    }

    main.initControl    = function()
    {
        // main.orbitControls          = new THREE.OrbitControls(main.camera, main.webGLRenderer.domElement, new THREE.Vector3(main.camera_lx, main.camera_ly, main.camera_lz));
    }

    main.initRenderer   = function()
    {
        // main.webGLRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
        main.webGLRenderer = new THREE.WebGLRenderer({ antialias: true, alpha : true, transparent : true });
        main.webGLRenderer.setSize(main.screen_width, main.screen_height);
        main.webGLRenderer.setClearColor(0x333333, 0);

        main.webGLRenderer.gammaInput = true;
        main.webGLRenderer.gammaOutput = true;
        main.webGLRenderer.shadowMapEnabled = true;
        main.webGLRenderer.shadowMapCascade = true;
        main.webGLRenderer.shadowMapType = THREE.PCFSoftShadowMap;
        main.webGLRenderer.shadowMapEnabled = true;
        main.webGLRenderer.shadowMapSoft    = true;

        // main.webGLRenderer.gammaInput = true;
        // main.webGLRenderer.gammaOutput = true;
        // main.webGLRenderer.shadowMap.enabled = true;
        // main.webGLRenderer.shadowMap.renderReverseSided = false;

        // main.webGLRenderer.shadowMapEnabled = true;
        // main.webGLRenderer.shadowMapSoft    = true;
    }

    main.initLights     = function()
    {
        var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x353533, 1 );
        hemiLight.color.setHSL( 0.5, 0.16, 0.97 );
        hemiLight.groundColor.setHSL( 0.77, 0.51, 0.91 );
        hemiLight.position.set( 0, 500, 0 );
        main.scene.add( hemiLight );

        // var dirLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
        // dirLight.position.set( 0, 0, 1 ).normalize();
        // main.scene.add( dirLight );

        // var pointLight = new THREE.PointLight( 0xffffff, 4.5, 0, 0 );
        // pointLight.color.setHSL( Math.random(), 1, 0.5 );
        // pointLight.position.set( 0, 100, 90 );
        // main.scene.add( pointLight );
    }

    main.initParticle   = function()
    {
        main.particleSystem = new THREE.GPUParticleSystem({
            maxParticles: 65000
        });

        main.particleSystem.particleShaderMat.depthTest = false;

        main.options = {
            position: new THREE.Vector3(),
            positionRandomness: 0.5,
            velocity: new THREE.Vector3(),
            velocityRandomness: .35,
            color: 0xefe00d,
            colorRandomness: 2.35,
            turbulence: .15,
            lifetime: 0.55,
            size: 7,
            sizeRandomness: 5
        };

        main.spawnerOptions = {
            spawnRate: 15000,
            horizontalSpeed: 1.5,
            verticalSpeed: 1.33,
            timeScale: 0.1
        };

        main.main_group.add(main.particleSystem);
    }

    main.initBackground  = function()
    {
        var dotGeometry = new THREE.SphereGeometry(0.15, 5, 5);
        var dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var dots = [];

        main.dots = dots;

        for (let i = 0; i < main.num_dots; i++) 
        {
            var dot = new THREE.Mesh(dotGeometry, dotMaterial);

            dot.position.set(
                Math.random() * 100 - 50,
                Math.random() * 50 - 25,
                Math.random() * 20 - 25
            );

            dot.userData.velocity = new THREE.Vector3(
                Math.random() * 0.05 - 0.025,
                Math.random() * 0.05 - 0.025,
                Math.random() * 0.05 - 0.025
            );

            dots.push(dot);
            main.scene.add(dot);
        }

        // Line setup
        var lineGeometry = new THREE.Geometry();
        var lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, opacity: 0.5, transparent: true });

        for(var i = 0; i < main.num_dots - 1; i ++)
        {
            for(var j = i + 1; j < main.num_dots; j ++)
            {
                if(dots[i].position.distanceTo(dots[j].position) < 5)
                    lineGeometry.vertices.push(dots[i].position, dots[j].position);
            }
        }
    
        main.lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
        main.scene.add(main.lineMesh);
    }

    main.updateDotsPosition = function()
    {
        if(!main.dots.length)
            return;

        for(var i = 0; i < main.dots.length; i ++)
        {
            main.dots[i].position.add(main.dots[i].userData.velocity);

            if(main.dots[i].position.x <= -50 || main.dots[i].position.x >= 50)
                main.dots[i].userData.velocity.x = main.dots[i].userData.velocity.x * -1;

            if(main.dots[i].position.y <= -25 || main.dots[i].position.y >= 25)
                main.dots[i].userData.velocity.y = main.dots[i].userData.velocity.y * -1;

            if(main.dots[i].position.z <= -5 || main.dots[i].position.z >= 20)
                main.dots[i].userData.velocity.z = main.dots[i].userData.velocity.z * -1;
        }
    }

    main.updateLines = function()
    {
        var lineGeometry = new THREE.Geometry();

        for(var i = 0; i < main.num_dots - 1; i ++)
        {
            for(var j = i + 1; j < main.num_dots; j ++)
            {
                if(main.dots[i].position.distanceTo(main.dots[j].position) < 7)
                    lineGeometry.vertices.push(main.dots[i].position, main.dots[j].position);
            }
        }
    
        main.lineMesh.geometry.dispose();  // clean old geometry
        main.lineMesh.geometry = lineGeometry;
    }

    main.addPortfolios = function()
    {
        var numPhotos = 12;
        var geometry = new THREE.PlaneBufferGeometry( 13, 7 );

        for(var i = 1; i < numPhotos + 1; i ++)
        {
            var texture  = new THREE.ImageUtils.loadTexture("photos/" + i + ".jpg");
                texture.wrapS   = texture.wrapT = THREE.ClampToEdgeWrapping;
            var material = new THREE.MeshBasicMaterial({ map: texture, side : THREE.BackSide});
            var photo    = new THREE.Mesh(geometry, material);

            photo.position.x = 20 * Math.cos(Math.PI / 180 * 36 * (i - 1));
            photo.position.z = 20 * Math.sin(Math.PI / 180 * 36 * (i - 1));
            photo.position.y = -3.5;
            photo.rotation.y = Math.PI / 180 * (90 - 36 * (i - 1));

            main.ground.add(photo);
        }
    }

    main.addUserName = function()
    {
        var loader = new THREE.FontLoader();

        loader.load('font/helvetiker_regular.typeface.json', function(font) 
        {
            var geometry = new THREE.TextGeometry(main.userName, 
            {
                font: font,
                size: 1,
                height: 0.25,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelSegments: 5
            });

            // var material = new THREE.MeshPhongMaterial({color : 0x0000FF});
            var materials = [
                    new THREE.MeshPhongMaterial( { color: 0xd3a347 } ), // front
                    new THREE.MeshPhongMaterial( { color: 0x0c1125 } ) // side
                ];

            var textMesh = new THREE.Mesh(geometry, materials);
            geometry.center();  // center the geometry
            
            textMesh.position.set(0, -6, 10);
            main.main_group.add(textMesh);
        });
    }

    main.updateBackground = function()
    {
        main.updateDotsPosition();
        main.updateLines();
    }

    main.animateParticle = function()
    {
        var delta = main.clock.getDelta() * main.spawnerOptions.timeScale;

        main.tick += delta;

        if (main.tick < 0) 
            main.tick = 0;

        if (delta > 0) 
        {
            main.options.position.x = Math.sin(main.tick * 25) * 8;
            main.options.position.y = Math.cos(main.tick * 25) * 8;
            main.options.position.z = 2;

            for (var x = 0; x < main.spawnerOptions.spawnRate * delta; x++) 
            {
                main.particleSystem.spawnParticle(main.options);
            }
        }

        main.particleSystem.update(main.tick);
    }

    main.animateGround  = function()
    {
        main.ground.rotation.y += 0.001;
    }

    main.addFloor       = function()
    {
        // var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
        var texture  = new THREE.ImageUtils.loadTexture("img/ground_bg.jpg");
            texture.wrapS   = texture.wrapT = THREE.ClampToEdgeWrapping;

        var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side:THREE.DoubleSide} );
        var geometry = new THREE.CylinderGeometry(20, 20, 2, 64);
        var mesh     = new THREE.Mesh( geometry, material );

        mesh.rotation.y = Math.PI;
        mesh.position.y = -8;
        mesh.material.receiveShadow = true;
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        main.ground = new THREE.Group();

        main.ground.add(mesh);
        main.main_group.add(main.ground);
    }

    main.addPhoto   = function()
    {
        // var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
        var texture  = new THREE.ImageUtils.loadTexture("photos/profile.png");
            // texture.wrapS   = texture.wrapT = THREE.ClampToEdgeWrapping;

        var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side:THREE.DoubleSide} );
        var geometry = new THREE.CylinderGeometry(7, 7, 2, 64);
        var mesh     = new THREE.Mesh( geometry, material );

        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.y = Math.PI / 2;
        mesh.position.y = 0;
        mesh.material.receiveShadow = true;
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        main.main_group = new THREE.Group();
        main.main_group.add(mesh);

        main.scene.add(main.main_group);
    }

    main.animateSkills = function()
    {
        if(!main.isAnimSkill)
            return;

        var current_time = Date.now();

        if(!main.prevTime)
            main.prevTime = current_time;

        if(current_time - main.prevTime >= 900)
        {
            if(main.currAnimInd >= $("#skill_area span").length)
            {
                main.currAnimInd = 0;

                $("#skill_area span").each(function()
                {
                    $(this).removeClass("add_anim_effect");
                    $(this).removeAttr("class", "");
                })

                return;
            }

            main.currAnimInd ++;

            var target = $("#skill_area span:nth-child(" + main.currAnimInd + ")");
                target.addClass("add_anim_effect");

            main.prevTime = current_time;
        }
    }

    main.animteAboutMe = function()
    {
        var current_time = Date.now();

        if(!main.prevAboutTime)
            main.prevAboutTime = current_time;

        if(current_time - main.prevAboutTime < 10000)
            return;

        if(main.currAboutInd > $("#about_me h3").length)
        {
            main.currAboutInd = 0;

            $("#about_me h3").each(function()
            {
                $(this).removeClass("add_anim_about");
                $(this).removeAttr("class", "");
            })

            return;
        }

        var target = $("#about_me h3:nth-child(" + main.currAboutInd + ")");
            target.addClass("add_anim_about");

        main.currAboutInd ++;
        main.prevAboutTime = current_time;
    }

    main.render     = function() 
    {
        main.animateParticle();
        main.updateBackground();
        main.animateGround();
        main.webGLRenderer.render(main.scene, main.camera);

        if(!main.isPortfMode)
        {
            main.animateSkills();
            main.animteAboutMe();
        }

        requestAnimationFrame(main.render);
    }

    main.init();

    return main;
}; 