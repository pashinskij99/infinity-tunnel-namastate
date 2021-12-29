// Tunnel

const global = {
  scrollWhere: null,
  arrForTexts: [],
  arrForGroup: [],
  videoIsEnd: true,
  takeCanvas: document.querySelector(".prob_canvas"),
  takeContainerCanvas: document.querySelector(".modal-canvas-block"),
  leaveFromWindow: false,
}

var ww = window.innerWidth
var wh = window.innerHeight

var isMobile = ww < 500

const mouse = new THREE.Vector2()
let currentIntersect = null
let currentName = null

const loadManager = new THREE.LoadingManager()
const loader = new THREE.TextureLoader(loadManager)

let selectedObject = null, max = -0.15, min = 0.15
const colorF = new THREE.Color("#F3F0EF")
const colorB = new THREE.Color("#3B5971")

global.takeCanvas.addEventListener('click', () => {
  if(currentIntersect) {
    if(global.videoIsEnd) {
      if(currentIntersect.object.name === 'NAMASTATE') {
        window.open('https://namastate.wpengine.com/', '_blank')
      } 
    }
  }
})

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / ww * 2 - 1
  mouse.y = - (event.clientY / wh) * 2 + 1
})

const hamburger = document.querySelector(".hamburger"),
    hamburgerContainer = document.querySelector('.hamburger-container')
hamburger.addEventListener("click", () => {
  if(!global.videoIsEnd) {
    global.videoIsEnd = true
  }
  if (global.takeContainerCanvas.className == "modal-canvas-block hide") {
    global.takeContainerCanvas.classList.remove("hide")
    global.takeContainerCanvas.classList.add("show")
    hamburgerContainer.classList.add('hamburger-close')
  } else if (global.takeContainerCanvas.className == "modal-canvas-block show") {
    global.takeContainerCanvas.classList.remove("show")
    global.takeContainerCanvas.classList.add("hide")
    hamburgerContainer.classList.remove('hamburger-close')
  }
})

function ModalTunnel(texture, canvas, textTexture, textSubTexture, textureForTringle) {
  this.textTexture = textTexture
  this.textureForTringle = textureForTringle
  this.textSubTexture = textSubTexture
  this.texture = texture
  this.canvas = canvas

  this.raycaster = new THREE.Raycaster()

  this.init()
  this.createMesh()

  this.handleEvents()

  window.requestAnimationFrame(this.render.bind(this))
}

ModalTunnel.prototype.init = function() {
  this.speed = 1;
  this.prevTime = 0;
  this.mouse = {
    position: new THREE.Vector2(ww * 0.5,  wh * 0.5),
    ratio: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(ww * 0.5,  wh * 0.5)
  };

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: this.canvas
  });
  this.renderer.setClearColor( "#F3F0EF" );
  this.renderer.setSize(ww ,wh)

  this.camera = new THREE.PerspectiveCamera(10.1, ww /wh, 0.03, 1.3)
  this.camera.rotation.y = Math.PI
  this.camera.position.z = 0.5

  this.scene = new THREE.Scene()

  this.addParticle()
};

ModalTunnel.prototype.addParticle = function() {
  this.plane = new THREE.PlaneBufferGeometry( .783, .96 )
  this.planeText = new THREE.PlaneBufferGeometry( .25, .2 )
  this.planeSubText = new THREE.PlaneBufferGeometry( .15, .03 )
  this.particles = []
  this.text = []
  this.firText = [this.textTexture[0]]
  this.secText = [this.textTexture[1]]
  this.thirText = [this.textTexture[2]]
  this.fourText = [this.textTexture[3]]
  this.fiveText = [this.textTexture[4]]
  this.sixText = [this.textTexture[5]]
  this.sevenText = [this.textTexture[6]]
  this.eightText = [this.textTexture[7]]
  this.textSub = []
  this.textSub1 = [this.textSubTexture[0]]
  this.textSub2 = [this.textSubTexture[1]]
  this.textSub3 = [this.textSubTexture[2]]
  this.textSub4 = [this.textSubTexture[3]]
  this.textSub5 = [this.textSubTexture[4]]
  this.textSub6 = [this.textSubTexture[5]]
  this.textSub7 = [this.textSubTexture[6]]
  this.textSub8 = [this.textSubTexture[7]]
  this.textures = []
  this.texture1 = [this.texture[1]]
  this.texture2 = [this.texture[0]]
  this.texture3 = [this.texture[6]]
  this.texture4 = [this.texture[5]]
  this.texture5 = [this.texture[4]]
  this.texture6 = [this.texture[3]]
  this.texture7 = [this.texture[2]]

  for (var i = 0; i <= 49; i++) {
    if(this.text.length <= 56) {
      this.textures.push(this.texture1, this.texture2,this.texture3,this.texture4,this.texture5,this.texture6, this.texture7)
      this.text.push(this.fiveText,this.fourText,this.thirText,this.secText,this.firText, this.eightText,this.sevenText, this.sixText)
      this.textSub.push(this.textSub5, this.textSub4, this.textSub3, this.textSub2,this.textSub1, this.textSub8, this.textSub7, this.textSub6)
    }
    this.text[i][0].transparent = true
    this.textSub[i][0].transparent = true
    this.particles.push(new ModalParticle(this.scene, i, this.textures, this.plane, this.text[i][0], this.planeText, this.planeSubText, this.textSub[i][0], this.textureForTringle))
  }
};

ModalTunnel.prototype.createMesh = function() {
  var points = []
  var i = 0
  var geometry

  this.scene.remove(this.tubeMesh)

  for (i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.75 * (i / 4)))
  }
  points[4].y = -0.05

  this.curve = new THREE.CatmullRomCurve3(points)
  this.curve.type = "catmullrom"

  geometry = new THREE.Geometry()
  geometry.vertices = this.curve.getPoints(70)
  this.splineMesh = new THREE.Line(geometry, new THREE.ShaderMaterial())
  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false)
  console.log(this.tubeGeometry);
  this.tubeGeometry = new THREE.TubeBufferGeometry(this.curve, 70, 0.02, 30, false)
  console.log(this.tubeGeometry);
  this.tubeGeometry_o = this.tubeGeometry.clone()
};

ModalTunnel.prototype.handleEvents = function() {
  window.addEventListener('resize', this.onResize.bind(this), false)
  this.canvas.addEventListener('mousewheel', this.onMouseDown.bind(this), false);
  this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
  this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
  this.canvas.addEventListener('mouseleave', (event) => {
    global.leaveFromWindow = true
  }, false);
  this.canvas.addEventListener('mouseover', () => {
    global.leaveFromWindow = false
  })
  this.canvas.addEventListener("mousemove", (event) => {
    mouse.x = ( (event.layerX - this.canvas.offsetLeft) / this.canvas.clientWidth ) * 2 - 1;
    mouse.y = ( (event.layerY - this.canvas.offsetTop) / this.canvas.clientHeight ) * -2 + 1;
  })
};

let num2 = 100
let timerModalTunnel

ModalTunnel.prototype.onMouseDown = function() {
  if(event.deltaY > 0) {
    num2 += event.deltaY * 4.5;
    // scrollDown
    global.scrollWhere = 'down'
    gsap.to(this, 0, {
      speed: 550 + num2,
      ease: Power2.easeInOut
    })
    clearTimeout(timerModalTunnel)
    timerModalTunnel = setTimeout(() => {
      gsap.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut
      })
      global.scrollWhere = null
      num2 = 100
    }, 200)
  } else if (event.deltaY < 0) {
    //scrollTop
    num2 += event.deltaY * 4.5
    global.scrollWhere = 'top'
    gsap.to(this, 0, {
      speed: 550 + -(num2),
      ease: Power2.easeInOut
    })
    clearTimeout(timerModalTunnel)
    timerModalTunnel = setTimeout(() => {
      gsap.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut
      })
      num2 = 100
      global.scrollWhere = null
    }, 200)
  }
}

let x3 = null
let y3 = null

ModalTunnel.prototype.onTouchStart = function() {
  const firstTouch = event.touches[0]
  x3 = firstTouch.clientX
  y3 = firstTouch.clientY
}

ModalTunnel.prototype.onTouchMove = function() {
  if(!x3 || !y3) {
    return false
  }
  let y4 = event.touches[0].clientY

  let yDiff = y4 - y3

  if(yDiff > 0) {
    global.scrollWhere = 'down'

    gsap.to(this, 0, {
      speed: 500 + Math.random() * (3000 - 2700) + 2700,
      ease: Power2.easeInOut,
    })
    clearTimeout(timerModalTunnel)
    timerModalTunnel = setTimeout(() => {
      gsap.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut // Power1.easeInOut
      })
      global.scrollWhere = null
    }, 300)
  }
  else {
    global.scrollWhere = 'top'

    gsap.to(this, 0, {
      speed: 500 + Math.random() * (3000 - 2700) + 2700,
      ease: Power2.easeInOut,
    })
    clearTimeout(timerModalTunnel)
    timerModalTunnel = setTimeout(() => {
      gsap.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut, // Power1.easeInOut
      })
      global.scrollWhere = null
    }, 300)
  }
  x3 = null
  y3 = null
}

const popupContent = document.querySelector(".popup_content")

ModalTunnel.prototype.onResize = function() {
  ww = window.innerWidth;
  wh = window.innerHeight;

  isMobile = ww < 500;

  this.camera.aspect = ww / wh;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(ww, wh);
}

ModalTunnel.prototype.onMouseMove = function(e) {
  if (e.type === "mousemove"){
    this.mouse.target.x = e.clientX;
    this.mouse.target.y = e.clientY;
  } else {
    this.mouse.target.x = e.touches[0].clientX;
    this.mouse.target.y = e.touches[0].clientY;
  }
}
ModalTunnel.prototype.updateTunnelElementsByDistance = function(){
  const particlesMeasurement = [];

  let minD = Infinity;
  let maxD = -Infinity;

  for( const np of this.particles ){
    const nm = { d: np.mesh.position.distanceTo( this.camera.position ), p: np.mesh };
    if( nm.d > maxD ){ maxD = nm.d;}
    if( nm.d < minD ){ minD = nm.d;}
    particlesMeasurement.push( nm );
  }

  const MATH_PI_1_2 = Math.PI / 2;
  const RADIAN_RANGE = 0.02;
  const RADIAN_START = MATH_PI_1_2 + ( MATH_PI_1_2 - RADIAN_RANGE );

  for( const pm of particlesMeasurement ){
    const alphaLinier = pm.d / ( maxD - minD );
    const sinAlpha = Math.sin( RADIAN_START + RADIAN_RANGE * alphaLinier );

    const scaleAlpha = sinAlpha * 1.9; // 1.4

    pm.p.scale.set( scaleAlpha, scaleAlpha, scaleAlpha );
  }
};

ModalTunnel.prototype.updateCameraPosition = function() {
  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 10
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 10

  this.mouse.ratio.x = (this.mouse.position.x / ww)
  this.mouse.ratio.y = (this.mouse.position.y / wh)

  const test1 = 0.000008;
  const test2 = test1 / 2;
  this.camera.rotation.y = Math.PI - (this.mouse.ratio.x * 0.1 - 0.05)
  this.camera.position.x = (this.mouse.ratio.x * test1 - test2);
  this.camera.position.y = -(this.mouse.ratio.y * test1 - test2) - -0.00541;
}

ModalTunnel.prototype.updateCurve = function() {
  let i = 0;
  let index = 0;
  let vertice_o = null;
  let vertice = null;
  for (i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
    vertice_o = this.tubeGeometry_o.vertices[i];
    vertice = this.tubeGeometry.vertices[i];
    index = Math.floor(i / 30);
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 1;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 1;
  }
  this.tubeGeometry.verticesNeedUpdate = true;

  this.curve.points[1].x = -(0.6 * (1 - this.mouse.ratio.x) - 0.3) / 180;
  this.curve.points[2].x = (0.6 * (1 - this.mouse.ratio.x) - 0.3) / 35;
  this.curve.points[3].x = 0;
  this.curve.points[4].x = (0.6 * (1 - this.mouse.ratio.x) - 0.3) / 35;
  this.curve.points[1].y = -(0.6 * (1 - this.mouse.ratio.y) - 0.3) / 180;
  this.curve.points[2].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 35;
  this.curve.points[3].y = 0;
  this.curve.points[4].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 35;

  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
}

let selectedObject1 = null

ModalTunnel.prototype.render = function(time) {
  if(global.videoIsEnd && !global.leaveFromWindow) {
    this.updateCameraPosition();
  }

  this.updateTunnelElementsByDistance();

  this.updateCurve();

  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].update(this);
    if(
        this.particles[i].burst
        &&
        this.particles[i].percent > 1
    ){
      this.particles.splice(i, 1)
      i--
    }
  }

  this.renderer.render(this.scene, this.camera);

  this.raycaster.setFromCamera(mouse, this.camera)
  this.intersectsGroup = this.raycaster.intersectObjects(global.arrForGroup, true)
  this.intersectsText = this.raycaster.intersectObjects(global.arrForTexts)

  for (const object of global.arrForGroup) {
    if(object.children[0].children[0].material.alphaMap.name === 'CONNECT') {
      gsap.to(object.children[0].children[0].scale, {x: 0.7, y: 0.25,})
    } else if(object.children[0].children[0].material.alphaMap.name === 'AWARENESS') {
      gsap.to(object.children[0].children[0].scale, {x: 1.1, y: 0.25,})
    } else if(object.children[0].children[0].material.alphaMap.name === 'JOURNEY') {
      gsap.to(object.children[0].children[0].scale, {x: 0.6, y: 0.25})
      gsap.to(object.children[0].children[0].rotation, {z: 0.03})
    } else if(object.children[0].children[0].material.alphaMap.name === 'COMMUNITAS') {
      gsap.to(object.children[0].children[0].scale, {x: 1.4, y: 0.3})
      gsap.to(object.children[0].children[0].rotation, {z: 0.03})
    } else if(object.children[0].children[0].material.alphaMap.name === 'SENSORIA') {
      gsap.to(object.children[0].children[0].scale, {x: 0.7, y: 0.25})
      gsap.to(object.children[0].children[0].rotation, {z: 0.02})
    } else if(object.children[0].children[0].material.alphaMap.name === 'ALL GOODS') {
      gsap.to(object.children[0].children[0].scale, {x: 0.85, y: 0.25})
      gsap.to(object.children[0].children[0].rotation, {z: 0.04})
    } else if(object.children[0].children[0].material.alphaMap.name === 'NAMA VISION') {
      gsap.to(object.children[0].children[0].scale, {x: 1.3, y: 0.3})
      gsap.to(object.children[0].children[0].rotation, {z: 0.02})
    } else if(object.children[0].children[0].material.alphaMap.name === 'NAMASTATE') {
      gsap.to(object.children[0].children[0].scale, {x: 1.4, y: 0.3})
      gsap.to(object.children[0].children[0].position, {x: -0.13, y: -0.287})
      gsap.to(object.children[0].children[0].rotation, {z: -0.82})
    }
      if(object.children[0].children[1].material.alphaMap.name === 'mind') {
        gsap.to(object.children[0].children[1].scale, {x: 2, y: 2})
        gsap.to(object.children[0].children[1].position, {x: 0.22, y: -0.17})
        gsap.to(object.children[0].children[1].rotation, {z: 1.01})
      } else if(object.children[0].children[1].material.alphaMap.name === 'exp') {
        gsap.to(object.children[0].children[1].scale, {x: 2.5, y: 2})
        gsap.to(object.children[0].children[1].position, {x: 0.22, y: -0.18})
        gsap.to(object.children[0].children[1].rotation, {z: 1.02})
      } else if(object.children[0].children[1].material.alphaMap.name === 'stream') {
        gsap.to(object.children[0].children[1].scale, {x: 2.5, y: 2})
        gsap.to(object.children[0].children[1].position, {x: 0.22, y: -0.18})
        gsap.to(object.children[0].children[1].rotation, {z: 1.02})
      } else if(object.children[0].children[1].material.alphaMap.name === 'shop') {
        gsap.to(object.children[0].children[1].scale, {x: 2.5, y: 2})
        gsap.to(object.children[0].children[1].position, {x: 0.22, y: -0.18 })
        gsap.to(object.children[0].children[1].rotation, {z: 1.02 })
      } else if(object.children[0].children[1].material.alphaMap.name === 'stay') {
        gsap.to(object.children[0].children[1].scale, {x: 2.7, y: 2.2})
        gsap.to(object.children[0].children[1].position, {x: 0.22, y: -0.18})
        gsap.to(object.children[0].children[1].rotation, {z: 1.02})
      } else if(object.children[0].children[1].material.alphaMap.name === 'discover') {
        gsap.to(object.children[0].children[1].scale, {x: 2.5, y: 2})
        gsap.to(object.children[0].children[1].position, {x: 0.22, y: -0.18})
        gsap.to(object.children[0].children[1].rotation, {z: 1.02})
      }else if(object.children[0].children[1].material.alphaMap.name === 'contact') {
        gsap.to(object.children[0].children[1].scale, {x: 2.3, y: 2})
        gsap.to(object.children[0].children[1].rotation, {z: 1.02})
        gsap.to(object.children[0].children[1].position, {x: 0.22, y: -0.18})
      }

      gsap.to(object.children[0].children[0].material.color, {r: 1, g: 1, b: 1})
      gsap.to(object.children[0].children[0].material, {opacity: 2})
      gsap.to(object.children[0].children[1].material, {opacity: 0, duration: 1})

    if(global.scrollWhere === 'down' || global.scrollWhere === 'top') {
      gsap.to(object.children[0].rotation, { z: Math.random() * (max - min) + min, duration: 2})
    }
    gsap.to(object.scale, {x: 1, y: 1, duration: 3, })
    gsap.to(object.children[0].children[0].scale, {x: .8, y: .3, duration: 1 })
  }

  if ( this.intersectsText.length > 0 ) {
      const res = this.intersectsText.filter(function (res) {
        return res.object;
      })[0];
      if (res && res.object) {
        selectedObject1 = res.object;
        gsap.to(selectedObject1.scale, {x: .9, y: .3, duration: 3, ease: 'elastic'})
        currentName = selectedObject1.name
        if(selectedObject1.name === 'NAMASTATE') {
          gsap.to(selectedObject1.parent.children[1].material, {opacity: 0, duration: 1})
        } else {
          gsap.to(selectedObject1.parent.children[1].material, {opacity: 7, duration: 1})
          gsap.to(selectedObject1.parent.children[1].material.color , {r: 2, g: 2, b: 2, duration: 1})
        }

      }
  }

  if(this.intersectsText.length) {
    if(currentIntersect === null) {
    }
    currentIntersect = this.intersectsText[0]
  } else {
    if(currentIntersect) {
    }
    currentIntersect = null
  }

  window.requestAnimationFrame(this.render.bind(this));

}

function ModalParticle(scene, i, texture, plane, text, textGeometry, textSubGeometry, textForSubTitle, textureForParticle ) {
  const radius = .022
  this.material = texture[i][0]
  if(i === 49) {
    this.material = this.material.clone()
    this.material.uniforms.uFirstColor.value = new THREE.Color("#bc6ef9") 
    this.material.uniforms.uSecondColor.value = new THREE.Color("#ffc919") 
    this.material.uniforms.uTexture.value = textureForParticle
  }
  this.material.transparent = true
  this.mesh = new THREE.Mesh(plane, this.material);

  this.mesh.scale.set(radius, radius, radius);
  this.mesh.position.set(0, 0, 2);
  this.percent = i * 0.02;
  this.burst =  false;
  this.offset = new THREE.Vector3(0, 0, 0);
  this.speed = 1;
  this.mesh.rotation.y = Math.PI
  const group = new THREE.Group()
  if (!this.burst){
    this.speed *= 0.000001;
  }
  /*
  * Text
  * */
  this.textMesh = new THREE.Mesh(textGeometry, text) 
  this.subTextMesh = new THREE.Mesh(textSubGeometry, textForSubTitle)
  this.mesh.add(this.textMesh, this.subTextMesh)
  this.textMesh.name = text.alphaMap.name
  this.subTextMesh.name = textForSubTitle.alphaMap.name
  if(text.name === 'NAMASTATE'){
    this.textMesh.position.set(-0.156, -0.26, 0.05)
    this.textMesh.rotation.set(0, 0, -0.8)
    this.subTextMesh.position.set(0.256, -0.13, 0.05)
    this.subTextMesh.rotation.set(0, 0, 0.9)
  }
  else {
    this.textMesh.position.set(0, 0.44, 0.05)
    this.subTextMesh.position.set(0.24, -0.15, 0.05)
    this.subTextMesh.rotation.set(0, 0, 0.95)
  }
  if (textForSubTitle.name === 'shop') {
    this.subTextMesh.position.set(0.24, -0.13, 0.05)
  } else if (textForSubTitle.name === 'stay') {
    this.subTextMesh.position.set(0.24, -0.13, 0.05)
  }
  global.arrForTexts.push(this.textMesh)
  global.arrForGroup.push(group)
  group.add(this.mesh)
  scene.add(group)
}

ModalParticle.prototype.update = function (tunnel) {
  if(global.scrollWhere === "down") {
    this.percent -= (this.speed  ) * (tunnel.speed)
  } else if(global.scrollWhere === "top") {
    this.percent += this.speed * (tunnel.speed)
  }
  this.pos = tunnel.curve.getPoint(1 - ((this.percent + 999999)%1)).add(this.offset)

  this.mesh.position.x = this.pos.x - 0.000;
  this.mesh.position.y = this.pos.y - 0.0013;
  this.mesh.position.z =  0.000001 + this.pos.z
}

window.onload = function() {
  const textTexture = [
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/namastate.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/awarenes.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/journey.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/sensoria.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/all_goods.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/communitas.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/nama.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/connect.png")}), 
  ]

  textTexture[0].alphaMap.name = 'NAMASTATE'
  textTexture[1].alphaMap.name = 'AWARENESS'
  textTexture[2].alphaMap.name = 'JOURNEY'
  textTexture[3].alphaMap.name = 'SENSORIA'
  textTexture[4].alphaMap.name = 'ALL GOODS'
  textTexture[5].alphaMap.name = 'COMMUNITAS'
  textTexture[6].alphaMap.name = 'NAMA VISION'
  textTexture[7].alphaMap.name = 'CONNECT'

  const textSubTexture = [
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/mind.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/mind.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/exp.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/stream.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/shop.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/stay.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/discover.png")}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/contact.png")}),
  ]

  textSubTexture[0].alphaMap.name = 'mind'
  textSubTexture[1].alphaMap.name = 'mind'
  textSubTexture[2].alphaMap.name = 'exp'
  textSubTexture[3].alphaMap.name = 'stream'
  textSubTexture[4].alphaMap.name = 'shop'
  textSubTexture[5].alphaMap.name = 'stay'
  textSubTexture[6].alphaMap.name = 'discover'
  textSubTexture[7].alphaMap.name = 'contact'

  const textureForTringle = loader.load("/img/texture/clearTexture/Chunnel_1.png")

  const vertexShader = `
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;
    
    attribute vec3 position;
    attribute vec2 uv;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main()
    {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      
      vUv = uv;
    }
  `
  const fragmentShader = `
    precision mediump float;
        
    uniform sampler2D uTexture;
    uniform vec3 uFirstColor;
    uniform vec3 uSecondColor;
    
    varying vec2 vUv;
    varying float vElevation;
    
    void main ()
    {
      vec4 textureColor = texture2D(uTexture, vUv);
      if(  textureColor.a < 0.5 ){ discard; }
      gl_FragColor = vec4(mix(uFirstColor, uSecondColor, vUv.x), textureColor.a );          
    }
  `

  const materials = [
    new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: {value: textureForTringle},
        uFirstColor: {value: new THREE.Color('#7a38f9')},
        uSecondColor: {value: new THREE.Color('#30ff46')}
      }
    }),
    new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: {value: textureForTringle},
        uFirstColor: {value: new THREE.Color('#E238f4')},
        uSecondColor: {value: new THREE.Color('#2c6c2e')}
      }
    }),
    new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: {value: textureForTringle},
        uFirstColor: {value: new THREE.Color('#8ce5e5')},
        uSecondColor: {value: new THREE.Color('#ff7319')}
      }
    }),
    new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: {value: textureForTringle},
        uFirstColor: {value: new THREE.Color('#bc6ef9')},
        uSecondColor: {value: new THREE.Color('#ffc919')}
      }
    }),
    new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: {value: textureForTringle},
        uFirstColor: {value: new THREE.Color('#0041ff')},
        uSecondColor: {value: new THREE.Color('#ff2aa3')}
      }
    }),
    new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: {value: textureForTringle},
        uFirstColor: {value: new THREE.Color('#2de29c')},
        uSecondColor: {value: new THREE.Color('#9d07bb')}
      }
    }),
    new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: {value: textureForTringle},
        uFirstColor: {value: new THREE.Color('#fb9a1d')},
        uSecondColor: {value: new THREE.Color('#00f2ff')}
      }
    })
  ]

  loadManager.onLoad = () => {
    window.tunnelModal = new ModalTunnel(materials, global.takeCanvas, textTexture, textSubTexture, textureForTringle)
  }
}





