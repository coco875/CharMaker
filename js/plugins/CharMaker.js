/*:
 * @command set
 * @text Show menu of selection
 */


var fs = require('fs');

function CharMaker() { 
    this.initialize.apply(this, arguments);
}

(function () {
    const pluginName = "CharMaker";
    continu = true
    width = 576
    height = 384
    PlayerImage = {}
    PlayerImage.characterCanvas = document.createElement('canvas')
    PlayerImage.characterCanvas.width = width
    PlayerImage.characterCanvas.height = height
    PlayerImage.characterCanvas
    animex = 0
    animey = 0
    actorWidth = width/4
    actorHeight = height/2
    spriteWidth = actorWidth/3
    spriteHeight = actorHeight/4
    PluginManager.registerCommand(pluginName, "set", args => {
        //SceneManager._scene._active = false
        SceneManager.goto(CharMaker);
    });

    option = `opt<br><i class="arrow left" id="optL">&#8592</i><div id="opt">vpt</div><i class="arrow right" id="optR">&#8594</i><br>`

    tab = `<li id="txt" style="
    display:inline-block;
    float:left;
    height:24px;
    min-width:80px;
    text-align:center;
    line-height: 22px;
    padding:0 8px 0 8px;
    margin: 1px 0px 0px 0px;
    border-radius: 30px;
    background:#393c43;
    color: white;">txt</li>`

    tabpanel = `<div id="txt" class="tabpanel" style="display:none">content</div>`

    half_width = 816/2
    info_tab = {
        "Character":{
            "id":"character",
            "content":`
            <div class="row" style="display: flex;">
                <div class="column" style="width: 50%;">
                <canvas id="characterCanvas" width=${spriteWidth} height=${spriteHeight} style="display: block; margin: 0 auto; width: ${spriteWidth*4}px; height: ${spriteHeight*4}px; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges; image-rendering: pixelated; image-rendering: crisp-edges;"></canvas>
                </div>
                <div class="column" style="width: 50%;">
                <div style="text-align: center; margin-top: 8px; color: white;">option</div>
                </div>
            </div>
            `,
            "draw":function () {
                let canvas = document.getElementById("characterCanvas")
                let ctx = canvas.getContext("2d")
                ctx.rect(0,0,canvas.width,canvas.height)
                ctx.fillStyle = "black"
                ctx.fill()
                ctx.drawImage(
                    PlayerImage.characterCanvas, 
                    animex*spriteWidth, 
                    animey*spriteHeight, 
                    spriteWidth, 
                    spriteHeight, 
                    0, 0, 
                    canvas.width, canvas.height)
                    animex++
                    if (animex == 3) {
                        animex = 0
                        animey++
                    }
                    if (animey==4) {
                        animey = 0
                    }
            },
            "option":[
                "body",
                "fronthair",
                "reathair",
                "beard",
                "ears",
                "eyes",
                "facialmark",
                "beastears",
                "tail",
                "wing",
                "clothing",
                "cloak",
                "acca",
                "accb",
                "glasses"
            ]
        },
        "Face":{
            "id":"face",
            "content":`
            <div class="row" style="display: flex;">>
                <div class="column" style="width: 50%;">
                <canvas id="faceCanvas"></canvas>
                </div>
                <div class="column" style="width: 50%;">
                <div style="text-align: center; margin-top: 8px; color: white;">jdw</div>
                </div>
            </div>
            `
        },
        "Battler":{
            "id":"battler",
            "content":`
            <div class="row" style="display: flex;">>
                <div class="column" style="width: 50%;">
                <canvas id="battlerCanvas"></canvas>
                </div>
                <div class="column" style="width: 50%;">
                <div style="text-align: center; margin-top: 8px; color: white;">ufytd</div>
                </div>
            </div>
            `
        }
    }

    fileGenerator = "js/plugins/generator/"
    json = fs.readFileSync("test.json")
    const charProperties = JSON.parse(json)
    const maskColor = JSON.parse(fs.readFileSync(fileGenerator+"maks_color.json"))
    const order = JSON.parse(fs.readFileSync(fileGenerator+"order.json"))
    const gradByType = JSON.parse(fs.readFileSync(fileGenerator+"grad_by_type.json"))
    var step = 0
    var grad = {}
    grad.grad_common = ImageManager.loadBitmap(fileGenerator, "grad_common")
    grad.grad_eyes = ImageManager.loadBitmap(fileGenerator, "grad_eyes")
    grad.grad_hair = ImageManager.loadBitmap(fileGenerator, "grad_hair")
    grad.grad_skin = ImageManager.loadBitmap(fileGenerator, "grad_skin")

    function grad_common_load(){
        grad.grad_eyes.addLoadListener(grad_eyes_load)
    }

    function grad_eyes_load(){
        grad.grad_hair.addLoadListener(grad_hair_load)
    }

    function grad_hair_load(){
        grad.grad_skin.addLoadListener(grad_skin_load)
    }

    function grad_skin_load(){
        if (step == order.length){
            //final_save()
        } else {
            var filename = type+"_"+order[step]+"_"+charProperties.patterns[order[step].toLowerCase().replace(/\d+/g, '')]
            if (order[step].toLowerCase().replace(/\d+/g, '') in charProperties.patterns && fs.existsSync(image_path+filename+".png")){
                var image = ImageManager.loadBitmap(image_path, filename);
                var mask = ImageManager.loadBitmap(image_path, filename+"_c");

                image.addLoadListener(function () {
                    mask.addLoadListener(function () {
                        applyMask_grad(image,mask)
                        PlayerImage.characterCanvas.getContext('2d').drawImage(image.canvas,0,0)
                        step+=1
                        grad_skin_load()
                    })
                })
            } else {
                step+=1
                grad_skin_load()
            }
        }
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
      
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    //TV

    function final_save(canvas){
        console.log($gamePlayer._characterIndex,$gamePlayer._characterName)
        // string generated by canvas.toDataURL()
        var img = canvas.toDataURL();
        // strip off the data: url prefix to get just the base64-encoded bytes
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = Buffer.from(data, 'base64');
        fs.writeFileSync('img/characters/image.png', buf);
        $gamePlayer._characterIndex = 0
        $gamePlayer._characterName = "image"
        continu = false
    }

    var type = "TV"
    var gender = ""
    if (charProperties.gender == "male") {
        gender = "Male"
    } else {
        gender = "Female"
    }

    var image_path = fileGenerator+type+"/"+gender+"/";

    function distance_color(c1,c2){
        rgbc1 = hexToRgb(c1)
        rgbc2 = hexToRgb(c2)
        dist = (rgbc1.r-rgbc2.r)**2+(rgbc1.g-rgbc2.g)**2+(rgbc1.b-rgbc2.b)**2
        dist = Math.sqrt(dist)
        return dist;
    }

    function niv_gris(c1){
        rgbc1 = hexToRgb(c1)
        moy = rgbc1.r+rgbc1.g,rgbc1.b
        moy /= 3
        return moy
    }

    function applyMask_grad(image,mask) {
        convertColor = {}
        for (x=0;x<mask.width;x+=1) {
            for (y=0;y<mask.height;y+=1){
                if (mask.getPixel(x,y) in maskColor){
                    colorOriginal = image.getPixel(x,y)

                    if (colorOriginal in convertColor) {
                        newColor = convertColor[colorOriginal]
                    } else {
                        gradActual = grad[gradByType[maskColor[mask.getPixel(x,y)]]]
                        t = niv_gris(colorOriginal)
                        t= t*1.1
                        t = t/255

                        newColor = gradActual.getPixel(gradActual.width-(t*(gradActual.width*1.2)), (charProperties.colors[maskColor[mask.getPixel(x,y)]])*4)
                    }
                    image.fillRect(x,y,1,1,newColor)
                }
            }
        }

    }

    CharMaker.prototype = Object.create(Scene_Base.prototype);

    CharMaker.prototype.constructor = CharMaker;

    CharMaker.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    CharMaker.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
    }

    CharMaker.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        this.startFadeIn(this.fadeSpeed(), false);
        this.createCharMaker();
    }

    CharMaker.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        SceneManager.snapForBackground();
    };

    CharMaker.prototype.createCharMaker = function(){
        tab_html = ""
        tabpanel_html = ""
        for (var key in info_tab) {
            tab_html += tab.replace(/txt/g,key)
            let txt = tabpanel.replace(/txt/g,info_tab[key].id).replace(/content/g,info_tab[key].content)
            let option_html = ""
            for (t in info_tab[key].option){
                let value = info_tab[key].option[t]
                option_html += option.replace(/opt/g,value).replace("vpt",charProperties.patterns[value])
            }
            txt = txt.replace("option",option_html)
            tabpanel_html += txt
        }
        
        let html = `
        <div id="CharMaker" 
        style="
            position: fixed;
            z-index: 999999999999999; /* yep it's a lot but eh */ 
            margin: 0 auto;
            left: 50vw; 
            transform: translate(-50%, 0);
        "
        >
        <div id="tabs">
            <ul style="
            display:block;
            height:32px;
            width:${Graphics._width}px;
            background:#393c43;">
                ${tab_html}
            </ul>
        </div>
        <div id="tabcontent">
        ${tabpanel_html}
        </div>
        </div>
        </div>
        `
        document.getElementById('text_zone').innerHTML = html;
        for (i=0;i<Object.keys(info_tab).length;i+=1) {
            document.getElementById(key).addEventListener('click', callbackClosure( i, function(i) {
                selView(i)
            }) );
        }
        //canvas = document.getElementById("characterCanvas");
        //ctx = canvas.getContext("2d");
        grad.grad_common.addLoadListener(grad_common_load)
        selInit()
        for (var key in info_tab) {
            for (t in info_tab[key].option) {
                let value = info_tab[key].option[t]
                document.getElementById(value+"L").addEventListener('click',function (){
                    console.log(value)
                })
            }
        }
    }

    function callbackClosure(i, callback) {
        return function() {
          return callback(i);
        }
      }

    function selView(n) {
        i=0
        for (var key in info_tab) {
            if (i==n){
                document.getElementById(info_tab[key].id).style.display = "inline"
                document.getElementById(key).style.background = "#34373c"
                if ("draw" in info_tab[key]) {
                    setInterval(info_tab[key].draw,500)
                }
            } else {
                document.getElementById(info_tab[key].id).style.display = "none"
                document.getElementById(key).style.background = "#393c43"
            }
            if (i<Object.keys(info_tab)){
                return
            }
            i++
        }
    }
    
    function selInit() {
        selView(0)
    }
})();
