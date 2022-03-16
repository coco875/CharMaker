/*:
 * @command set
 * @text Show menu of selection
 */

function CharMaker() { 
    this.initialize.apply(this, arguments);
}

(function () {
    web = true
    try {
        var fs = require('fs');
        web = false
    } catch (error) {
        web = true
    }
    const pluginName = "CharMaker";
    width = 576
    height = 384
    a = 0
    PlayerImage = {}
    imageChar = {}
    maskType = {}
    PlayerImage.character = new Bitmap(width,height)
    PlayerImage.character
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

    option = 'opt<br><i class="arrow left" id="optL">&#8592</i><div id="opt" style="display:inline;">vpt</div><i class="arrow right" id="optR">&#8594</i><br>'
    color_button = `opt<br><i class="arrow left" id="optcL">&#8592</i><div id="optc" style="display:inline;">cpt</div><i class="arrow right" id="optcR">&#8594</i><br>`

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
                <div class="column" style="width: 34%;">
                <canvas id="characterCanvas" width=${spriteWidth} height=${spriteHeight} style="display: block; margin: 0 auto; width: ${spriteWidth*4}px; height: ${spriteHeight*4}px; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges; image-rendering: pixelated; image-rendering: crisp-edges;"></canvas>
                <button onclick="CharMaker.endScene()" style="display: block; margin: 0 auto;">Save</button>
                </div>
                <div class="column" style="width: 66%;">
                <div style="text-align: center; margin-top: 8px; color: white; display: block;">option</div>
                </div>
            </div>
            `,
            "draw":function () {
                let canvas = document.getElementById("characterCanvas")
                if (canvas) {
                    let ctx = canvas.getContext("2d")
                    ctx.clearRect(0,0,canvas.width,canvas.height)
                    ctx.drawImage(
                        PlayerImage.character.canvas, 
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
                }
            },
            "option":[
                "body",
                "fronthair",
                "rearhair",
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
            ],
            "color":[
                "skin",
                "eyes",
                "hair",
                "facialmark",
                "beastears",
                "clothing",
                "clothing1",
                "clothing2",
                "clothing3",
                "cloak",
                "accA",
                "accB",
                "accB1",
                "accB2",
                "glass",
                "glass2",
                "tail",
                "wing"
            ]
        },
        "Face":{
            "id":"face",
            "content":`
            <div class="row" style="display: flex;">
                <div class="column" style="width: 50%;">
                <canvas id="faceCanvas"></canvas>
                </div>
                <div class="column" style="width: 50%;">
                <div style="text-align: center; margin-top: 8px; color: white; display: block;">work in progress</div>
                </div>
            </div>
            `
        },
        "Battler":{
            "id":"battler",
            "content":`
            <div class="row" style="display: flex;">
                <div class="column" style="width: 50%;">
                <canvas id="battlerCanvas"></canvas>
                </div>
                <div class="column" style="width: 50%;">
                <div style="text-align: center; margin-top: 8px; color: white; display: block;">work in progress</div>
                </div>
            </div>
            `
        }
    }

    fileGenerator = "js/plugins/generator/"
    var charProperties
    import_json("test.json", (j) => {
        if (StorageManager.exists("char")){
            StorageManager.loadObject("char").then((value) => {
                charProperties = value
            })
        } else {
            charProperties = j
        }
    });
    var cpcharProperties = {patterns:{},colors:{}}
    var maskColor
    var order
    var gradByType

    function import_json (file,callback) {
        var xmlhttp = new XMLHttpRequest();
        var url = file;

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                t = JSON.parse(this.responseText);
                callback(t)
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function file_exist (file, callback) {
        var xmlhttp = new XMLHttpRequest();
        var url = file;

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(true)
            } else if (this.readyState == 4 && (this.status == 404 || this.status == 0)) {
                callback(false)
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    import_json(fileGenerator+"maks_color.json", (j) => {
        maskColor = j
    });

    import_json(fileGenerator+"order.json", (j) => {
        order = j
    });

    import_json(fileGenerator+"grad_by_type.json", (j) => {
        gradByType = j
    });
    
    var step = 0
    var grad = {}
    grad.grad_common = ImageManager.loadBitmap(fileGenerator, "grad_common")
    grad.grad_eyes = ImageManager.loadBitmap(fileGenerator, "grad_eyes")
    grad.grad_hair = ImageManager.loadBitmap(fileGenerator, "grad_hair")
    grad.grad_skin = ImageManager.loadBitmap(fileGenerator, "grad_skin")

    function grad_common_load(){
        type = "TV"
        var gender = ""
        if (charProperties.gender == "male") {
            gender = "Male"
        } else {
            gender = "Female"
        }

        image_path = fileGenerator+type+"/"+gender+"/";
        step = 0
        PlayerImage.character.clear()
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
            if (!web) {
                final_save(PlayerImage.character)
            }
            bit = ImageManager.loadCharacter($gamePlayer._characterName)
            bit.addLoadListener(function(){
                bit.clearRect(0,0,actorWidth,actorHeight)
                bit.blt(PlayerImage.character,0,0,PlayerImage.character.width,PlayerImage.character.height,0,0)
            })
            cpcharProperties.colors = JSON.parse(JSON.stringify(charProperties.colors))
        } else {
            let item = order[step].toLowerCase().replace(/\d+/g, '')
            var filename = type+"_"+order[step]+"_"+charProperties.patterns[item]
            file_exist(image_path+filename+".png",(t)=>{
                if (t && item in charProperties.patterns) {
                    var image = ImageManager.loadBitmap(image_path, filename);
                    var mask = ImageManager.loadBitmap(image_path, filename+"_c");
                    image.addLoadListener(function () {
                        mask.addLoadListener(function () {
                            if (!(filename in imageChar)) {
                                imageChar[filename] = new Bitmap(image.width,image.height)
                            }
                            col = false
                            for (var i in maskType[item]) {
                                value = maskType[item][i]
                                if (cpcharProperties.colors[value]!=charProperties.colors[value]) col = true
                            }
                            
                            imageChar[filename].addLoadListener(function (){ 
                                if (charProperties.patterns[item] != cpcharProperties.patterns[order[step]] || col) {
                                    applyMask_grad(imageChar[filename],image,mask,item)
                                    cpcharProperties.patterns[order[step]] = charProperties.patterns[item]
                                }
                                PlayerImage.character.blt(imageChar[filename],0,0,imageChar[filename].width,imageChar[filename].height,0,0)
                                step+=1
                                grad_skin_load()
                            })
                        })
                    })
                } else {
                    step+=1
                    grad_skin_load()
                }
            })
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
        //console.log($gamePlayer,$gameActors)
        // string generated by canvas.toDataURL()
        var img = canvas.canvas.toDataURL();
        // strip off the data: url prefix to get just the base64-encoded bytes
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = Buffer.from(data, 'base64');
        fs.writeFileSync('img/characters/image.png', buf);
    }

    var image_path = ""
    var type = ""

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

    function applyMask_grad(clone,image,mask,item) {
        let convertColor = {}
        
        for (x=0;x<mask.width;x+=1) {
            for (y=0;y<mask.height;y+=1){
                if (mask.getPixel(x,y) in maskColor){
                    colorOriginal = image.getPixel(x,y)

                    if (colorOriginal in convertColor) {
                        newColor = convertColor[colorOriginal]
                        clone.fillRect(x,y,1,1,newColor)
                    } else if (charProperties.colors[maskColor[mask.getPixel(x,y)]] != cpcharProperties.colors[maskColor[mask.getPixel(x,y)]] || charProperties.patterns[item] != cpcharProperties.patterns[order[step]]){
                        if (!maskType[item]) maskType[item] = []
                        maskType[item].push(maskColor[mask.getPixel(x,y)])
                        gradActual = grad[gradByType[maskColor[mask.getPixel(x,y)]]]
                        t = niv_gris(colorOriginal)
                        //t= t*0.5
                        t = t/255
                        x_color = gradActual.width-(t*(gradActual.width*1))
                        y_color = (charProperties.colors[maskColor[mask.getPixel(x,y)]])*4
                        //console.log(x_color,y_color)
                        newColor = gradActual.getPixel(x_color, y_color)
                        convertColor[colorOriginal] = newColor
                        clone.fillRect(x,y,1,1,newColor)
                    }
                    
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
            if ("draw" in info_tab[key]) {
                a = setInterval(info_tab[key].draw,250)
            }
            tab_html += tab.replace(/txt/g,key)
            let txt = tabpanel.replace(/txt/g,info_tab[key].id).replace(/content/g,info_tab[key].content)
            let html_glob = ""
            let option_html = `<div class="row" style="display: flex;">`
            let button = ``
            button += tab.replace(/txt/g,"Option")
            button += tab.replace(/txt/g,"Color")
            html_glob += `<ul style="
            display: block;
            height:32px;
            width: 100%;
            margin:0;
            padding:0;
            background:#393c43;">
                ${button}
            </ul>`
            i = 0
            col_option = ""
            for (t in info_tab[key].option){
                let value = info_tab[key].option[t]
                if ("function" != typeof(value)) {
                    col_option += option.replace(/opt/g,value).replace("vpt",charProperties.patterns[value])
                    if (i%10==0 && i!= 0) {
                        option_html += `<div class="column" style="width: 50%;">${col_option}</div>`
                        col_option = ""
                    }
                    i++
                }
            }
            option_html += `<div class="column" style="width: 50%;">${col_option}</div></div>`
            html_glob += tabpanel.replace(/txt/g,info_tab[key].id+"option").replace(/content/g,option_html)
            let color_html = `<div class="row" style="display: flex;">`
            i = 0
            col_color = ""
            for (t in info_tab[key].color){
                let value = info_tab[key].color[t]
                if ("function" != typeof(value)) {
                    col_color += color_button.replace(/opt/g,value).replace("cpt",charProperties.colors[value])
                    if (i%10==0 && i!= 0) {
                        color_html += `<div class="column" style="width: 50%;">${col_color}</div>`
                        col_color = ""
                    }
                    i++
                }
            }
            color_html += `<div class="column" style="width: 50%;">${col_color}</div></div>`
            html_glob += tabpanel.replace(/txt/g,info_tab[key].id+"color").replace(/content/g,color_html)
            
            txt = txt.replace("option",html_glob)
            tabpanel_html += txt
        }
        
        let html = `
        <div id="CharMaker" 
        style="
            position: fixed;
            z-index: 999999999999999; /* yep it's a lot but eh */ 
            margin: 0 auto;
            left: 50vw; 
            width: 100%;
            margin:0;
            padding:0;
            transform: translate(-50%, 0);
            font-size: 100%; 
            font-family:Comic Sans MS, Comic Sans, cursive;
        "
        >
        <div id="tabs">
            <ul style="
            display: block;
            height:32px;
            width: 100%;
            margin:0;
            padding:0;
            background:#393c43;">
                ${tab_html}
            </ul>
        </div>
        <div id="tabcontent" style="display: block; height: auto">
        ${tabpanel_html}
        </div>
        </div>
        </div>
        `
        document.getElementById('text_zone').innerHTML = html;
        i = 0

        for (var key in info_tab) {
            colopt = {
                "Color":{
                    "id": info_tab[key].id+"color"
                },
                "Option":{
                    "id": info_tab[key].id+"option"
                }
            }
            document.getElementById(key).addEventListener('click', callbackClosure( i, function(i) {
                selView(i, info_tab)
            }) );
            if ("color" in info_tab[key]) {
                document.getElementById("Color").addEventListener('click', callbackClosure( colopt, function(colopt) {
                    selView(0, colopt)
                }) );
                document.getElementById("Option").addEventListener('click', callbackClosure( colopt, function(colopt) {
                    selView(1, colopt)
                }) );
                selView(1, colopt)
            }
            i++
        }
        //canvas = document.getElementById("characterCanvas");
        //ctx = canvas.getContext("2d");
        grad.grad_common.addLoadListener(grad_common_load)
        selInit()
        for (var key in info_tab) {
            for (t in info_tab[key].option) {
                let value = info_tab[key].option[t]
                if ("function" != typeof(value)) {
                    document.getElementById(value+"L").addEventListener('click',function (){
                        if (step == order.length) {
                            n = Number(charProperties.patterns[value].slice(-2))
                            n = Math.max(n-1,0)
                            charProperties.patterns[value] = "p"+String(n).padStart(2,'0')
                            document.getElementById(value).innerHTML = charProperties.patterns[value]
                            CharMaker.actualise()
                        }
                    })
                    document.getElementById(value+"R").addEventListener('click',function (){
                        if (step == order.length) {
                            n = Number(charProperties.patterns[value].slice(-2))
                            n = Math.min(n+1,15)
                            charProperties.patterns[value] = "p"+String(n).padStart(2,'0')
                            document.getElementById(value).innerHTML = charProperties.patterns[value]
                            CharMaker.actualise()
                        }
                    })
                }
            }
            for (t in info_tab[key].color) {
                let value = info_tab[key].color[t]
                if ("function" != typeof(value)) {
                    document.getElementById(value+"cL").addEventListener('click',function (){
                        if (step == order.length) {
                            n = Number(charProperties.colors[value])
                            n = Math.max(n-1,0)
                            charProperties.colors[value] = n
                            document.getElementById(value+"c").innerHTML = String(n)
                            CharMaker.actualise()
                        }
                    })
                    document.getElementById(value+"cR").addEventListener('click',function (){
                        if (step == order.length) {
                            n = Number(charProperties.colors[value])
                            n = Math.min(n+1,30)
                            charProperties.colors[value] = n
                            document.getElementById(value+"c").innerHTML = String(n)
                            CharMaker.actualise()
                        }
                    })
                }
            }
        }
    }

    CharMaker.actualise = function(){
        step = 0
        PlayerImage.character.clear()
        grad_skin_load()
    }

    CharMaker.endScene = function(){
        SceneManager.goto(Scene_Map)
        document.getElementById("CharMaker").style.display = "none"
        // $gameActors.actor(1).setCharacterImage("image",0);
        // $gamePlayer.refresh();
        bit = ImageManager.loadCharacter($gamePlayer._characterName)
        bit.addLoadListener(function(){
            bit.clearRect(0,0,actorWidth,actorHeight)
            bit.blt(PlayerImage.character,0,0,PlayerImage.character.width,PlayerImage.character.height,0,0)
        })
        clearInterval(a)
    }

    var DMSG = DataManager.saveGame
    DataManager.saveGame = function (n,p) {
        StorageManager.saveObject("char",charProperties)
        return DMSG.call(this,n,p)
    }

    var DMlG = DataManager.loadGame
    DataManager.loadGame = function (n) {
        import_json("test.json", (j) => {
            if (StorageManager.exists("char")){
                StorageManager.loadObject("char").then((value) => {
                    charProperties = value
                    grad.grad_common.addLoadListener(grad_common_load)
                })
            } else {
                charProperties = j
            }
        });
        return DMlG.call(this,n)
    }

    var GP = Game_Player.prototype.refresh
    Game_Player.prototype.refresh = function (t) {
        GP.call(this,t)
        if (type!="") {
            bit = ImageManager.loadCharacter($gamePlayer._characterName)
            bit.addLoadListener(function(){
                bit.clearRect(0,0,actorWidth,actorHeight)
                bit.blt(PlayerImage.character,0,0,PlayerImage.character.width,PlayerImage.character.height,0,0)
            })
        }
    }

    var scene = SceneManager.pop
    SceneManager.pop = function () {
        scene.call(this)
        if (type!="") {
            bit = ImageManager.loadCharacter($gamePlayer._characterName)
            bit.addLoadListener(function(){
                bit.clearRect(0,0,actorWidth,actorHeight)
                bit.blt(PlayerImage.character,0,0,PlayerImage.character.width,PlayerImage.character.height,0,0)
            })
        }
    }

    function callbackClosure(i, callback) {
        return function() {
          return callback(i);
        }
      }

    function selView(n, dict) {
        i=0
        for (var key in dict) {
            if (i==n){
                document.getElementById(dict[key].id).style.display = "inline"
                document.getElementById(key).style.background = "#34373c"
            } else {
                document.getElementById(dict[key].id).style.display = "none"
                document.getElementById(key).style.background = "#393c43"
            }
            i++
        }
    }
    
    function selInit() {
        selView(0, info_tab)
    }
})();
