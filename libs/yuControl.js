(function(){

    function YuConstraint(camera){
        this.object = camera;
        this.target = new THREE.Vector3();
    }




    THREE.YuControls = function ( camera, domElement ){
        var constraint = new YuConstraint(camera);
        var target = constraint.target;
        var scope = this;
        this.constraint = constraint;

         // How far you can orbit vertically, upper and lower limits.
        
        this.minPolarAngle = -85; // deg
        this.maxPolarAngle = 85; // deg

        // How far you can orbit horizontally, upper and lower limits.
       
        this.minAzimuthAngle = - Infinity; // radians
        this.maxAzimuthAngle = Infinity; // radians


        this.rotateSpeed = 1;
        this.autoRotate = true;

        var isUserInteracting = false,onPointerDownPointerX,onPointerDownPointerY,
            onMouseDownMouseX = 0, onMouseDownMouseY = 0,
            lon = 90, onMouseDownLon = 0,
            lat = 0, onMouseDownLat = 0,
            phi = 0, theta = 0;

        this.enabled = true;
        Object.defineProperty( this, 'constraint', {

            get: function() {

                return constraint;

            }

        } );

        Object.defineProperty(this,'enabled',{
            set:function(value){
                this.enabled = value;
                !!value?initEvent():destroyEvent();
            }
        });

        Object.defineProperty(this,'target',{
            get:function(){
                return this.constraint.target;
            },
            set:function(value){
                this.constraint.target = value;
            }
        });



        this.update = function(){
            if(this.autoRotate === true){

                if ( isUserInteracting === false ) {
                   lon += this.rotateSpeed/10;
                }

                lat = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, lat ) );
                phi = THREE.Math.degToRad( 90 - lat );
                theta = THREE.Math.degToRad( lon );

                target.x = 500 * Math.sin( phi ) * Math.cos( theta );
                target.y = 500 * Math.cos( phi );
                target.z = 500 * Math.sin( phi ) * Math.sin( theta );

                camera.lookAt( target );
            }
        }

      





        function onDocumentMouseDown( event ) {
            event.preventDefault();

            isUserInteracting = true;

            onPointerDownPointerX = event.clientX;
            onPointerDownPointerY = event.clientY;

            onPointerDownLon = lon;
            onPointerDownLat = lat;

        }

        function onDocumentMouseMove( event ) {
            if ( isUserInteracting === true ) {

                lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
                lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
                scope.update()
            }

        }

        function onDocumentMouseUp( event ) {

            isUserInteracting = false;

        }

        function onDocumentMouseWheel( event ) {

            camera.fov =Math.max(Math.min(camera.fov-event.wheelDeltaY * 0.05,80),30);
            camera.updateProjectionMatrix();
            scope.update()

        }


        function onDocumentTouchStart( event ) {

            if ( event.touches.length == 1 ) {

                event.preventDefault();

                onPointerDownPointerX = event.touches[ 0 ].pageX;
                onPointerDownPointerY = event.touches[ 0 ].pageY;

                onPointerDownLon = lon;
                onPointerDownLat = lat;

            }

        }

        function onDocumentTouchMove( event ) {

            if ( event.touches.length == 1 ) {

                event.preventDefault();

                lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
                lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.3 + onPointerDownLat;

                scope.updete();

            }

        }


        initEvent();

        function initEvent(){
      document.addEventListener( 'mousedown', onDocumentMouseDown, false );
      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      document.addEventListener( 'mouseup', onDocumentMouseUp, false );
      document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

      document.addEventListener( 'touchstart', onDocumentTouchStart, false );
      document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    }
    
    function destroyEvent(){
      document.removeEventListener( 'mousedown', onDocumentMouseDown, false );
      document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
      document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
      document.removeEventListener( 'mousewheel', onDocumentMouseWheel, false );

      document.removeEventListener( 'touchstart', onDocumentTouchStart, false );
      document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
    }

    }

})();


