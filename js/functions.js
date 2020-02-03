function parse_str(str){
    var faces = []; 
    var vertices = [];         
    var count_n = 0;
    var count_m = 0;
    var data_f = str.split("s off");
    
    var v2 = [];
    var f2 = [];
    var str3 = '';
    var arV = [];
    var arTmp = [];
    
    var str2 = data_f[0]; //data_f[0].replace(/\s/g, '');
    v2 = data_f[0].split('v');
    
    for (count_n = 1; count_n < v2.length ; count_n++){
        arV = v2[count_n].split(' ');
        arTmp[0] = parseFloat (arV[1]);
        arTmp[1] = parseFloat (arV[2]);
        arTmp[2] = parseFloat (arV[3]);
        vertices.push(arTmp[0] ,arTmp[1]/*, arTmp[2]*/);    //x, y, z - coord              
    }

    f2 = data_f[1].split('f');        
    var vec4 = [];
    var tmpl = [];
    var pess = new Object;
    
    for (count_m = 1; count_m < f2.length; count_m++){            
        tmpl = f2[count_m].split(' '); 
        pess.a = parseFloat(tmpl.pop());  
        pess.b = parseFloat(tmpl.pop());
        pess.c = parseFloat(tmpl.pop());
        pess.d = parseFloat(tmpl.pop()); 
        faces.push(pess.d, pess.c, pess.b, pess.a);              
    }
    var objReturn = new Object;
    objReturn.vertices = vertices;
    objReturn.faces = faces;
    return objReturn;
}
//==================================================================================
function getIndexesPoligon(vrtsX, vrtsY){ 
    var gipn = 0;  
    function gipIndexOf(arr, num){        
        for (gipn = 0; gipn < 4; gipn++){                            
            if(num == arr[gipn]){
                // console.log(gipn, 'pes');
                return gipn;
                // break;
            }else if (gipn == 3)
                return -1; 
        }           
    }
    function isParalel(arr1, arr2){
        var ipIndex = [];
        var ipT = arr1[0];
        var ipN = 0;
        for (var ipCx = 1; ipCx < 4; ipCx++){           
            if (Math.max(Math.abs(arr1[ipCx]), Math.abs(ipT)) - Math.min(Math.abs(arr1[ipCx]), Math.abs(ipT)) < 0.0001){           
                ipN++;
                ipIndex[0] = arr1[ipCx];
                ipIndex[1] = arr1[0];
            }              
        }
        // console.log(ipN, arr1, Math.abs(ipT));
        if (ipN > 0) 
            return true;    //paralel polygon
        else{
            ipT = arr2[0];
            for (var ipCx = 1; ipCx < 4; ipCx++){           
                if (Math.max(Math.abs(arr2[ipCx]), Math.abs(ipT)) - Math.min(Math.abs(arr2[ipCx]), Math.abs(ipT)) < 0.0001){ 
                    ipN++;
                }
            }
            if (ipN > 0) 
                return true;    //paralel polygon
        }
        return false;                    
    }

    var p = new Object;
    var vertex0 = new Object;
    var vertex1 = new Object;
    var vertex2 = new Object;
    var vertex3 = new Object;

    var index = new Object;
    p.vertex0 = vertex0;
    p.vertex1 = vertex1;
    p.vertex2 = vertex2;
    p.vertex3 = vertex3;    
    p.arrayOut = [0, 0, 0, 0];
    // var ktx = [9.9, 11.4, 7.5, 8];

    if (!isParalel(vrtsX, vrtsY)){
        p.vertex0.x = (Math.min (vrtsX[0], vrtsX[1], vrtsX[2], vrtsX[3]));
        p.vertex2.x = (Math.max (vrtsX[0], vrtsX[1], vrtsX[2], vrtsX[3]));
        p.vertex3.y = (Math.min (vrtsY[0], vrtsY[1], vrtsY[2], vrtsY[3]));
        p.vertex1.y = (Math.max (vrtsY[0], vrtsY[1], vrtsY[2], vrtsY[3]));
        
        p.vertex0.index = gipIndexOf(vrtsX, p.vertex0.x);
        p.vertex1.index = gipIndexOf(vrtsY, p.vertex1.y);
        p.vertex2.index = gipIndexOf(vrtsX, p.vertex2.x);
        p.vertex3.index = gipIndexOf(vrtsY, p.vertex3.y);
        // var gggg = Math.max (ktx[0], ktx[1], ktx[2], ktx[3]);
        // var hhh = gipIndexOf([5, 7, 9, 3], 3.9);
        p.arrayOut[0] = p.vertex0.index;
        p.arrayOut[1] = p.vertex1.index;
        p.arrayOut[2] = p.vertex2.index;
        p.arrayOut[3] = p.vertex3.index;        
        p.arrayIndexes = p.arrayOut;
    } else {
        // console.log('primitive is perallel');
        p.arrayOut[0] = 0;
        p.arrayOut[1] = 1;
        p.arrayOut[2] = 2;
        p.arrayOut[3] = 3;  
        p.arrayIndexes = p.arrayOut;       
    }        
    return p;
}
//==================================================================================
function formingData(inV, inF){   //input array vertices and array faces; output two arrays 
    var finX0, finX1, finX2, finX3;
    var finY0, finY1, finY2, finY3;
    var containX = [];
    var containY = [];

    for (var tmpw = 0; tmpw < inF.length / 4; tmpw++){
        finX0 = inV[inF[tmpw*4 + 0]*2 -2];
        finX1 = inV[inF[tmpw*4 + 1]*2 -2];
        finX2 = inV[inF[tmpw*4 + 2]*2 -2];
        finX3 = inV[inF[tmpw*4 + 3]*2 -2];

        finY0 = inV[inF[tmpw*4 + 0]*2 -1];
        finY1 = inV[inF[tmpw*4 + 1]*2 -1];
        finY2 = inV[inF[tmpw*4 + 2]*2 -1];
        finY3 = inV[inF[tmpw*4 + 3]*2 -1];     
        var finArrayX = [];
        var finArrayY = [];
        finArrayX[0] = finX0;
        finArrayX[1] = finX1;
        finArrayX[2] = finX2;
        finArrayX[3] = finX3;

        finArrayY[0] = finY0;
        finArrayY[1] = finY1;
        finArrayY[2] = finY2;
        finArrayY[3] = finY3; 
        //---------------------------------------
        //перестановка порядку вершин
        var tmpx = [];
        var tmpy = [];
        var indexp = getIndexesPoligon(finArrayX, finArrayY);        
        for (fdn = 0; fdn < 4; fdn ++){             
            tmpx[fdn] = finArrayX[indexp.arrayIndexes[fdn]];
            tmpy[fdn] = finArrayY[indexp.arrayIndexes[fdn]];
        }
        finArrayX = tmpx;
        finArrayY = tmpy;
        // console.log('indexp = ', indexp.arrayIndexes);
        //--------------------------------------        
        containY.push(finArrayY);
        containX.push(finArrayX);
    }            
    // console.log('containX = ', containX.length);
    var outPut = new Object;
    outPut.containX = containX;
    outPut.containY = containY;
    outPut.finArrayX = finArrayX;
    outPut.finArrayY = finArrayY;
    return outPut;
}
//================================================================
    function createPhisObjects(/*width, height, angle, */ar1, scale){
        var arPhisObjs = [];
        var obj = [];
        for(var n = 0; n < ar1.length; n++){
            obj = ar1[n];
            arPhisObjs[n] = {
                type:'box',
                size:[obj.polygonWidth, obj.polygonHeight, 1], // size of shape
                pos:[obj.posX, obj.posY, 0], // start position in degree
                rot:[0,0,obj.angle], // start rotation in degree
                move:false, // dynamic or statique
                density: 1,
                friction: 0.2,  //0.2
                restitution: 0.2,
                belongsTo: 1, // The bits of the collision groups to which the shape belongs.
                collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.                            
            };
        }
        return arPhisObjs;
    }
//==========================================================
    function createSceeneObjects(arrInput, scale, pObjs){
        var obj = [];
        var cg = [];
        var ar2 = [];
        var cubeM = new THREE.MeshLambertMaterial(
            {color: 0xcc0000}); 
        var arOut = [];
        for (n = 0; n < arrInput.length; n++){
            obj = arrInput[n];
            ar2 = pObjs[n];
            cg[n] = new THREE.CubeGeometry(obj.polygonWidth*1, obj.polygonHeight*1, 1);
            arOut[n] = new THREE.Mesh(cg[n], cubeM); 
            arOut[n].receiveShadow = true 
            // scene.add(arOut[n]);
            arOut[n].position.set(obj.posX * 1, obj.posY * 1, 1 * 1);
        }  
        return arOut; 
    }
//===========================================================
   function OutDataForPhisics(ax, ay, ind){
        var kitX = [];
        var kitY = [];
        var oData = [];
        var polygonWidth = 0;
        var polygonHeight = 0;
        var angle = 0;
        var posX = 0;
        var posY = 0;
        var m = 0;
        var k = 0;
        var l = 0;
        var radius = 0;
        var cosBeta = 0;
        var sinBeta = 0;
        var xk = [];
      
        for (var n = 0; n < ax.length; n ++){
            kitX = ax[n];
            kitY = ay[n];
            // console.log('kitX = ', kitX);
            polygonWidth = Math.sqrt( (kitX[2] - kitX[3])*(kitX[2] - kitX[3]) + (kitY[2] - kitY[3])*(kitY[2] - kitY[3]) );
            polygonHeight = Math.sqrt( (kitX[1] - kitX[2])*(kitX[1] - kitX[2]) + (kitY[1] - kitY[2])*(kitY[1] - kitY[2]) );
    

            // angle = 180 * Math.asin((kitY[2] - kitY[3]) / polygonWidth) /Math.PI;            
            radius = Math.sqrt( (kitX[1] - kitX[3])*(kitX[1] - kitX[3]) + (kitY[1] - kitY[3])*(kitY[1] - kitY[3]) )  / 2;
            sinBeta = ((kitY[2] - kitY[3]) / polygonWidth);
            beta =  Math.asin(sinBeta);
            cosBeta = Math.cos(beta);
            angle = beta * (180 / Math.PI);
           
            // console.log('radius = ', radius);
            var sinGamma = (polygonHeight / 2 )/radius;
            // var alpha = Math.asin(sinGamma) + beta;
            // var alpha = Math.asin(sinGamma)*180/Math.PI + beta*180/Math.PI;
            var alpha = Math.asin(sinGamma) + beta;
            var ms = radius * Math.sin(alpha*Math.PI/180);
            var ns = radius * Math.cos(alpha*Math.PI/180);
            
            posY = kitY[3] + ms;
            posX = kitX[3] + ns;
            posX = (kitX[0] + kitX[1] + kitX[2] + kitX[3])/4;
            posY = (kitY[0] + kitY[1] + kitY[2] + kitY[3])/4;
            // console.log('kitx = ', kitX[0], kitX[1], kitX[2], kitX[3]);
            // console.log('kitY = ', kitY[0], kitY[1], kitY[2], kitY[3]);
            
            //  console.log('cosBeta = ', cosBeta, ' PosX = ', posX, 'PosY = ', posY);
            // console.log('angle = ', angle, ' width = ', polygonWidth, ' height = ', polygonHeight);
            // console.log('sinBeta = ', ax.length);
            if (polygonHeight > polygonWidth){
                // console.log('Height > Width');
                // angle += 270;
            }
              
            xk[n] = new Object;
            xk[n].polygonWidth = polygonWidth;
            xk[n].polygonHeight = polygonHeight;
            xk[n].posX = posX;
            xk[n].posY = posY;
            xk[n].angle = angle;    
            oData.push(xk[n]);
        }
        return oData;
    }
