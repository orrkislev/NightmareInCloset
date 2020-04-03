pages = []
page = 0
lang = "heb"

let slider,button;


function preload(){
  pages = loadJSON('a/texts.json')
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    imageMode(CENTER);
    textAlign(RIGHT, CENTER);
    textSize(18);

    slider = createSlider(-10, 100, -10);
    slider.position(10, 10);
    slider.style('width', '80px');
    slider.input(updateSlider);

    button = createButton(lang);
    button.position(20,50);
    button.mousePressed(changeLang);

    pages = pages.texts
    $.each(pages, (key, page)=>{
      if (key==0){
        loadImage('a/'+page.image, img => {
          pages[0].image = img
          showPage(0)
        });
      } else {
        page.image = loadImage('a/'+page.image)
      }
    })
    // background(220);
    
    // p = 200
    
    // t = 'שלום'
    // text(t, p, 20);
    // p -= textWidth(t) + textWidth(' ')
    
    // t2 = 'hello'
    // textStyle(BOLD);
    // textSize(25);
    // fill(120,50,240)
    // text(t2, p, 20)
    // p -= textWidth(t2) + textWidth(' ')
    
    // textStyle(NORMAL);
    // textSize(14);
    // fill(0)
    // t3 = 'מה זה'
    // text(t3, p, 20)
  }

  function showPage(pageNum){

    background(100)
    imageWidth = (height/pages[pageNum].image.height) * pages[pageNum].image.width
    image(pages[pageNum].image,width/2,height/2,imageWidth,height)

    txt = pages[pageNum].text
    
    if (txt!=undefined){
      if (pages[page].levels != undefined){
        level = Math.floor(slider.value() / (100 / (pages[page].levels.length-1)))
      } else {
        text(txt,width/2 + imageWidth/3,height*0.9)
        return
      }
        
      if (level==-1){
        text(txt,width/2 + imageWidth/3,height*0.9)
        return
      } else{
        phrases = pages[pageNum].levels[level]

        rgx = ''
        phrases.forEach(phrase => {
          rgx = rgx + "|" + phrase.phrase
        });
        rgx = rgx.substr(1)
        rgx = "("+rgx+")"
        rgx = new RegExp(rgx,'g');
        txt = pages[pageNum].text.split(rgx)

        parts = []
        txt.forEach((part)=>{
          parts.push({"text":part,"special":false})
        })

        phrases.forEach(phrase => {
          parts.forEach((part)=>{
            if (part.text==phrase.phrase){
              part.text = phrase[lang]
              part.special = true
            }
          })
        });

        p = width/2 + imageWidth/3
        parts.forEach((part)=>{
          if (part.special){
            textStyle(BOLD);
            textSize(25);
            fill(120,50,240)
          } else {
            textStyle(NORMAL);
            textSize(14);
            fill(0)
          }
          text(part.text, p, height*0.9)
          p -= textWidth(part.text) + textWidth(' ')
        })
      }
    }
  }

  function keyPressed(){
    if (keyCode === LEFT_ARROW) {
      page = (page+1+pages.length)%pages.length
      showPage(page)
    } else if (keyCode === RIGHT_ARROW) {
      page = (page-1+pages.length)%pages.length
      showPage(page)
    }
  }

  function updateSlider(){
    showPage(page)
  }

  function changeLang(){
    if (lang=="heb"){
      lang="eng"
    } else {
      lang="heb"
    }
    button.html(lang)
    showPage(page)

  }